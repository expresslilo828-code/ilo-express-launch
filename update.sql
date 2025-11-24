-- =============================================
-- UPDATE ONLY: Fix enum casting for day_of_week
-- Run this in Supabase SQL editor to fix booking errors
-- =============================================

-- Drop and recreate the get_available_time_slots function with proper enum casting
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
  -- Get the day of the week (FIXED: proper enum casting)
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

-- Drop and recreate the create_booking_with_notifications function with proper enum casting
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
  -- Check if the time slot is available (FIXED: proper enum casting)
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