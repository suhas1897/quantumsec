# 📋 Consultation Form Setup - Implementation Checklist

## ✅ Phase 1: Code Implementation (COMPLETE)

### Frontend
- [x] Created `ConsultationPopup.tsx` component
- [x] Updated `CTASection.tsx` with popup triggers
- [x] Updated `JourneySection.tsx` with popup trigger
- [x] Created `consultationService.ts` API client
- [x] Added form validation
- [x] Added loading states
- [x] Added success confirmation
- [x] Integrated toast notifications

### Backend
- [x] Created `api/consultation.ts` with:
  - [x] Google Sheets integration
  - [x] Email sending (user confirmation)
  - [x] Email sending (admin notification)
  - [x] Error handling
- [x] Created `api/routes.ts` Express route
- [x] Added input validation
- [x] Added error handling

### Configuration & Docs
- [x] Created `CONSULTATION_SETUP.md`
- [x] Created `CONSULTATION_QUICK_START.md`
- [x] Created `IMPLEMENTATION_SUMMARY.md`
- [x] Created `.env.example`
- [x] Created `server.example.ts`
- [x] Created `VITE_PROXY_SETUP.md`

## 📋 Phase 2: Setup Configuration (YOU ARE HERE)

### Google Cloud Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project
- [ ] Enable Google Sheets API
- [ ] Enable Google Drive API
- [ ] Create Service Account
- [ ] Create JSON key and download it
- [ ] Save key file in secure location

### Google Sheets Setup
- [ ] Create new Google Sheet
- [ ] Name it "Consultation Leads"
- [ ] Add header row with columns:
  - [ ] Timestamp
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Interest
- [ ] Share sheet with service account email
- [ ] Copy the Sheet ID from URL

