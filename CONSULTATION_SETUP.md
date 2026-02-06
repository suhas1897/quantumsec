# Consultation Form Setup Guide

This guide explains how to configure the consultation popup form to work with Google Sheets and email notifications.

## Overview

The consultation form collects user information (name, email, phone, interest) and:
1. **Stores data** in a Google Sheet for lead tracking
2. **Sends confirmation email** to the user
3. **Sends admin notification** to your team

## Features

✅ Beautiful animated popup dialog  
✅ Form validation  
✅ Google Sheets integration  
✅ Email notifications (user + admin)  
✅ Toast notifications for user feedback  
✅ Loading states and success confirmations  

## Setup Instructions

### 1. **Google Sheets Setup**

#### Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google Sheets API**
4. Enable the **Google Drive API**

#### Create Service Account
1. Go to **Service Accounts** in Google Cloud Console
2. Create a new service account
3. Create a JSON key and download it
4. Save this file in a secure location

#### Create Google Sheet
1. Create a new Google Sheet for consultation submissions
2. Name it (e.g., "Consultation Leads")
3. Create a header row with these columns:
   - Timestamp
   - Name
   - Email
   - Phone
   - Interest

4. Share the sheet with your service account email (found in the JSON key file)

### 2. **Email Configuration**

The system uses Gmail for sending emails. You have two options:

#### Option A: Gmail App Password (Recommended)
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Go to **App passwords** (in Security section)
4. Generate a password for "Mail" and "Windows"
5. Copy the 16-character password

#### Option B: Gmail Less Secure App
1. Go to [Account Security Settings](https://myaccount.google.com/security)
2. Scroll down to "Less secure app access"
3. Turn it ON

### 3. **Environment Variables Setup**

Create a `.env` file in the project root with:

```env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/your/service-account-key.json
GOOGLE_SHEET_ID=your-sheet-id-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-or-less-secure-password
ADMIN_EMAIL=admin@yourcompany.com
```

#### Finding Your Google Sheet ID
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- Copy the `SHEET_ID_HERE` part

### 4. **Install Required Packages**

If not already installed, add these dependencies:

```bash
npm install googleapis nodemailer
npm install --save-dev @types/nodemailer
```

### 5. **API Endpoint Configuration**

The form submits to `/api/consultation`. You need to:

1. **For Express.js Backend:**
   - Import the routes from `api/routes.ts`
   - Add to your express app:
   ```typescript
   import consultationRoutes from './api/routes';
   app.use('/api', consultationRoutes);
   ```

2. **For Vercel/Serverless:**
   - Move `api/routes.ts` to `api/consultation.js`
   - Vercel will automatically handle the routing

3. **For Other Backends:**
   - Create an endpoint that handles POST requests
   - Call `handleConsultationSubmission()` from `api/consultation.ts`

### 6. **Update Frontend Service**

The frontend service is in `src/services/consultationService.ts`. It expects:
- API endpoint: `/api/consultation`
- Method: POST
- Request body: `{ name, email, phone, interest, timestamp }`

## Component Usage

### Using the Consultation Popup

The popup is already integrated in:
- **CTASection** - Both CTA buttons open the popup
- **JourneySection** - "Start Your Journey" button opens the popup

To add it to other components:

```tsx
import { useState } from "react";
import { ConsultationPopup } from "@/components/ConsultationPopup";
import { Button } from "@/components/ui/button";

export const MyComponent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsPopupOpen(true)}>
        Schedule Consultation
      </Button>
      <ConsultationPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
};
```

## Email Customization

Edit `/api/consultation.ts` to customize:

### User Confirmation Email
- Change the HTML template in `sendConfirmationEmail()`
- Modify the subject line
- Add your company branding

### Admin Notification Email
- Modify the template in `sendAdminNotification()`
- Change the recipient (`ADMIN_EMAIL`)
- Add additional fields as needed

## Testing

### Test the Form Locally
1. Start your development server
2. Click "Schedule Consultation" or "Start Your Journey"
3. Fill in the form with test data
4. Check:
   - ✅ Google Sheet for the new entry
   - ✅ Your email for confirmation
   - ✅ Admin email for notification

### Troubleshooting

**Issue: "Failed to submit form"**
- Check that the `/api/consultation` endpoint is running
- Verify environment variables are set correctly
- Check browser console for error details

**Issue: Google Sheets not updating**
- Verify service account has access to the sheet
- Check `GOOGLE_SHEET_ID` is correct
- Ensure column names match (Timestamp, Name, Email, Phone, Interest)

**Issue: Emails not sending**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Check Gmail app password is 16 characters
- Enable "Less Secure App" if not using app password
- Check spam/junk folders

**Issue: CORS errors**
- Ensure backend is running on the correct port
- Check proxy configuration in `vite.config.ts`

## File Structure

```
src/
├── components/
│   ├── ConsultationPopup.tsx          # Main popup component
│   └── sections/
│       ├── CTASection.tsx             # Updated with popup
│       └── JourneySection.tsx         # Updated with popup
└── services/
    └── consultationService.ts         # API client

api/
├── consultation.ts                    # Google Sheets + Email logic
└── routes.ts                          # Express routes
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use app passwords** instead of main Gmail password
3. **Restrict service account permissions** to only needed scopes
4. **Validate all inputs** on both frontend and backend
5. **Use HTTPS** in production
6. **Store sensitive keys** in environment variables
7. **Implement rate limiting** to prevent spam

## Next Steps

1. Configure Google Cloud and create service account
2. Create Google Sheet with headers
3. Set up Gmail and get app password
4. Add environment variables to `.env`
5. Install required npm packages
6. Test the form submission
7. Customize email templates as needed
8. Deploy to production

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Google Sheets API documentation
- Check Nodemailer documentation
- Review browser console for error messages
