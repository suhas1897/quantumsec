# Visual Deployment Guide: Zoho + Google Sheets + Railway + Netlify

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Netlify)                              │
│                  https://your-site.netlify.app                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐                                        │
│  │   User Fills Form        │                                        │
│  │  (name, email, phone,    │                                        │
│  │   interest)              │                                        │
│  └────────────┬─────────────┘                                        │
│               │                                                       │
│               │ POST /api/consultation                               │
│               │ (JSON)                                               │
│               ▼                                                       │
│  ┌──────────────────────────┐                                        │
│  │  VITE_API_URL            │                                        │
│  │  (Railway backend URL)   │                                        │
│  └──────────────────────────┘                                        │
│                                                                       │
│  ✅ No sensitive data in frontend                                    │
│  ✅ Only public VITE_ variables                                      │
│                                                                       │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────────────┐
│                      BACKEND (Railway)                               │
│             https://your-service.up.railway.app                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────┐                                        │
│  │  Express Server          │                                        │
│  │  api/server.ts           │                                        │
│  │  Port: 3001              │                                        │
│  └────────────┬─────────────┘                                        │
│               │                                                       │
│     ┌─────────┴─────────┐                                            │
│     │                   │                                            │
│     ▼                   ▼                                            │
│  ┌──────────┐      ┌──────────────────────────┐                     │
│  │Validation│      │ Consultation Handler     │                     │
│  │- Email   │      │ (consultationHandler.ts) │                     │
│  │- Phone   │      └────┬─────────────────────┘                     │
│  │- Fields  │           │                                            │
│  └──────────┘      ┌────┴──┬──────────────┬──────────┐               │
│                    │       │              │          │               │
│                    ▼       ▼              ▼          ▼               │
│              ┌──────────┐┌──────────┐ ┌────────┐ ┌────────┐         │
│              │  Zoho    ││ Google   │ │  User  │ │ Admin  │         │
│              │  CRM     ││Sheets    │ │ Email  │ │ Email  │         │
│              │          ││(Backup)  │ │Confirm │ │Notify  │         │
│              └──────────┘└──────────┘ └────────┘ └────────┘         │
│              (REQUIRED)    (OPTIONAL) (REQUIRED) (REQUIRED)          │
│                                                                       │
│  🔐 All secrets stored here (api/.env)                              │
│  🔐 API Keys safe on backend                                        │
│  ✅ Multiple integration points                                     │
│  ✅ Graceful failure handling                                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER SUBMISSION
     │
     └──────────────────────────────────────────────────────────┐
                                                                 │
                      STEP 1: RECEIVE & VALIDATE
                                                                 │
     ┌────────────────────────────────────────────────────────┐ │
     │ POST /api/consultation                                 │ │
     │ ├─ Validate email format ✓                             │ │
     │ ├─ Validate required fields ✓                          │ │
     │ └─ Sanitize input data ✓                              │ │
     └────────────────────────────────────────────────────────┘ │
                                                                 │
                      STEP 2: PROCESS CONCURRENTLY
                                                                 │
     ┌─────────────────────────────────────────────────────────┐
     │                                                           │
     ├─────────────────┬──────────────┬──────────┬─────────────┤
     │                 │              │          │             │
     ▼                 ▼              ▼          ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────┐ ┌──────┐  ┌───────┐
│ Zoho CRM    │  │Google Sheet │  │User     │ │Admin │  │ Log   │
│ API Call    │  │ Append      │  │Email    │ │Email │  │Response
│             │  │ (Optional)  │  │ Send    │ │Send  │  │       │
│ Create Lead │  │             │  │         │ │      │  │       │
└────┬────────┘  └────┬────────┘  └────┬────┘ └──┬───┘  └───┬───┘
     │                │               │        │        │
     └────────────────┼───────────────┼────────┼────────┘
                      │               │        │
                      └───────────────┼────────┘
                                      │
                      STEP 3: COLLECT RESULTS
                                      │
                      ┌───────────────▼────────────────┐
                      │ Check Status:                  │
                      │ ├─ zoho: ✓/✗                   │
                      │ ├─ googleSheets: ✓/✗           │
                      │ ├─ confirmationEmail: ✓/✗      │
                      │ ├─ adminEmail: ✓/✗             │
                      │ └─ errors: [...]               │
                      └───────────────┬────────────────┘
                                      │
                      STEP 4: RETURN RESPONSE
                                      │
                      ┌───────────────▼────────────────┐
                      │ {                              │
                      │   success: true,               │
                      │   message: "...",              │
                      │   results: {...}               │
                      │ }                              │
                      └────────────────────────────────┘
                                      │
                                      ▼
                            FRONTEND (Update UI)
