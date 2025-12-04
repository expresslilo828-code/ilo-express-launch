import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface EmailData {
  full_name: string;
  business_name?: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  services: string;
  notes?: string;
}

export interface EmailTemplateVariables extends EmailData {
  [key: string]: string | undefined;
}

class EmailService {
  private async invokeEdgeFunction(type: string, payload: any): Promise<{ success: boolean; error?: any }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { type, payload }
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error invoking send-email for ${type}:`, error);
      return { success: false, error };
    }
  }

  async sendContactForm(name: string, email: string, message: string): Promise<boolean> {
    const { success } = await this.invokeEdgeFunction('contact', { name, email, message });
    return success;
  }

  async sendBookingConfirmation(bookingId: string, emailData: EmailData): Promise<boolean> {
    const { success } = await this.invokeEdgeFunction('booking_confirmation', {
      ...emailData,
      booking_id: bookingId
    });
    return success;
  }

  async sendAdminNotification(bookingId: string, emailData: EmailData): Promise<boolean> {
    // Admin notification is now handled automatically by the backend when booking_confirmation is sent
    // This method is kept for compatibility but might not be needed if the backend handles both
    // However, if the frontend calls them separately, we can keep this as a no-op or specific trigger
    // For now, let's assume the backend 'booking_confirmation' handles BOTH user and admin emails as requested.
    console.log("Admin notification is handled by booking_confirmation workflow.");
    return true;
  }

  async sendReminderEmail(bookingId: string, emailData: EmailData): Promise<boolean> {
    const { success } = await this.invokeEdgeFunction('reminder', {
      ...emailData,
      booking_id: bookingId
    });
    return success;
  }

  async sendBulkReminders(bookingIds: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const bookingId of bookingIds) {
      try {
        const { data: booking } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (booking) {
          const emailData: EmailData = {
            full_name: booking.full_name,
            business_name: booking.business_name || undefined,
            email: booking.email,
            phone: booking.phone,
            preferred_date: booking.preferred_date,
            preferred_time: booking.preferred_time,
            services: Array.isArray(booking.services_requested)
              ? (booking.services_requested as string[]).join(', ')
              : 'Service details',
            notes: booking.notes || undefined
          };

          const sent = await this.sendReminderEmail(bookingId, emailData);
          if (sent) {
            success++;
          } else {
            failed++;
          }
        }
      } catch (error) {
        console.error(`Error sending reminder for booking ${bookingId}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}

export const emailService = new EmailService();