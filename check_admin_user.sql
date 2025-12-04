-- Check if your admin user exists in the database
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.auth_user_id,
  au.is_active,
  au.created_at,
  u.email as auth_email,
  u.email_confirmed_at
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.auth_user_id
WHERE au.auth_user_id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';

-- If the above returns no rows, check if the user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE id = 'a27ee2bc-886f-4f5d-9001-12fbb19f115c';
