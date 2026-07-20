import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/lib/test-utils";
import TermsAndConditionsPage from "./page";

describe("TermsAndConditionsPage", () => {
  it("renders the terms and conditions heading", () => {
    renderWithIntl(<TermsAndConditionsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms and Conditions" })
    ).toBeInTheDocument();
  });
});
