# Consultation Form - FAQ & Troubleshooting

## ❓ Frequently Asked Questions

### General Questions

**Q: Why do I need a Google Cloud project?**  
A: Google Sheets API requires authentication. A service account is the secure way to grant your app access to Google Sheets without exposing your personal credentials.

**Q: Can I use a different spreadsheet service instead of Google Sheets?**  
A: Yes! You can modify `api/consultation.ts` to use Airtable, Notion, Excel Online, or any other service with an API. The structure would be similar.

**Q: How many form submissions can I make?**  
A: Google Sheets API has quotas:
- Free tier: 60 requests per minute
- Paid tier: 500 requests per minute (very generous for this use case)

**Q: Can I customize the form fields?**  
A: Yes! Edit `ConsultationPopup.tsx` to add/remove fields. You'll also need to update the backend to handle new fields.

**Q: What if I want to use a different email service?**  
A: Replace Nodemailer with SendGrid, Mailgun, or AWS SES. The backend logic would be similar.

### Setup Questions

**Q: Where do I find my Google Sheet ID?**  
A: Open your Google Sheet in browser. The URL looks like:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
```
Copy the part between `/d/` and `/edit`.

**Q: Why do I need a Gmail app password instead of my regular password?**  
A: Gmail no longer allows "less secure apps" to use your main password. App passwords are specifically for third-party applications and are more secure.

**Q: Can I use a non-Gmail email service?**  
A: Yes, but you'll need to modify the SMTP configuration in `api/consultation.ts`. Most email providers have SMTP settings.

**Q: How do I know if my service account is working?**  
A: Try running this test:
```typescript
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const client = await auth.getClient();
console.log('Auth working:', client.projectId);
```

### Integration Questions

**Q: How do I deploy the backend?**  
A: Options:
1. **Vercel** - Just move `api/routes.ts` to `api/consultation.js`
2. **Heroku** - Deploy as Express app
3. **AWS Lambda** - Use Serverless Framework
4. **Self-hosted** - Use Docker or run directly on your server

**Q: Can the frontend and backend be on different domains?**  
A: Yes! Just update the API endpoint:
```typescript
const response = await fetch("https://api.yourdomain.com/api/consultation", {
  // ...
});
```
You may need CORS headers on the backend.

**Q: How do I add authentication to the API?**  
A: Add middleware to `api/routes.ts`:
```typescript
app.use('/api/consultation', authenticateUser, consultationRoutes);
```

**Q: Can I use this with a CMS like WordPress?**  
A: Yes! The API is independent. Just call it from your frontend. If embedding in WordPress, you'd need a REST API plugin.

### Email Questions

**Q: Why aren't users receiving emails?**  
A: Check:
1. Gmail password is 16 characters (app password)
2. 2FA is enabled
3. Email address is correct
4. Check spam folder
5. Check Gmail activity for blocked sign-ins

**Q: Can I send emails from a company domain?**  
A: Yes! Use your company's email service (Gmail, Outlook, SendGrid, etc.) instead of personal Gmail.

**Q: How do I customize the email template?**  
A: Edit the HTML in `api/consultation.ts`:
- `sendConfirmationEmail()` - User email
- `sendAdminNotification()` - Admin email

**Q: Can I add attachments to emails?**  
A: Yes, Nodemailer supports attachments:
```typescript
{
  filename: "brochure.pdf",
  path: "/path/to/file.pdf"
}
```

### Data & Security Questions

**Q: Where is the user data stored?**  
A: In Google Sheets, which is Google's encrypted servers. Data is secure and automatically backed up.

**Q: Is my data secure?**  
A: Yes:
- Environment variables keep credentials secret
- Google authentication is secure
- HTTPS in production encrypts transit
- Google Sheets has access controls

**Q: Can I delete entries from Google Sheets?**  
A: Yes, manually delete rows. For automated deletion, you'd need to build that feature.

**Q: How long is the data stored?**  
A: Indefinitely unless you manually delete it. Consider archiving old entries periodically.

**Q: Can I export the data?**  
A: Yes! Google Sheets allows export to CSV, Excel, PDF, etc.

**Q: What if someone submits multiple times?**  
A: Each submission creates a new row. If you want to prevent duplicates, add logic to check if email already exists.

---

## 🐛 Troubleshooting Guide

### Problem: "Form won't submit"

**Check list:**
1. Is backend running? 
   ```bash
   curl http://localhost:3001/health
   ```
2. Is proxy configured in vite.config.ts?
3. Check browser console for errors
4. Check backend logs for errors
5. Verify environment variables are set

**Solution:**
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

---

### Problem: "Google Sheet not updating"

**Check list:**
1. Is `GOOGLE_SHEET_ID` correct?
   - Verify in your Google Sheet URL
2. Is service account email shared?
   - Open Google Sheet → Share
   - Add service account email from JSON key
3. Are column headers correct?
   - Should be: Timestamp, Name, Email, Phone, Interest
4. Does JSON key file exist?
   - Check path in environment variable
5. Is sheet name correct?
   - Default: "Consultations" sheet tab

**Solution:**
```typescript
// Check Google Sheets API access
const sheets = google.sheets('v4');
const result = await sheets.spreadsheets.get({
  auth: authClient,
  spreadsheetId: GOOGLE_SHEET_ID,
});
console.log('Sheet found:', result.data.properties.title);
```

---

### Problem: "No confirmation email received"

**Check list:**
1. Is `EMAIL_USER` correct Gmail?
2. Is `EMAIL_PASSWORD` correct app password?
   - Should be 16 characters (with spaces)
   - Not your regular Gmail password
3. Is 2FA enabled on Gmail?
4. Check spam folder
5. Check Gmail sign-in activity (blocked?)
6. Is `ADMIN_EMAIL` correct?

**Solution:**
```bash
# Generate new app password
1. https://myaccount.google.com/
2. Security tab
3. App passwords (requires 2FA)
4. Mail, Windows
5. Copy new 16-char password
```

---

### Problem: "CORS errors in console"

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:3001/api/consultation' 
blocked by CORS policy
```