### Gmail Setup
- [ ] Go to [Google Account Settings](https://myaccount.google.com/)
- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password:
  - [ ] Go to Security section
  - [ ] Click "App passwords"
  - [ ] Select "Mail" and "Windows"
  - [ ] Copy the 16-character password

### Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `GOOGLE_SERVICE_ACCOUNT_KEY` path
- [ ] Fill in `GOOGLE_SHEET_ID`
- [ ] Fill in `EMAIL_USER`
- [ ] Fill in `EMAIL_PASSWORD`
- [ ] Fill in `ADMIN_EMAIL`
- [ ] Verify `.env` is in `.gitignore`

## 🔧 Phase 3: Installation (NEXT)

### Dependencies
- [ ] Run `npm install googleapis nodemailer`
- [ ] Run `npm install --save-dev @types/nodemailer` (if needed)

### Backend Server
- [ ] Copy `server.example.ts` to `server.ts`
- [ ] Or integrate `api/routes.ts` into existing backend

### Vite Configuration
- [ ] Open `vite.config.ts`
- [ ] Add proxy configuration for `/api`:
  ```ts
  proxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
    },
  }
  ```

## 🧪 Phase 4: Testing (AFTER SETUP)

### Local Testing
- [ ] Start backend: `npm run server` (should run on port 3001)
- [ ] Start frontend: `npm run dev` (should run on port 8080)
- [ ] Navigate to http://localhost:8080
- [ ] Click "Schedule Consultation" button
- [ ] Fill form with test data:
  - [ ] Name: Test User
  - [ ] Email: test@example.com
  - [ ] Phone: +1 555-0000
  - [ ] Interest: Any option
- [ ] Submit form

### Verification
- [ ] Check Google Sheet - new row should appear
- [ ] Check email (test@example.com) - confirmation email received
- [ ] Check admin email - notification received
- [ ] Check toast notification on popup
- [ ] Check success message display

## 🐛 Phase 5: Troubleshooting

### If Form Won't Submit
- [ ] Check backend is running on port 3001
- [ ] Check console for error messages
- [ ] Verify API endpoint URL in service
- [ ] Check proxy configuration in vite.config.ts

### If Google Sheet Not Updating
- [ ] Verify service account email in JSON key
- [ ] Verify sheet is shared with that email
- [ ] Verify `GOOGLE_SHEET_ID` is correct
- [ ] Check column names match exactly
- [ ] Verify API key file path is correct

### If Emails Not Sending
- [ ] Verify `EMAIL_USER` is correct Gmail address
- [ ] Verify `EMAIL_PASSWORD` is 16-character app password
- [ ] Check if 2FA is enabled
- [ ] Check spam/junk folders
- [ ] Verify `ADMIN_EMAIL` is correct
- [ ] Check Gmail "Less Secure Apps" setting if not using app password

### If CORS Errors
- [ ] Add proxy config to vite.config.ts
- [ ] Verify backend URL in proxy config
- [ ] Restart Vite dev server
- [ ] Clear browser cache

## 📚 Documentation References

| Document | Purpose |
|----------|---------|
| [CONSULTATION_SETUP.md](./CONSULTATION_SETUP.md) | Detailed setup guide (read first!) |
| [CONSULTATION_QUICK_START.md](./CONSULTATION_QUICK_START.md) | Quick reference guide |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | What was implemented |
| [VITE_PROXY_SETUP.md](./VITE_PROXY_SETUP.md) | Vite configuration help |
| [.env.example](./.env.example) | Environment variable template |
| [server.example.ts](./server.example.ts) | Express server example |

## 📊 Project Files Overview

### New Files Created
```
src/
├── components/ConsultationPopup.tsx (257 lines)
└── services/consultationService.ts (35 lines)

api/
├── consultation.ts (188 lines)
└── routes.ts (58 lines)

Docs/
├── CONSULTATION_SETUP.md
├── CONSULTATION_QUICK_START.md
├── IMPLEMENTATION_SUMMARY.md
├── VITE_PROXY_SETUP.md
├── VITE_PROXY_CONFIG.example.ts
├── .env.example
└── server.example.ts
```

### Updated Files
```
src/components/sections/
├── CTASection.tsx (added popup state & triggers)
└── JourneySection.tsx (added popup state & triggers)
```

## 🚀 Deployment Checklist

### Before Production
- [ ] Test all functionality locally
- [ ] Verify email templates look good
- [ ] Test with real email address
- [ ] Review error handling
- [ ] Set up environment variables in production
- [ ] Test production email sending
- [ ] Monitor first few submissions
- [ ] Set up error logging

### Production Setup
- [ ] Deploy backend (Heroku, AWS, etc.)
- [ ] Update API endpoint URL in frontend
- [ ] Update Vite proxy for production
- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Monitor Google Sheets quota usage
- [ ] Monitor email sending limits

## 📞 Support & Resources

### Google Cloud
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Setup](https://cloud.google.com/docs/authentication/getting-started)

### Email
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Password Help](https://support.google.com/accounts/answer/185833)

### Backend
- [Express.js Guide](https://expressjs.com/)
- [TypeScript with Express](https://expressjs.com/en/resources/typescript.html)

### Frontend
- [React Hooks](https://react.dev/reference/react)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI Components](https://ui.shadcn.com/)

## ✨ Success Criteria

You'll know everything is working when:

✅ Popup opens when clicking "Schedule Consultation"  
✅ Form validates all fields  
✅ Form submits successfully  
✅ User receives confirmation email  
✅ Admin receives notification email  
✅ Data appears in Google Sheet  
✅ Success message displays  
✅ Popup closes after success  

## 🎯 Next Actions

1. **READ**: Start with [CONSULTATION_SETUP.md](./CONSULTATION_SETUP.md)
2. **CONFIGURE**: Set up Google Cloud and Gmail
3. **SETUP**: Configure environment variables
4. **INSTALL**: Install dependencies
5. **BACKEND**: Set up backend server
6. **TEST**: Test locally with forms
7. **DEPLOY**: Deploy to production

---

**Status**: ✅ Code Implementation Complete → 📋 Awaiting Setup Configuration

**Estimated Time**: 
- Setup: 30 minutes
- Testing: 15 minutes  
- Customization: 15 minutes
- **Total: ~1 hour**

Good luck! 🚀
