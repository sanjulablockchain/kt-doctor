import nodemailer from "nodemailer";

export type ContactMail = {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type ApplicationMail = ContactMail & {
  attachments?: MailAttachment[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Builds the SMTP transport and resolves the `from` sender. All routing is
// env-driven so the mailbox can change with no code edit. On Microsoft 365 `from`
// must be the authenticated mailbox, so the visitor/applicant address is carried
// in `replyTo` instead. Each send function reads its own recipient env var
// (`CONTACT_TO` vs `CAREERS_TO`) so contact and careers can land in different
// inboxes over the same transport.
function buildTransport(): { transport: nodemailer.Transporter; from: string } {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const from = requireEnv("CONTACT_FROM");
  const secure = process.env.SMTP_SECURE === "true";

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return { transport, from };
}

// Sends a contact-form message to the configured inbox over SMTP.
export async function sendContactMail(mail: ContactMail): Promise<void> {
  const { transport, from } = buildTransport();
  const to = requireEnv("CONTACT_TO");
  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}

// Sends a job application to the careers mailbox, attaching the applicant's CV.
export async function sendApplicationMail(mail: ApplicationMail): Promise<void> {
  const { transport, from } = buildTransport();
  const to = requireEnv("CAREERS_TO");
  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    attachments: mail.attachments,
  });
}