**Check list:**
1. Is proxy configured in vite.config.ts?
2. Is backend running on correct port?
3. Is frontend running on 8080?

**Solution:**
```typescript
// Add to vite.config.ts server config:
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  }
}
```

---

### Problem: "Validation errors on submission"

**Check list:**
1. Are all fields filled?
2. Is email format valid (has @ and .)?
3. Is phone number filled?
4. Is interest selected?

**Solution:**
```typescript
// Verify in ConsultationPopup.tsx:
- name: "" → must not be empty
- email: "" → must match /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- phone: "" → must not be empty
- interest: "" → must not be empty
```

---

### Problem: "Unknown error when submitting"

**Check list:**
1. Check browser console for detailed error
2. Check backend terminal for error logs
3. Verify all environment variables are set
4. Verify Google credentials are valid
5. Verify email credentials are valid

**Solution:**
```bash
# Add detailed logging
// In api/routes.ts
router.post('/consultation', async (req, res) => {
  console.log('Received data:', req.body);
  try {
    // ... rest of code
  } catch (error) {
    console.error('Detailed error:', error);
    // Send error back
  }
});
```

---

### Problem: "Service account authentication fails"

**Symptoms:**
```
Error: ENOENT: no such file or directory, open 'undefined'
```

**Check list:**
1. Is `GOOGLE_SERVICE_ACCOUNT_KEY` path correct?
2. Does file exist at that path?
3. Is path absolute or relative?

**Solution:**
```bash
# Use absolute path in .env:
GOOGLE_SERVICE_ACCOUNT_KEY=/Users/username/Downloads/key.json
# NOT: ./key.json or ~/key.json

# Verify file exists:
ls -la /path/to/key.json
```

---

### Problem: "Email sending is slow"

**Cause:** Gmail SMTP is slower than dedicated email services

**Solution:**
1. Use SendGrid or Mailgun for faster sending
2. Move to background job queue
3. Send admin notification asynchronously

```typescript
// Send admin email in background (don't await)
sendAdminNotification(data).catch(console.error);
```

---

### Problem: "Rate limiting - too many requests"

**Symptoms:**
```
Error: Rate limit exceeded
```

**Cause:** Exceeding Google Sheets API or Gmail quota

**Solution:**
1. Implement request throttling
2. Add request queue
3. Cache responses
4. Upgrade to paid Google Cloud plan

---

### Problem: "Data not appearing immediately in Google Sheet"

**Cause:** API calls are asynchronous

**Solution:**
```typescript
// Add small delay before returning success
setTimeout(() => {
  res.json({ success: true });
}, 500); // 500ms delay

// Or refresh sheet after 1-2 seconds
```

---

## 💡 Pro Tips

### Tip 1: Monitor Email Sending
```typescript
// Add email tracking
const emailResult = await transporter.sendMail(mailOptions);
console.log('Email sent with ID:', emailResult.messageId);
```

### Tip 2: Rate Limiting
```typescript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});
router.post('/consultation', limiter, async (req, res) => { ... });
```

### Tip 3: Error Alerting
```typescript
// Send error notifications
if (error) {
  await sendSlackNotification(`Consultation API Error: ${error}`);
  // or
  await sendEmailAlert(`Error in consultation form: ${error}`);
}
```

### Tip 4: Analytics
```typescript
// Track submissions
const analytics = {
  timestamp: new Date(),
  success: true,
  interest: data.interest,
  responseTime: Date.now() - startTime
};
// Send to Google Analytics or mixpanel
```

### Tip 5: Backup Data
```bash
# Download Google Sheet regularly
# Or set up automated backup:
# - Google Sheets backup script
# - Export to CSV weekly
# - Archive to cloud storage
```

---

## 📞 Getting Help

### Before asking for help:

1. Check this FAQ
2. Read [CONSULTATION_SETUP.md](./CONSULTATION_SETUP.md)
3. Check browser console for errors
4. Check backend terminal for errors
5. Test each component individually

### When asking for help, provide:

1. The error message (exact text)
2. What you're trying to do
3. What you've already tried
4. Your environment (Windows/Mac/Linux)
5. Relevant code snippet
6. Browser console screenshot

### Resources:

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Nodemailer Docs](https://nodemailer.com/)
- [Express.js Docs](https://expressjs.com/)
- [React Hooks](https://react.dev/reference/react)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Form opens when clicking button
- [ ] Form validates required fields
- [ ] Form validates email format
- [ ] Form submits successfully
- [ ] Google Sheet gets new row
- [ ] User receives confirmation email
- [ ] Admin receives notification email
- [ ] Popup shows success message
- [ ] Popup closes after success
- [ ] Can submit multiple times

If all ✅, you're good to go! 🎉
