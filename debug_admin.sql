-- DEBUG SCRIPT: Check Admin User Linkage
-- Run this in Supabase SQL Editor

-- 1. Check if your email exists in admin_users
SELECT * FROM public.admin_users;

-- 2. Check if your auth user exists (you can't select from auth.users directly in some contexts, but try this)
-- If this fails, ignore it.
SELECT id, email FROM auth.users;

-- 3. FIX: Link admin_users to auth.users by email
-- This updates the auth_user_id in admin_users to match the actual user ID from auth.users
UPDATE public.admin_users
SET auth_user_id = au.id
FROM auth.users au
WHERE public.admin_users.email = au.email;

-- 4. Verify the link
SELECT au.email, au.auth_user_id, u.id as actual_auth_id
FROM public.admin_users au
JOIN auth.users u ON au.email = u.email;
