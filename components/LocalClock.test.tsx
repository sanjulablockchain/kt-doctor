import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocalClock } from "./LocalClock";

// The suite pins TZ=UTC (see vitest.config.ts), so the default "visitor" here
// sits on UTC. Tests that care about a specific country stub getTimezoneOffset,
// which is the only thing the clock reads to decide the zone.
const UTC_TIME = "17:43:19";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-19T17:43:19Z"));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("LocalClock", () => {
  it("shows the visitor's current wall-clock time", () => {
    render(<LocalClock />);
    expect(screen.getByLabelText("Current local time")).toHaveTextContent(UTC_TIME);
  });

  it("shows exactly one clock", () => {
    const { container } = render(<LocalClock />);
    expect(container.querySelectorAll("time")).toHaveLength(1);
  });

  it("advances once per second", () => {
    render(<LocalClock />);
    expect(screen.getByLabelText("Current local time")).toHaveTextContent(UTC_TIME);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByLabelText("Current local time")).toHaveTextContent("17:43:20");
  });

  it("follows the visitor to Sri Lanka", () => {
    // UTC+5:30, which getTimezoneOffset reports inverted as -330.
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-330);
    render(<LocalClock />);
    expect(screen.getByText("GMT+5.5")).toBeInTheDocument();
  });

  it("follows the visitor to the UK", () => {
    // British Summer Time is UTC+1.
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-60);
    render(<LocalClock />);
    expect(screen.getByText("GMT+1")).toBeInTheDocument();
  });

  it("follows the visitor to California", () => {
    // Pacific Daylight Time is UTC-7.
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(420);
    render(<LocalClock />);
    expect(screen.getByText("GMT-7")).toBeInTheDocument();
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
    expect(html).not.toContain(UTC_TIME);
    expect(html).not.toContain("GMT");
  });

  it("stops ticking once unmounted", () => {
    const { unmount } = render(<LocalClock />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
