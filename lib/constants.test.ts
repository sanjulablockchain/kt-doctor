import { describe, it, expect } from "vitest";
import {
  BOOKING_URL,
  PAY_ONLINE_URL,
  PATIENT_PORTAL_URL,
  MAIN_PHONE,
  TEXT_PHONE,
  GENERAL_EMAIL,
} from "./constants";

describe("constants", () => {
  it("booking URL points to the real Healow practice page", () => {
    expect(BOOKING_URL).toBe(
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("pay online URL points to healowpay.com", () => {
    expect(PAY_ONLINE_URL).toBe("https://healowpay.com");
  });

  it("patient portal URL points to the eClinicalWorks portal", () => {
    expect(PATIENT_PORTAL_URL).toBe(
      "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp"
    );
  });

  it("has the main phone, text phone, and general email", () => {
    expect(MAIN_PHONE).toBe("(818) 361-5437");
    expect(TEXT_PHONE).toBe("(626) 298-7121");
    expect(GENERAL_EMAIL).toBe("customerservice@ktdoctor.com");
  });
});
