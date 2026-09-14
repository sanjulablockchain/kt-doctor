import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
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

  it("offers texting the practice text line, showing the number to read", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const textLink = screen.getByRole("link", { name: /text us/i });
    expect(textLink).toHaveAttribute("href", "sms:+16262987121");
    expect(textLink).toHaveTextContent("(626) 298-7121");
  });

  it("leads the call option with the number itself, since that is the useful part", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const callLink = screen.getByRole("link", { name: /361-5437/ });
    expect(callLink).toHaveAttribute("href", "tel:+18183615437");
    expect(callLink).toHaveTextContent("We'll find the soonest opening");
  });

  it("uses the same text line in Spanish, since the practice has one text number", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />, "es");

    expect(screen.getByRole("link", { name: /mensaje/i })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
  });

  it("heads the dialog with the practice logo", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const logo = screen.getByRole("img");
    expect(logo.getAttribute("alt")).toMatch(/\w/);
  });

  it("counts the clinics from the location data rather than hardcoding a number", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(
      screen.getByText(new RegExp(`${locations.length} clinics`, "i"))
    ).toBeInTheDocument();
  });

  it("states the accepted insurance from the insurance data", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    // Matched on the whole footer line: a bare /PPO/ would also hit
    // "a-ppo-intment" in the heading.
    const footerMeta = screen.getByText(/^Ages 0-21 ·/);
    for (const category of insuranceInfo.acceptedCategories) {
      expect(footerMeta).toHaveTextContent(category);
    }
  });

  it("singles out booking online as the quick option, leaving the other two level", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /book online/i })).toHaveTextContent(
      /under a minute/i
    );
    expect(screen.getByRole("link", { name: /text us/i })).not.toHaveTextContent(
      /under a minute/i
    );
    expect(screen.getByRole("link", { name: /361-5437/ })).not.toHaveTextContent(
      /under a minute/i
    );
  });

  it("offers a Not now action that dismisses the dialog", async () => {
    const onClose = vi.fn();
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /not now/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("translates the new window copy", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />, "es");

    expect(screen.getByText(/su hijo puede ser atendido hoy/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ahora no/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /reservar en línea/i })
    ).toHaveTextContent(/en menos de un minuto/i);
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
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    const dialog = screen.getByRole("dialog");
    await user.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    // The dialog is portalled to <body>, so the backdrop is its parent
    // rather than the render container's first child.
    await user.click(dialog.parentElement as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it("closes after an option is chosen, so the page is not left behind a dialog", async () => {
    const onClose = vi.fn();
    renderWithIntl(<BookingOptionsDialog onClose={onClose} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("link", { name: /361-5437/ }));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders every option inside the dialog, not loose in the page", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const dialog = within(screen.getByRole("dialog"));
    expect(dialog.getByRole("link", { name: /book online/i })).toBeInTheDocument();
    expect(dialog.getByRole("link", { name: /text us/i })).toBeInTheDocument();
    expect(dialog.getByRole("link", { name: /361-5437/ })).toBeInTheDocument();
  });

  it("locks background scrolling while open and restores it on close", () => {
    const { unmount } = renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
