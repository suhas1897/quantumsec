# Admin Guide: Common Tasks

## Getting Started

### 1. Make Yourself Admin (Required First Step)
See [QUICK_START.md](QUICK_START.md) for the SQL command.

### 2. Login
- Navigate to `http://localhost:5173/auth` (or your app URL)
- Click "Switch to Login" if signup form is shown
- Enter your email and password
- You'll be redirected to `/admin`

### 3. Navigate Admin Panel
The sidebar shows 6 sections. Click any to manage that content type.

---

## Managing Content

### ⭐ Why Choose Us (Features)

**Location:** Admin Panel → Why Choose Us

**What it does:** Displays the key features/benefits on the homepage

**Add a Feature:**
1. Click "Add Feature"
2. Fill in:
   - **Title** - Short feature name (e.g., "Expert Instructors")
   - **Description** - Detailed explanation
   - **Icon** - Choose from 15 icons (Star, Shield, Zap, etc.)
3. Click "Create"

**Edit a Feature:**
1. Click the pencil icon on any feature
2. Modify the fields
3. Click "Update"

**Delete a Feature:**
1. Click the trash icon
2. Confirm deletion

**Available Icons:** 
Star, Shield, Zap, Target, Award, Users, BookOpen, Code, Database, Brain, Rocket, Heart, Globe, Lock, CheckCircle

---

### 🎓 Programs (Courses)

**Location:** Admin Panel → Programs

**What it does:** List of courses available for enrollment

**Add a Program:**
1. Click "Add Program"
2. Fill in:
   - **Title** - Course name (e.g., "Cybersecurity 101")
   - **Description** - What students will learn
   - **Category** - e.g., "cybersecurity", "networking", etc.
   - **Duration** - e.g., "8 weeks", "12 weeks"
   - **Level** - Beginner, Intermediate, or Advanced
   - **Tools** - Comma-separated (e.g., "Python, Kali Linux, Metasploit")
   - **Outcomes** - Comma-separated (e.g., "Pass Security+, Get OSCP")
3. Click "Create"

**Example:**
```
Title: Advanced Penetration Testing
Category: cybersecurity
Duration: 12 weeks
Level: Advanced
Tools: Burp Suite, Metasploit, Wireshark
Outcomes: OSCP certified, Real client engagements
```

**Edit/Delete:** Same as Features

---

### 🗺️ Journey Steps (Learning Path)

**Location:** Admin Panel → Journey Steps

**What it does:** Show the step-by-step learning journey on homepage

**Add a Step:**
1. Click "Add Step"
2. Fill in:
   - **Title** - Step name (e.g., "Master Fundamentals")
   - **Subtitle** - Brief subtitle
   - **Description** - Detailed description of this step
   - **Icon** - Visual icon for the step
   - **Step Number** - Order (1, 2, 3, etc.)
   - **Features** - Comma-separated skills/topics taught
3. Click "Create"

**Example:**
```
Title: Master the Fundamentals
Subtitle: Build your cybersecurity foundation
Step Number: 1
Features: Network basics, Linux essentials, Security concepts
```

**Edit/Delete:** Same as Features

---

### 📈 Outcomes (Statistics)

**Location:** Admin Panel → Outcomes

**What it does:** Display impressive statistics on homepage (e.g., "500+ Graduates")

**Add an Outcome:**
1. Click "Add Outcome"
2. Fill in:
   - **Label** - What is being counted (e.g., "Graduates")
   - **Value** - The number (e.g., "500")
   - **Suffix** - Symbol after number (e.g., "+", "%", "")
3. Click "Create"

**Examples:**
```
Label: Graduates          Label: Success Rate      Label: Companies
Value: 500               Value: 95                Value: 200+
Suffix: +                Suffix: %                Suffix: (blank)

Result: 500+             Result: 95%              Result: 200+
```

**Edit/Delete:** Same as Features

---

### 💬 Testimonials (Reviews)

**Location:** Admin Panel → Testimonials

**What it does:** Display student reviews on homepage

**Add a Testimonial:**
1. Click "Add Testimonial"
2. Fill in:
   - **Author Name** - Student's name
   - **Author Title** - Their position/title (e.g., "Security Analyst")
   - **Quote** - Their testimonial/review
   - **Avatar URL** - Link to their profile picture (optional)
