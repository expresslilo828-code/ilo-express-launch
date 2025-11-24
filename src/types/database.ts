export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  short_description: string | null;
  price: number | null;
  duration_hours: number | null;
  features: string[] | null;
  is_active: boolean;
  icon: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Testimonial {
  id: string;
  client_name: string;
  business_name: string | null;
  rating: number;
  testimonial: string;
  is_featured: boolean;
  is_approved: boolean;
}

export interface Booking {
  id: string;
  service_id: string | null;
  full_name: string;
  business_name: string | null;
  email: string;
  phone: string;
  contact_method: string | null;
  state: string | null;
  city: string | null;
  preferred_date: string;
  preferred_time: string;
  duration_minutes: number | null;
  services_requested: string[] | null;
  notes: string | null;
  how_heard: string | null;
  file_urls: string[] | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  reminder_sent: boolean | null;
  created_at: string;
  updated_at: string | null;
}

export interface AdminTimeSlot {
  id: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  slot_duration_minutes: number | null;
  is_available: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_by: string | null;
  created_at: string | null;
}

export interface EmailTemplate {
  id: string;
  template_type: string;
  subject: string;
  html_content: string;
  text_content: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmailLog {
  id: string;
  booking_id: string | null;
  email_type: string;
  recipient_email: string;
  subject: string | null;
  sent_at: string | null;
  status: string | null;
  error_message: string | null;
  resend_message_id: string | null;
}

// Helper types for time slots
export interface AvailableTimeSlot {
  time_slot: string;
  is_available: boolean;
}
