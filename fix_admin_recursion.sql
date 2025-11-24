-- Fix RLS Recursion by using a secure RPC function
-- This function allows the frontend to fetch the current user's admin profile
-- WITHOUT triggering the recursive RLS policy on the admin_users table.

CREATE OR REPLACE FUNCTION public.get_admin_profile()
RETURNS SETOF public.admin_users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Directly select the admin user for the current auth user
  -- Because this is SECURITY DEFINER, it bypasses RLS on the table
  RETURN QUERY
  SELECT *
  FROM public.admin_users
  WHERE auth_user_id = auth.uid()
  AND is_active = true;
END;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_profile() TO authenticated;
