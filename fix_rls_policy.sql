-- FIX RLS INFINITE RECURSION
-- Run this in Supabase SQL Editor

-- The issue is that the policy "Admins can view admin users" calls is_admin(), 
-- which tries to read the table, which triggers the policy again -> Infinite Loop.

-- 1. Drop the existing recursive policy
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- 2. Create a new policy that breaks the loop
-- It explicitly allows a user to read their OWN row without calling is_admin()
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
TO authenticated
USING (
    auth_user_id = auth.uid()  -- BREAKS THE LOOP: You can always see your own row
    OR
    public.is_admin(auth.uid()) -- Admins can see everyone else's rows
);

-- 3. Ensure is_admin is secure (just in case)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This is crucial!
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE auth_user_id = user_id AND is_active = true
  );
END;
$$;
