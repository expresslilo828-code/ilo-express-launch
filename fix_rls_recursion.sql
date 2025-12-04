-- =============================================
-- FIX: Remove RLS infinite recursion on admin_users
-- =============================================
-- The problem: The is_admin() function queries admin_users,
-- but the RLS policy on admin_users calls is_admin() creating infinite recursion!
-- Solution: Allow users to read their own admin record directly without calling is_admin()

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Create new policy: Users can view their own admin record
-- This breaks the recursion because it doesn't call is_admin()
CREATE POLICY "Users can view own admin profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Create new policy: Admins can view all admin records
-- This uses a direct query instead of calling is_admin() to avoid recursion
CREATE POLICY "Admins can view all admin profiles"
ON public.admin_users FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.admin_users WHERE is_active = true
  )
);

-- Policy for managing admin users (INSERT, UPDATE, DELETE)
-- Only existing active admins can manage other admin users
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

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;
