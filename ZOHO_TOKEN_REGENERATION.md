# Zoho CRM OAuth2 Refresh Token Regeneration Guide

## Issue: 401 Unauthorized Error

If you're getting a `401 Unauthorized` error when trying to add leads to Zoho CRM, your refresh token has likely expired or become invalid.

---

## Solution: Regenerate Refresh Token

### Step 1: Go to Zoho Developer Console

1. Open: https://accounts.zoho.com/developerconsole
2. Login with your Zoho account

### Step 2: Create OAuth Client (if not exists)

1. Click **"Add Client"** in the left sidebar
2. Select **"Server-based Applications"**
3. Fill in details:
   - **Client Name:** `QuantumSec Labs Backend`
   - **Company Name:** Your company
   - **Authorization URL:** `http://localhost:3001/callback` (for local) or your deployed URL
4. Click **"Create"**

### Step 3: Get Authorization Code

1. In your OAuth client details, copy:
   - **Client ID**
   - **Client Secret**

2. In your browser, visit this URL (replace CLIENT_ID):
   ```
   https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=CLIENT_ID&scope=ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.UPDATE&redirect_uri=http://localhost:3001/callback&access_type=offline
   ```

3. Authorize the application
4. You'll be redirected to a callback URL with a code parameter

### Step 4: Get Refresh Token

1. Make a POST request to get the refresh token. Use this format:

**Using curl (Mac/Linux):**
```bash
curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3001/callback" \
  -d "grant_type=authorization_code"
```

**Using PowerShell (Windows):**
```powershell
$params = @{
    Uri = 'https://accounts.zoho.in/oauth/v2/token'
    Method = 'POST'
    Body = @{
        code = 'YOUR_AUTH_CODE'
        client_id = 'YOUR_CLIENT_ID'
        client_secret = 'YOUR_CLIENT_SECRET'
        redirect_uri = 'http://localhost:3001/callback'
        grant_type = 'authorization_code'
    }
}
$response = Invoke-WebRequest @params
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

2. The response will look like:
```json
{
  "access_token": "...",
  "refresh_token": "1000.abc123...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### Step 5: Update Your Credentials

1. Copy the **refresh_token** value
2. Update `api/.env`:
   ```env
   ZOHO_CLIENT_ID=1000.ZVMTNQNY18JU52BMICKBSHQOIKCEGU
   ZOHO_CLIENT_SECRET=YOUR_NEW_SECRET
   ZOHO_REFRESH_TOKEN=1000.YOUR_NEW_REFRESH_TOKEN
   ```

3. Save and restart the server:
   ```bash
   npm run server
   ```

---

## Alternative: Use Zoho REST API Explorer

1. Go to: https://www.zohoapis.com/crm/v2/
2. Click **"REST API Test"** or **"API Test Console"**
3. This provides a web interface to test your credentials

---

## Verify Your Credentials

### Check Client ID and Secret
1. Go to https://accounts.zoho.com/developerconsole
2. Click on your OAuth client
3. Verify **Client ID** and **Client Secret**

### Check Refresh Token
The refresh token should:
- Start with `1000.`
- Be very long (100+ characters)
- Include lowercase letters, numbers, periods, and dashes

### Example Valid Token
```
1000.ad22b7189bee95161b8649e2426a0efb.38502fa5765391ccfa490a5ae73fdbcd1234567890abcdef
```

---

## Troubleshooting

### 401 Unauthorized
- Refresh token expired or invalid
- Client ID/Secret mismatch
- Check Zoho account is active

### 403 Forbidden
- OAuth client doesn't have CRM API permission
- Go to API permissions and enable "CRM API"

### 400 Bad Request
- Check parameter formatting
- Verify grant_type is correct

### Invalid_code Error
- Auth code expired (valid for only 10 minutes)
- Need to get a new auth code

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `api/.env` to GitHub
- Refresh tokens are sensitive - keep them private
- Store in environment variables, not in code
- Use different tokens for dev, staging, production

---

## Current Credentials Location

Your credentials are stored in:
```
api/.env (DO NOT COMMIT)
```

With variables:
- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REFRESH_TOKEN`

---

## Test After Updating

```bash
# 1. Update api/.env with new credentials
# 2. Start server
npm run server

# 3. Test API endpoint
curl -X POST http://localhost:3001/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "interest": "Web Development"
  }'

# 4. Check response includes "zoho": true
```

---

## Links

- [Zoho Developer Console](https://accounts.zoho.com/developerconsole)
- [Zoho CRM OAuth Documentation](https://www.zoho.com/crm/developer/docs/api/oauth-overview.html)
- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/)
- [CRM Modules - Leads](https://www.zoho.com/crm/developer/docs/api/modules-api.html)

---

**Last Updated:** January 27, 2026
