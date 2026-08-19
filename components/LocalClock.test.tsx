import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { renderWithIntl as render } from "@/lib/test-utils";
import { LocalClock } from "./LocalClock";

// The suite pins TZ=UTC (see vitest.config.ts), so "the visitor" here sits on
// UTC and the clinic sits on Los Angeles time. 2026-08-19 is inside daylight
// saving, which puts Los Angeles at UTC-7.
const VISITOR_TIME = "17:43:19";
const CLINIC_TIME = "10:43:19";

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
    expect(screen.getByLabelText("Current local time")).toHaveTextContent(VISITOR_TIME);
  });

  it("advances once per second", () => {
    render(<LocalClock />);
    expect(screen.getByLabelText("Current local time")).toHaveTextContent(VISITOR_TIME);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByLabelText("Current local time")).toHaveTextContent("17:43:20");
  });

  it("labels the visitor's own UTC offset", () => {
    render(<LocalClock />);
    expect(screen.getByText("GMT+0")).toBeInTheDocument();
  });

  it("reads the visitor's offset from their device rather than assuming one", () => {
    // Colombo is UTC+5:30; getTimezoneOffset reports that inverted as -330.
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-330);
    render(<LocalClock />);
    expect(screen.getByText("GMT+5.5")).toBeInTheDocument();
  });

  it("shows the clinic's Los Angeles time alongside the visitor's", () => {
    render(<LocalClock />);
    expect(screen.getByLabelText("Current clinic time")).toHaveTextContent(CLINIC_TIME);
    expect(screen.getByText("GMT-7")).toBeInTheDocument();
  });

  it("captions both clocks so identical readings are not mistaken for a bug", () => {
    render(<LocalClock />);
    expect(screen.getByText("Your time")).toBeInTheDocument();
    expect(screen.getByText("Clinic time")).toBeInTheDocument();
  });

  it("ticks both clocks together", () => {
    render(<LocalClock />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByLabelText("Current local time")).toHaveTextContent("17:43:20");
    expect(screen.getByLabelText("Current clinic time")).toHaveTextContent("10:43:20");
  });

  it("exposes accessible labels without announcing every tick", () => {
    render(<LocalClock />);
    const clock = screen.getByLabelText("Current local time");
    expect(clock.tagName).toBe("TIME");
    // A live region here would make screen readers speak the time every second.
    expect(clock).not.toHaveAttribute("aria-live");
    expect(screen.getByLabelText("Current clinic time")).not.toHaveAttribute("aria-live");
  });

  it("renders fixed-width placeholders on the server so hydration cannot mismatch", () => {
    // The server has no way to know the visitor's timezone, so it must not
    // commit to a time. Anything else is a hydration error in production.
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LocalClock />
      </NextIntlClientProvider>
    );
    expect(html).toContain("--:--:--");
    expect(html).not.toContain(VISITOR_TIME);
    expect(html).not.toContain(CLINIC_TIME);
    expect(html).not.toContain("GMT");
  });

  it("stops ticking once unmounted", () => {
    const { unmount } = render(<LocalClock />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
