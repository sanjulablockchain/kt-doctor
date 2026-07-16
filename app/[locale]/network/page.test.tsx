import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import NetworkPage from "./page";

describe("NetworkPage", () => {
  it("renders all 4 brands with their real names", () => {
    render(<NetworkPage />);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    expect(screen.getByText("St. Gianna Medical Group")).toBeInTheDocument();
    expect(screen.getByText("LA Intensive Pediatric Therapy")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
  });

  it("renders external links for the three sub-brands", () => {
    render(<NetworkPage />);
    const externalLinks = screen.getAllByRole("link", { name: /visit site/i });
    expect(externalLinks).toHaveLength(3);
    expect(externalLinks.map((l) => l.getAttribute("href")).sort()).toEqual(
      ["https://www.laipt.org", "https://www.sgmdoctor.com", "https://www.sjhospital.lk"].sort()
    );
  });
});
