import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import SmsPrivacyPolicyPage from "./page";

describe("SmsPrivacyPolicyPage", () => {
  it("renders the SMS privacy policy heading", () => {
    renderWithIntl(<SmsPrivacyPolicyPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "SMS Privacy Policy" })
    ).toBeInTheDocument();
  });
});
