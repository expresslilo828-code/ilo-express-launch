-- =============================================
-- FIX ADMIN ACCESS V2
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Reset RLS policies for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view own admin profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_users;
DROP POLICY IF EXISTS "Active admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated users can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Service role full access" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view their own admin record" ON public.admin_users;

-- Create simple, non-recursive policies

-- Policy 1: Users can view their own admin profile
-- This is essential for the initial check
CREATE POLICY "Users can view own admin profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Policy 2: Service role has full access (for backend/edge functions)
CREATE POLICY "Service role full access"
ON public.admin_users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. Create/Replace is_admin function with SECURITY DEFINER
-- We use CREATE OR REPLACE with the exact signature (including defaults) to avoid breaking dependent policies
-- This function runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- IMPORTANT: Bypasses RLS
SET search_path = public -- Secure search path
AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE auth_user_id = user_id
    AND is_active = true
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

-- 3. Verify
SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies 
WHERE tablename = 'admin_users'
ORDER BY policyname;
