# ✅ Admin Setup Checklist

## Phase 1: Initial Setup (5 minutes)

- [ ] **Copy your email address**
  - You'll need it for the SQL command

- [ ] **Open Supabase Dashboard**
  - Go to https://app.supabase.com
  - Log in to your account
  - Select your project

- [ ] **Navigate to SQL Editor**
  - Click "SQL Editor" in left sidebar
  - Click "New Query"

- [ ] **Run Admin SQL**
  - Open file: `sql-make-admin.sql` from project root
  - Copy the query (first one, not verification)
  - Replace `your-email@example.com` with your actual email
  - Paste into Supabase SQL Editor
  - Click "Run"

- [ ] **Verify Admin Role Added**
  - Run the verification query from `sql-make-admin.sql`
  - Confirm you see your email with 'admin' role

- [ ] **Refresh Application**
  - Close all app tabs
  - Go to `http://localhost:5173` or your app URL
  - App should reload

## Phase 2: First Login (3 minutes)

- [ ] **Navigate to Login**
  - Go to `/auth` page
  - Should see "Login" tab is selected

- [ ] **Enter Credentials**
  - Email: The one you used for SQL
  - Password: Your Supabase password

- [ ] **Click Login**
  - Wait for redirect

- [ ] **Verify Admin Dashboard**
  - Should see Admin layout
  - Sidebar shows 6 sections:
    - ✓ Dashboard
    - ✓ Why Choose Us
    - ✓ Programs
    - ✓ Journey Steps
    - ✓ Outcomes
    - ✓ Testimonials

- [ ] **Check Dashboard**
  - Click "Dashboard" if not already there
  - Should show content counts (0 if new)
  - Should show links to each section

## Phase 3: Test CRUD Operations (10 minutes)

- [ ] **Test Create**
  - Go to "Why Choose Us"
  - Click "Add Feature"
  - Fill in:
    - Title: "Test Feature"
    - Description: "This is a test"
    - Icon: "Star"
  - Click "Create"
  - Verify feature appears in list

- [ ] **Test Read**
  - Feature should be visible in list
  - Can see title, description, icon

- [ ] **Test Update**
  - Click pencil icon on test feature
  - Change title to "Updated Feature"
  - Click "Update"
  - Verify list shows new title

- [ ] **Test Delete**
  - Click trash icon on test feature
  - Click "Delete" in confirmation
  - Verify feature removed from list

- [ ] **Test Other Sections**
  - Repeat above steps for:
    - ✓ Programs
    - ✓ Journey Steps
    - ✓ Outcomes
    - ✓ Testimonials

## Phase 4: Add Real Content (Varies)

- [ ] **Plan Content**
  - Decide on features
  - Plan programs
  - Create journey steps
  - Prepare statistics
  - Gather testimonials

- [ ] **Add Features**
  - Add 4-6 key features
  - Choose appropriate icons
  - Write compelling descriptions

- [ ] **Add Programs**
  - Add course offerings
  - Include tools and outcomes
  - Set duration and level

- [ ] **Add Journey Steps**
  - Create 3-5 steps
  - Order logically
  - Add features for each step

- [ ] **Add Outcomes**
  - Add key statistics
  - Use realistic numbers
  - Format with suffixes (+, %)

- [ ] **Add Testimonials**
  - Add student reviews
  - Include avatar URLs if possible
  - Mix different roles

## Phase 5: Verify on Frontend (5 minutes)

- [ ] **Logout from Admin**
  - Click "Logout" in admin panel
  - Should redirect to home page

- [ ] **Check Homepage**
  - Features show in Why Choose Us section
  - Programs display in Programs section
  - Journey shows learning path
  - Outcomes display statistics
  - Testimonials show reviews

- [ ] **Mobile Test**
  - Shrink browser window
  - Verify responsive layout
  - All content readable on mobile

- [ ] **Dark Mode Test** (if supported)
  - Toggle dark/light mode
  - Verify content shows in both

## Phase 6: Add More Admins (Optional)

- [ ] **For Each Admin User**
  - Go to Supabase SQL Editor
  - Run same SQL query with their email
  - Ask them to login
  - Verify they see admin panel

## Phase 7: Set Permissions (Optional)

- [ ] **Multiple Admins Setup**
  - All admins can manage all content
  - No role differentiation (yet)

- [ ] **Public Access**
  - Anyone can view content
  - Login required to edit
  - Email verification recommended (set in Supabase auth)

## Phase 8: Backup & Maintenance (Ongoing)

- [ ] **Weekly**
  - Verify all content displays correctly
  - Check for outdated information
  - Update testimonials as needed

- [ ] **Monthly**
  - Review analytics
  - Update statistics/outcomes
  - Refresh program descriptions

- [ ] **As Needed**
  - Add new courses
  - Remove outdated content
  - Update pricing/details

---

## ⚠️ Important Notes

### Security
- ✅ Only admins can edit
- ✅ Public users can only view
- ✅ Passwords stored securely
- ✅ Sessions expire for security

### Limitations (Current)
- ❌ Only role: admin (vs user)
- ❌ No role customization UI yet
- ❌ No content scheduling
- ❌ No bulk upload

### Coming Soon (Potential Enhancements)
- Bulk CSV import/export
- Content scheduling
- Comment/approval system
- Revision history
- Analytics dashboard
- Media library
- Email notifications

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Admin button not showing" | Not marked as admin in DB - run SQL |
| "Can't login" | Wrong email/password - check Supabase auth |
| "Create button greyed out" | Permission issue - verify admin role |
| "Changes not saving" | Check browser console for errors |
| "Slow loading" | Check internet speed, Supabase status |

---

## ✨ You're All Set!

You now have a fully functional content management system. 

### What you can do:
- ✅ Manage all website content
- ✅ Add/edit/delete any item
- ✅ Control what displays publicly
- ✅ Add more admin users
- ✅ Update content anytime

### What's automatic:
- ✅ Changes display immediately
- ✅ Mobile responsive
- ✅ Data backed up in cloud
- ✅ Secure database
- ✅ Real-time sync

---

## 📚 Documentation Files

- `QUICK_START.md` - 2-minute setup guide
- `SETUP_ADMIN.md` - Detailed admin setup
- `ADMIN_GUIDE.md` - How to use admin panel
- `CRUD_SYSTEM_OVERVIEW.md` - Technical details
- `ARCHITECTURE.md` - System architecture
- `sql-make-admin.sql` - SQL commands

---

**Checklist Version:** 1.0
**Last Updated:** January 23, 2026
**System:** Quantum Leap Labs CMS