```

---

## File Structure

```
quantum-leap-labs/
├── api/
│   ├── server.ts ✅ UPDATED
│   │   └─ Imports consultationHandler
│   │   └─ Routes POST /api/consultation
│   │
│   ├── consultationHandler.ts ✅ NEW
│   │   ├─ getZohoAccessToken()
│   │   ├─ addToZohoCRM()
│   │   ├─ addToGoogleSheet()
│   │   ├─ sendConfirmationEmail()
│   │   ├─ sendAdminNotification()
│   │   └─ processConsultation()
│   │
│   ├── consultation.ts (BACKUP)
│   │   └─ Legacy Google Sheets only
│   │
│   ├── .env ✅ NEW
│   │   ├─ ZOHO_CLIENT_ID
│   │   ├─ ZOHO_CLIENT_SECRET
│   │   ├─ ZOHO_REFRESH_TOKEN
│   │   ├─ EMAIL_USER
│   │   ├─ EMAIL_PASSWORD
│   │   ├─ ADMIN_EMAIL
│   │   ├─ GOOGLE_SHEET_ID
│   │   └─ GOOGLE_SERVICE_ACCOUNT_KEY
│   │
│   └── .env.example ✅ NEW
│       └─ Template for setup
│
├── src/
│   ├── services/
│   │   └── consultationService.ts (unchanged)
│   │       └─ Calls /api/consultation
│   │
│   └── ... (other components unchanged)
│
├── .env ✅ CLEANED
│   ├─ VITE_SUPABASE_PROJECT_ID
│   ├─ VITE_SUPABASE_PUBLISHABLE_KEY
│   ├─ VITE_SUPABASE_URL
│   ├─ VITE_API_URL
│   └─ ❌ Removed: Zoho, Email, Google creds
│
├── DEPLOYMENT_GUIDE.md
├── BACKEND_SETUP.md ✅ NEW
├── DEPLOYMENT_CHECKLIST.md ✅ NEW
└── DEPLOYMENT_SUMMARY.md ✅ NEW
```

---

## Deployment Timeline

### Day 1: Preparation
```
09:00 - Read documentation (30 min)
09:30 - Setup local environment (30 min)
10:00 - Test locally (30 min)
       └─ npm run server
       └─ npm run dev
       └─ Test API calls
10:30 - BREAK
```

### Day 1: Backend Deployment
```
11:00 - Create Railway account (10 min)
11:10 - Connect GitHub (5 min)
11:15 - Add environment variables (10 min)
11:25 - Configure build settings (5 min)
11:30 - Deploy & wait (10 min)
11:40 - Test backend endpoint (10 min)
       └─ curl https://your-railway.up.railway.app/health
```

### Day 1: Frontend Deployment
```
12:00 - Create Netlify account (5 min)
12:05 - Connect GitHub (5 min)
12:10 - Add environment variables (5 min)
       └─ VITE_API_URL = Railway URL
12:15 - Deploy & wait (10 min)
12:25 - Test frontend (10 min)
```

### Day 1: Final Testing
```
12:35 - Test form submission (10 min)
12:45 - Verify Zoho lead created (5 min)
12:50 - Check emails received (5 min)
12:55 - Check Google Sheets (5 min)
13:00 - ✅ DEPLOYMENT COMPLETE!
```

**Total Time:** ~4 hours

---

## Deployment Checklist Visual

### Local Setup
```
[ ] Install dependencies
    npm install axios
