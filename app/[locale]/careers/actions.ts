"use server";

import { sendApplicationMail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  validateApplication,
  validateCvFile,
  type ApplicationFieldErrors,
  type ApplicationValues,
} from "@/lib/careersSchema";
import { positions } from "@/data/careers";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ApplicationFieldErrors;
  values?: ApplicationValues;
};

// Builds the HTML body for the application notification email. Every field
// here must already be HTML-escaped by the caller; this function only lays
// out markup. Uses inline styles and a table layout (not Tailwind classes or
// a <style> block), the standard approach for HTML that must render
// consistently across email clients like Outlook, which strip <style> tags
// and support only a subset of CSS.
function buildApplicationEmailHtml(fields: {
  name: string;
  email: string;
  phone: string;
  positionTitle: string;
  messageHtml: string;
}): string {
  const { name, email, phone, positionTitle, messageHtml } = fields;
  const row = (label: string, value: string) => `
            <tr>
              <td style="padding:10px 0 0;width:90px;font-size:13px;color:#56606e;vertical-align:top;font-family:Arial,Helvetica,sans-serif;">${label}</td>
              <td style="padding:10px 0 0;font-size:14px;color:#12181f;font-family:Arial,Helvetica,sans-serif;">${value}</td>
            </tr>`;

  return `<div style="background-color:#f4f7fa;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:16px;border:1px solid #dde3ea;">
    <tr>
      <td style="background-color:#0e8fa0;padding:24px 28px;border-radius:16px 16px 0 0;">
        <p style="margin:0;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;font-family:Arial,Helvetica,sans-serif;">Kids &amp; Teens Medical Group</p>
        <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">New Job Application</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#56606e;font-family:Arial,Helvetica,sans-serif;">Applying for</p>
        <p style="margin:6px 0 0;display:inline-block;background-color:#e4f5f6;color:#0b6e7c;font-size:14px;font-weight:700;padding:6px 14px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;">${positionTitle}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid #dde3ea;">${row(
          "Name",
          `<span style="font-weight:600;">${name}</span>`
        )}${row("Email", email)}${row("Phone", phone)}</table>

        <div style="margin-top:20px;padding:16px 18px;background-color:#f4f7fa;border-left:3px solid #0e8fa0;border-radius:0 10px 10px 0;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#56606e;font-family:Arial,Helvetica,sans-serif;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#12181f;font-family:Arial,Helvetica,sans-serif;">${messageHtml}</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background-color:#f4f7fa;border-top:1px solid #dde3ea;border-radius:0 0 16px 16px;">
        <p style="margin:0;font-size:12px;color:#56606e;font-family:Arial,Helvetica,sans-serif;">Submitted via the Careers page at ktdoctor.com. The applicant's CV is attached to this email.</p>
      </td>
    </tr>
  </table>
</div>`;
}

export async function sendJobApplication(
  _prev: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const raw: ApplicationValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    position: String(formData.get("position") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never fill the hidden `company` field. Drop silently
  // so bots get a success and don't retry.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const cv = formData.get("cv");
  const cvFile = cv instanceof File ? cv : null;

  const result = validateApplication(raw);
  const fieldErrors: ApplicationFieldErrors = result.success ? {} : { ...result.fieldErrors };
  const cvError = validateCvFile(cvFile);
  if (cvError) fieldErrors.cv = cvError;

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values: raw };
  }

  const d = (result as { success: true; data: ApplicationValues }).data;
  const phone = d.phone || "Not provided";
  const positionTitle = positions.find((p) => p.id === d.position)?.title || "General / other";
  const message = d.message || "Not provided";

  try {
    const buffer = Buffer.from(await (cvFile as File).arrayBuffer());
    await sendApplicationMail({
      replyTo: d.email,
      subject: `[Careers] Application: ${positionTitle}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nPosition: ${positionTitle}\n\n${message}`,
      html: buildApplicationEmailHtml({
        name: escapeHtml(d.name),
        email: escapeHtml(d.email),
        phone: escapeHtml(phone),
        positionTitle: escapeHtml(positionTitle),
        messageHtml: escapeHtml(message).replace(/\n/g, "<br>"),
      }),
      attachments: [
        {
          filename: (cvFile as File).name,
          content: buffer,
          contentType: (cvFile as File).type || undefined,
        },
      ],
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Careers application send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
