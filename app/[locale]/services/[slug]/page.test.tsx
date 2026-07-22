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
      params: Promise.resolve({ slug: "well-child-exam" }),
    });
    render(ui);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the telehealth image with English alt text", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("img", { name: /video telehealth visit/i })).toBeInTheDocument();
  });

  it("renders the telehealth image with Spanish alt text when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("img", { name: /visita de telesalud por video/i })).toBeInTheDocument();
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

  it("renders the telehealth benefits, how-it-works, and schedule sections", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("heading", { name: "Benefits" })).toBeInTheDocument();
    expect(screen.getByText("Convenience")).toBeInTheDocument();
    expect(screen.getByText("Privacy and Comfort")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How It Works" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to Schedule" })).toBeInTheDocument();
  });

  it("renders the telehealth schedule contact links from constants", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "telehealth" }) });
    render(ui);
    expect(screen.getByRole("link", { name: /818\) 361-5437/ })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
    expect(screen.getByRole("link", { name: /626\) 298-7121/ })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
    expect(screen.getByRole("link", { name: /818\) 423-5637/ })).toHaveAttribute(
      "href",
      "sms:+18184235637"
    );
  });

  it("renders no benefits or schedule sections for a plain service", async () => {
    const ui = await ServiceDetailPage({ params: Promise.resolve({ slug: "well-child-exam" }) });
    render(ui);
    expect(screen.queryByRole("heading", { name: "Benefits" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "How to Schedule" })).not.toBeInTheDocument();
  });

  it("renders the telehealth sections in Spanish when locale is es", async () => {
    const ui = await ServiceDetailPage({
      params: Promise.resolve({ slug: "telehealth", locale: "es" }),
    });
    render(ui, "es");
    expect(screen.getByRole("heading", { name: "Beneficios" })).toBeInTheDocument();
    expect(screen.getByText("Comodidad")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cómo Agendar" })).toBeInTheDocument();
  });
});
