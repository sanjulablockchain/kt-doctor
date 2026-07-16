import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the practice name as the main heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /kids & teens pediatric medical group/i })
    ).toBeInTheDocument();
  });

  it("renders a Book an Appointment link to the real booking URL", () => {
    render(<AboutPage />);
    const link = screen.getByRole("link", { name: /book an appointment/i });
    expect(link).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("renders a Find a Clinic link to /locations", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("mentions the real number of clinic locations", () => {
    render(<AboutPage />);
    expect(screen.getByText(new RegExp(`${locations.length} locations`, "i"))).toBeInTheDocument();
  });

  it("renders every accepted insurance category", () => {
    render(<AboutPage />);
    for (const category of insuranceInfo.acceptedCategories) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });
});
