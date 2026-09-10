import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { BookAppointmentButton } from "./BookAppointmentButton";

describe("BookAppointmentButton", () => {
  it("renders its label and keeps the styling the call site passes in", () => {
    renderWithIntl(
      <BookAppointmentButton className="rounded-full bg-teal">
        Book an Appointment
      </BookAppointmentButton>
    );

    const trigger = screen.getByRole("button", { name: "Book an Appointment" });
    expect(trigger).toHaveClass("rounded-full", "bg-teal");
  });

  it("shows no dialog until it is clicked", () => {
    renderWithIntl(<BookAppointmentButton>Book</BookAppointmentButton>);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the three booking options when clicked", async () => {
    renderWithIntl(<BookAppointmentButton>Book</BookAppointmentButton>);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Book" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /text us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call us/i })).toBeInTheDocument();
  });

  it("closes the dialog again on Escape, and can be reopened", async () => {
    renderWithIntl(<BookAppointmentButton>Book</BookAppointmentButton>);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Book" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Book" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("is reachable and operable by keyboard alone", async () => {
    renderWithIntl(<BookAppointmentButton>Book</BookAppointmentButton>);
    const user = userEvent.setup();

    await user.tab();
    expect(screen.getByRole("button", { name: "Book" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("exposes an explicit accessible name when the call site renders only an icon", async () => {
    renderWithIntl(
      <BookAppointmentButton aria-label="Book an Appointment">
        <svg aria-hidden />
      </BookAppointmentButton>
    );

    expect(screen.getByRole("button", { name: "Book an Appointment" })).toBeInTheDocument();
  });
});
