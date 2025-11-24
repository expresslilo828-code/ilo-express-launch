-- DISABLE THE RECURSIVE POLICY
-- This will let you access the admin dashboard
-- Run this in Supabase SQL Editor

-- Drop the recursive policy that's causing the infinite loop
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_users;

-- Keep only the simple self-access policy
-- (This one doesn't call any functions, so it can't loop)

-- Verify the remaining policies:
SELECT 
    policyname,
    cmd,
    qual AS using_expression
FROM pg_policies
WHERE tablename = 'admin_users';
