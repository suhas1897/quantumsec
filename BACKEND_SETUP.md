# Backend Configuration & Integration Guide

## Overview

The backend has been upgraded to integrate with **Zoho CRM** (primary) and **Google Sheets** (optional) for managing consultation submissions. All sensitive credentials are kept secure in the backend.

---

## Architecture

```
Frontend (.env)
├─ VITE_SUPABASE_* (public)
├─ VITE_API_URL (public)
└─ NO sensitive data ❌

     ↓ HTTP POST /api/consultation

Backend (api/.env)
├─ ZOHO_CLIENT_ID/SECRET/REFRESH_TOKEN (private) ✅
├─ GOOGLE_SHEET_ID (private) ✅
├─ EMAIL_USER/PASSWORD (private) ✅
└─ API Key integrations (private) ✅
```

---

## Files Structure

```
api/
├─ server.ts               ← Main Express server
├─ consultationHandler.ts  ← Zoho + Google Sheets logic (NEW)
├─ consultation.ts         ← Legacy Google Sheets (KEEP as backup)
├─ routes.ts
├─ .env                    ← Sensitive credentials (DO NOT COMMIT)
├─ .env.example            ← Template with instructions
└─ .gitignore             ← Already excludes .env
```

---

## Backend Environment Variables

### Required Variables

#### Zoho CRM (Primary Lead Management)
```env
ZOHO_CLIENT_ID=1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU
ZOHO_CLIENT_SECRET=dc3dee2b0071b9ff1b7dd743508b3324fd32da29bb
ZOHO_REFRESH_TOKEN=1000.ad22b7189bee95161b8649e2426a0efb.38502fa5765391ccfa490a5ae73fdbcdqkmh6152f57f205f04c9289b2d72a83413868
```

