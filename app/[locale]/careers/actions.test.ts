import { describe, it, expect, vi, beforeEach } from "vitest";

const sendApplicationMailMock = vi.fn();
vi.mock("@/lib/mailer", () => ({
  sendApplicationMail: (...args: unknown[]) => sendApplicationMailMock(...args),
}));

import { sendJobApplication, type ApplicationFormState } from "./actions";

const IDLE: ApplicationFormState = { status: "idle" };

function pdf(name = "cv.pdf", bytes = "PDF-BYTES"): File {
  return new File([bytes], name, { type: "application/pdf" });
}

function fd(fields: Record<string, string>, file: File | null = pdf()): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  if (file) form.append("cv", file);
  return form;
}

const VALID = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  position: "pediatrician",
  message: "Excited to apply.",
  company: "", // honeypot empty
};

beforeEach(() => sendApplicationMailMock.mockReset());

describe("sendJobApplication", () => {
  it("drops spam silently when the honeypot is filled", async () => {
    const state = await sendJobApplication(IDLE, fd({ ...VALID, company: "bot" }));
    expect(state.status).toBe("success");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("returns field errors and does not send when required fields are missing", async () => {
    const state = await sendJobApplication(
      IDLE,
      fd({ name: "", email: "", phone: "", position: "", message: "", company: "" })
    );
    expect(state.status).toBe("error");
    expect(state.fieldErrors).toMatchObject({ name: "nameRequired", email: "emailRequired" });
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("flags an invalid email", async () => {
    const state = await sendJobApplication(IDLE, fd({ ...VALID, email: "nope" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBe("emailInvalid");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("requires a CV", async () => {
    const state = await sendJobApplication(IDLE, fd(VALID, null));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.cv).toBe("cvRequired");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("rejects a CV that is too large", async () => {
    const big = pdf();
    Object.defineProperty(big, "size", { value: 6 * 1024 * 1024 });
    const state = await sendJobApplication(IDLE, fd(VALID, big));
    expect(state.fieldErrors?.cv).toBe("cvTooLarge");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("rejects a non-document file type", async () => {
    const png = new File(["x"], "photo.png", { type: "image/png" });
    const state = await sendJobApplication(IDLE, fd(VALID, png));
    expect(state.fieldErrors?.cv).toBe("cvType");
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("sends a well-formed mail with the CV attached on valid input", async () => {
    sendApplicationMailMock.mockResolvedValueOnce(undefined);
    const state = await sendJobApplication(IDLE, fd(VALID));
    expect(state.status).toBe("success");
    const arg = sendApplicationMailMock.mock.calls[0][0];
    expect(arg.replyTo).toBe("jane@example.com");
    expect(arg.subject).toBe("[Careers] Application: Pediatrician (MD/DO)");
    expect(arg.text).toContain("Jane Doe");
    expect(arg.attachments[0].filename).toBe("cv.pdf");
    expect(Buffer.isBuffer(arg.attachments[0].content)).toBe(true);
  });

  it("escapes HTML in the applicant fields", async () => {
    sendApplicationMailMock.mockResolvedValueOnce(undefined);
    await sendJobApplication(IDLE, fd({ ...VALID, name: "<script>alert(1)</script>" }));
    const arg = sendApplicationMailMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
  });

  it("returns sendFailed and preserves values when the mailer throws", async () => {
    sendApplicationMailMock.mockRejectedValueOnce(new Error("smtp down"));
    const state = await sendJobApplication(IDLE, fd(VALID));
    expect(state.status).toBe("error");
    expect(state.errorCode).toBe("sendFailed");
    expect(state.values?.name).toBe("Jane Doe");
  });
});
