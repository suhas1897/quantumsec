# Quick Fix: Regenerate Zoho Refresh Token (5 Minutes)

## Problem
```
"zoho": false,
"errors": ["Zoho CRM error: Request failed with status code 401"]
```

Your Zoho refresh token is expired. ✅ **Email service is working!**

---

## Solution (Quick Steps)

### 1. Get New Refresh Token

Go to: https://accounts.zoho.com/developerconsole

**In browser console, run:**
```javascript
// Get your Client ID and Secret
const clientId = '1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU';
const clientSecret = 'dc3dee2b0071b9ff1b7dd743508b3324fd32da29bb';

// In another tab, open this URL:
// https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU&scope=ZohoCRM.modules.leads.CREATE&redirect_uri=http://localhost:3001/callback&access_type=offline

// Copy the CODE from the URL after authorization
```

### 2. Exchange Code for Refresh Token

**PowerShell:**
```powershell
$code = "PASTE_THE_CODE_HERE"
$clientId = "1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU"
$clientSecret = "dc3dee2b0071b9ff1b7dd743508b3324fd32da29bb"

$response = Invoke-WebRequest -Uri "https://accounts.zoho.in/oauth/v2/token" -Method POST -Body @{
    code = $code
    client_id = $clientId
    client_secret = $clientSecret
    redirect_uri = "http://localhost:3001/callback"
    grant_type = "authorization_code"
}

$token = ($response.Content | ConvertFrom-Json).refresh_token
Write-Host "Refresh Token: $token"
```

### 3. Update `api/.env`

Edit file: `h:\quantunlabs\quantum-leap-labs\api\.env`

Replace this line:
```env
ZOHO_REFRESH_TOKEN=1000.ad22b7189bee95161b8649e2426a0efb.38502fa5765391ccfa490a5ae73fdbcdqkmh6152f57f205f04c9289b2d72a83413868
```

With your new token:
```env
ZOHO_REFRESH_TOKEN=1000.YOUR_NEW_TOKEN_HERE
```

### 4. Restart Server

```bash
npm run server
```

### 5. Test Again

```bash
curl -X POST http://localhost:3001/api/consultation \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","interest":"Web"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Consultation submitted successfully!",
  "results": {
    "zoho": true,
    "zohoSheets": true,
    "confirmationEmail": true,
    "adminEmail": true,
    "errors": []
  }
}
```

---

## What's Already Working ✅

- Email confirmations
- Admin notifications
- Zoho Sheets logging
- API validation
- Error handling

**Just need to refresh the Zoho token!**

---

## Current Credentials

```
CLIENT_ID: 1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU
CLIENT_SECRET: dc3dee2b0071b9ff1b7dd743508b3324fd32da29bb
SHEET_ID: qkmh6152f57f205f04c9289b2d72a83413868
ADMIN_EMAIL: kvchandukv4096@gmail.com
```

---

## Reference Files

- Full guide: [ZOHO_TOKEN_REGENERATION.md](ZOHO_TOKEN_REGENERATION.md)
- Test results: [TEST_RESULTS.md](TEST_RESULTS.md)
- Backend setup: [BACKEND_SETUP.md](BACKEND_SETUP.md)

---

**Time to fix:** 5 minutes ⏱️  
**Status:** Backend ready, just need token refresh 🔐
