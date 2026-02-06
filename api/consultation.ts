import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  timestamp: string;
}

// Initialize Google Sheets
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Add data to Google Sheet
 */
async function addToGoogleSheet(data: ConsultationData) {
  const authClient = await auth.getClient();
  
  const values = [
    [
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.interest,
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Consultations!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    return true;
  } catch (error) {
    console.error('Error adding to Google Sheet:', error);
    throw error;
  }
}

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(data: ConsultationData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.email,
    subject: 'Your Consultation Request - QuantumSec Labs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">QuantumSec Labs</h1>
          <p style="margin: 5px 0 0 0;">Consultation Confirmation</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Thank You, ${data.name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We've received your consultation request and we're excited to help you start your journey in:
          </p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
            <strong style="color: #667eea;">Area of Interest:</strong> ${data.interest.replace('-', ' ').toUpperCase()}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Our team will review your information and contact you at:
          </p>
          
          <ul style="color: #666;">
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
          </ul>
          
          <p style="color: #666; line-height: 1.6;">
            You can expect to hear from us within <strong>24 hours</strong> during business days.
          </p>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">What's Next?</h3>
            <ol style="color: #666; line-height: 1.8;">
              <li>Our advisor will contact you for a detailed discussion about your goals</li>
              <li>We'll assess which program best fits your needs</li>
              <li>You'll receive personalized recommendations and enrollment details</li>
            </ol>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 30px;">
            If you have any questions in the meantime, feel free to reach out to us directly.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
            <p>© 2026 QuantumSec Labs. All rights reserved.</p>
            <p>This email was sent because you submitted a consultation request through our website.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send notification email to admin
 */
async function sendAdminNotification(data: ConsultationData) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Consultation Request - ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Consultation Request</h2>
        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Submitted:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(data.timestamp).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.phone}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Interest:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.interest.replace('-', ' ').toUpperCase()}</td>
          </tr>
        </table>
        <p><strong>Action Required:</strong> Please follow up with this lead within 24 hours.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    // Don't throw - admin notification failure shouldn't block user experience
    return false;
  }
}

/**
 * Main handler for consultation submissions
 */
export async function handleConsultationSubmission(data: ConsultationData) {
  try {
    // Add to Google Sheet
    await addToGoogleSheet(data);
    
    // Send confirmation email to user
    await sendConfirmationEmail(data);
    
    // Send notification to admin
    await sendAdminNotification(data);
    
    return {
      success: true,
      message: 'Consultation request submitted successfully',
    };
  } catch (error) {
    console.error('Error in consultation submission:', error);
    throw error;
  }
}
