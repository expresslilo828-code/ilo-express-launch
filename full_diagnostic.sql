-- COMPREHENSIVE DIAGNOSTIC
-- Run this in Supabase SQL Editor to find the real problem

-- 1. Does the table exist and what's in it?
SELECT 'Table exists check' AS test;
SELECT COUNT(*) as total_rows FROM public.admin_users;

-- 2. Can we query it directly?
SELECT 'Direct query test' AS test;
SELECT * FROM public.admin_users LIMIT 5;

-- 3. Check for triggers that might be hanging
SELECT 
    'Triggers on admin_users' AS test,
    tgname AS trigger_name,
    tgenabled AS enabled
FROM pg_trigger
WHERE tgrelid = 'public.admin_users'::regclass;

-- 4. Check grants/permissions
SELECT 
    'Permissions check' AS test,
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'admin_users';

-- 5. Check if there are any locks on the table
SELECT 
    'Lock check' AS test,
    locktype,
    mode,
    granted
FROM pg_locks
WHERE relation = 'public.admin_users'::regclass;

-- 6. Test the exact query your frontend is using
SELECT 'Frontend query simulation' AS test;
SELECT * 
FROM public.admin_users
WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c'
AND is_active = true;
