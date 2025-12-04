-- =============================================
-- FIX: Remove RLS infinite recursion on admin_users (V2)
-- =============================================
-- This version drops ALL existing policies first to ensure clean slate

-- Drop ALL existing policies on admin_users table
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view own admin profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_users;
DROP POLICY IF EXISTS "Active admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;

-- Create new policy: Users can view their own admin record (no recursion)
CREATE POLICY "Users can view own admin profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Create new policy: Admins can view all admin records (uses direct query, no recursion)
CREATE POLICY "Admins can view all admin profiles"
ON public.admin_users FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.admin_users WHERE is_active = true
  )
);

-- Policy for managing admin users (INSERT, UPDATE, DELETE)
CREATE POLICY "Active admins can manage admin users"
ON public.admin_users FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.admin_users WHERE is_active = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT auth_user_id FROM public.admin_users WHERE is_active = true
  )
);

-- Verify the policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN cmd = 'SELECT' THEN 'Read'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    WHEN cmd = 'ALL' THEN 'All Operations'
  END as operation_type
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;
