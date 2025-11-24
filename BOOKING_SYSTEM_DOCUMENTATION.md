# Complete Booking Management System Documentation

## Overview

This is a comprehensive booking management system built with React, TypeScript, Supabase, and Resend. It provides full admin control over bookings with automated email notifications.

## Features

### 🔧 Admin Features
- **Complete CRUD operations** on all bookings
- **Time slot management** for each day of the week
- **Date blocking** for holidays/maintenance
- **Status management** (pending, confirmed, in_progress, completed, cancelled)
- **Bulk operations** (delete multiple bookings, send bulk reminders)
- **Email management** (send individual/bulk reminders)
- **Detailed booking views** with all client information

### 👤 Client Features
- **No login required** - public booking form
- **Real-time availability** checking
- **Multiple service selection**
- **Automatic email confirmations**
- **File upload support** (ready for implementation)

### 📧 Email System
- **Automated notifications** to admin when new booking is created
- **Client confirmation emails** with branded templates
- **Reminder emails** (manual and bulk sending)
- **Email logging** for tracking delivery status
- **Customizable templates** with dynamic content

## Database Schema

### Tables

#### 1. `bookings`
Main booking storage with complete client information.

```sql
- id (UUID, Primary Key)
- service_id (UUID, Foreign Key to services)
- full_name (VARCHAR, Required)
- business_name (VARCHAR, Optional)
- email (VARCHAR, Required)
- phone (VARCHAR, Required)
- contact_method (VARCHAR)
- state (VARCHAR)
- city (VARCHAR)
- preferred_date (DATE, Required)
- preferred_time (TIME, Required)
- duration_minutes (INTEGER)
- services_requested (JSONB)
- notes (TEXT)
- how_heard (VARCHAR)
- file_urls (JSONB)
- status (ENUM: pending, confirmed, in_progress, completed, cancelled)
- admin_notes (TEXT)
- confirmed_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- cancelled_at (TIMESTAMP)
- cancellation_reason (TEXT)
- reminder_sent (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `admin_time_slots`
Configurable time slots for each day of the week.

```sql
- id (UUID, Primary Key)
- day_of_week (ENUM: monday, tuesday, wednesday, thursday, friday, saturday, sunday)
- start_time (TIME, Required)
- end_time (TIME, Required)
- slot_duration_minutes (INTEGER, Default: 30)
- is_available (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. `blocked_dates`
Specific dates blocked from booking.

```sql
- id (UUID, Primary Key)
- blocked_date (DATE, Required, Unique)
- reason (VARCHAR, Optional)
- created_by (UUID, Foreign Key to auth.users)
- created_at (TIMESTAMP)
```

#### 4. `services`
Available services for booking.

```sql
- id (UUID, Primary Key)
- title (VARCHAR, Required)
- slug (VARCHAR, Required, Unique)
- category (VARCHAR)
- description (TEXT)
- short_description (TEXT)
- price (DECIMAL)
- duration_hours (DECIMAL)
- features (JSONB)
- is_active (BOOLEAN, Default: true)
- icon (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. `email_templates`
Customizable email templates.

```sql
- id (UUID, Primary Key)
- template_type (VARCHAR, Required, Unique)
- subject (VARCHAR, Required)
- html_content (TEXT, Required)
- text_content (TEXT)
- is_active (BOOLEAN, Default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 6. `email_logs`
Email delivery tracking.

```sql
- id (UUID, Primary Key)
- booking_id (UUID, Foreign Key to bookings)
- email_type (VARCHAR, Required)
- recipient_email (VARCHAR, Required)
- subject (VARCHAR)
- sent_at (TIMESTAMP)
- status (VARCHAR, Default: 'sent')
- error_message (TEXT)
- resend_message_id (VARCHAR)
```

#### 7. `user_roles`
Admin role management.

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- role (ENUM: admin, user)
- created_at (TIMESTAMP)
```

### Database Functions

#### 1. `get_available_time_slots(target_date)`
Returns available time slots for a specific date, considering:
- Admin-configured time slots for that day of the week
- Already booked time slots
- Blocked dates

#### 2. `create_booking_with_notifications(booking_data)`
Creates a booking with automatic validation:
- Checks if time slot is available
- Prevents double booking
- Validates against blocked dates
- Returns the new booking ID

#### 3. `update_booking_status(booking_id, status, notes, reason)`
Updates booking status with automatic timestamps:
- Sets confirmed_at, completed_at, or cancelled_at
- Tracks admin notes and cancellation reasons

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Resend Email Configuration
VITE_RESEND_API_KEY=your_resend_api_key

# Email Configuration
VITE_ADMIN_EMAIL=admin@yourbusiness.com
VITE_FROM_EMAIL=bookings@yourbusiness.com

# Branding Configuration
VITE_COMPANY_NAME=Your Business Name
VITE_LOGO_URL=https://your-domain.com/logo.png
```

### 2. Database Setup

1. Run the migration file in your Supabase SQL editor:
   ```bash
   supabase/migrations/20241220_booking_management_system.sql
   ```

2. Create an admin user:
   ```sql
   -- After creating a user through Supabase Auth
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('your-user-id', 'admin');
   ```

### 3. Email Setup

1. Sign up for Resend at https://resend.com
2. Add your domain and verify it
3. Create an API key
4. Update your email templates in the database if needed

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## Email Templates

The system includes three pre-configured email templates:

### 1. Booking Confirmation (`booking_confirmation`)
Sent to clients when they book an appointment.

### 2. Admin Notification (`admin_notification`)
Sent to admin when a new booking is created.

### 3. Reminder Email (`reminder_email`)
Sent to clients as appointment reminders.

### Template Variables

All templates support these variables:
- `{full_name}` - Client's full name
- `{business_name}` - Client's business name
- `{email}` - Client's email
- `{phone}` - Client's phone number
- `{preferred_date}` - Appointment date (formatted)
- `{preferred_time}` - Appointment time
- `{services}` - Requested services (comma-separated)
- `{notes}` - Client notes

## Admin Dashboard

### Booking Management (`/admin/bookings`)
- View all bookings with filtering by status
- Bulk actions (delete, send reminders)
- Individual booking details in modal
- Quick status updates
- Delete individual bookings
- Send reminder emails

### Schedule Management (`/admin/schedule`)
- Configure time slots by day of the week
- Set slot duration (15, 30, 60, 90 minutes)
- Enable/disable time slots
- Block specific dates
- View and manage blocked dates

## API Integration

### Available Functions

#### Get Available Time Slots
```typescript
const { data, error } = await supabase
  .rpc('get_available_time_slots', {
    target_date: '2024-12-25'
  });
```

#### Create Booking
```typescript
const { data: bookingId, error } = await supabase
  .rpc('create_booking_with_notifications', {
    p_full_name: 'John Doe',
    p_email: 'john@example.com',
    // ... other booking data
  });
```

#### Update Booking Status
```typescript
const { error } = await supabase
  .rpc('update_booking_status', {
    p_booking_id: 'booking-uuid',
    p_status: 'confirmed',
    p_admin_notes: 'Confirmed via phone'
  });
```

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

- **Public access**: Services (read), time slots (read), blocked dates (read)
- **Public write**: Bookings (insert only)
- **Admin only**: All other operations require admin role

### Admin Authentication
Only users with the `admin` role in `user_roles` table can:
- View admin dashboard
- Manage bookings
- Configure schedule
- Access email logs

## Customization

### Email Templates
Customize email templates by updating the `email_templates` table:

```sql
UPDATE email_templates 
SET html_content = 'your-custom-html'
WHERE template_type = 'booking_confirmation';
```

### Services
Add/modify services in the `services` table:

```sql
INSERT INTO services (title, slug, category, description, is_active)
VALUES ('New Service', 'new-service', 'Category', 'Description', true);
```

### Time Slots
Configure working hours via the admin interface or directly:

```sql
INSERT INTO admin_time_slots (day_of_week, start_time, end_time, slot_duration_minutes)
VALUES ('monday', '09:00', '17:00', 30);
```

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check Resend API key and domain verification
2. **Time slots not showing**: Verify admin_time_slots configuration
3. **Bookings failing**: Check RLS policies and database functions
4. **Admin access denied**: Verify user_roles table has admin entry

### Logs
Check email delivery in the `email_logs` table:

```sql
SELECT * FROM email_logs ORDER BY sent_at DESC;
```

## Future Enhancements

### Planned Features
- Calendar integration (Google Calendar, Outlook)
- SMS notifications via Twilio
- Payment processing integration
- Multi-location support
- Recurring appointments
- Client portal for managing bookings
- Advanced reporting and analytics
- Mobile app support

### File Upload Implementation
The system is ready for file uploads. To implement:

1. Set up Supabase Storage bucket
2. Add file upload logic to booking form
3. Update `file_urls` field with actual file URLs
4. Add file viewing in admin interface

## Support

For technical support or customization requests, please refer to:
- Supabase documentation: https://supabase.com/docs
- Resend documentation: https://resend.com/docs
- React documentation: https://react.dev

## License

This booking system is provided as-is for your implementation. Customize as needed for your specific business requirements.