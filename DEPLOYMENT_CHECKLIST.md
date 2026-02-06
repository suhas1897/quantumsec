# Deployment Checklist: Zoho + Google Sheets + Railway + Netlify

## Pre-Deployment: Local Testing

### Backend Setup
- [ ] Copy `api/.env.example` to `api/.env`
- [ ] Fill in all Zoho credentials:
  - [ ] `ZOHO_CLIENT_ID`
  - [ ] `ZOHO_CLIENT_SECRET`
  - [ ] `ZOHO_REFRESH_TOKEN`
- [ ] Fill in email credentials:
  - [ ] `EMAIL_USER` (Gmail with app password)
  - [ ] `EMAIL_PASSWORD`
  - [ ] `ADMIN_EMAIL`
- [ ] (Optional) Fill in Google Sheets:
  - [ ] `GOOGLE_SHEET_ID`
  - [ ] `GOOGLE_SERVICE_ACCOUNT_KEY`

### Frontend Setup
- [ ] Verify `.env` contains only VITE_ variables:
  ```env
  VITE_SUPABASE_PROJECT_ID
  VITE_SUPABASE_PUBLISHABLE_KEY
  VITE_SUPABASE_URL
  VITE_API_URL=http://localhost:3001
  ```
- [ ] NO sensitive data in frontend `.env`

### Local Testing
- [ ] Install dependencies: `npm install` or `bun install`
- [ ] Start backend: `npm run server`
- [ ] Start frontend: `npm run dev`
- [ ] Test health endpoint: `curl http://localhost:3001/health`
- [ ] Test API endpoint:
  ```bash
  curl -X POST http://localhost:3001/api/consultation \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "interest": "Web Development"
    }'
  ```
- [ ] Verify response includes successful Zoho creation
- [ ] Check email arrived in admin inbox
- [ ] Check Zoho CRM has new lead
- [ ] (Optional) Check Google Sheets has new row

---

## Deployment: Railway Backend

### Create Railway Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Authorize Railway with GitHub
- [ ] Select your repository
- [ ] Select main branch

### Configure Railway
- [ ] Go to Project Settings → Build & Deploy
- [ ] Set **Build command:** `npm install`
- [ ] Set **Start command:** `node api/server.mjs`

### Add Environment Variables to Railway
- [ ] Go to Variables tab
- [ ] Add all variables from `api/.env`:
  ```env
  PORT=3001
  NODE_ENV=production
  CLIENT_URL=https://your-netlify-domain.netlify.app  # Update after Netlify deployment
  ZOHO_CLIENT_ID=
  ZOHO_CLIENT_SECRET=
  ZOHO_REFRESH_TOKEN=
  EMAIL_USER=
  EMAIL_PASSWORD=
  ADMIN_EMAIL=
  GOOGLE_SHEET_ID=  # Optional
  GOOGLE_SERVICE_ACCOUNT_KEY=  # Optional
  ```

### Railway Deployment
- [ ] Trigger deployment by pushing to GitHub: `git push origin main`
- [ ] Check deployment status in Railway dashboard
- [ ] Wait for "Deployed" status
- [ ] Copy Railway URL: `https://your-service-production.up.railway.app`
- [ ] Test health: `curl https://your-service-production.up.railway.app/health`

---

## Deployment: Netlify Frontend

