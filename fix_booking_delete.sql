-- Fix foreign key constraint to allow booking deletion
-- This adds CASCADE delete so that email logs are automatically deleted when a booking is deleted

-- First, drop the existing foreign key constraint
ALTER TABLE public.email_logs 
DROP CONSTRAINT IF EXISTS email_logs_booking_id_fkey;

-- Recreate the constraint with ON DELETE CASCADE
ALTER TABLE public.email_logs 
ADD CONSTRAINT email_logs_booking_id_fkey 
FOREIGN KEY (booking_id) 
REFERENCES public.bookings(id) 
ON DELETE CASCADE;

-- Verify the constraint was created
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table,
  confdeltype AS delete_action
FROM pg_constraint
WHERE conname = 'email_logs_booking_id_fkey';
