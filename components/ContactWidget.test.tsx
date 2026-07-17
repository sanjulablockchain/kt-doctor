import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ContactWidget } from "./ContactWidget";

describe("ContactWidget", () => {
  it("opens the panel and shows WhatsApp, text, and call options with the real numbers", async () => {
    render(<ContactWidget />);
    const toggle = screen.getByRole("button", { name: "Contact us" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/16262987121")
    );
    expect(screen.getByRole("link", { name: /Text \(English\)/ })).toHaveAttribute(
      "href",
      expect.stringContaining("sms:+16262987121")
    );
    expect(screen.getByRole("link", { name: /Texto \(Español\)/ })).toHaveAttribute(
      "href",
      expect.stringContaining("sms:+18184235637")
    );
    expect(screen.getByRole("link", { name: /Call Us/ })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
  });

  it("closes the panel when the toggle is clicked again", async () => {
    render(<ContactWidget />);
    await userEvent.click(screen.getByRole("button", { name: "Contact us" }));
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Close contact options" }));
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
  });

  it("copies the phone number to the clipboard", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    render(<ContactWidget />);
    await userEvent.click(screen.getByRole("button", { name: "Contact us" }));
    await userEvent.click(screen.getByRole("button", { name: "Copy phone number" }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("+18183615437");
  });
});
