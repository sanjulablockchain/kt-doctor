import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import PrivacyPolicyPage from "./page";

describe("PrivacyPolicyPage", () => {
  it("renders the privacy policy heading", () => {
    renderWithIntl(<PrivacyPolicyPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" })
    ).toBeInTheDocument();
  });
});
