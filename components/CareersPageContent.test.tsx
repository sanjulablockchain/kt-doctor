import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { CareersPageContent } from "./CareersPageContent";
import { positions } from "@/data/careers";

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
    expect(screen.getByText(/official job postings are only shared/i)).toBeInTheDocument();
  });

  it("shows the displayed careers emails as a mailto link", () => {
    render(<CareersPageContent />);
    const link = screen.getByRole("link", { name: /hr@ktdoctor\.com and monessa\.azad@ktdoctor\.com/i });
    expect(link).toHaveAttribute("href", "mailto:HR@ktdoctor.com,monessa.azad@ktdoctor.com");
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
});
