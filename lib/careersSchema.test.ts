import { describe, it, expect } from "vitest";
import {
  validateApplication,
  validateCvFile,
  CV_MAX_BYTES,
  type ApplicationValues,
} from "./careersSchema";

const VALID: ApplicationValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(555) 123-4567",
  position: "pediatrician",
  message: "I would love to join the team.",
};

describe("validateApplication", () => {
  it("accepts valid input and trims", () => {
    const result = validateApplication({ ...VALID, name: "  Jane Doe  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Jane Doe");
  });

  it("requires name and email but not phone/position/message", () => {
    const result = validateApplication({ name: "", email: "", phone: "", position: "", message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors).toMatchObject({ name: "nameRequired", email: "emailRequired" });
      expect(result.fieldErrors.phone).toBeUndefined();
      expect(result.fieldErrors.position).toBeUndefined();
      expect(result.fieldErrors.message).toBeUndefined();
    }
  });

  it("flags an invalid email", () => {
    const result = validateApplication({ ...VALID, email: "nope" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.email).toBe("emailInvalid");
  });
});

describe("validateCvFile", () => {
  it("requires a file", () => {
    expect(validateCvFile(null)).toBe("cvRequired");
    expect(validateCvFile({ name: "cv.pdf", size: 0, type: "application/pdf" })).toBe("cvRequired");
  });

  it("rejects files over the size limit", () => {
    expect(validateCvFile({ name: "cv.pdf", size: CV_MAX_BYTES + 1, type: "application/pdf" })).toBe(
      "cvTooLarge"
    );
  });

  it("rejects disallowed extensions", () => {
    expect(validateCvFile({ name: "cv.exe", size: 100, type: "application/octet-stream" })).toBe("cvType");
    expect(validateCvFile({ name: "photo.png", size: 100, type: "image/png" })).toBe("cvType");
  });

  it("accepts pdf/doc/docx within the limit", () => {
    expect(validateCvFile({ name: "cv.pdf", size: 100, type: "application/pdf" })).toBeNull();
    expect(validateCvFile({ name: "cv.doc", size: 100, type: "application/msword" })).toBeNull();
    expect(validateCvFile({ name: "resume.DOCX", size: 100, type: "" })).toBeNull();
  });
});
