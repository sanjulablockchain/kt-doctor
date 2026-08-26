import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { ConversionAction } from "@/lib/gtag";

const trackMock = vi.fn<(action: ConversionAction) => void>();

// The real conversionActionForLink stays in place: only the reporting call is
// stubbed, so these tests exercise the actual href classification.
vi.mock("@/lib/gtag", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/gtag")>()),
  trackConversion: (action: ConversionAction) => trackMock(action),
}));

import { ConversionTracking } from "./ConversionTracking";

// Real anchors would make jsdom log "Not implemented: navigation to another
// Document" on every click. Swallowing the default in the bubble phase keeps
// the output clean without touching the capture-phase listener under test.
function blockNavigation(event: Event) {
  if ((event.target as Element | null)?.closest?.("a")) event.preventDefault();
}

beforeEach(() => {
  trackMock.mockReset();
  document.addEventListener("click", blockNavigation);
});

afterEach(() => document.removeEventListener("click", blockNavigation));

describe("ConversionTracking", () => {
  it("reports a phone call when a tel: link is clicked", async () => {
    render(
      <>
        <ConversionTracking />
        <a href="tel:+18183615437">Call Us</a>
      </>
    );

    await userEvent.click(screen.getByRole("link", { name: "Call Us" }));

    expect(trackMock).toHaveBeenCalledWith("phone_call");
  });

  it("reports a booking click when a healow link is clicked", async () => {
    render(
      <>
        <ConversionTracking />
        <a href="https://healow.com/apps/practice/kids-and-teens?v=2">Book Appointment</a>
      </>
    );

    await userEvent.click(screen.getByRole("link", { name: "Book Appointment" }));

    expect(trackMock).toHaveBeenCalledWith("booking_click");
  });

  it("reports the click when the visitor hits an element nested inside the link", async () => {
    render(
      <>
        <ConversionTracking />
        <a href="https://wa.me/16262987121">
          <span>WhatsApp</span>
        </a>
      </>
    );

    await userEvent.click(screen.getByText("WhatsApp"));

    expect(trackMock).toHaveBeenCalledWith("whatsapp_click");
  });

  it("reports nothing for ordinary site navigation", async () => {
    render(
      <>
        <ConversionTracking />
        {/* A raw anchor on purpose: this fixture stands in for any internal
            link, whether it came from next/link or not. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/en/locations">Locations</a>
      </>
    );

    await userEvent.click(screen.getByRole("link", { name: "Locations" }));

    expect(trackMock).not.toHaveBeenCalled();
  });

  it("reports nothing for clicks that miss every link", async () => {
    render(
      <>
        <ConversionTracking />
        <button type="button">Menu</button>
      </>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));

    expect(trackMock).not.toHaveBeenCalled();
  });

  it("stops listening once unmounted", async () => {
    const { unmount } = render(
      <>
        <ConversionTracking />
        <a href="tel:+18183615437">Call Us</a>
      </>
    );
    const link = screen.getByRole("link", { name: "Call Us" });

    unmount();
    document.body.appendChild(link);
    await userEvent.click(link);

    expect(trackMock).not.toHaveBeenCalled();
  });

  it("renders nothing visible", () => {
    const { container } = render(<ConversionTracking />);
    expect(container).toBeEmptyDOMElement();
  });
});
