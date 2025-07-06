
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipientEmail: string;
  attachmentPath?: string;
  attachmentFileName?: string;
}

const sendEmailViaResend = async (emailData: {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachment?: { filename: string; content: Uint8Array };
}) => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  console.log("Sending email via Resend API");

  const resend = new Resend(resendApiKey);

  try {
    const emailPayload: any = {
      from: emailData.from,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    };

    // Add attachment if exists - with better error handling
    if (emailData.attachment) {
      try {
        console.log(`Converting attachment to base64: ${emailData.attachment.filename}`);

        // Check if content is valid
        if (!emailData.attachment.content || emailData.attachment.content.length === 0) {
          console.warn("Attachment content is empty, skipping attachment");
        } else {
          // Convert Uint8Array to base64 more safely
          const base64Content = btoa(
            Array.from(emailData.attachment.content)
              .map(byte => String.fromCharCode(byte))
              .join('')
          );

          emailPayload.attachments = [
            {
              filename: emailData.attachment.filename,
              content: base64Content,
            },
          ];
          console.log(`Attachment added: ${emailData.attachment.filename} (${emailData.attachment.content.length} bytes)`);
        }
      } catch (attachmentError) {
        console.error("Error processing attachment:", attachmentError);
        // Continue without attachment rather than failing completely
      }
    }

    console.log("Sending request to Resend API...");
    const response = await resend.emails.send(emailPayload);

    console.log("Email sent successfully via Resend API:", response);
    return { success: true, messageId: response.id };

  } catch (error: any) {
    console.error("Resend API Error:", error);
    throw new Error(`Resend API Error: ${error.message}`);
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Add timeout to prevent infinite loops
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 seconds
    });

    const processRequest = async () => {
      const { name, email, subject, message, recipientEmail, attachmentPath, attachmentFileName }: ContactFormPayload = await req.json();

      console.log("Processing contact form submission:", { name, email, subject, recipientEmail });

      // Validate required fields
      if (!name || !email || !subject || !message) {
        throw new Error("Missing required fields: name, email, subject, or message");
      }

      if (!recipientEmail) {
        throw new Error("Recipient email is not configured.");
      }

      return { name, email, subject, message, recipientEmail, attachmentPath, attachmentFileName };
    };

    const { name, email, subject, message, recipientEmail, attachmentPath, attachmentFileName } = await Promise.race([
      processRequest(),
      timeoutPromise
    ]) as ContactFormPayload;

    // Prepare attachment if exists
    let attachment;
    if (attachmentPath && attachmentFileName) {
      try {
        console.log("Downloading attachment:", attachmentPath);
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('contact_attachments')
          .download(attachmentPath);

        if (downloadError) {
          console.error('Error downloading attachment from Supabase Storage:', downloadError);
          // Continue without attachment rather than failing
        } else if (fileData) {
          const arrayBuffer = await fileData.arrayBuffer();
          attachment = {
            filename: attachmentFileName,
            content: new Uint8Array(arrayBuffer),
          };
          console.log("Attachment prepared successfully");
        }
      } catch (attachmentError) {
        console.error('Error processing attachment:', attachmentError);
        // Continue without attachment rather than failing
      }
    }

    const emailData = {
      from: "CYHOMS <noreply@cyhoms.com>", // Use your verified domain
      to: recipientEmail,
      subject: `رسالة جديدة من نموذج التواصل: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; direction: rtl; text-align: right;">
          <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">رسالة جديدة من موقع CYHOMS</h1>
          <p style="font-size: 16px; margin-bottom: 20px;">تم استلام رسالة جديدة من نموذج التواصل على الموقع:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">تفاصيل المرسل:</h2>
            <p><strong>الاسم:</strong> ${name}</p>
            <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${email}" style="color: #3498db;">${email}</a></p>
            <p><strong>الموضوع:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e1e8ed; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2c3e50; margin-top: 0;">نص الرسالة:</h2>
            <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.8;">${message}</div>
          </div>
          
          ${attachment ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0;"><strong>📎 مرفق:</strong> ${attachmentFileName}</p>
          </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #e1e8ed; margin: 30px 0;">
          <p style="font-size: 12px; color: #6c757d; text-align: center;">
            تم إرسال هذا البريد الإلكتروني تلقائياً من نموذج التواصل على موقع CYHOMS<br>
            للرد على الرسالة، يرجى الرد مباشرة على هذا البريد أو إرسال رسالة إلى: ${email}
          </p>
        </div>
      `,
      attachment,
    };

    const result = await sendEmailViaResend(emailData);
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);

    // Determine appropriate error message and status code
    let errorMessage = "An unexpected error occurred while sending the email.";
    let statusCode = 500;

    if (error.message.includes("timeout")) {
      errorMessage = "Request timeout. Please try again.";
      statusCode = 408;
    } else if (error.message.includes("RESEND_API_KEY")) {
      errorMessage = "Email service configuration error.";
      statusCode = 503;
    } else if (error.message.includes("Missing required fields")) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes("Recipient email")) {
      errorMessage = "Email service not configured properly.";
      statusCode = 503;
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error.message // Include original error for debugging
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
