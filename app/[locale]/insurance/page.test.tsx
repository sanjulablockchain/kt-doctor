import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InsurancePage from "./page";

describe("InsurancePage", () => {
  it("renders the general accepted insurance categories", () => {
    render(<InsurancePage />);
    expect(screen.getByText("HMO")).toBeInTheDocument();
    expect(screen.getByText("PPO")).toBeInTheDocument();
    expect(screen.getByText("Medi-Cal")).toBeInTheDocument();
  });

  it("renders a link to the real Serendib Healthways site", () => {
    render(<InsurancePage />);
    const link = screen.getByRole("link", { name: /serendib healthways/i });
    expect(link).toHaveAttribute("href", "https://www.serendibhealthways.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders a call-to-verify link using the real main phone number", () => {
    render(<InsurancePage />);
    const link = screen.getByRole("link", { name: /call.*verify/i });
    expect(link).toHaveAttribute("href", "tel:+18183615437");
  });
});
