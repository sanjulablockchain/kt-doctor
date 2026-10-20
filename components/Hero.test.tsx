import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Hero } from "./Hero";
import { locations } from "@/data/locations";
import { partners } from "@/data/partners";
import { BOOKING_URL } from "@/lib/constants";

describe("Hero", () => {
  it("renders the status pills, headline, and subheading with the live clinic count", () => {
    render(<Hero />);
    expect(screen.getByText("Same-day openings today")).toBeInTheDocument();
    expect(screen.getByText("Telehealth 7 days a week")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Care built around your family.");
    expect(
      screen.getByText(new RegExp(`at ${locations.length} clinics across Greater LA`))
    ).toBeInTheDocument();
  });

  it("renders the Spanish copy", () => {
    render(<Hero />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Atención pensada para su familia.");
    expect(screen.getByRole("link", { name: /telesalud desde casa/i })).toHaveAttribute(
      "href",
      "/es/services/telehealth"
    );
  });

  it("gates the same-day pill's pulsing dot for reduced motion", () => {
    const { container } = render(<Hero />);
    const ping = container.querySelector('[class*="ktmg-ping"]');
    expect(ping?.className).toContain("motion-reduce:hidden");
  });

  it("links the telehealth CTA to the telehealth service page", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /telehealth from home/i })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });

  it("opens the booking options chooser from the primary CTA", async () => {
    render(<Hero />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /book an appointment/i }));

    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("link", { name: /book online/i })).toHaveAttribute(
      "href",
      BOOKING_URL
    );
    expect(dialog.getByRole("link", { name: /text us/i })).toBeInTheDocument();
    expect(dialog.getByRole("link", { name: /361-5437/ })).toBeInTheDocument();
  });

  it("renders the 2 navigation CTAs with correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute(
      "href",
      "/doctors"
    );
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute(
      "href",
      "/locations"
    );
  });

  it("renders all 4 stats as term/definition pairs in the bottom strip", () => {
    render(<Hero />);
    const terms = screen.getAllByRole("term").map((el) => el.textContent);
    expect(terms).toEqual([
      "Clinic locations",
      "Board-certified providers",
      "Years of pediatric care",
      "Ages served",
    ]);
  });

  it("renders every partner logo with its name as alt text", () => {
    render(<Hero />);
    expect(screen.getByText("Trusted Partners & Affiliations")).toBeInTheDocument();
    for (const partner of partners) {
      expect(screen.getByRole("img", { name: partner.name })).toBeInTheDocument();
    }
  });

  it("renders the embedded One Network panel with its social row", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  });

  it("sizes the hero to one screenful below the sticky header on large viewports", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("lg:min-h-[calc(100svh-var(--header-h,4rem))]");
    expect(section?.className).not.toContain("lg:min-h-[44rem]");
  });

  it("scales hero vertical padding with viewport height instead of a fixed lg:py-20", () => {
    const { container } = render(<Hero />);
    const content = container.querySelector("section > div.relative");
    expect(content?.className).toContain("lg:py-[clamp(0.5rem,2.5svh,2.5rem)]");
    expect(content?.className).not.toContain("lg:py-20");
  });
});
