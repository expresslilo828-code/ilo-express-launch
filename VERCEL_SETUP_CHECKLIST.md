# Vercel Deployment Setup Checklist

## ✅ Step-by-Step Guide to Fix Admin Access on Vercel

### Step 1: Add Environment Variables to Vercel (CRITICAL!)

1. **Login to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: Click on your `liloexpress.com` project
3. **Go to Settings**: Click "Settings" in the top navigation
4. **Navigate to Environment Variables**: Click "Environment Variables" in the left sidebar
5. **Add these variables**:

   For each variable below, click "Add New" and fill in:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://tojruwyvpgkdhoypqkdg.supabase.co`
   - Environments: Select **Production**, **Preview**, and **Development**
   - Click "Save"

   **Variable 2:**
   - Key: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvanJ1d3l2cGdrZGhveXBxa2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTIyNjIsImV4cCI6MjA3OTQ4ODI2Mn0.3KoSK3NDmHYaFqs5PKaFgipf8rd2fUeOixyckkHTCYo`
   - Environments: Select **Production**, **Preview**, and **Development**
   - Click "Save"

### Step 2: Redeploy Your Application

**IMPORTANT**: Environment variables only take effect after redeployment!

Option A - Redeploy from Dashboard:
1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the three dots menu (⋯)
4. Click "Redeploy"
5. Confirm redeployment

Option B - Push a new commit:
1. Make any small change (e.g., add a space to README.md)
2. Commit and push to your Git repository
3. Vercel will automatically deploy

### Step 3: Verify Environment Variables

After redeployment:

1. Visit: **https://liloexpress.com/diagnostic**
2. Check the "Environment Variables" section:
   - `VITE_SUPABASE_URL` should show the full URL (not ❌ MISSING)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` should show ✅ SET

If they still show ❌ MISSING:
- Environment variables were not configured correctly
- Go back to Step 1 and double-check
- Make sure you clicked "Save" for each variable
- Make sure you selected all three environments (Production, Preview, Development)

### Step 4: Verify Admin User in Database

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/tojruwyvpgkdhoypqkdg
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste and run:

```sql
-- Check if your admin user exists
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

5. **If your user is NOT in the list**, add them:

```sql
-- First, find your auth user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Copy the ID from the result, then run:
INSERT INTO admin_users (auth_user_id, email, full_name, is_active)
VALUES (
  'PASTE-YOUR-AUTH-USER-ID-HERE',
  'your-email@example.com',
  'Your Full Name',
  true
)
ON CONFLICT (auth_user_id) DO UPDATE
SET is_active = true;
```

### Step 5: Test Login on Production

1. Go to: **https://liloexpress.com/login**
2. Enter your admin credentials
3. Click "Admin Sign In"
4. You should be redirected to the admin dashboard
5. **Refresh the page (F5)**
6. You should REMAIN logged in (not see "Access Denied")

### Step 6: Verify Session Persistence

Open browser console (F12) and check for these logs:
- `🔧 Supabase Config Check:` - Should show environment variables loaded
- `🔍 Checking admin status for user:` - Should show your user ID
- `✅ Admin user found:` - Should show your admin record

If you see errors:
- Check the diagnostic page: https://liloexpress.com/diagnostic
- Look for any red error badges
- Follow the troubleshooting tips on that page

---

## Common Issues and Solutions

### Issue 1: Environment Variables Still Missing After Redeployment

**Symptom**: Diagnostic page shows ❌ MISSING for environment variables

**Solutions**:
1. Double-check you clicked "Save" in Vercel dashboard
2. Verify you selected all three environments (Production, Preview, Development)
3. Try clearing Vercel's build cache:
   - In Vercel dashboard, go to Settings → General
   - Scroll to "Build & Development Settings"
   - Toggle "Automatically expose System Environment Variables" to ON
4. Wait a few minutes and redeploy again

### Issue 2: "Access Denied" After Refresh

**Symptom**: Login works, but page refresh shows "Access Denied"

**Solutions**:
1. Clear browser cache and localStorage:
   - Open DevTools (F12)
   - Go to Application tab
   - Under Local Storage, delete all `sb-` keys
   - Refresh and login again

2. Check admin_users table in Supabase (Step 4 above)

3. Verify RLS policies are correct:
```sql
-- Check policies on admin_users table
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

### Issue 3: "No admin user found in database"

**Symptom**: Console shows "⚠️ No admin user found in database for this auth user!"

**Solution**: Follow Step 4 to add your user to the admin_users table

### Issue 4: Works on localhost but not on Vercel

**Cause**: Environment variables are loaded from `.env` file locally, but Vercel needs them configured in the dashboard

**Solution**: Follow Step 1 to add environment variables to Vercel

---

## Testing Checklist

- [ ] Environment variables configured in Vercel dashboard
- [ ] Application redeployed after adding variables
- [ ] Diagnostic page shows all environment variables loaded
- [ ] Admin user exists in admin_users table
- [ ] Can login successfully at https://liloexpress.com/login
- [ ] Page refresh keeps you logged in
- [ ] No "Access Denied" error after refresh
- [ ] Console shows no errors

---

## Files Changed

✅ `src/integrations/supabase/client.ts` - Added better session handling
✅ `src/pages/DiagnosticPage.tsx` - New diagnostic tool
✅ `src/App.tsx` - Added diagnostic route
✅ `VERCEL_DEPLOYMENT_FIX.md` - Detailed explanation
✅ `VERCEL_SETUP_CHECKLIST.md` - This checklist

---

## Need Help?

If you're still experiencing issues after following all steps:

1. Visit the diagnostic page: https://liloexpress.com/diagnostic
2. Take a screenshot of the results
3. Check browser console for errors (F12)
4. Verify your admin user exists in Supabase database
