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
      <button onClick={() => setPreference("system")}>system</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to 'system' when nothing is stored", () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByTestId("pref")).toHaveTextContent("system");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("setting dark persists to localStorage and sets data-theme", async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByRole("button", { name: "dark" }));
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("setting system clears storage and removes data-theme", async () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await userEvent.click(screen.getByRole("button", { name: "dark" }));
    await userEvent.click(screen.getByRole("button", { name: "system" }));
    expect(screen.getByTestId("pref")).toHaveTextContent("system");
    expect(localStorage.getItem("theme")).toBe(null);
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("reads an existing stored preference on mount", async () => {
    localStorage.setItem("theme", "dark");
    await act(async () => {
      render(<ThemeProvider><Probe /></ThemeProvider>);
    });
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
  });

  it("useTheme returns the system default without throwing when there is no provider", () => {
    render(<Probe />);
    expect(screen.getByTestId("pref")).toHaveTextContent("system");
  });
});
