import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from api folder
dotenv.config({ path: path.resolve('./api/.env') });

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  timestamp: string;
}

interface ZohoAccessToken {
  access_token: string;
  expires_in: number;
}

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Cache for Zoho access token
let zohoAccessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get Zoho CRM Access Token using OAuth2 Refresh Token
 */
async function getZohoAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (zohoAccessToken && Date.now() < tokenExpiry) {
    return zohoAccessToken;
  }

  try {
    const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      },
    });

    zohoAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min before expiry
    
    return zohoAccessToken;
  } catch (error) {
    console.error('Error getting Zoho access token:', error);
    throw new Error('Failed to authenticate with Zoho CRM');
  }
}

/**
 * Add consultation to Zoho CRM
 */
async function addToZohoCRM(data: ConsultationData): Promise<any> {
  try {
    const accessToken = await getZohoAccessToken();

    const zohoData = {
      data: [
        {
          Last_Name: data.name,
          Email: data.email,
          Phone: data.phone,
          Description: `Interest: ${data.interest}\nSubmitted: ${data.timestamp}`,
          Lead_Source: 'Web Form',
        },
      ],
    };

    const response = await axios.post(
      'https://www.zohoapis.in/crm/v2/Leads',
      zohoData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Added to Zoho CRM:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding to Zoho CRM:', error);
    throw error;
  }
}

/**
 * Add data to Zoho Sheets
 */
// async function addToZohoSheet(data: ConsultationData): Promise<boolean> {
//   try {
//     const sheetId = process.env.ZOHO_SHEET_ID;
    
//     if (!sheetId) {
//       console.warn('Zoho Sheet ID not configured, skipping Zoho Sheets integration');
//       return false;
//     }

//     const accessToken = await getZohoAccessToken();

//     // Add row to Zoho Sheets
//     // Format: timestamp, name, email, phone, interest
//     const payload = {
//       sheets: [
//         {
//           index: 0,
//           rows: [
//             {
//               cells: [
//                 { value: data.timestamp },
//                 { value: data.name },
//                 { value: data.email },
//                 { value: data.phone },
//                 { value: data.interest },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     const response = await axios.post(
//       `https://www.zohoapis.com/sheet/v2/spreadsheets/${sheetId}/insertRows`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log('✅ Added to Zoho Sheets:', data.name);
//     return true;
//   } catch (error) {
//     console.error('Error adding to Zoho Sheet:', error);
//     // Don't throw - Zoho Sheets is backup, Zoho CRM is primary
//     return false;
//   }
// }

async function addToZohoSheet(data: ConsultationData): Promise<boolean> {
  try {
    const sheetId = process.env.ZOHO_SHEET_ID!;
    const worksheetName = 'Sheet1'; // MUST match exactly

    const accessToken = await getZohoAccessToken();

    await axios.post(
      `https://sheet.zoho.com/api/v2/${sheetId}/rows`,
      {
        data: [
          {
            Timestamp: data.timestamp,
            Name: data.name,
            Email: data.email,
            Phone: data.phone,
            Interest: data.interest,
          },
        ],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          worksheet_name: worksheetName,
        },
      }
    );

    console.log('✅ Added to Zoho Sheet');
    return true;
  } catch (error: any) {
    console.error(
      '❌ Zoho Sheet error:',
      error.response?.data || error.message
    );
    return false;
  }
}


/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(data: ConsultationData): Promise<void> {
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
            We have received your consultation request. Our team will review your inquiry and get back to you within 24-48 hours.
          </p>
          
          <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #333;">Your Request Details:</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="margin: 8px 0;"><strong>Interest:</strong> ${data.interest}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any urgent questions, feel free to reach out to us at ${process.env.ADMIN_EMAIL}
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            Best regards,<br/>
            <strong>QuantumSec Labs Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to:', data.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

/**
 * Send notification email to admin
 */
async function sendAdminNotification(data: ConsultationData): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Consultation Request: ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Consultation Request</h2>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Interest:</strong> ${data.interest}</p>
          <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
        
        <p style="margin-top: 20px;">
          This lead has been automatically added to Zoho CRM and Google Sheets for tracking.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent');
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

/**
 * Process consultation submission
 * Adds to Zoho CRM (primary) and Zoho Sheets (backup), sends emails
 */
export async function processConsultation(data: ConsultationData): Promise<any> {
  try {
    const results = {
      zoho: false,
      zohoSheets: false,
      confirmationEmail: false,
      adminEmail: false,
      errors: [] as string[],
    };

    // Add to Zoho CRM (primary)
    try {
      await addToZohoCRM(data);
      results.zoho = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Zoho CRM error: ${errorMsg}`);
      console.error('Zoho CRM error:', error);
    }

    // Add to Zoho Sheets (backup)
    try {
      const sheetSuccess = await addToZohoSheet(data);
      results.zohoSheets = sheetSuccess;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Zoho Sheets optional error: ${errorMsg}`);
      // Don't add to errors - it's backup
    }

    // Send confirmation email to user
    try {
      await sendConfirmationEmail(data);
      results.confirmationEmail = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Confirmation email error: ${errorMsg}`);
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(data);
      results.adminEmail = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Admin email error: ${errorMsg}`);
    }

    // Consider successful if Zoho CRM was added
    const isSuccess = results.zoho || results.zohoSheets;

    return {
      success: isSuccess,
      message: isSuccess 
        ? 'Consultation submitted successfully!' 
        : 'Failed to process consultation',
      results,
    };
  } catch (error) {
    console.error('Error processing consultation:', error);
    throw error;
  }
}
