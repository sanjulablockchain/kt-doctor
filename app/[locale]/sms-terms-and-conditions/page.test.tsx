import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import SmsTermsAndConditionsPage from "./page";

describe("SmsTermsAndConditionsPage", () => {
  it("renders the SMS terms and conditions heading", () => {
    renderWithIntl(<SmsTermsAndConditionsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "SMS Terms and Conditions" })
    ).toBeInTheDocument();
  });
});
