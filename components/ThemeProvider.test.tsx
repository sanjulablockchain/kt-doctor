import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function Probe() {
  const { preference, setPreference } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <button onClick={() => setPreference("dark")}>dark</button>
      <button onClick={() => setPreference("light")}>light</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light when nothing is stored, regardless of the OS preference", () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByTestId("pref")).toHaveTextContent("light");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("setting dark persists to localStorage and sets data-theme", async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByRole("button", { name: "dark" }));
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setting light clears storage and removes data-theme, back to the default", async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByRole("button", { name: "dark" }));
    await userEvent.click(screen.getByRole("button", { name: "light" }));
    expect(screen.getByTestId("pref")).toHaveTextContent("light");
    expect(localStorage.getItem("theme")).toBe(null);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("reads an existing stored dark preference on mount", async () => {
    localStorage.setItem("theme", "dark");
    await act(async () => {
      render(<ThemeProvider><Probe /></ThemeProvider>);
    });
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
  });

  it("treats a stale stored 'system' value from the old three-way toggle as light", async () => {
    localStorage.setItem("theme", "system");
    await act(async () => {
      render(<ThemeProvider><Probe /></ThemeProvider>);
    });
    expect(screen.getByTestId("pref")).toHaveTextContent("light");
  });

  it("useTheme returns the light default without throwing when there is no provider", () => {
    render(<Probe />);
    expect(screen.getByTestId("pref")).toHaveTextContent("light");
  });
});
