-- =============================================
-- FIX ADMIN_USERS RLS POLICIES
-- Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Check if admin_users table exists
SELECT * FROM admin_users LIMIT 1;

-- Step 2: Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Step 3: Create new simple policies that work
-- Allow authenticated users to read their own admin record
CREATE POLICY "Users can view their own admin record"
ON admin_users FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow service role to do everything (for backend operations)
CREATE POLICY "Service role full access"
ON admin_users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Step 4: Test the query that's failing
SELECT * FROM admin_users WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Step 5: Create admin user if it doesn't exist
-- First get the email
SELECT id, email FROM auth.users WHERE id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Then create admin user (replace email with the one from above)
INSERT INTO admin_users (auth_user_id, email, full_name, is_active)
VALUES (
  'a27ee2bc-886f-4f5d-9001-12fbb19f115c',
  'REPLACE_WITH_YOUR_EMAIL',  -- Get this from the query above
  'Admin User',
  true
)
ON CONFLICT (auth_user_id) 
DO UPDATE SET is_active = true;

-- Step 6: Verify everything works
SELECT * FROM admin_users WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';
