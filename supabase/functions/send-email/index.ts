import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
    type: 'contact' | 'booking_confirmation' | 'reminder' | 'admin_notification';
    payload: any;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const resendApiKey = Deno.env.get('VITE_RESEND_API_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'expresslilo828@gmail.com';
        const logoUrl = 'https://tojruwyvpgkdhoypqkdg.supabase.co/storage/v1/object/public/logo2/logolilo.jpg';

        if (!resendApiKey) throw new Error('RESEND_API_KEY is not set');
        if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase credentials are not set');

        const resend = new Resend(resendApiKey);
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { type, payload }: EmailPayload = await req.json();

        console.log(`Processing email request type: ${type}`);

        const getTemplate = async (templateType: string) => {
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .eq('template_type', templateType)
                .eq('is_active', true)
                .single();
            if (error) throw new Error(`Template ${templateType} not found: ${error.message}`);
            return data;
        };

        const replaceVariables = (template: string, variables: any) => {
            let result = template;
            Object.entries(variables).forEach(([key, value]) => {
                const regex = new RegExp(`{${key}}`, 'g');
                result = result.replace(regex, String(value || ''));
            });
            return result;
        };

        // Helper to wrap email content with logo
        const wrapWithLogo = (content: string) => {
            return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #321509; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #CB6209, #E68922); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #D1C5B3; border-radius: 0 0 8px 8px; }
        .info-box { background: #FDFDFB; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #CB6209; }
        .footer { text-align: center; margin-top: 30px; color: #7B4D25; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Lilo Express Logo" style="height:56px;width:auto;margin-bottom:10px;border-radius:6px;object-fit:contain;" />
          <h1 style="margin: 10px 0 0 0; font-size: 22px;">Lilo Express</h1>
          <p style="margin: 6px 0 0 0;font-size:14px;">One-Stop Application Services LLC</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p><strong>Lilo Express</strong><br/>
          One-Stop Application Services LLC<br/>
          Email: expresslilo828@gmail.com</p>
          <p>© ${new Date().getFullYear()} Lilo Express</p>
        </div>
      </div>
    </body>
    </html>`;
        };

        const logEmail = async (bookingId: string | null, emailType: string, recipient: string, subject: string, status: 'sent' | 'failed', errorMsg?: string, resendId?: string) => {
            await supabase.from('email_logs').insert({
                booking_id: bookingId,
                email_type: emailType,
                recipient_email: recipient,
                subject,
                status,
                error_message: errorMsg,
                resend_message_id: resendId
            });
        };

        if (type === 'contact') {
            const { name, email, message } = payload;

            await resend.emails.send({
                from: "Lilo Express Contact <contact@liloexpress.com>",
                to: [adminEmail],
                reply_to: email,
                subject: `New Contact: ${name}`,
                html: wrapWithLogo(`<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message}</p>`),
            });

            await resend.emails.send({
                from: "Lilo Express <noreply@liloexpress.com>",
                to: [email],
                subject: "We Received Your Message",
                html: wrapWithLogo(`<p>Dear ${name},</p><p>Thank you for contacting us. We'll respond within 24 hours.</p><p>Best regards,<br>The Lilo Express Team</p>`),
            });

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (type === 'booking_confirmation') {
            const userTemplate = await getTemplate('booking_confirmation');
            const adminTemplate = await getTemplate('admin_notification');
            const variables = {
                ...payload,
                services: Array.isArray(payload.services) ? payload.services.join(', ') : payload.services
            };

            const userSubject = replaceVariables(userTemplate.subject, variables);
            let userHtml = replaceVariables(userTemplate.html_content, variables);

            // Replace any placeholder logo URLs with the actual logo
            userHtml = userHtml.replace(/https:\/\/your-domain\.com\/logo\.png/g, logoUrl);
            userHtml = userHtml.replace(/src="[^"]*logo[^"]*"/gi, `src="${logoUrl}"`);

            const userRes = await resend.emails.send({
                from: "Lilo Express Bookings <bookings@liloexpress.com>",
                to: [payload.email],
                subject: userSubject,
                html: userHtml,
            });

            if (userRes.error) throw userRes.error;
            await logEmail(payload.booking_id, 'booking_confirmation', payload.email, userSubject, 'sent', undefined, userRes.data?.id);

            const adminSubject = replaceVariables(adminTemplate.subject, variables);
            let adminHtml = replaceVariables(adminTemplate.html_content, variables);

            // Replace any placeholder logo URLs with the actual logo
            adminHtml = adminHtml.replace(/https:\/\/your-domain\.com\/logo\.png/g, logoUrl);
            adminHtml = adminHtml.replace(/src="[^"]*logo[^"]*"/gi, `src="${logoUrl}"`);

            const adminRes = await resend.emails.send({
                from: "Lilo Express System <system@liloexpress.com>",
                to: [adminEmail],
                subject: adminSubject,
                html: adminHtml,
            });

            if (adminRes.error) console.error("Admin email failed:", adminRes.error);
            else await logEmail(payload.booking_id, 'admin_notification', adminEmail, adminSubject, 'sent', undefined, adminRes.data?.id);

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (type === 'reminder') {
            const template = await getTemplate('reminder_email');
            const variables = {
                ...payload,
                services: Array.isArray(payload.services) ? payload.services.join(', ') : payload.services
            };

            const subject = replaceVariables(template.subject, variables);
            let html = replaceVariables(template.html_content, variables);

            // Replace any placeholder logo URLs with the actual logo
            html = html.replace(/https:\/\/your-domain\.com\/logo\.png/g, logoUrl);
            html = html.replace(/src="[^"]*logo[^"]*"/gi, `src="${logoUrl}"`);

            const res = await resend.emails.send({
                from: "Lilo Express Reminders <reminders@liloexpress.com>",
                to: [payload.email],
                subject: subject,
                html: html,
            });

            if (res.error) throw res.error;

            if (payload.booking_id) {
                await supabase
                    .from('bookings')
                    .update({ reminder_sent: true })
                    .eq('id', payload.booking_id);
            }

            await logEmail(payload.booking_id, 'reminder_email', payload.email, subject, 'sent', undefined, res.data?.id);

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        throw new Error(`Unknown email type: ${type}`);

    } catch (error: any) {
        console.error('Error in send-email function:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
