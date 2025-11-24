-- List all RLS Policies
-- Run this in Supabase SQL Editor to see what policies are active

SELECT
    schemaname,
    tablename,
    policyname,
    cmd AS operation,
    roles,
    qual AS using_expression,
    with_check AS with_check_expression
FROM
    pg_policies
ORDER BY
    tablename, policyname;

-- Specific check for admin_users table
SELECT
    *
FROM
    pg_policies
WHERE
    tablename = 'admin_users';
