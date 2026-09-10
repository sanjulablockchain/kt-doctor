import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { BookingOptionsDialog } from "./BookingOptionsDialog";

const HEALOW_URL =
  "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2";

describe("BookingOptionsDialog", () => {
  it("renders as a labelled modal dialog", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName();
  });

  it("offers booking online through the Healow booking site in a new tab", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const bookLink = screen.getByRole("link", { name: /book online/i });
    expect(bookLink).toHaveAttribute("href", HEALOW_URL);
    expect(bookLink).toHaveAttribute("target", "_blank");
    expect(bookLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("offers texting the practice text line", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /text us/i })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
  });

  it("offers calling the main practice number", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /call us/i })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
  });

  it("uses the same text line in Spanish, since the practice has one text number", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />, "es");

    expect(screen.getByRole("link", { name: /mensaje/i })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
  });

  it("moves keyboard focus into the dialog when it opens", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("closes when the close button is clicked", async () => {
    const onClose = vi.fn();
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /close|cerrar/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("closes when Escape is pressed", async () => {
    const onClose = vi.fn();
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("closes when the backdrop is clicked but not when the panel is clicked", async () => {
    const onClose = vi.fn();
    const { container } = renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes after an option is chosen, so the page is not left behind a dialog", async () => {
    const onClose = vi.fn();
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("link", { name: /call us/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("locks background scrolling while open and restores it on close", () => {
    const { unmount } = renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
