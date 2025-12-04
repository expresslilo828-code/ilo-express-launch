# 🚨 CRITICAL FIX: RLS Infinite Recursion

## The Problem

Your admin check is timing out because of **infinite recursion** in the RLS policies:

1. When you query `admin_users` table, the RLS policy checks if you're an admin by calling `is_admin()`
2. The `is_admin()` function queries the `admin_users` table
3. This triggers the RLS policy again, which calls `is_admin()` again
4. **Infinite loop!** The query never completes and times out after 10 seconds

## The Solution

Run the SQL fix to replace the recursive policies with non-recursive ones.

## Steps to Fix

### Option 1: Run via Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/tojruwyvpgkdhoypqkdg
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire content of `fix_rls_recursion.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"
7. Verify the policies at the bottom - you should see 3 new policies

### Option 2: Run via Supabase CLI (if you have it installed)

```bash
supabase db push --db-url "postgresql://postgres:[password]@db.tojruwyvpgkdhoypqkdg.supabase.co:5432/postgres" < fix_rls_recursion.sql
```

### After Running the Fix

1. **Clear your browser localStorage**:
   - Open DevTools (F12)
   - Go to Application tab → Local Storage
   - Find `https://liloexpress.com`
   - Delete all items starting with `sb-`
   - OR just click "Clear All"

2. **Test on your deployed site**:
   - Go to https://liloexpress.com/login
   - Log in with your admin credentials
   - You should be redirected to admin dashboard
   - **Refresh the page (F5)** - you should stay logged in!

3. **Check the console logs**:
   - Should see: `✅ Query completed at: [timestamp]`
   - Should see: `✅ Admin user found: {...}`
   - Should NOT see: `⏱️ Admin check timed out after 10 seconds`

## What Changed

### Before (BROKEN):
```sql
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
USING (public.is_admin(auth.uid())); -- ❌ Calls is_admin() which queries admin_users = RECURSION!
```

### After (FIXED):
```sql
-- Users can always view their own record (no recursion)
CREATE POLICY "Users can view own admin profile"
ON public.admin_users FOR SELECT
USING (auth_user_id = auth.uid()); -- ✅ Direct comparison, no recursion

-- Admins can view all records (using direct query, not is_admin function)
CREATE POLICY "Admins can view all admin profiles"
ON public.admin_users FOR SELECT
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM public.admin_users WHERE is_active = true
  )
); -- ✅ Direct query, no recursion
```

## Verification

After applying the fix, you can verify it's working by checking the console logs:

### ✅ Working (after fix):
```
🔍 Checking admin status for user: a27ee2bc-886f-4f5d-9001-12fbb19f115c
📊 Querying admin_users table...
⏱️ Query started at: 2025-11-28T21:56:55.901Z
✅ Query completed at: 2025-11-28T21:56:55.923Z  <-- Query completes in ~22ms!
✅ Admin user found: {id: "...", email: "...", ...}
🎯 Is user admin? true
```

### ❌ Not Working (before fix):
```
🔍 Checking admin status for user: a27ee2bc-886f-4f5d-9001-12fbb19f115c
📊 Querying admin_users table...
⏱️ Query started at: 2025-11-28T21:56:55.901Z
⏱️ Admin check timed out after 10 seconds  <-- Query hangs!
```

## Why This Happened

This is a common mistake in Supabase/PostgreSQL RLS policies. The `is_admin()` helper function is useful for checking admin status in OTHER tables (bookings, services, etc.), but it should NEVER be used in the RLS policy for the `admin_users` table itself.

The fix ensures that:
1. Users can always read their own admin record (for the initial auth check)
2. Admins can read all admin records (using a direct subquery instead of the helper function)
3. No recursive calls to `is_admin()` when querying `admin_users`

## Need Help?

If the fix doesn't work:
1. Check the Supabase SQL Editor for any error messages
2. Visit https://liloexpress.com/diagnostic to see the current status
3. Check browser console for error messages
4. Verify your admin user exists: `SELECT * FROM admin_users WHERE email = 'your-email@example.com';`
