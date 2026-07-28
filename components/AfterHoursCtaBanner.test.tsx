import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { AfterHoursCtaBanner } from "./AfterHoursCtaBanner";
import { AFTER_HOURS_PHONE } from "@/lib/constants";

describe("AfterHoursCtaBanner", () => {
  it("renders the heading, body, and open-now status pill", () => {
    render(<AfterHoursCtaBanner />);
    expect(
      screen.getByText("Sick after six? Our doors are still open.")
    ).toBeInTheDocument();
    expect(screen.getByText(/board-certified pediatricians/i)).toBeInTheDocument();
    expect(screen.getByText("Open now")).toBeInTheDocument();
  });

  it("links the primary CTA to the After-Hours Pediatric Urgent Care site in a new tab", () => {
    render(<AfterHoursCtaBanner />);
    const cta = screen.getByRole("link", { name: /get urgent care now/i });
    expect(cta).toHaveAttribute("href", "https://pediatricafterhour.com/");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a tel: phone link with an accessible call label", () => {
    render(<AfterHoursCtaBanner />);
    const phone = screen.getByRole("link", { name: /call/i });
    expect(phone.getAttribute("href")).toMatch(/^tel:\+1\d{10}$/);
    expect(phone).toHaveAttribute("aria-label", `Call ${AFTER_HOURS_PHONE}`);
    expect(phone).toHaveTextContent(AFTER_HOURS_PHONE);
  });

  it("renders the schedule rows", () => {
    render(<AfterHoursCtaBanner />);
    expect(screen.getByText("Weeknights")).toBeInTheDocument();
    expect(screen.getByText("6pm-11pm")).toBeInTheDocument();
    expect(screen.getByText("Weekends")).toBeInTheDocument();
    expect(screen.getByText("All day")).toBeInTheDocument();
    expect(screen.getByText("Virtual care")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
  });

  it("renders the heading and status pill in Spanish when locale is es", () => {
    render(<AfterHoursCtaBanner />, "es");
    expect(
      screen.getByText("¿Enfermo después de las seis? Nuestras puertas siguen abiertas.")
    ).toBeInTheDocument();
    expect(screen.getByText("Abierto ahora")).toBeInTheDocument();
  });
});
