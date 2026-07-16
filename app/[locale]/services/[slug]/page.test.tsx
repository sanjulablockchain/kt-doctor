import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import ServiceDetailPage, { generateStaticParams } from "./page";

describe("ServiceDetailPage", () => {
  it("generates static params for all 21 real services", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(21);
    expect(params).toContainEqual({ slug: "telehealth" });
    expect(params).toContainEqual({ slug: "well-child-exam" });
  });

  it("renders the service name, category, description, and long description", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Telehealth");
    expect(screen.getByText("Sick & Urgent Care")).toBeInTheDocument();
    expect(
      screen.getByText("Remote medical consultations from wherever your family is.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/board-certified pediatrician remotely/i)
    ).toBeInTheDocument();
  });

  it("renders a Book an Appointment link to the real booking URL", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    const bookingLink = screen.getByRole("link", { name: /book an appointment/i });
    expect(bookingLink).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
  });

  it("renders a back link to /services", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);

    expect(screen.getByRole("link", { name: /back to services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });
});
