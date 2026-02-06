# Consultation Form - System Architecture & Data Flow

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  CTASection / JourneySection                                     │
│         │                                                         │
│         ├─→ [Schedule Consultation Button] ─┐                   │
│         │                                   │                   │
│         └─→ [Start Your Journey Button] ────┤                   │
│                                             │                   │
│                                             ▼                   │
│                                    ┌─────────────────┐           │
│                                    │ ConsultationPopup│           │
│                                    │   Component      │           │
│                                    │                 │           │
│                                    │ • Form Fields   │           │
│                                    │ • Validation    │           │
│                                    │ • Loading State │           │
│                                    │ • Success State │           │
│                                    └────────┬────────┘           │
│                                             │                   │
│                                             ▼                   │
│                                 consultationService.ts           │
│                              (POST /api/consultation)            │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP POST
                           │ {name, email, phone, interest}
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      BACKEND (Express / Node)        │
        │   api/routes.ts & api/consultation.ts│
        └──────────────────────────────────────┘
                           │
                 ┌─────────┼─────────┐
                 │         │         │
                 ▼         ▼         ▼
        ┌───────────┐  ┌────────┐  ┌──────────┐
        │  Google   │  │ Gmail  │  │  Admin   │
        │  Sheets   │  │Service │  │ Email    │
        │(Data Save)│  │(User   │  │(Notifn)  │
        │           │  │Confirm)│  │          │
        └───────────┘  └────────┘  └──────────┘
            │              │           │
            ▼              ▼           ▼
    ┌──────────────┐ ┌──────────┐ ┌────────┐
    │Lead Database │ │User Email│ │Admin   │
    │(Row Added)   │ │Inbox     │ │Inbox   │
    └──────────────┘ └──────────┘ └────────┘
```

## 🔄 User Data Flow

```
1. USER ACTION
   └─→ Click "Schedule Consultation" or "Start Your Journey"

2. POPUP OPENS
   └─→ Beautiful modal appears with form

3. USER ENTERS DATA
   ├─→ Name: Full name
   ├─→ Email: Valid email address
   ├─→ Phone: Contact number
   └─→ Interest: Career path selection

4. FORM VALIDATION (Frontend)
   ├─→ Check all fields filled
   ├─→ Validate email format
   └─→ Show error if invalid

5. SUBMIT
   └─→ POST request to /api/consultation

6. BACKEND PROCESSING
   ├─→ Validate input again
   ├─→ Save to Google Sheets
   │   └─→ New row: [timestamp, name, email, phone, interest]
   ├─→ Send confirmation email
   │   └─→ Professional HTML template to user
   └─→ Send admin notification
       └─→ Lead alert to admin email

7. RESPONSE
   ├─→ Success response to frontend
   └─→ Error response with message

8. USER FEEDBACK
   ├─→ Show success message
   ├─→ Display confirmation
   └─→ Auto-close popup after 2 seconds

9. COMPLETION
   └─→ User can fill form again if needed
```

## 🔌 Integration Points

### Frontend ↔ Backend Communication

```
REQUEST (Frontend → Backend)
┌────────────────────────────────────┐
│ POST /api/consultation             │
├────────────────────────────────────┤
│ Headers:                           │
│   Content-Type: application/json   │
├────────────────────────────────────┤
│ Body:                              │
│ {                                  │
│   "name": "John Doe",              │
│   "email": "john@example.com",     │
│   "phone": "+1 555-0000",          │
│   "interest": "cybersecurity",     │
│   "timestamp": "2026-01-23T10:30"  │
│ }                                  │
└────────────────────────────────────┘

RESPONSE (Backend → Frontend)
Success:
┌────────────────────────────────────┐
│ Status: 200 OK                     │
├────────────────────────────────────┤
│ {                                  │
│   "success": true,                 │
│   "message": "Consultation request │
│   submitted successfully"           │
│ }                                  │
└────────────────────────────────────┘

Error:
┌────────────────────────────────────┐
│ Status: 400/500 Error              │
├────────────────────────────────────┤
│ {                                  │
│   "success": false,                │
│   "message": "Error description"   │
│ }                                  │
└────────────────────────────────────┘
```

## 📧 Email Flow

### User Confirmation Email
```
From: YOUR_EMAIL@gmail.com
To: user's email (from form)
Subject: Your Consultation Request - QuantumSec Labs

