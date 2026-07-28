"use server";

import { sendContactMail } from "@/lib/mailer";
import {
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contactSchema";
import { escapeHtml } from "@/lib/escapeHtml";
import {
  emailShell,
  emailRowTable,
  emailMessageBlock,
  mailtoLink,
  telLink,
} from "@/lib/emailTemplate";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errorCode?: string;
  fieldErrors?: ContactFieldErrors;
  values?: ContactValues;
};

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
  const phoneProvided = Boolean(d.phone);
  const phone = d.phone || "Not provided";
  const escapedPhone = escapeHtml(phone);

  try {
    await sendContactMail({
      replyTo: d.email,
      subject: `[Website Contact] ${d.subject}`,
      text: `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${phone}\nSubject: ${d.subject}\n\n${d.message}`,
      html: emailShell({
        title: "New Website Contact Message",
        bodyHtml:
          emailRowTable([
            {
              label: "Name",
              valueHtml: `<span style="font-weight:600;">${escapeHtml(d.name)}</span>`,
            },
            { label: "Email", valueHtml: mailtoLink(escapeHtml(d.email)) },
            {
              label: "Phone",
              valueHtml: phoneProvided ? telLink(escapedPhone) : escapedPhone,
            },
            { label: "Subject", valueHtml: escapeHtml(d.subject) },
          ]) +
          emailMessageBlock("Message", escapeHtml(d.message).replace(/\n/g, "<br>")),
        footerText: "Submitted via the Contact page at ktdoctor.com.",
      }),
    });
    return { status: "success" };
  } catch (error) {
    // Log server-side only; never leak transport details to the client.
    console.error("Contact form send failed:", error);
    return { status: "error", errorCode: "sendFailed", values: raw };
  }
}