**How to get Zoho credentials:**
1. Go to [Zoho Developer Console](https://accounts.zoho.com/developerconsole)
2. Create a Server-based App
3. Get Client ID and Client Secret
4. Generate Refresh Token using OAuth2
5. Copy values to `api/.env`

#### Email Service
```env
EMAIL_USER=chalamcherlasuhas1980@gmail.com
EMAIL_PASSWORD=epgppblajymwajwl
ADMIN_EMAIL=kvchandukv4096@gmail.com
```

**Note:** Using Gmail's App Passwords (not regular password)

### Optional Variables

#### Google Sheets (Backup Logging)
```env
GOOGLE_SERVICE_ACCOUNT_KEY=secret/quantumseclabs-1d9ea47d935b.json
GOOGLE_SHEET_ID=qkmh6152f57f205f04c9289b2d72a83413868
```

#### Server Configuration
```env
PORT=3001
NODE_ENV=production
CLIENT_URL=https://your-netlify-domain.netlify.app
```

---

## How It Works

### Consultation Submission Flow

```
1. User submits form on frontend
   ↓
2. Frontend calls: POST /api/consultation
   └─ Body: { name, email, phone, interest, timestamp }
   
3. Backend processes (api/consultationHandler.ts):
   
   a. Add to Zoho CRM ✅
      └─ Creates a Lead in Zoho CRM
      └─ Includes contact details + timestamp
      
   b. Add to Google Sheets (Optional)
      └─ Appends row to specified sheet
      └─ Backup for data retention
      
   c. Send Confirmation Email to User ✅
      └─ Professional HTML template
      └─ Shows submission details
      
   d. Send Admin Notification ✅
      └─ Notifies admin@email.com
      └─ Includes lead details
      
4. Return JSON response with results
   └─ Success/failure status
   └─ Details of what succeeded/failed
```

---

## API Endpoint

### POST /api/consultation

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "interest": "Web Development",
  "timestamp": "2026-01-27T10:30:00.000Z"  // Optional
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Consultation submitted successfully!",
  "results": {
    "zoho": true,
    "googleSheets": true,
    "confirmationEmail": true,
    "adminEmail": true,
    "errors": []
  }
}
```

**Partial Success (200):**
```json
{
  "success": true,
  "message": "Consultation submitted successfully!",
  "results": {
    "zoho": true,
    "googleSheets": false,
    "confirmationEmail": true,
    "adminEmail": true,
    "errors": [
      "Google Sheets optional error: Sheet not found"
    ]
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Missing required fields",
  "error": "Details in development mode"
}
```

---

## Local Development

### Setup Steps

1. **Create backend .env file:**
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start backend server:**
   ```bash
   npm run server
   # or in another terminal:
   node api/server.mjs
   ```

4. **Start frontend dev server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Test API:**
   ```bash
   # Test health endpoint
   curl http://localhost:3001/health
   
   # Test consultation endpoint
   curl -X POST http://localhost:3001/api/consultation \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "1234567890",
       "interest": "Web Development"
     }'
   ```

---

## Production Deployment

### Railway Backend Setup

1. **Create `.env` file in `api/` folder** (DO NOT commit):
   ```env
   PORT=3001
   NODE_ENV=production
   CLIENT_URL=https://your-netlify-domain.netlify.app
   ZOHO_CLIENT_ID=...
   ZOHO_CLIENT_SECRET=...
   ZOHO_REFRESH_TOKEN=...
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   ADMIN_EMAIL=...
   GOOGLE_SHEET_ID=...
   GOOGLE_SERVICE_ACCOUNT_KEY=...
   ```

2. **Add to Railway Dashboard:**
   - Go to Project → Variables
   - Add each variable from `.env`

3. **Configure Deploy:**
   - Build command: `npm install`
   - Start command: `node api/server.mjs`

4. **Deploy:**
   - Push to GitHub
   - Railway auto-deploys

### Netlify Frontend Setup

1. **Ensure frontend .env has only VITE_ variables:**
   ```env
   VITE_API_URL=https://your-railway-backend.up.railway.app
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   ```

2. **Build command:** `npm run build`

3. **Publish directory:** `dist`

4. **Deploy:**
   - Push to GitHub
   - Netlify auto-deploys

---

## Troubleshooting

### Issue: "Zoho authentication failed"
**Solution:**
- Verify `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` are correct
- Check token hasn't expired: [Zoho Console](https://accounts.zoho.com/developerconsole)
- Test locally: `npm run server` and check logs

### Issue: "Email sending failed"
**Solution:**
- Verify Gmail app password (not regular password)
- Check "Allow less secure apps" in Gmail settings
- Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- Check `ADMIN_EMAIL` is valid

### Issue: "Google Sheets 404 error"
**Solution:**
- Verify `GOOGLE_SHEET_ID` is correct
- Check service account has access to the sheet
- Verify sheet has a "Consultations" tab
- If not needed, remove `GOOGLE_SHEET_ID` - it's optional

### Issue: CORS errors in frontend
**Solution:**
- Verify `CLIENT_URL` on backend matches frontend domain
- Restart backend after changing environment variables
- Check browser DevTools Network tab for actual error

### Issue: Build fails on Railway
**Solution:**
- Check Railway logs: Project → Service → Logs
- Verify all dependencies installed: `npm install`
- Check start command: `node api/server.mjs`
- Ensure `api/` folder exists and has all files

---

## Security Checklist

- [x] Backend credentials in `api/.env` (not frontend)
- [x] `.env` files in `.gitignore` (not committed)
- [x] Use environment variables for sensitive data
- [x] VITE_ prefix only for frontend public variables
- [x] Email passwords use app-specific passwords
- [x] Zoho refresh token stored securely on backend
- [x] Frontend only knows API endpoint URL
- [x] No API keys exposed in network requests
- [x] CORS configured to only allow frontend domain

---

## Environment Variables Summary

### Frontend (.env) - PUBLIC
```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
VITE_API_URL
```

### Backend (api/.env) - PRIVATE
```
PORT
NODE_ENV
CLIENT_URL
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
EMAIL_USER
EMAIL_PASSWORD
ADMIN_EMAIL
GOOGLE_SERVICE_ACCOUNT_KEY
GOOGLE_SHEET_ID
```

---

## References

- [Zoho CRM API Docs](https://www.zoho.com/crm/developer/docs/api/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Express.js CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Railway Docs](https://docs.railway.app)
- [Netlify Docs](https://docs.netlify.com)

---

**Last Updated:** January 27, 2026  
**Version:** 2.0 (Zoho CRM + Google Sheets)
