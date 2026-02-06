-- ============================================
-- MAKE YOUR ACCOUNT AN ADMIN
-- ============================================
-- Execute this SQL in your Supabase SQL Editor
-- https://app.supabase.com → Your Project → SQL Editor → New Query

-- Replace 'your-email@example.com' with your actual email address
-- This adds the 'admin' role to your user account

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- After running this:
-- 1. Go back to your app
-- 2. Login with your email/password
-- 3. You'll be redirected to /admin dashboard
-- 4. You can now manage all content!

-- ============================================
-- VERIFY IT WORKED
-- ============================================
-- Run this query to check if your user is admin:

SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';

-- You should see your email with 'admin' role listed

-- ============================================
-- MAKE ANOTHER USER ADMIN (Optional)
-- ============================================
-- Replace with the email of the other user

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'other-user@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- REMOVE ADMIN ACCESS (If needed)
-- ============================================
-- DELETE FROM public.user_roles 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
-- AND role = 'admin';
