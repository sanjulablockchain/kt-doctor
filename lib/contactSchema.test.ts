import { describe, it, expect } from "vitest";
import { validateContact, type ContactValues } from "./contactSchema";

const VALID: ContactValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  subject: "Appointment inquiry",
  message: "Hello, I'd like to book a visit.",
};

describe("validateContact", () => {
  it("accepts valid input and returns trimmed data", () => {
    const result = validateContact({ ...VALID, name: "  Jane Doe  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jane Doe");
      expect(result.data.email).toBe("jane@example.com");
    }
  });

  it("flags each required field that is empty", () => {
    const result = validateContact({ name: "", email: "", phone: "", subject: "", message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toMatchObject({
        name: "nameRequired",
        email: "emailRequired",
        subject: "subjectRequired",
        message: "messageRequired",
      });
      // Phone is optional, so an empty phone is not an error.
      expect(result.fieldErrors.phone).toBeUndefined();
    }
  });

  it("flags an invalid email address", () => {
    const result = validateContact({ ...VALID, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.email).toBe("emailInvalid");
  });

  it("reports the required error (not the format error) for an empty email", () => {
    const result = validateContact({ ...VALID, email: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.email).toBe("emailRequired");
  });
});