[ ] Create api/.env
    cp api/.env.example api/.env
[ ] Fill in credentials
    ZOHO_*
    EMAIL_*
[ ] Test backend
    npm run server
[ ] Test frontend
    npm run dev
[ ] Test API
    curl -X POST http://localhost:3001/api/consultation
```

### Railway Setup
```
[ ] Create account at railway.app
[ ] Connect GitHub repo
[ ] Select main branch
[ ] Set build command: npm install
[ ] Set start command: node api/server.mjs
[ ] Add environment variables
    - PORT=3001
    - NODE_ENV=production
    - CLIENT_URL=https://... (update after Netlify)
    - ZOHO_*
    - EMAIL_*
    - GOOGLE_*
[ ] Deploy (auto-trigger on git push)
[ ] Note Railway URL
    https://your-service-production.up.railway.app
```

### Netlify Setup
```
[ ] Create account at netlify.com
[ ] Connect GitHub repo
[ ] Select main branch
[ ] Set build command: npm run build
[ ] Set publish directory: dist
[ ] Add environment variables
    - VITE_API_URL=https://railway-url.up.railway.app
    - VITE_SUPABASE_*
[ ] Deploy (auto-trigger on git push)
[ ] Note Netlify URL
    https://your-site.netlify.app
```

### Final Steps
```
[ ] Update Railway CLIENT_URL
    https://your-site.netlify.app
[ ] Restart Railway service
[ ] Test production endpoint
    https://your-site.netlify.app
[ ] Submit test form
[ ] Verify Zoho lead
[ ] Verify emails
[ ] ✅ DONE!
```

---

## Success Indicators

### ✅ Local Development
- [ ] Backend starts: `npm run server` → "✅ Backend server running"
- [ ] Frontend starts: `npm run dev` → Browser opens at localhost:8080
- [ ] Health check: `curl http://localhost:3001/health` → `{"status":"ok"}`
- [ ] API works: Form submission → "Consultation submitted successfully!"
- [ ] Zoho: New lead appears in Zoho CRM
- [ ] Emails: Emails arrive in both user and admin inbox

### ✅ Production Deployment
- [ ] Railway shows "Deployed" status
- [ ] Netlify shows "Published" status
- [ ] Health check: `curl https://your-railway/health` → Works
- [ ] Frontend: `https://your-netlify.app` → Loads without errors
- [ ] Form: Submit → "Consultation submitted successfully!"
- [ ] Zoho: New lead appears within 30 seconds
- [ ] Emails: Confirmation and admin emails arrive

### ✅ Error Handling
- [ ] Invalid email → Returns 400 error
- [ ] Missing fields → Returns 400 error
- [ ] Zoho down → Returns with `zoho: false` but continues
- [ ] Email fails → Returns with `confirmationEmail: false` but continues
- [ ] Google Sheets fails → Returns with `googleSheets: false` but continues

---

## Emergency Contacts

| Issue | Solution |
|-------|----------|
| Backend not deploying | Check Railway logs, verify build command |
| Frontend blank page | Check console (F12), verify VITE_API_URL |
| No Zoho leads | Verify Zoho credentials, check backend logs |
| No emails | Verify Gmail app password, check admin email |
| CORS errors | Verify CLIENT_URL on backend, restart service |

---

## Quick Links

| Service | Link | Account |
|---------|------|---------|
| Railway | https://railway.app/dashboard | Your account |
| Netlify | https://app.netlify.com | Your account |
| Zoho Console | https://accounts.zoho.com/developerconsole | Zoho account |
| Gmail | https://myaccount.google.com | Google account |
| GitHub | https://github.com | Your repo |

---

## Notes

- 🟢 **Green**: Completed
- 🟡 **Yellow**: In Progress
- 🔴 **Red**: Blocked/Failed
- 🔵 **Blue**: Information

---

**Created:** January 27, 2026  
**Status:** Ready for Deployment  
**Next Step:** Follow DEPLOYMENT_CHECKLIST.md
