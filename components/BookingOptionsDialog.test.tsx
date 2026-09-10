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

  it("badges booking online and texting as recommended, but not calling", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /book online/i })).toHaveTextContent(
      /recommended/i
    );
    expect(screen.getByRole("link", { name: /text us/i })).toHaveTextContent(
      /recommended/i
    );
    expect(screen.getByRole("link", { name: /call us/i })).not.toHaveTextContent(
      /recommended/i
    );
  });

  it("keeps the intro line neutral about which option to pick", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    expect(
      screen.getByText("Choose whichever way is easiest for you.")
    ).toBeInTheDocument();
  });

  it("introduces calling with a prompt that sits between texting and the call row", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const prompt = screen.getByText(/prefer to speak with us\?/i);
    const text = screen.getByRole("link", { name: /text us/i });
    const call = screen.getByRole("link", { name: /call us/i });

    // Node.DOCUMENT_POSITION_FOLLOWING === 4: the prompt comes after the
    // text option and before the call option.
    expect(text.compareDocumentPosition(prompt) & 4).toBeTruthy();
    expect(prompt.compareDocumentPosition(call) & 4).toBeTruthy();
  });

  it("keeps the prompt out of the call link, so the link stays a short single line", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />);

    const call = screen.getByRole("link", { name: /call us/i });
    expect(call).toHaveAttribute("href", "tel:+18183615437");
    expect(call).toHaveTextContent("(818) 361-5437");
    expect(call).not.toHaveTextContent(/prefer to speak/i);
  });

  it("marks the recommendation with text, not colour alone", () => {
    renderWithIntl(<BookingOptionsDialog onClose={() => {}} />, "es");

    // The Spanish badge has to be real translated text for the same reason:
    // a screen reader and a colourblind visitor both need to read it.
    expect(screen.getByRole("link", { name: /reservar en línea/i })).toHaveTextContent(
      /recomendado/i
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
