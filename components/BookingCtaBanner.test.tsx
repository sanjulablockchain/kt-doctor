import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { BookingCtaBanner } from "./BookingCtaBanner";
import { BOOKING_URL, MAIN_PHONE } from "@/lib/constants";

describe("BookingCtaBanner", () => {
  it("renders the heading, body, and same-day status pill", () => {
    render(<BookingCtaBanner />);
    expect(screen.getByText("Your child can be seen today.")).toBeInTheDocument();
    expect(screen.getByText(/book online in under a minute/i)).toBeInTheDocument();
    expect(screen.getByText("Same-day openings today")).toBeInTheDocument();
  });

  it("links the primary button to the Healow booking URL in a new tab", () => {
    render(<BookingCtaBanner />);
    const book = screen.getByRole("link", { name: /book an appointment/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a tel: phone link with an accessible call label", () => {
    render(<BookingCtaBanner />);
    const phone = screen.getByRole("link", { name: /call/i });
    expect(phone.getAttribute("href")).toMatch(/^tel:\+1\d{10}$/);
    expect(phone).toHaveAttribute("aria-label", `Call ${MAIN_PHONE}`);
    expect(phone).toHaveTextContent(MAIN_PHONE);
  });

  it("renders the status pill in Spanish when locale is es", () => {
    render(<BookingCtaBanner />, "es");
    expect(screen.getByText("Citas para el mismo día, hoy")).toBeInTheDocument();
  });
});
