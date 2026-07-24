import { describe, it, expect, vi, beforeEach } from "vitest";

const sendContactMailMock = vi.fn();
vi.mock("@/lib/mailer", () => ({
  sendContactMail: (...args: unknown[]) => sendContactMailMock(...args),
}));

import { sendContactMessage, type ContactFormState } from "./actions";

const IDLE: ContactFormState = { status: "idle" };

function fd(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  return form;
}

const VALID = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  subject: "Appointment inquiry",
  message: "Hello, I'd like to book a visit.",
  company: "", // honeypot empty
};

beforeEach(() => sendContactMailMock.mockReset());

describe("sendContactMessage", () => {
  it("drops spam silently when the honeypot is filled", async () => {
    const state = await sendContactMessage(IDLE, fd({ ...VALID, company: "bot" }));
    expect(state.status).toBe("success");
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send when required fields are missing", async () => {
    const state = await sendContactMessage(
      IDLE,
      fd({ name: "", email: "", phone: "", subject: "", message: "", company: "" })
    );
    expect(state.status).toBe("error");
    expect(state.fieldErrors).toMatchObject({
      name: "nameRequired",
      email: "emailRequired",
      subject: "subjectRequired",
      message: "messageRequired",
    });
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("flags an invalid email address", async () => {
    const state = await sendContactMessage(IDLE, fd({ ...VALID, email: "not-an-email" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBe("emailInvalid");
    expect(sendContactMailMock).not.toHaveBeenCalled();
  });

  it("sends a well-formed mail on valid input and reports success", async () => {
    sendContactMailMock.mockResolvedValueOnce(undefined);
    const state = await sendContactMessage(IDLE, fd(VALID));
    expect(state.status).toBe("success");
    expect(sendContactMailMock).toHaveBeenCalledTimes(1);
    const arg = sendContactMailMock.mock.calls[0][0];
    expect(arg.replyTo).toBe("jane@example.com");
    expect(arg.subject).toBe("[Website Contact] Appointment inquiry");
    expect(arg.text).toContain("Jane Doe");
    expect(arg.text).toContain("Hello, I'd like to book a visit.");
    expect(arg.html).toContain("Jane Doe");
  });

  it("escapes HTML in the message body", async () => {
    sendContactMailMock.mockResolvedValueOnce(undefined);
    await sendContactMessage(IDLE, fd({ ...VALID, message: "<script>alert(1)</script>" }));
    const arg = sendContactMailMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
  });

  it("returns a sendFailed error and preserves values when the mailer throws", async () => {
    sendContactMailMock.mockRejectedValueOnce(new Error("smtp down"));
    const state = await sendContactMessage(IDLE, fd(VALID));
    expect(state.status).toBe("error");
    expect(state.errorCode).toBe("sendFailed");
    expect(state.values?.name).toBe("Jane Doe");
  });
});
