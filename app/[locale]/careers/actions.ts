"use server";

import { sendApplicationMail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  emailShell,
  emailRowTable,
  emailBadge,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "@/lib/emailTemplate";
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

// Builds the HTML body for the application notification email from the shared
// lib/emailTemplate.ts building blocks. Every field here must already be
// HTML-escaped by the caller.
function buildApplicationEmailHtml(fields: {
  name: string;
  email: string;
  phone: string;
  phoneProvided: boolean;
  positionTitle: string;
  messageHtml: string;
}): string {
  const { name, email, phone, phoneProvided, positionTitle, messageHtml } = fields;

  return emailShell({
    title: "New Job Application",
    bodyHtml:
      emailBadge("Applying for", positionTitle) +
      emailRowTable([
        { label: "Name", valueHtml: `<span style="font-weight:600;">${name}</span>` },
        { label: "Email", valueHtml: mailtoLink(email) },
        { label: "Phone", valueHtml: phoneProvided ? telLink(phone) : phone },
      ]) +
      emailMessageBlock("Message", messageHtml),
    footerText:
      "Submitted via the Careers page at ktdoctor.com. The applicant's CV is attached to this email.",
  });
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
  const phoneProvided = Boolean(d.phone);
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
        phoneProvided,
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
