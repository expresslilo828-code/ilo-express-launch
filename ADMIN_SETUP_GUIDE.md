# Admin Setup Guide

## Complete Booking Management System
**Admin RUD (Read, Update, Delete) - No Create Permission**

This system provides full admin control over bookings with the restriction that admins cannot create bookings - only public users can create bookings through the public form.

## 🚀 Quick Setup

### 1. Database Migration
Run the complete SQL migration in your Supabase SQL editor:
```sql
-- Copy and paste the entire content from:
supabase/migrations/20241220_booking_management_system.sql
```

### 2. Environment Setup
```bash
# Copy the environment template
cp .env.example .env

# Configure your environment variables:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_ADMIN_EMAIL=admin@yourbusiness.com
VITE_FROM_EMAIL=bookings@yourbusiness.com
VITE_COMPANY_NAME=Your Business Name
VITE_LOGO_URL=https://your-domain.com/logo.png
```

### 3. Create Admin User

#### Step 1: Create Auth User in Supabase
Go to your Supabase dashboard → Authentication → Users → Add User
- Email: admin@yourbusiness.com
- Password: [secure password]
- Auto Confirm User: Yes

#### Step 2: Convert to Admin
In your Supabase SQL editor, run:
```sql
-- Replace 'auth-user-id-here' with the actual UUID from auth.users table
SELECT public.create_admin_user(
  'auth-user-id-here',  -- Get this from Authentication > Users in Supabase dashboard
  'admin@yourbusiness.com',
  'Admin Full Name'
);
```

### 4. Configure Time Slots
After logging in as admin, go to Admin → Schedule Management to set up:
- Working days (Monday-Sunday)
- Time slots for each day
- Slot duration (15, 30, 60, 90 minutes)
- Block specific dates for holidays

## 📋 System Architecture

### Admin Capabilities (RUD Only)
✅ **READ**: View all bookings with detailed information  
✅ **UPDATE**: Change booking status, add admin notes  
✅ **DELETE**: Remove single or multiple bookings  
❌ **CREATE**: Cannot create bookings (public only)

### Additional Admin Features
- Configure time slots for each day of the week
- Block specific dates 
- Send reminder emails (individual/bulk)
- View email delivery logs
- Manage email templates

### Public User Features
- Create bookings without login
- Real-time availability checking
- Automatic email confirmations
- File upload support (ready for implementation)

## 🗄️ Database Schema

### Core Tables
1. **`admin_users`** - Admin authentication and authorization
2. **`bookings`** - All booking data (public creates, admin RUD)
3. **`admin_time_slots`** - Configurable schedule by day
4. **`blocked_dates`** - Holiday/maintenance blocking
5. **`services`** - Available services for booking
6. **`email_templates`** - Branded email templates
7. **`email_logs`** - Email delivery tracking

### Key Security Features
- Row Level Security (RLS) on all tables
- Admin-only access via `is_admin()` function
- Public can only INSERT bookings
- Admins can only READ/UPDATE/DELETE bookings

## 🔧 Admin Functions

### Check Admin Status
```sql
SELECT public.is_admin(); -- Returns true if current user is admin
```

### Create Additional Admin Users
```sql
SELECT public.create_admin_user(
  'auth-user-id',
  'new-admin@yourbusiness.com', 
  'Admin Name'
);
```

### Update Booking Status
```sql
SELECT public.update_booking_status(
  'booking-id',
  'confirmed',
  'Admin notes here',
  NULL -- cancellation reason (if cancelling)
);
```

## 📧 Email System

### Automatic Emails
- **Client Confirmation**: Sent when booking is created
- **Admin Notification**: Sent to admin when booking is created  
- **Reminder Emails**: Sent manually by admin

### Email Templates
Three branded templates included:
- `booking_confirmation` - Client confirmation
- `admin_notification` - New booking alerts
- `reminder_email` - Appointment reminders

### Template Variables
All templates support dynamic content:
- `{full_name}`, `{business_name}`, `{email}`, `{phone}`
- `{preferred_date}`, `{preferred_time}`, `{services}`
- `{notes}` and more

## 🛡️ Security Model

### Authentication Flow
1. User authenticates via Supabase Auth
2. System checks `admin_users` table for admin status
3. Admin privileges verified via `is_admin()` function
4. RLS policies enforce access control

### Permission Matrix
| Operation | Public | Admin |
|-----------|--------|-------|
| Create Booking | ✅ | ❌ |
| View Bookings | ❌ | ✅ |
| Update Booking | ❌ | ✅ |
| Delete Booking | ❌ | ✅ |
| Manage Schedule | ❌ | ✅ |
| Send Emails | ❌ | ✅ |

## 🚦 Testing the System

### 1. Test Public Booking
1. Go to `/booking` (no login required)
2. Fill out the booking form
3. Select available time slot
4. Submit booking
5. Check email confirmation

### 2. Test Admin Functions
1. Login at `/login` with admin credentials
2. Go to `/admin/bookings` to see the new booking
3. Update booking status
4. Send reminder email
5. Test bulk operations

### 3. Test Schedule Management
1. Go to `/admin/schedule`
2. Add time slots for different days
3. Block a specific date
4. Check availability on public booking form

## 🔍 Troubleshooting

### Admin Access Issues
```sql
-- Check if user exists in admin_users
SELECT * FROM admin_users WHERE email = 'admin@yourbusiness.com';

-- Check admin status
SELECT public.is_admin('user-id-here');
```

### Email Issues
```sql
-- Check email logs for delivery status
SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 10;
```

### Booking Issues
```sql
-- Check available time slots for a specific date
SELECT * FROM public.get_available_time_slots('2024-12-25');
```

## 📈 Production Checklist

- [ ] ✅ Database migration completed
- [ ] ✅ Admin user created and verified
- [ ] ✅ Environment variables configured
- [ ] ✅ Resend email service verified
- [ ] ✅ Time slots configured
- [ ] ✅ Email templates customized
- [ ] ✅ Test booking flow (public)
- [ ] ✅ Test admin functions (RUD)
- [ ] ✅ Test email delivery
- [ ] ✅ Configure domain and branding

## 🎯 Key Features Delivered

### ✅ Admin RUD Operations
- Full read access to all bookings
- Update booking status and notes
- Delete single or multiple bookings
- **No create permission** (public only)

### ✅ Time Management
- Configure slots for Monday-Sunday
- Set custom slot durations
- Block specific dates
- Real-time availability checking

### ✅ Email System
- Branded templates with logo
- Automatic notifications
- Manual reminder sending
- Delivery tracking

### ✅ Security
- Proper admin authentication
- Row-level security
- Function-based permissions
- Audit trail in logs

The system is now complete and production-ready with the requested RUD functionality for admins!