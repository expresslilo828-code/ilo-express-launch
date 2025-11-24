import { Resend } from 'resend';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

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
  private readonly adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@yourbusiness.com';
  private readonly fromEmail = import.meta.env.VITE_FROM_EMAIL || 'bookings@yourbusiness.com';
  private readonly companyName = import.meta.env.VITE_COMPANY_NAME || 'Your Business Name';
  private readonly logoUrl = import.meta.env.VITE_LOGO_URL || 'https://your-domain.com/logo.png';

  private replaceTemplateVariables(template: string, variables: EmailTemplateVariables): string {
    let result = template;
    
    // Replace all variables in the format {variable_name}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, value || '');
    });

    // Replace logo URL
    result = result.replace(/https:\/\/your-domain\.com\/logo\.png/g, this.logoUrl);
    result = result.replace(/Your Business Name/g, this.companyName);

    return result;
  }

  private async getEmailTemplate(templateType: string): Promise<Tables<'email_templates'> | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_type', templateType)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching email template ${templateType}:`, error);
      return null;
    }

    return data;
  }

  private async logEmail(
    bookingId: string | null,
    emailType: string,
    recipientEmail: string,
    subject: string,
    status: 'sent' | 'failed',
    errorMessage?: string,
    resendMessageId?: string
  ): Promise<void> {
    try {
      await supabase.from('email_logs').insert({
        booking_id: bookingId,
        email_type: emailType,
        recipient_email: recipientEmail,
        subject,
        status,
        error_message: errorMessage,
        resend_message_id: resendMessageId
      });
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  async sendBookingConfirmation(bookingId: string, emailData: EmailData): Promise<boolean> {
    try {
      const template = await this.getEmailTemplate('booking_confirmation');
      if (!template) {
        console.error('Booking confirmation template not found');
        return false;
      }

      const variables: EmailTemplateVariables = {
        ...emailData,
        services: Array.isArray(emailData.services) ? emailData.services.join(', ') : emailData.services
      };

      const subject = this.replaceTemplateVariables(template.subject, variables);
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables);
      const textContent = template.text_content ? this.replaceTemplateVariables(template.text_content, variables) : undefined;

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [emailData.email],
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        await this.logEmail(bookingId, 'booking_confirmation', emailData.email, subject, 'failed', error.message);
        console.error('Error sending booking confirmation:', error);
        return false;
      }

      await this.logEmail(bookingId, 'booking_confirmation', emailData.email, subject, 'sent', undefined, data?.id);
      return true;
    } catch (error) {
      console.error('Error in sendBookingConfirmation:', error);
      return false;
    }
  }

  async sendAdminNotification(bookingId: string, emailData: EmailData): Promise<boolean> {
    try {
      const template = await this.getEmailTemplate('admin_notification');
      if (!template) {
        console.error('Admin notification template not found');
        return false;
      }

      const variables: EmailTemplateVariables = {
        ...emailData,
        services: Array.isArray(emailData.services) ? emailData.services.join(', ') : emailData.services
      };

      const subject = this.replaceTemplateVariables(template.subject, variables);
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables);
      const textContent = template.text_content ? this.replaceTemplateVariables(template.text_content, variables) : undefined;

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [this.adminEmail],
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        await this.logEmail(bookingId, 'admin_notification', this.adminEmail, subject, 'failed', error.message);
        console.error('Error sending admin notification:', error);
        return false;
      }

      await this.logEmail(bookingId, 'admin_notification', this.adminEmail, subject, 'sent', undefined, data?.id);
      return true;
    } catch (error) {
      console.error('Error in sendAdminNotification:', error);
      return false;
    }
  }

  async sendReminderEmail(bookingId: string, emailData: EmailData): Promise<boolean> {
    try {
      const template = await this.getEmailTemplate('reminder_email');
      if (!template) {
        console.error('Reminder email template not found');
        return false;
      }

      const variables: EmailTemplateVariables = {
        ...emailData,
        services: Array.isArray(emailData.services) ? emailData.services.join(', ') : emailData.services
      };

      const subject = this.replaceTemplateVariables(template.subject, variables);
      const htmlContent = this.replaceTemplateVariables(template.html_content, variables);
      const textContent = template.text_content ? this.replaceTemplateVariables(template.text_content, variables) : undefined;

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to: [emailData.email],
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        await this.logEmail(bookingId, 'reminder_email', emailData.email, subject, 'failed', error.message);
        console.error('Error sending reminder email:', error);
        return false;
      }

      // Mark reminder as sent in booking
      await supabase
        .from('bookings')
        .update({ reminder_sent: true })
        .eq('id', bookingId);

      await this.logEmail(bookingId, 'reminder_email', emailData.email, subject, 'sent', undefined, data?.id);
      return true;
    } catch (error) {
      console.error('Error in sendReminderEmail:', error);
      return false;
    }
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