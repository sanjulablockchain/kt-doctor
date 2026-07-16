import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import ServicesPage from "./page";

describe("ServicesPage", () => {
  it("has an h1 for the page and renders all 5 category headings", () => {
    render(<ServicesPage />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Comprehensive Pediatric Care");

    expect(screen.getByText("Preventive & Wellness Care")).toBeInTheDocument();
    expect(screen.getByText("Newborn & Family Care")).toBeInTheDocument();
    expect(screen.getByText("Sick & Urgent Care")).toBeInTheDocument();
    expect(screen.getByText("Behavioral & Developmental Health")).toBeInTheDocument();
    expect(screen.getByText("Specialty & Adolescent Care")).toBeInTheDocument();
  });

  it("renders individual real services from different categories", () => {
    render(<ServicesPage />);
    expect(screen.getByText("Well Child Exam")).toBeInTheDocument();
    expect(screen.getByText("Telehealth")).toBeInTheDocument();
    expect(screen.getByText("ADHD & Behavioral Issues")).toBeInTheDocument();
    expect(screen.getByText("Adolescent Medicine")).toBeInTheDocument();
  });
});
