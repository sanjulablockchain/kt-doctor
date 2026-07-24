"use server";

import { sendContactMail } from "@/lib/mailer";
import {
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contactSchema";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ContactFieldErrors;
  values?: ContactValues;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never fill the hidden `company` field. Drop silently
  // so bots get a success and don't retry.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const result = validateContact(raw);
  if (!result.success) {
    return { status: "error", fieldErrors: result.fieldErrors, values: raw };
  }

  const d = result.data;
  const phone = d.phone || "Not provided";
  try {
    await sendContactMail({
      replyTo: d.email,
      subject: `[Website Contact] ${d.subject}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nSubject: ${d.subject}\n\n${d.message}`,
      html: `<h2>New website contact message</h2>
<p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
<p><strong>Subject:</strong> ${escapeHtml(d.subject)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(d.message).replace(/\n/g, "<br>")}</p>`,
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Contact form send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
