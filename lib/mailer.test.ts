import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

const ENV = {
  SMTP_HOST: "smtp.office365.com",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "box@ktdoctor.com",
  SMTP_PASS: "secret",
  CONTACT_TO: "to@ktdoctor.com",
  CONTACT_FROM: "from@ktdoctor.com",
  CAREERS_TO: "careers-inbox@ktdoctor.com",
};

beforeEach(() => {
  sendMailMock.mockReset();
  createTransportMock.mockClear();
  for (const [k, v] of Object.entries(ENV)) process.env[k] = v;
});

afterEach(() => {
  for (const k of Object.keys(ENV)) delete process.env[k];
});

describe("sendContactMail", () => {
  it("builds an SMTP transport from env and sends with configured to/from", async () => {
    const { sendContactMail } = await import("./mailer");
    await sendContactMail({
      replyTo: "visitor@example.com",
      subject: "[Website Contact] Hi",
      text: "hello",
      html: "<p>hello</p>",
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: { user: "box@ktdoctor.com", pass: "secret" },
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: "from@ktdoctor.com",
      to: "to@ktdoctor.com",
      replyTo: "visitor@example.com",
      subject: "[Website Contact] Hi",
      text: "hello",
      html: "<p>hello</p>",
    });
  });

  it("throws a clear error when a required env var is missing", async () => {
    delete process.env.SMTP_PASS;
    const { sendContactMail } = await import("./mailer");
    await expect(
      sendContactMail({ replyTo: "v@e.com", subject: "s", text: "t", html: "<p>t</p>" })
    ).rejects.toThrow("Missing required env var: SMTP_PASS");
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});

describe("sendApplicationMail", () => {
  it("sends to CAREERS_TO with attachments passed through", async () => {
    const { sendApplicationMail } = await import("./mailer");
    const content = Buffer.from("PDF-BYTES");
    await sendApplicationMail({
      replyTo: "applicant@example.com",
      subject: "[Careers] Application: Pediatrician (MD/DO)",
      text: "application",
      html: "<p>application</p>",
      attachments: [{ filename: "cv.pdf", content, contentType: "application/pdf" }],
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: "from@ktdoctor.com",
      to: "careers-inbox@ktdoctor.com",
      replyTo: "applicant@example.com",
      subject: "[Careers] Application: Pediatrician (MD/DO)",
      text: "application",
      html: "<p>application</p>",
      attachments: [{ filename: "cv.pdf", content, contentType: "application/pdf" }],
    });
  });
});