Body Template:
├─→ Header with company branding
├─→ Thank you message
├─→ Submitted interest area highlighted
├─→ Contact details confirmation
├─→ Expected response time (24 hours)
├─→ Next steps explanation
└─→ Company footer
```

### Admin Notification Email
```
From: YOUR_EMAIL@gmail.com
To: ADMIN_EMAIL (from env)
Subject: New Consultation Request - [User Name]

Body Template:
├─→ New lead alert
├─→ Submission timestamp
├─→ Complete user information table
│   ├─→ Name
│   ├─→ Email (clickable)
│   ├─→ Phone
│   └─→ Interest
├─→ Quick action reminder
└─→ Database reference
```

## 🔐 Data Security

### Data at Rest
```
Google Sheets
├─→ Only admin can access
├─→ Service account authenticated
├─→ Data encrypted at Google's servers
└─→ Regular backups available

Environment Variables
├─→ Never committed to git
├─→ Stored in .env (local) or CI/CD secrets (production)
└─→ Hidden from version control (.gitignore)
```

### Data in Transit
```
Browser → Backend
├─→ HTTPS in production
├─→ POST request with JSON payload
└─→ Validated on backend

Backend → Google/Gmail
├─→ API authentication via service account
├─→ OAuth 2.0 for Gmail
└─→ Secure Google API calls
```

### Validation Layers
```
Layer 1: Frontend
├─→ Required field check
├─→ Email format validation
├─→ Type checking
└─→ User feedback

Layer 2: Backend
├─→ Input validation
├─→ Email format re-validation
├─→ Type checking
└─→ Error handling
```

## 📱 Component Dependencies

```
ConsultationPopup.tsx
├── Imports
│   ├─→ React (useState)
│   ├─→ Framer Motion (motion, AnimatePresence)
│   ├─→ Lucide Icons (X, Loader2, CheckCircle)
│   ├─→ UI Components (Button, Input, Label, Select)
│   └─→ Hooks (useToast)
│
└── State Management
    ├─→ formData (name, email, phone, interest)
    ├─→ isLoading (loading state)
    ├─→ isSuccess (success state)
    └─→ toast notifications
```

## 🌐 Environment Configuration

```
Local Development
├─→ Frontend: http://localhost:8080
├─→ Backend: http://localhost:3001
├─→ Proxy: /api → http://localhost:3001
└─→ Services: Google Cloud (dev project)

Staging
├─→ Frontend: https://staging.domain.com
├─→ Backend: https://api-staging.domain.com
└─→ Services: Google Cloud (staging project)

Production
├─→ Frontend: https://domain.com
├─→ Backend: https://api.domain.com
└─→ Services: Google Cloud (production project)
```

## 🔄 State Management Flow

```
ConsultationPopup Component State

┌──────────────────────────────────────┐
│ Initial State                        │
├──────────────────────────────────────┤
│ isOpen: false                        │
│ formData: {                          │
│   name: "", email: "", ...           │
│ }                                    │
│ isLoading: false                     │
│ isSuccess: false                     │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ User Opens Popup                     │
├──────────────────────────────────────┤
│ isOpen: true                         │
│ formData: {} (user fills)            │
│ isLoading: false                     │
│ isSuccess: false                     │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ User Submits Form                    │
├──────────────────────────────────────┤
│ isLoading: true                      │
│ API call starts                      │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ Success Response                     │
├──────────────────────────────────────┤
│ isLoading: false                     │
│ isSuccess: true                      │
│ Shows success message                │
│ Auto-closes after 2s                 │
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│ Reset to Initial                     │
├──────────────────────────────────────┤
│ formData: cleared                    │
│ isSuccess: false                     │
│ isOpen: false (closed)               │
└──────────────────────────────────────┘
```

## 📊 Database Schema (Google Sheet)

```
Column A: Timestamp
├─→ Format: ISO 8601 (2026-01-23T10:30:45.123Z)
├─→ Unique identifier
└─→ For tracking and follow-up

Column B: Name
├─→ Format: Text
├─→ Full name of prospect
└─→ For personalization

Column C: Email
├─→ Format: Email
├─→ Valid email address
├─→ For sending confirmation
└─→ For follow-up contact

Column D: Phone
├─→ Format: Tel
├─→ Contact number
└─→ For direct outreach

Column E: Interest
├─→ Format: Category
├─→ Options: cybersecurity, data-engineering, ai-ml, not-sure
└─→ For lead segmentation
```

---

**This architecture ensures:**
✅ Secure data handling  
✅ Reliable data storage  
✅ Professional communication  
✅ Clear audit trail  
✅ Scalable infrastructure  
✅ Easy customization  
