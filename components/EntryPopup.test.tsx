import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { EntryPopup } from "./EntryPopup";

describe("EntryPopup", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not show the dialog immediately on mount", () => {
    renderWithIntl(<EntryPopup />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the dialog with a heading, call link, and booking link after the entry delay", () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Book Now" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book an Appointment" })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
    expect(screen.getByRole("link", { name: /call \(818\) 361-5437/i })).toHaveAttribute(
      "href",
      "tel:+18183615437"
    );
  });

  it("also offers texting, so it matches the three ways to book offered elsewhere", () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole("link", { name: /text \(626\) 298-7121/i })).toHaveAttribute(
      "href",
      "sms:+16262987121"
    );
  });

  it("shows a supporting photo with meaningful alt text alongside the dialog", () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });

    const photo = screen.getByRole("img");
    expect(photo.getAttribute("alt")).toMatch(/\w/);
  });

  it("blurs the page content behind the popup, not just dims it", () => {
    const { container } = renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });

    expect(container.firstChild).toHaveClass("backdrop-blur-sm");
  });

  it("moves keyboard focus into the dialog when it opens, since nothing else triggered it", () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
  });

  it("does not show the dialog again once it has already been shown this session", () => {
    sessionStorage.setItem("ktmg-entry-popup-seen", "true");
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when Escape is pressed", async () => {
    renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
    const user = userEvent.setup();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the backdrop is clicked but not when the panel is clicked", async () => {
    const { container } = renderWithIntl(<EntryPopup />);
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
    const user = userEvent.setup();

    await user.click(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(container.firstChild as Element);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
