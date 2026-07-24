import { z } from "zod";

// Single source of truth for contact-form validation, shared by the server
// action (authoritative / safety net) and the client form (instant feedback),
// so both enforce identical rules. Error strings are i18n sub-keys under
// `Contact.errors`; the UI renders them with t(`errors.${code}`). Keep them in
// sync with messages/*.json.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "subject" | "message", string>
>;

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }).max(100, { message: "tooLong" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" })
    .max(200, { message: "tooLong" })
    .regex(EMAIL_RE, { message: "emailInvalid" }),
  phone: z.string().trim().max(40, { message: "tooLong" }),
  subject: z.string().trim().min(1, { message: "subjectRequired" }).max(150, { message: "tooLong" }),
  message: z.string().trim().min(1, { message: "messageRequired" }).max(5000, { message: "tooLong" }),
});

export type ContactData = z.infer<typeof contactSchema>;

// Validates raw form values, returning at most one error code per field (the
// first issue), matching how the UI renders a single message per field.
export function validateContact(
  raw: ContactValues
):
  | { success: true; data: ContactData }
  | { success: false; fieldErrors: ContactFieldErrors } {
  const parsed = contactSchema.safeParse(raw);
  if (parsed.success) {
    return { success: true, data: parsed.data };
  }
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof ContactFieldErrors | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}
