import { z } from "zod";
import { EMAIL_RE } from "./contactSchema";

// Application-form validation shared by the client form (instant feedback) and
// the server action (authoritative). Error strings are i18n sub-keys under
// `Careers.errors`; the UI renders them with t(`errors.${code}`). Keep in sync
// with messages/*.json.
export type ApplicationFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "position" | "message" | "cv", string>
>;

export type ApplicationValues = {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
};

export const applicationSchema = z.object({
  name: z.string().trim().min(1, { message: "nameRequired" }).max(100, { message: "tooLong" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" })
    .max(200, { message: "tooLong" })
    .regex(EMAIL_RE, { message: "emailInvalid" }),
  phone: z.string().trim().max(40, { message: "tooLong" }),
  position: z.string().trim().max(100, { message: "tooLong" }),
  message: z.string().trim().max(2000, { message: "tooLong" }),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export function validateApplication(
  raw: ApplicationValues
):
  | { success: true; data: ApplicationData }
  | { success: false; fieldErrors: ApplicationFieldErrors } {
  const parsed = applicationSchema.safeParse(raw);
  if (parsed.success) return { success: true, data: parsed.data };
  const fieldErrors: ApplicationFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof ApplicationFieldErrors | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const CV_ACCEPT = ".pdf,.doc,.docx";
export const CV_ALLOWED_EXT = ["pdf", "doc", "docx"];

// Validates the uploaded CV by size and extension. Typed to the minimal shape it
// reads so both the browser `File` and tests satisfy it. MIME is not trusted
// (often empty or spoofed); the extension is the gate.
export function validateCvFile(
  file: { name: string; size: number; type: string } | null
): string | null {
  if (!file || file.size === 0) return "cvRequired";
  if (file.size > CV_MAX_BYTES) return "cvTooLarge";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!CV_ALLOWED_EXT.includes(ext)) return "cvType";
  return null;
}
