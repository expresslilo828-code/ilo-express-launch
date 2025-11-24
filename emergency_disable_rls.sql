-- EMERGENCY FIX: Temporarily disable RLS on admin_users
-- This will help us determine if RLS is the problem
-- Run this in Supabase SQL Editor

-- 1. Check current RLS status
SELECT 
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'admin_users';

-- 2. Temporarily DISABLE RLS to test
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- 3. Verify it's disabled
SELECT 
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'admin_users';

-- After running this, try accessing your admin dashboard
-- If it works, then RLS was definitely the problem
-- We can re-enable it later with proper policies