### Create Netlify Project
- [ ] Go to [netlify.com](https://netlify.com)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Select your GitHub repository
- [ ] Select main branch

### Configure Netlify Build
- [ ] **Build command:** `npm run build`
- [ ] **Publish directory:** `dist`
- [ ] Click "Deploy site"

### Add Netlify Environment Variables
- [ ] Go to Site settings → Build & Deploy → Environment
- [ ] Add environment variables:
  ```env
  VITE_API_URL=https://your-service-production.up.railway.app
  VITE_SUPABASE_PROJECT_ID=dczqzuqflhhlmimiudfl
  VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  VITE_SUPABASE_URL=https://dczqzuqflhhlmimiudfl.supabase.co
  ```
- [ ] Trigger redeploy after adding variables

### Netlify Deployment
- [ ] Wait for "Published" status
- [ ] Copy Netlify URL: `https://your-site-name.netlify.app`

---

## Post-Deployment: Update URLs

### Update Backend CLIENT_URL
- [ ] Get Netlify domain from deployment
- [ ] Go to Railway → Variables
- [ ] Update `CLIENT_URL` to Netlify domain
- [ ] Restart Railway service (redeploy)

### Test Production
- [ ] Frontend loads: `https://your-site-name.netlify.app`
- [ ] No console errors (F12)
- [ ] Test health endpoint: `curl https://your-railway-backend.up.railway.app/health`
- [ ] Test consultation submission from frontend
- [ ] Verify email received in admin inbox
- [ ] Check new lead in Zoho CRM
- [ ] (Optional) Check Google Sheets updated

---

## Post-Deployment: Monitoring

### Backend Monitoring
- [ ] Check Railway logs regularly
- [ ] Monitor error rate
- [ ] Set up email alerts (if available)

### Frontend Monitoring
- [ ] Check Netlify deploy logs
- [ ] Monitor build status
- [ ] Set up alerts for failed deployments

### Data Tracking
- [ ] Verify Zoho leads are accumulating
- [ ] Check email delivery (no bounces)
- [ ] (Optional) Verify Google Sheets backup

---

## Troubleshooting During Deployment

### Backend Won't Deploy on Railway
```
Check:
1. Railway logs for error messages
2. Ensure api/ folder exists
3. Verify api/server.mjs is the correct file
4. Check all environment variables are set
5. Try rebuilding: Railway → Service → Rebuild
```

### Frontend Shows Blank Page
```
Check:
1. Browser console (F12) for errors
2. Network tab for failed API calls
3. VITE_API_URL environment variable
4. Netlify build logs
5. Try clearing cache and reloading
```

### API Returns 404
```
Check:
1. Backend is deployed and healthy
2. VITE_API_URL matches Railway URL exactly
3. Frontend is calling correct endpoint: /api/consultation
4. Railway service is running (not crashed)
```

### CORS Errors
```
Check:
1. Backend CLIENT_URL matches frontend domain
2. Backend has restarted after CLIENT_URL change
3. Request includes Origin header
4. Backend cors() middleware is configured correctly
```

### Zoho Not Receiving Leads
```
Check:
1. ZOHO_CLIENT_ID, SECRET, REFRESH_TOKEN are correct
2. Token hasn't expired (check Zoho Console)
3. Backend logs show Zoho API calls
4. Response includes "zoho: true"
```

### Emails Not Arriving
```
Check:
1. EMAIL_USER and EMAIL_PASSWORD correct
2. Gmail app password (not regular password)
3. Admin inbox for spam folder
4. Response includes "confirmationEmail: true"
5. Backend logs show email sending
```

---

## After Everything is Deployed

### Update Documentation
- [ ] Update README.md with production URLs
- [ ] Document any custom setup steps
- [ ] Share deployment process with team

### Security Review
- [ ] Verify no API keys in frontend `.env`
- [ ] Check `.env` files are in `.gitignore`
- [ ] Confirm sensitive data only in backend
- [ ] Review CORS configuration
- [ ] Test with invalid credentials to ensure proper errors

### Backup & Disaster Recovery
- [ ] Backup Zoho database settings
- [ ] Backup Google Sheets
- [ ] Document recovery procedures
- [ ] Test backup restoration

### Ongoing Maintenance
- [ ] Monitor Railway usage (free tier limits)
- [ ] Monitor Netlify build minutes (free tier limits)
- [ ] Update dependencies monthly
- [ ] Review logs weekly
- [ ] Test backup systems monthly

---

## Quick Links

| Service | Link |
|---------|------|
| Railway | https://railway.app/dashboard |
| Netlify | https://app.netlify.com |
| Zoho Console | https://accounts.zoho.com/developerconsole |
| Gmail | https://myaccount.google.com/apppasswords |
| GitHub | https://github.com |

---

## Deployment Timeline

| Step | Duration | Priority |
|------|----------|----------|
| Local testing | 30 min | 🔴 Must Complete |
| Railway setup | 10 min | 🔴 Must Complete |
| Netlify setup | 5 min | 🔴 Must Complete |
| Add variables | 5 min | 🔴 Must Complete |
| Test production | 20 min | 🔴 Must Complete |
| Monitor & adjust | 30 min | 🟡 Recommended |

**Total Time:** ~2 hours (first deployment)

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** January 27, 2026  
**Version:** 1.0