3. Click "Create"

**Example:**
```
Author Name: John Smith
Author Title: Security Analyst at TechCorp
Quote: "This course transformed my career. I landed a job 2 months after graduating!"
Avatar URL: https://example.com/avatars/john.jpg
```

**Edit/Delete:** Same as Features

---

## 📊 Dashboard

**Location:** Admin Panel → Dashboard (default page)

Shows:
- Total count of each content type
- Quick links to manage each section
- Overview of your site content

---

## Common Tasks

### Task: Add a New Course

1. Go to Programs section
2. Click "Add Program"
3. Fill in all fields
4. Click "Create"
5. Back on programs list, click "Update" to make more edits

### Task: Update Testimonials After Graduation

1. Go to Testimonials section
2. Click pencil icon on testimonial to edit
3. Update quote or author info
4. Click "Update"

### Task: Add New Statistics

1. Go to Outcomes section
2. Click "Add Outcome"
3. If you had 500 graduates and now have 600:
   - Click pencil icon on "Graduates"
   - Change Value from "500" to "600"
   - Click "Update"

### Task: Reorder Features

Each item has a "grip" icon (≡) - drag to reorder
Then save order (automatic in new versions)

### Task: Remove Outdated Content

1. Find the item you want to remove
2. Click trash icon (🗑️)
3. Confirm deletion in the dialog
4. Item is removed immediately

---

## Tips & Tricks

### ✨ Best Practices

1. **Use Clear Titles** - Make content self-explanatory
2. **Add Icons Thoughtfully** - Choose icons that match the content
3. **Keep Descriptions Concise** - Don't overwhelm with text
4. **Order Matters** - Put most important items first
5. **Test on Mobile** - Your site is viewed on phones too

### 🎯 Content Guidelines

- **Features:** 4-6 key benefits work best
- **Programs:** Show variety (different levels/durations)
- **Journey Steps:** 3-5 steps tell a compelling story
- **Outcomes:** 3-4 impressive statistics
- **Testimonials:** Mix different roles/companies

### 🔍 Validation Rules

- All fields marked in dialog are required
- Lists use comma-separation: `item1, item2, item3`
- URLs must be valid: `https://example.com/image.jpg`
- Numbers only: Duration, Value, Step Number

---

## Troubleshooting

### "Changes not showing"
→ Wait 2-3 seconds, then refresh the page

### "Can't add/edit content"
→ Check if you're logged in and have admin role

### "Getting error messages"
→ Check the red toast notification for details

### "Delete button doesn't work"
→ Confirm you clicked "Delete" in the confirmation dialog

### "Lost connection to database"
→ Check internet connection, refresh page

---

## Advanced Tasks

### Bulk Content Updates

**Currently:** Edit items one by one

**Future enhancement:** Export/import CSV support

**Workaround now:** 
- Take screenshots of current content
- Edit items, one at a time
- Keep notes of changes

### Scheduling Content

**Currently:** Content goes live immediately

**Future enhancement:** Schedule publish dates

**Workaround now:**
- Prepare content in draft
- Manual copy/paste when ready to publish

### User Management

**Currently:** Manual role assignment via SQL

**Future enhancement:** UI for user management

**For now:** Ask developer to run SQL command:
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'user@example.com'
```

---

## Support

If you encounter issues:

1. **Check console:** Browser DevTools → Console tab
2. **Check logs:** Supabase Dashboard → Logs
3. **Verify admin status:** Run SQL query from SETUP_ADMIN.md
4. **Clear cache:** Ctrl+Shift+Delete, clear browsing data
5. **Restart app:** Close browser, reopen

---

## Files Reference

- [QUICK_START.md](QUICK_START.md) - Get admin access
- [SETUP_ADMIN.md](SETUP_ADMIN.md) - Admin setup details
- [CRUD_SYSTEM_OVERVIEW.md](CRUD_SYSTEM_OVERVIEW.md) - Technical details
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

---

**Last updated:** January 23, 2026
**System:** Quantum Leap Labs Admin Panel
