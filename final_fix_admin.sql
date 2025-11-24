-- FINAL FIX FOR ADMIN ACCESS
-- Run this in Supabase SQL Editor

-- 1. Drop ALL existing policies on admin_users to ensure a clean slate
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can view own admin profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_users;

-- 2. Create a SIMPLE, NON-RECURSIVE policy for reading your own data
-- This allows you to read your own row in admin_users.
-- It does NOT call any functions, so it cannot loop.
CREATE POLICY "Users can view own admin profile"
ON public.admin_users FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- 3. Create policy for Admins to see ALL users (using the secure function)
CREATE POLICY "Admins can view all admin profiles"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 4. Ensure is_admin is secure and bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This is CRITICAL: it bypasses RLS
SET search_path = public
AS $$
BEGIN
  -- This runs with high privileges, bypassing RLS
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE auth_user_id = user_id AND is_active = true
  );
END;
$$;

-- 5. Grant permissions just in case
GRANT SELECT ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
