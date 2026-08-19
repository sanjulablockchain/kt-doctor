import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocalClock } from "./LocalClock";

// Colombo (UTC+5:30), the timezone in the design reference. getTimezoneOffset
// is inverted, hence -330.
const COLOMBO_OFFSET = -330;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 7, 19, 17, 43, 19));
  vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(COLOMBO_OFFSET);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("LocalClock", () => {
  it("shows the visitor's current wall-clock time", () => {
    render(<LocalClock />);
    expect(screen.getByText("17:43:19")).toBeInTheDocument();
  });

  it("advances once per second", () => {
    render(<LocalClock />);
    expect(screen.getByText("17:43:19")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("17:43:20")).toBeInTheDocument();
    expect(screen.queryByText("17:43:19")).not.toBeInTheDocument();
  });

  it("labels the visitor's own UTC offset rather than the clinic's", () => {
    render(<LocalClock />);
    expect(screen.getByText("GMT+5.5")).toBeInTheDocument();
  });

  it("exposes an accessible label without announcing every tick", () => {
    render(<LocalClock />);
    const clock = screen.getByLabelText("Current local time");
    expect(clock.tagName).toBe("TIME");
    // A live region here would make screen readers speak the time every second.
    expect(clock).not.toHaveAttribute("aria-live");
  });

  it("renders a fixed-width placeholder on the server so hydration cannot mismatch", () => {
    // The server has no way to know the visitor's timezone, so it must not
    // commit to a time. Anything else is a hydration error in production.
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LocalClock />
      </NextIntlClientProvider>
    );
    expect(html).toContain("--:--:--");
    expect(html).not.toContain("17:43:19");
    expect(html).not.toContain("GMT+5.5");
  });

  it("stops ticking once unmounted", () => {
    const { unmount } = render(<LocalClock />);
    unmount();

    const pending = vi.getTimerCount();
    expect(pending).toBe(0);
  });
});
