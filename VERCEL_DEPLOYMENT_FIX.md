# Fix for Admin Access Issue on Vercel

## Problem
After deploying to Vercel (https://liloexpress.com), admin login works initially but shows "Access Denied" after page refresh.

## Root Causes

### 1. **Missing Environment Variables on Vercel**
The most common cause is that environment variables are not configured in Vercel's dashboard.

### 2. **Session Storage Across Domains**
LocalStorage is domain-specific. Sessions created on `localhost` or IP addresses won't work on production domain.

### 3. **Supabase Client Configuration**
Missing session detection settings can cause authentication to fail on page refresh.

## Solutions

### Solution 1: Configure Vercel Environment Variables (MOST IMPORTANT)

1. Go to your Vercel project dashboard: https://vercel.com/your-username/your-project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production**, **Preview**, and **Development**:

```
VITE_SUPABASE_URL=https://tojruwyvpgkdhoypqkdg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvanJ1d3l2cGdrZGhveXBxa2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTIyNjIsImV4cCI6MjA3OTQ4ODI2Mn0.3KoSK3NDmHYaFqs5PKaFgipf8rd2fUeOixyckkHTCYo
```

**CRITICAL**: After adding environment variables, you MUST **redeploy** your application for changes to take effect.

4. Trigger a new deployment:
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy** button
   - OR push a new commit to trigger automatic deployment

### Solution 2: Updated Supabase Client Configuration

The Supabase client has been updated with better session handling:

```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,  // NEW: Detects session from URL callbacks
    flowType: 'pkce',          // NEW: More secure auth flow
  }
});
```

### Solution 3: Verify Admin User in Database

Make sure your admin user exists in the Supabase database:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/tojruwyvpgkdhoypqkdg
2. Navigate to **SQL Editor**
3. Run this query to check if your admin user exists:

```sql
-- Check if admin user exists
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.auth_user_id,
  au.is_active,
  u.email as auth_email
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.auth_user_id;
```

4. If your user is missing, add them:

```sql
-- First, get your auth user ID
SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Then insert into admin_users (replace with your actual user ID and email)
INSERT INTO admin_users (auth_user_id, email, full_name, is_active)
VALUES (
  'your-auth-user-id-here',
  'your-admin-email@example.com',
  'Your Full Name',
  true
)
ON CONFLICT (auth_user_id) DO UPDATE
SET is_active = true;
```

### Solution 4: Clear Browser Storage and Re-login

If the above doesn't work, clear the browser storage:

1. Open Browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Under **Local Storage**, find your domain (https://liloexpress.com)
4. Delete all items starting with `sb-` (Supabase session keys)
5. Refresh the page
6. Log in again

## Verification Steps

After implementing the fixes:

1. **Check Environment Variables**:
   - Open browser console on https://liloexpress.com
   - Look for the log: `🔧 Supabase Config Check:`
   - It should show `VITE_SUPABASE_PUBLISHABLE_KEY: ✅ Loaded`
   - If it shows `❌ MISSING`, environment variables are not configured correctly in Vercel

2. **Check Admin Status**:
   - After login, check console for: `🔍 Checking admin status for user:`
   - Should see: `✅ Admin user found: {...}`
   - Should NOT see: `⚠️ No admin user found in database`

3. **Test Page Refresh**:
   - Log in successfully
   - Refresh the page (F5)
   - Should remain logged in and see admin dashboard

## Why It Worked on IP Address (172.19.48.1:5173)

The IP address worked because:
1. You were running the dev server locally with `.env` file present
2. Environment variables were loaded from the `.env` file
3. LocalStorage was accessible and persisted

But it didn't work on `localhost:5173` because:
- Different domain = different localStorage namespace
- Session stored on `172.19.48.1` wasn't accessible on `localhost`

## Why It Doesn't Work on Vercel

The production deployment failed because:
1. **Environment variables weren't configured in Vercel dashboard**
2. Vercel doesn't automatically read `.env` files - you must configure them in the dashboard
3. Without environment variables, the Supabase client can't connect to your database

## Next Steps

1. ✅ Add environment variables to Vercel (Solution 1)
2. ✅ Redeploy the application
3. ✅ Verify admin user exists in database (Solution 3)
4. ✅ Test login and refresh on production URL
5. ✅ Check browser console for any errors

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/projects/environment-variables)
- [Supabase Auth with Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
