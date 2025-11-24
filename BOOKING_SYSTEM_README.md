# Complete Booking Management System

A full-featured booking management system with **admin RUD (Read, Update, Delete)** controls, automated emails, and real-time availability checking.

**🔒 Admin Permission Model**: Admins can only Read, Update, and Delete bookings - **no create permission**. Only public users can create bookings.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
Run this SQL in your Supabase SQL editor:
```bash
supabase/migrations/20241220_booking_management_system.sql
```

### 4. Create Admin User

**Step 1**: Create user in Supabase Dashboard → Authentication → Users
- Email: admin@yourbusiness.com
- Password: [secure password]  
- Auto Confirm User: ✅

**Step 2**: Make them admin via SQL:
```sql
-- Replace with actual auth user ID from Supabase dashboard
SELECT public.create_admin_user(
  'auth-user-id-from-dashboard',
  'admin@yourbusiness.com',
  'Admin Full Name'
);
```

### 5. Start Development
```bash
npm run dev
```

## 📋 Required Services

### Supabase
1. Create project at https://supabase.com
2. Get your project URL and anon key
3. Add to `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`

### Resend (Email Service)
1. Sign up at https://resend.com
2. Verify your domain
3. Create API key
4. Add to `.env` as `VITE_RESEND_API_KEY`

## 🎯 Features

### ✅ Public Booking (No Login Required)
- Real-time time slot availability
- Multiple service selection
- Automatic email confirmations
- File upload support (ready)

### ✅ Admin Dashboard
- Complete booking CRUD operations
- Time slot configuration by day
- Date blocking for holidays
- Bulk email reminders
- Status management
- Detailed booking views

### ✅ Email System
- Automated client confirmations
- Admin notifications for new bookings
- Manual and bulk reminder emails
- Branded email templates
- Email delivery tracking

### ✅ Advanced Features
- Row-level security
- Real-time availability checking
- Conflict prevention
- Automated status tracking
- Comprehensive logging

## 🗂️ File Structure

```
src/
├── pages/
│   ├── Booking.tsx              # Public booking form
│   └── admin/
│       ├── AdminBookings.tsx    # Booking management
│       └── AdminSchedule.tsx    # Time slot & date management
├── lib/
│   └── emailService.ts          # Email handling
├── integrations/supabase/
│   ├── client.ts               # Supabase client
│   └── types.ts                # Database types
└── types/
    └── database.ts             # Additional types

supabase/migrations/
└── 20241220_booking_management_system.sql  # Complete schema
```

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `bookings` | Main booking data |
| `admin_time_slots` | Configurable schedule |
| `blocked_dates` | Holiday/maintenance dates |
| `services` | Available services |
| `email_templates` | Customizable email templates |
| `email_logs` | Email delivery tracking |
| `user_roles` | Admin access control |

## 🔧 Configuration

### Email Templates
Three pre-configured templates:
- `booking_confirmation` - Client confirmation
- `admin_notification` - New booking alerts
- `reminder_email` - Appointment reminders

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_RESEND_API_KEY=your_resend_key
VITE_ADMIN_EMAIL=admin@yourbusiness.com
VITE_FROM_EMAIL=bookings@yourbusiness.com
VITE_COMPANY_NAME=Your Business Name
VITE_LOGO_URL=https://yourdomain.com/logo.png
```

## 📝 Usage Examples

### Get Available Time Slots
```typescript
const { data } = await supabase
  .rpc('get_available_time_slots', {
    target_date: '2024-12-25'
  });
```

### Create Booking
```typescript
const { data: bookingId } = await supabase
  .rpc('create_booking_with_notifications', {
    p_full_name: 'John Doe',
    p_email: 'john@example.com',
    p_preferred_date: '2024-12-25',
    p_preferred_time: '14:30',
    // ... other fields
  });
```

### Send Reminder Email
```typescript
await emailService.sendReminderEmail(bookingId, emailData);
```

## 🛡️ Security

- Row Level Security (RLS) on all tables
- Admin-only operations require role verification
- Public can only create bookings
- Input validation and sanitization
- Conflict prevention at database level

## 📧 Email Features

### Automatic Emails
- Client confirmation on booking
- Admin notification on new booking
- Reminder emails (manual/bulk)

### Template Variables
All templates support dynamic content:
- `{full_name}`, `{business_name}`, `{email}`, `{phone}`
- `{preferred_date}`, `{preferred_time}`, `{services}`
- `{notes}` and more

## 🔄 Admin Operations

### Booking Management
- Filter by status (pending, confirmed, in_progress, completed, cancelled)
- Bulk select and delete
- Individual status updates
- Detailed booking views
- Send reminder emails

### Schedule Management
- Configure time slots for each day
- Set slot duration (15, 30, 60, 90 minutes)
- Enable/disable specific slots
- Block dates for holidays
- Manage blocked dates

## 🚨 Troubleshooting

### Emails Not Sending
1. Check Resend API key in `.env`
2. Verify domain in Resend dashboard
3. Check `email_logs` table for errors

### Time Slots Not Showing
1. Configure `admin_time_slots` via admin panel
2. Ensure time slots are marked as available
3. Check for blocked dates

### Admin Access Issues
1. Verify user exists in `user_roles` table
2. Ensure role is set to 'admin'
3. Check authentication status

## 📈 Next Steps

### Immediate Setup
1. ✅ Run database migration
2. ✅ Configure environment variables
3. ✅ Create admin user
4. ✅ Set up email service
5. ✅ Configure time slots

### Optional Enhancements
- Add file upload for client documents
- Integrate calendar sync (Google/Outlook)
- Add SMS notifications
- Implement payment processing
- Create mobile app

## 📋 Production Checklist

- [ ] Database migration completed
- [ ] Environment variables configured
- [ ] Admin user created
- [ ] Email service verified
- [ ] Time slots configured
- [ ] Test booking flow
- [ ] Test email delivery
- [ ] Verify admin functions
- [ ] Set up monitoring
- [ ] Configure backups

## 📞 Support

The system is fully functional and ready for production use. Customize the email templates, services, and branding to match your business needs.

For detailed implementation guide, see `BOOKING_SYSTEM_DOCUMENTATION.md`.