# 🚨 QUICK FIX - Create Admin User

## The Problem
You're logged in as user `a27ee2bc-886f-4f5d-9001-12fbb19f115c` but there's no record in the `admin_users` table, so you can't access the admin dashboard.

## The Solution
Run this SQL in your Supabase SQL Editor:

```sql
-- Get your email from auth.users
SELECT id, email FROM auth.users WHERE id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- Create admin user (replace the email with the one from above)
INSERT INTO admin_users (auth_user_id, email, full_name, is_active)
VALUES (
  'a27ee2bc-886f-4f5d-9001-12fbb19f115c',
  'YOUR_EMAIL_HERE',  -- Replace with your actual email from the query above
  'Admin',
  true
)
ON CONFLICT (auth_user_id) 
DO UPDATE SET is_active = true;

-- Verify it was created
SELECT * FROM admin_users WHERE auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';
```

## Steps:
1. **Open Supabase Dashboard** → SQL Editor
2. **Copy the SQL above** and paste it
3. **Replace `YOUR_EMAIL_HERE`** with your actual email (from the first query result)
4. **Run the query**
5. **Refresh your app** and try logging in again

## What to Look For in Console:
After running the SQL and refreshing, you should see:
```
🔍 Checking admin status for user: a27ee2bc-886f-4f5d-9001-12fbb19f115c
📊 Querying admin_users table...
📦 Query result: { adminData: {...}, adminError: null }
✅ Admin user found: {id: "...", email: "...", ...}
🎯 Is user admin? true
```

## If You Still See This Warning:
```
⚠️ No admin user found in database for this auth user!
📝 You need to create an admin user record. Run create_admin_user.sql
```

Then the admin user was not created successfully. Check:
1. Did you replace `YOUR_EMAIL_HERE` with your actual email?
2. Did the query run without errors?
3. Does the `admin_users` table exist? (Run: `SELECT * FROM admin_users LIMIT 1;`)
