# Admin Setup Instructions

## The Problem
When you login, you don't see edit options because your user account is not marked as an admin in the Supabase `user_roles` table.

## Solution: Make Your Account an Admin

Follow these steps to grant yourself admin privileges:

### Method 1: Using Supabase Dashboard (Easiest)
1. Go to https://app.supabase.com and login to your project
2. Navigate to the **SQL Editor** section
3. Click **New query** and paste this SQL (replace `your-email@example.com` with your actual email):

```sql
-- First, get your user ID by email
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
-- Insert admin role for your user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM user_data
ON CONFLICT (user_id, role) DO NOTHING;
```

4. Click **Run** to execute
5. Refresh your application and login again

### Method 2: Using Local Supabase CLI
If you're running Supabase locally, run:

```bash
# In the project root directory
supabase db push
# Then execute the SQL from Method 1 in your local Supabase dashboard
```

## After Setup
1. Login with your credentials at the `/auth` page
2. You should now be redirected to `/admin` with full CRUD capabilities
3. Navigate through:
   - **Dashboard** - Overview of all content
   - **Why Choose Us** - Manage features
   - **Programs** - Manage courses
   - **Journey Steps** - Manage learning journey
   - **Outcomes** - Manage results statistics
   - **Testimonials** - Manage student testimonials

## Available Admin Features
All sections support full CRUD operations:
- ✅ **Create** - Add new content
- ✅ **Read** - View all content
- ✅ **Update** - Edit existing content
- ✅ **Delete** - Remove content with confirmation
