import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders System, Light, and Dark options within a labeled group", () => {
    renderToggle();
    expect(screen.getByRole("group", { name: /color theme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });

  it("marks System pressed by default", () => {
    renderToggle();
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "false");
  });

  it("selecting Dark presses it and applies data-theme=dark", async () => {
    renderToggle();
    await userEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("selecting System removes the data-theme attribute", async () => {
    renderToggle();
    await userEvent.click(screen.getByRole("button", { name: "Dark" }));
    await userEvent.click(screen.getByRole("button", { name: "System" }));
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
