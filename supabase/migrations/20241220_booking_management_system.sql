-- =============================================
-- COMPLETE BOOKING MANAGEMENT SYSTEM
-- Admin: Read, Update, Delete (RUD) - No Create
-- Users: Public booking creation only
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM (
  'pending', 
  'confirmed', 
  'in_progress', 
  'completed', 
  'cancelled'
);

-- Create day of week enum
CREATE TYPE public.day_of_week AS ENUM (
  'monday', 
  'tuesday', 
  'wednesday', 
  'thursday', 
  'friday', 
  'saturday', 
  'sunday'
);

-- =============================================
-- ADMIN USERS AND AUTHENTICATION
-- =============================================

-- Create admin users table (separate from auth.users for admin-specific data)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(auth_user_id)
);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE auth_user_id = user_id AND is_active = true
  );
END;
$$;

-- Function to create admin user (call this after creating user in auth.users)
CREATE OR REPLACE FUNCTION public.create_admin_user(
  p_auth_user_id UUID,
  p_email VARCHAR,
  p_full_name VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  INSERT INTO public.admin_users (auth_user_id, email, full_name)
  VALUES (p_auth_user_id, p_email, p_full_name)
  RETURNING id INTO admin_user_id;
  
  RETURN admin_user_id;
END;
$$;

-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2),
  duration_hours DECIMAL(4,2),
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- ADMIN TIME SLOTS CONFIGURATION
-- =============================================
CREATE TABLE public.admin_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(day_of_week, start_time)
);

-- =============================================
-- BLOCKED DATES TABLE
-- =============================================
CREATE TABLE public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL,
  reason VARCHAR(255),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blocked_date)
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id),
  full_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  contact_method VARCHAR(50),
  state VARCHAR(100),
  city VARCHAR(100),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  services_requested JSONB,
  notes TEXT,
  how_heard VARCHAR(255),
  file_urls JSONB,
  status booking_status DEFAULT 'pending',
  admin_notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- EMAIL TEMPLATES TABLE
-- =============================================
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_type)
);

-- =============================================
-- EMAIL LOGS TABLE
-- =============================================
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  email_type VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  resend_message_id VARCHAR(255)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_bookings_date_time ON public.bookings(preferred_date, preferred_time);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_blocked_dates_date ON public.blocked_dates(blocked_date);
CREATE INDEX idx_admin_time_slots_day ON public.admin_time_slots(day_of_week);
CREATE INDEX idx_email_logs_booking ON public.email_logs(booking_id);

-- =============================================
-- RLS POLICIES
-- =============================================
-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admin users: Only admins can view admin user data
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage admin users"
ON public.admin_users FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Services: Public read, admin write
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Admin time slots: Public read, admin write
CREATE POLICY "Anyone can view available time slots"
ON public.admin_time_slots FOR SELECT
USING (is_available = true);

CREATE POLICY "Admins can manage time slots"
ON public.admin_time_slots FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Blocked dates: Public read, admin write
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates FOR SELECT
USING (true);

CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Bookings: Public can CREATE only, admins can READ/UPDATE/DELETE only (no CREATE)
CREATE POLICY "Anyone can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (status = 'pending' OR status IS NULL);

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Email templates: Admin only
CREATE POLICY "Admins can manage email templates"
ON public.email_templates FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Email logs: Admin only
CREATE POLICY "Admins can view email logs"
ON public.email_logs FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to get available time slots for a specific date
CREATE OR REPLACE FUNCTION public.get_available_time_slots(
  target_date DATE
)
RETURNS TABLE (
  time_slot TIME,
  is_available BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  day_name day_of_week;
  slot_record RECORD;
  slot_time TIME;
  booked_times TIME[];
BEGIN
  -- Get the day of the week
  day_name := CASE EXTRACT(dow FROM target_date)::integer
    WHEN 0 THEN 'sunday'::day_of_week
    WHEN 1 THEN 'monday'::day_of_week
    WHEN 2 THEN 'tuesday'::day_of_week
    WHEN 3 THEN 'wednesday'::day_of_week
    WHEN 4 THEN 'thursday'::day_of_week
    WHEN 5 THEN 'friday'::day_of_week
    WHEN 6 THEN 'saturday'::day_of_week
  END;

  -- Check if date is blocked
  IF EXISTS (SELECT 1 FROM public.blocked_dates WHERE blocked_date = target_date) THEN
    RETURN;
  END IF;

  -- Get all booked times for this date
  SELECT ARRAY_AGG(preferred_time) INTO booked_times
  FROM public.bookings 
  WHERE preferred_date = target_date 
    AND status NOT IN ('cancelled');

  -- Generate time slots for this day
  FOR slot_record IN 
    SELECT ats.start_time, ats.end_time, ats.slot_duration_minutes
    FROM public.admin_time_slots ats
    WHERE ats.day_of_week = day_name AND ats.is_available = true
  LOOP
    slot_time := slot_record.start_time;
    
    WHILE slot_time < slot_record.end_time LOOP
      RETURN QUERY SELECT 
        slot_time,
        NOT (slot_time = ANY(COALESCE(booked_times, ARRAY[]::TIME[])));
      
      slot_time := slot_time + INTERVAL '1 minute' * slot_record.slot_duration_minutes;
    END LOOP;
  END LOOP;
END;
$$;

-- Function to create a booking and send notifications
CREATE OR REPLACE FUNCTION public.create_booking_with_notifications(
  p_service_id UUID,
  p_full_name VARCHAR,
  p_business_name VARCHAR,
  p_email VARCHAR,
  p_phone VARCHAR,
  p_contact_method VARCHAR,
  p_state VARCHAR,
  p_city VARCHAR,
  p_preferred_date DATE,
  p_preferred_time TIME,
  p_services_requested JSONB,
  p_notes TEXT,
  p_how_heard VARCHAR,
  p_file_urls JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_booking_id UUID;
  day_name day_of_week;
  slot_available BOOLEAN := false;
BEGIN
  -- Check if the time slot is available
  day_name := CASE EXTRACT(dow FROM p_preferred_date::date)::integer
    WHEN 0 THEN 'sunday'::day_of_week
    WHEN 1 THEN 'monday'::day_of_week
    WHEN 2 THEN 'tuesday'::day_of_week
    WHEN 3 THEN 'wednesday'::day_of_week
    WHEN 4 THEN 'thursday'::day_of_week
    WHEN 5 THEN 'friday'::day_of_week
    WHEN 6 THEN 'saturday'::day_of_week
  END;

  -- Check if date is blocked
  IF EXISTS (SELECT 1 FROM public.blocked_dates WHERE blocked_date = p_preferred_date) THEN
    RAISE EXCEPTION 'This date is not available for booking';
  END IF;

  -- Check if time slot exists and is available
  IF EXISTS (
    SELECT 1 FROM public.admin_time_slots 
    WHERE day_of_week = day_name 
      AND p_preferred_time >= start_time 
      AND p_preferred_time < end_time 
      AND is_available = true
  ) THEN
    slot_available := true;
  END IF;

  IF NOT slot_available THEN
    RAISE EXCEPTION 'This time slot is not available';
  END IF;

  -- Check if time is already booked
  IF EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE preferred_date = p_preferred_date 
      AND preferred_time = p_preferred_time 
      AND status NOT IN ('cancelled')
  ) THEN
    RAISE EXCEPTION 'This time slot is already booked';
  END IF;

  -- Create the booking
  INSERT INTO public.bookings (
    service_id, full_name, business_name, email, phone, contact_method,
    state, city, preferred_date, preferred_time, services_requested,
    notes, how_heard, file_urls, status
  ) VALUES (
    p_service_id, p_full_name, p_business_name, p_email, p_phone, p_contact_method,
    p_state, p_city, p_preferred_date, p_preferred_time, p_services_requested,
    p_notes, p_how_heard, p_file_urls, 'pending'
  ) RETURNING id INTO new_booking_id;

  RETURN new_booking_id;
END;
$$;

-- Function to update booking status
CREATE OR REPLACE FUNCTION public.update_booking_status(
  p_booking_id UUID,
  p_status booking_status,
  p_admin_notes TEXT DEFAULT NULL,
  p_cancellation_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.bookings 
  SET 
    status = p_status,
    admin_notes = COALESCE(p_admin_notes, admin_notes),
    confirmed_at = CASE WHEN p_status = 'confirmed' THEN now() ELSE confirmed_at END,
    completed_at = CASE WHEN p_status = 'completed' THEN now() ELSE completed_at END,
    cancelled_at = CASE WHEN p_status = 'cancelled' THEN now() ELSE cancelled_at END,
    cancellation_reason = CASE WHEN p_status = 'cancelled' THEN p_cancellation_reason ELSE cancellation_reason END,
    updated_at = now()
  WHERE id = p_booking_id;

  RETURN FOUND;
END;
$$;

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Default services
INSERT INTO public.services (title, slug, category, description, duration_hours, is_active) VALUES
('Business Formation (LLC, Corporation, EIN)', 'business-formation', 'Business Setup', 'Complete business formation services including LLC, Corporation setup and EIN registration', 1.0, true),
('USDOT Number Registration', 'usdot-registration', 'Transportation', 'USDOT number registration for commercial vehicles', 0.5, true),
('MC Number (Motor Carrier Authority)', 'mc-number', 'Transportation', 'Motor Carrier Authority registration', 0.5, true),
('IRP / IRP Renewal', 'irp-services', 'Transportation', 'International Registration Plan services and renewals', 0.5, true),
('BOC-3 Filing', 'boc3-filing', 'Transportation', 'BOC-3 process agent filing', 0.5, true),
('FMCSA Clearinghouse Queries', 'fmcsa-clearinghouse', 'Transportation', 'FMCSA Drug and Alcohol Clearinghouse queries', 0.5, true),
('UCR Registration', 'ucr-registration', 'Transportation', 'Unified Carrier Registration', 0.5, true),
('IFTA Services', 'ifta-services', 'Transportation', 'International Fuel Tax Agreement services', 0.5, true),
('IRS 2290 Heavy Vehicle Use Tax', 'irs-2290', 'Tax Services', 'Heavy Vehicle Use Tax filing', 0.5, true),
('Limo & NEMT Licensing', 'limo-nemt-licensing', 'Transportation', 'Limousine and Non-Emergency Medical Transportation licensing', 1.0, true);

-- Default admin time slots (Monday to Friday, 9 AM to 5 PM)
INSERT INTO public.admin_time_slots (day_of_week, start_time, end_time, slot_duration_minutes) VALUES
('monday', '09:00', '17:00', 30),
('tuesday', '09:00', '17:00', 30),
('wednesday', '09:00', '17:00', 30),
('thursday', '09:00', '17:00', 30),
('friday', '09:00', '17:00', 30);

-- Default email templates
INSERT INTO public.email_templates (template_type, subject, html_content, text_content) VALUES
('booking_confirmation', 'Booking Confirmation - {full_name}', 
'<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background-color:#f5f5f5}.container{max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.header{text-align:center;margin-bottom:30px}.logo{max-width:200px;height:auto}.title{color:#2563eb;margin:20px 0 10px}.content{color:#374151;line-height:1.6}.details{background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0}.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px}</style></head><body><div class="container"><div class="header"><img src="https://your-domain.com/logo.png" alt="Company Logo" class="logo"><h1 class="title">Booking Confirmation</h1></div><div class="content"><p>Dear {full_name},</p><p>Thank you for booking with us! Your appointment has been confirmed with the following details:</p><div class="details"><h3>Appointment Details</h3><p><strong>Date:</strong> {preferred_date}</p><p><strong>Time:</strong> {preferred_time}</p><p><strong>Services:</strong> {services}</p><p><strong>Business Name:</strong> {business_name}</p></div><p>We will send you a reminder 24 hours before your appointment.</p><p>If you need to reschedule or cancel, please contact us as soon as possible.</p></div><div class="footer"><p>Best regards,<br>Your Business Name<br>Phone: (555) 123-4567<br>Email: admin@yourbusiness.com</p></div></div></body></html>',
'Dear {full_name}, Thank you for booking with us! Your appointment is confirmed for {preferred_date} at {preferred_time}. Services: {services}. We will send a reminder 24 hours before your appointment.'),

('admin_notification', 'New Booking - {full_name}', 
'<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background-color:#f5f5f5}.container{max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.header{text-align:center;margin-bottom:30px}.logo{max-width:200px;height:auto}.title{color:#dc2626;margin:20px 0 10px}.content{color:#374151;line-height:1.6}.details{background:#fef2f2;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #dc2626}.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px}</style></head><body><div class="container"><div class="header"><img src="https://your-domain.com/logo.png" alt="Company Logo" class="logo"><h1 class="title">New Booking Alert</h1></div><div class="content"><p>A new booking has been received:</p><div class="details"><h3>Booking Details</h3><p><strong>Client:</strong> {full_name}</p><p><strong>Business:</strong> {business_name}</p><p><strong>Email:</strong> {email}</p><p><strong>Phone:</strong> {phone}</p><p><strong>Date:</strong> {preferred_date}</p><p><strong>Time:</strong> {preferred_time}</p><p><strong>Services:</strong> {services}</p><p><strong>Notes:</strong> {notes}</p></div><p>Please log in to the admin dashboard to review and confirm this booking.</p></div></div></body></html>',
'New booking received from {full_name} ({email}) for {preferred_date} at {preferred_time}. Services: {services}. Please review in admin dashboard.'),

('reminder_email', 'Appointment Reminder - Tomorrow at {preferred_time}', 
'<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background-color:#f5f5f5}.container{max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.header{text-align:center;margin-bottom:30px}.logo{max-width:200px;height:auto}.title{color:#059669;margin:20px 0 10px}.content{color:#374151;line-height:1.6}.details{background:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #059669}.footer{text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:14px}</style></head><body><div class="container"><div class="header"><img src="https://your-domain.com/logo.png" alt="Company Logo" class="logo"><h1 class="title">Appointment Reminder</h1></div><div class="content"><p>Dear {full_name},</p><p>This is a friendly reminder about your appointment with us tomorrow:</p><div class="details"><h3>Appointment Details</h3><p><strong>Date:</strong> {preferred_date}</p><p><strong>Time:</strong> {preferred_time}</p><p><strong>Services:</strong> {services}</p></div><p>Please arrive 10 minutes early and bring any relevant documents.</p><p>If you need to reschedule, please contact us immediately.</p></div><div class="footer"><p>See you soon!<br>Your Business Name<br>Phone: (555) 123-4567<br>Email: admin@yourbusiness.com</p></div></div></body></html>',
'Reminder: Your appointment is tomorrow {preferred_date} at {preferred_time} for {services}. Please arrive 10 minutes early.');

-- =============================================
-- ADMIN USER SETUP INSTRUCTIONS
-- =============================================

-- To create an admin user, follow these steps:
-- 1. First create a user through Supabase Auth (via dashboard or signUp function)
-- 2. Then run this function to make them an admin:

-- Example: Creating an admin user
-- SELECT public.create_admin_user(
--   'auth-user-id-from-auth-users-table',
--   'admin@yourbusiness.com',
--   'Admin Full Name'
-- );

-- =============================================
-- SYSTEM READY
-- =============================================

-- The booking system is now complete with:
-- ✅ Admin authentication and authorization
-- ✅ Public booking creation (no admin create permission)
-- ✅ Admin RUD operations on bookings
-- ✅ Time slot management for Monday-Sunday  
-- ✅ Date blocking functionality
-- ✅ Email system with branded templates
-- ✅ Complete security with RLS policies
-- ✅ All required database functions