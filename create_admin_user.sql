-- =============================================
-- CREATE ADMIN USER - Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Check if admin user exists
SELECT * FROM admin_users WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Step 2: Get user email from auth.users
SELECT id, email FROM auth.users WHERE id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Step 3: If admin doesn't exist, create admin user
-- Replace the values below with your actual data
INSERT INTO admin_users (auth_user_id, email, full_name, is_active)
VALUES (
  'a27ee2bc-886f-4f5d-9001-12fbb19f115c',  -- Your auth user ID
  'your-admin-email@example.com',          -- Your email from Step 2
  'Admin Name',                             -- Your full name
  true
)
ON CONFLICT (auth_user_id) DO UPDATE 
SET is_active = true;

-- Step 4: Verify admin user was created
SELECT * FROM admin_users WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Step 5: Test the is_admin function
SELECT is_admin('a27ee2bc-886f-4f5d-9001-12fbb19f115c');
