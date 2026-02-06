# Consultation Form - Quick Integration Summary

## What Was Added

### 1. **ConsultationPopup Component** (`src/components/ConsultationPopup.tsx`)
- Beautiful animated popup dialog
- Form fields: Name, Email, Phone, Interest (dropdown)
- Client-side validation
- Loading states and success confirmation
- Toast notifications for user feedback

### 2. **Updated Components**
- **CTASection** - Both buttons ("Start Your Journey" & "Schedule Consultation") now open the popup
- **JourneySection** - Added "Start Your Journey" button and integrated popup

### 3. **Backend API Layer**
- **`api/consultation.ts`** - Core business logic
  - Google Sheets integration
  - Email confirmation (user)
  - Admin notification email
  
- **`api/routes.ts`** - Express route handler
  - POST `/api/consultation` endpoint
  - Input validation
  - Error handling

### 4. **Frontend Service**
- **`src/services/consultationService.ts`** - API client for form submissions

### 5. **Documentation & Configuration**
- **`CONSULTATION_SETUP.md`** - Complete setup guide
- **`.env.example`** - Environment variable template
- **`server.example.ts`** - Express server example
- **`VITE_PROXY_CONFIG.example.ts`** - Development proxy setup

## Quick Start (5 Steps)

### Step 1: Get Google Cloud Credentials
```bash
# Follow CONSULTATION_SETUP.md to:
# 1. Create Google Cloud project
# 2. Enable Google Sheets API
# 3. Create service account
# 4. Download JSON key
```

### Step 2: Create Google Sheet
```
1. Create new Google Sheet: "Consultation Leads"
2. Add columns: Timestamp | Name | Email | Phone | Interest
3. Share with service account email
```

### Step 3: Set Up Gmail
```
1. Enable 2FA on Gmail
2. Generate app password
3. Copy the 16-character password
```

### Step 4: Configure Environment
```bash
# Copy .env.example to .env and fill in:
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/key.json
GOOGLE_SHEET_ID=your-sheet-id
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@company.com
```

### Step 5: Install Dependencies & Run
```bash
npm install googleapis nodemailer

# Start backend (copy server.example.ts to server.ts)
npm run server

# Start frontend
npm run dev
```

## How It Works

1. **User clicks** "Schedule Consultation" or "Start Your Journey"
2. **Popup opens** with form (name, email, phone, interest)
3. **User submits** the form
4. **Frontend validates** and sends to `/api/consultation`
5. **Backend**:
   - ✅ Saves data to Google Sheet
   - ✅ Sends confirmation email to user
   - ✅ Sends notification to admin
6. **Popup shows** success message and closes

## File Locations

```
Frontend Components:
├── src/components/ConsultationPopup.tsx
├── src/components/sections/CTASection.tsx (updated)
├── src/components/sections/JourneySection.tsx (updated)
└── src/services/consultationService.ts

Backend API:
├── api/consultation.ts (business logic)
└── api/routes.ts (express routes)

Config & Docs:
├── CONSULTATION_SETUP.md (detailed guide)
├── .env.example (environment template)
├── server.example.ts (backend setup)
└── VITE_PROXY_CONFIG.example.ts (dev proxy setup)
```

## Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text | ✅ | Full name of prospect |
| Email | Email | ✅ | Valid email address |
| Phone | Tel | ✅ | Contact number |
| Interest | Select | ✅ | Options: Cybersecurity, Data Engineering, AI & ML, Not Sure |

## Email Notifications

### User Receives:
- Confirmation of consultation request
- Expected contact timeframe (24 hours)
- Company branding and information

### Admin Receives:
- New lead notification with all details
- Action required reminder
- Timestamp of submission

## Customization

### Change Form Fields
Edit `ConsultationPopup.tsx`:
```tsx
// Add new field
<div className="space-y-2">
  <Label htmlFor="field">Field Name</Label>
  <Input
    id="field"
    value={formData.field}
    onChange={(e) => handleChange("field", e.target.value)}
  />
</div>

// Update state
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  interest: "",
  newField: "", // Add this
});
```

### Change Email Templates
Edit `api/consultation.ts`:
- `sendConfirmationEmail()` - User email template
- `sendAdminNotification()` - Admin email template

### Change Google Sheet Columns
Update `api/consultation.ts` line with append:
```ts
range: 'Consultations!A:F', // Change to match your columns
values: [
  [timestamp, name, email, phone, interest, newField], // Add new field
],
```

## Environment Variables Needed

| Variable | Example | Source |
|----------|---------|--------|
| GOOGLE_SERVICE_ACCOUNT_KEY | `/path/to/key.json` | Google Cloud Console |
| GOOGLE_SHEET_ID | `1qwerty123...` | Google Sheet URL |
| EMAIL_USER | `your@gmail.com` | Gmail account |
| EMAIL_PASSWORD | `abcd efgh ijkl mnop` | Gmail App Password |
| ADMIN_EMAIL | `admin@company.com` | Your company email |

## Testing

```bash
# Test the form locally
1. Open http://localhost:8080
2. Click "Schedule Consultation"
3. Fill form with test data
4. Submit and verify:
   - ✅ New row in Google Sheet
   - ✅ Confirmation email received
   - ✅ Admin notification received
```

## Production Deployment

1. Set environment variables in hosting platform
2. Deploy backend separately or use serverless
3. Update API endpoint if needed
4. Test end-to-end
5. Monitor email delivery and sheet updates

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Form won't submit | Check API endpoint is running |
| Google Sheet not updating | Verify service account permissions |
| No confirmation email | Check Gmail credentials and spam folder |
| CORS errors | Configure proxy in vite.config.ts |

## Support Resources

- [CONSULTATION_SETUP.md](./CONSULTATION_SETUP.md) - Detailed setup guide
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Nodemailer Docs](https://nodemailer.com/)
- [Express.js Docs](https://expressjs.com/)

---

**Ready to go!** Follow the Quick Start steps above to get your consultation form working. 🚀
