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

  it("renders the Spanish back link when locale is es", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui, "es");
    expect(screen.getByRole("link", { name: /volver a servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });

  it("renders the Spanish name, category, description, and long description when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Telesalud");
    expect(screen.getByText("Atención de Enfermedades y Urgencias")).toBeInTheDocument();
    expect(
      screen.getByText("Consultas médicas remotas desde donde se encuentre su familia.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/pediatra certificado de forma remota/i)
    ).toBeInTheDocument();
  });

  it("renders the service image with English alt text for same-day-appointments", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments" }),
    });
    render(ui);
    expect(screen.getByRole("img", { name: /teddy bear/i })).toBeInTheDocument();
  });

  it("renders the service image with Spanish alt text when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("img", { name: /osito de peluche/i })).toBeInTheDocument();
  });

  it("renders no image for services without one", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth" }),
    });
    render(ui);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a More Services link to /services on a service page", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth" }),
    });
    render(ui);
    expect(screen.getByRole("link", { name: /more services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("renders a More Services link on the image-layout page too", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "same-day-appointments" }),
    });
    render(ui);
    expect(screen.getByRole("link", { name: /more services/i })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("localizes the booking and More Services labels when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("link", { name: /reservar una cita/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /más servicios/i })).toHaveAttribute(
      "href",
      "/es/services"
    );
  });
});
