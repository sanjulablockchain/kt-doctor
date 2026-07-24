import nodemailer from "nodemailer";

export type ContactMail = {
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

// Sends a contact-form message to the configured inbox over SMTP. All routing
// is env-driven so the sending mailbox and recipient can change with no code
// edit. On Microsoft 365 `from` must be the authenticated mailbox, so the
// visitor's address is carried in `replyTo` instead.
export async function sendContactMail(mail: ContactMail): Promise<void> {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const to = requireEnv("CONTACT_TO");
  const from = requireEnv("CONTACT_FROM");
  const secure = process.env.SMTP_SECURE === "true";

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transport.sendMail({
    from,
    to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}
