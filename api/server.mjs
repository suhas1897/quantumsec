import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import nodemailer from 'nodemailer';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.mjs';

// Load .env from api folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Cache for Zoho access token
let zohoAccessToken = null;
let tokenExpiry = 0;

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Quantum Leap Labs API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the server is running and view configuration status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy with configuration details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    zohoSheetId: process.env.ZOHO_SHEET_ID ? '✅ Configured' : '❌ Missing',
    adminEmail: process.env.ADMIN_EMAIL ? '✅ Configured' : '❌ Missing',
  });
});

/**
 * Get Zoho CRM Access Token using OAuth2 Refresh Token
 */
async function getZohoAccessToken() {
  // Check if we have a valid cached token
  if (zohoAccessToken && Date.now() < tokenExpiry) {
    return zohoAccessToken;
  }

  try {
    console.log('🔐 Requesting new Zoho access token...');
    const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      },
    });

    zohoAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    
    console.log('✅ Zoho access token obtained successfully');
    return zohoAccessToken;
  } catch (error) {
    console.error('❌ Zoho authentication failed:', {
      status: error.response?.status,
      message: error.response?.data?.error_description || error.message,
      details: error.response?.data,
    });
    throw new Error(`Zoho auth failed: ${error.response?.data?.error_description || error.message}`);
  }
}

/**
 * Add consultation to Zoho CRM
 */
async function addToZohoCRM(data) {
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
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Added to Zoho CRM:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding to Zoho CRM:', error.message);
    throw error;
  }
}

/**
 * Add data to Zoho Sheets
 */
async function addToZohoSheet(data) {
  try {
    const sheetId = process.env.ZOHO_SHEET_ID;
    
    if (!sheetId) {
      console.warn('⚠️ Zoho Sheet ID not configured, skipping Zoho Sheets integration');
      return false;
    }

    const accessToken = await getZohoAccessToken();

    // Using Zoho Sheet API v2 - simple row append
    const url = `https://sheet.zoho.in/api/v2/${sheetId}`;
    
    const payload = {
      worksheet_name: 'Leads',
      row_data: {
        Timestamp: data.timestamp,
        Name: data.name,
        Email: data.email,
        Phone: data.phone,
        Interest: data.interest,
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Added to Zoho Sheets:', data.name);
    return true;
  } catch (error) {
    console.error('❌ Error adding to Zoho Sheet:', {
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    // Don't fail the request if Sheets fails - CRM is primary
    return false;
  }
}


/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(data) {
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
    console.error('❌ Error sending confirmation email:', error.message);
    throw error;
  }
}

/**
 * Send notification email to admin
 */
async function sendAdminNotification(data) {
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
          This lead has been automatically added to Zoho CRM and Zoho Sheets for tracking.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent to:', process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
    throw error;
  }
}

/**
 * @swagger
 * /api/consultation:
 *   post:
 *     summary: Submit a consultation request
 *     description: Submit a consultation form with name, email, phone, and area of interest. Integrates with Zoho CRM, Zoho Sheets, and sends confirmation emails.
 *     tags: [Consultation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsultationRequest'
 *     responses:
 *       200:
 *         description: Consultation request processed (check results for integration status)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultationResponse'
 *       400:
 *         description: Bad request - Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Consultation endpoint with Zoho CRM + Zoho Sheets integration
app.post('/api/consultation', async (req, res) => {
  try {
    const { name, email, phone, interest, timestamp } = req.body;

    // Validation
    if (!name || !email || !phone || !interest) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, phone, interest',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    console.log('📝 Processing consultation:', { name, email, phone, interest });

    const results = {
      zoho: false,
      zohoSheets: false,
      confirmationEmail: false,
      adminEmail: false,
      errors: [],
    };

    // Add to Zoho CRM (primary)
    try {
      await addToZohoCRM({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        interest: interest.trim(),
        timestamp: timestamp || new Date().toISOString(),
      });
      results.zoho = true;
    } catch (error) {
      results.errors.push(`Zoho CRM error: ${error.message}`);
    }

    // Add to Zoho Sheets (backup)
    try {
      const sheetSuccess = await addToZohoSheet({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        interest: interest.trim(),
        timestamp: timestamp || new Date().toISOString(),
      });
      results.zohoSheets = sheetSuccess;
    } catch (error) {
      console.warn(`⚠️ Zoho Sheets optional error: ${error.message}`);
    }

    // Send confirmation email to user
    try {
      await sendConfirmationEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        interest: interest.trim(),
        timestamp: timestamp || new Date().toISOString(),
      });
      results.confirmationEmail = true;
    } catch (error) {
      results.errors.push(`Confirmation email error: ${error.message}`);
    }

    // Send notification email to admin
    try {
      await sendAdminNotification({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        interest: interest.trim(),
        timestamp: timestamp || new Date().toISOString(),
      });
      results.adminEmail = true;
    } catch (error) {
      results.errors.push(`Admin email error: ${error.message}`);
    }

    // Consider successful if Zoho CRM was added
    const isSuccess = results.zoho || results.zohoSheets;

    return res.status(200).json({
      success: isSuccess,
      message: isSuccess 
        ? 'Consultation submitted successfully!' 
        : 'Failed to process consultation',
      results,
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Consultation endpoint: POST http://localhost:${PORT}/api/consultation`);
  console.log(`� API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`�📊 Zoho Sheet ID: ${process.env.ZOHO_SHEET_ID ? '✅ ' + process.env.ZOHO_SHEET_ID : '❌ Not configured'}`);
  console.log(`✉️  Admin Email: ${process.env.ADMIN_EMAIL ? '✅ ' + process.env.ADMIN_EMAIL : '❌ Not configured'}`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(60)}\n`);
});



