import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersPageContent } from "./CareersPageContent";
import { positions } from "@/data/careers";
import { locations } from "@/data/locations";
import { doctors } from "@/data/doctors";

vi.mock("@/components/LocationsMapLeaflet", () => ({
  LocationsMapLeaflet: ({ locations }: { locations: Array<{ id: string }> }) => (
    <div data-testid="leaflet-map">
      {locations.map((loc) => (
        <span key={loc.id}>{loc.id}</span>
      ))}
    </div>
  ),
}));

describe("CareersPageContent", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView; Apply click calls it.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders the English hero heading", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Build Your Career at Kids & Teens"
    );
  });

  it("renders the Spanish hero heading when locale is es", () => {
    render(<CareersPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Desarrolle su carrera en Kids & Teens"
    );
  });

  it("lists every open position by default", () => {
    render(<CareersPageContent />);
    for (const p of positions) {
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
    }
  });

  it("filters positions by department", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    await user.click(screen.getByRole("button", { name: /filter by department/i }));
    await user.click(screen.getByRole("option", { name: "Finance" }));
    // Billing Specialist is Finance; Pediatrician is Clinical.
    expect(screen.getByRole("heading", { name: "Billing Specialist" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pediatrician (MD/DO)" })).not.toBeInTheDocument();
  });

  it("pre-selects the position in the form when a role's Apply is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen.getByRole("heading", { name: "Pediatrician (MD/DO)" }).closest("article")!;
    await user.click(within(card).getByRole("button", { name: /apply/i }));
    expect(screen.getByRole("button", { name: /position/i })).toHaveTextContent("Pediatrician (MD/DO)");
  });

  it("keeps the anti-scam postings notice", () => {
    render(<CareersPageContent />);
    // Match text unique to the standalone notice banner, since the FAQ's
    // "genuine-postings" answer (Task 9) also opens with similar phrasing.
    expect(
      screen.getByText(/be cautious of postings claiming to represent/i)
    ).toBeInTheDocument();
  });

  it("renders Why Choose Us and Values as separate sections", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Why Choose Us" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "More than a Workplace" })).toBeInTheDocument();
    expect(screen.getByText("Compassion")).toBeInTheDocument();
    expect(
      screen.getByText(/every family's plan of care is built around their child/i)
    ).toBeInTheDocument();
  });

  it("renders the LA Network section with real, non-hardcoded stats", () => {
    render(<CareersPageContent />);
    expect(
      screen.getByRole("heading", { name: "Join the Largest Pediatric Network in LA" })
    ).toBeInTheDocument();
    expect(screen.getByText(String(locations.length))).toBeInTheDocument();
    expect(screen.getByText(`${doctors.length}+`)).toBeInTheDocument();
  });

  it("opens a details modal with responsibilities and requirements when a position's details link is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const pediatrician = positions.find((p) => p.id === "pediatrician")!;
    const card = screen.getByRole("heading", { name: pediatrician.title }).closest("article")!;
    await user.click(within(card).getByRole("button", { name: /view details/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(pediatrician.description)).toBeInTheDocument();
    expect(screen.getByText(pediatrician.responsibilities[0])).toBeInTheDocument();
    expect(screen.getByText(pediatrician.requirements[0])).toBeInTheDocument();
  });

  it("closes the details modal when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen
      .getByRole("heading", { name: "Pediatrician (MD/DO)" })
      .closest("article")!;
    await user.click(within(card).getByRole("button", { name: /view details/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("pre-selects the position and closes the modal when applying from the details modal", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen
      .getByRole("heading", { name: "Pediatrician (MD/DO)" })
      .closest("article")!;
    await user.click(within(card).getByRole("button", { name: /view details/i }));
    await user.click(screen.getByRole("button", { name: /apply for this role/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /position/i })).toHaveTextContent("Pediatrician (MD/DO)");
  });

  it("narrows Open Positions when a role-browser category is explored", async () => {
    const user = userEvent.setup();
    render(<CareersPageContent />);
    const card = screen.getByRole("heading", { name: "Corporate and Administrative Services" }).closest("div")!;
    await user.click(within(card).getByRole("button", { name: "Explore roles" }));
    expect(screen.getByRole("heading", { name: "Billing Specialist" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pediatrician (MD/DO)" })).not.toBeInTheDocument();
  });

  it("renders sections in the approved order", () => {
    render(<CareersPageContent />);
    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent);
    const indexOf = (text: string) => headings.findIndex((h) => h === text);

    expect(indexOf("Why Choose Us")).toBeGreaterThanOrEqual(0);
    expect(indexOf("Why Choose Us")).toBeLessThan(indexOf("Benefits that support your life"));
    expect(indexOf("More than a Workplace")).toBeGreaterThan(indexOf("Benefits that support your life"));
    expect(indexOf("Join the Largest Pediatric Network in LA")).toBeGreaterThan(
      indexOf("More than a Workplace")
    );
    expect(indexOf("Open Positions (8)")).toBeGreaterThan(
      indexOf("Join the Largest Pediatric Network in LA")
    );
  });

  it("renders the 4 benefits categories with their items", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Health & Wellbeing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Professional Development" })).toBeInTheDocument();
    expect(
      screen.getByText("A restricted bonus program designed to ease student loans and support your retirement goals")
    ).toBeInTheDocument();
  });

  it("renders the Candidate FAQ section", () => {
    render(<CareersPageContent />);
    expect(screen.getByRole("heading", { name: "Candidate FAQ" })).toBeInTheDocument();
    expect(
      screen.getByText("Can I apply for more than one position?")
    ).toBeInTheDocument();
  });
});
