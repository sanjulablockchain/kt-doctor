import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { Header } from "./Header";

// usePathname requires a real Next.js router context, which RTL doesn't
// provide. The Header only uses it to build the language-switcher link, so a
// fixed path is enough for testing everything else in this file.
vi.mock("@/i18n/navigation", async () => {
  const actual = await vi.importActual<typeof import("@/i18n/navigation")>(
    "@/i18n/navigation"
  );
  return { ...actual, usePathname: () => "/" };
});

describe("Header", () => {
  it("renders always-visible nav links to Doctors, Locations, and Resources", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute("href", "/resources");
  });

  it("renders the real booking, pay online, and patient portal links", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: /appointments/i })).toHaveAttribute(
      "href",
      "https://healow.com/apps/practice/janesri-de-silva-md-a-prof-corp-dba-kids-and-teens-medical-group-25634?v=2&t=2"
    );
    expect(screen.getByRole("link", { name: /pay online/i })).toHaveAttribute(
      "href",
      "https://healowpay.com"
    );
    expect(screen.getByRole("link", { name: /portal log in/i })).toHaveAttribute(
      "href",
      "https://mycw178.ecwcloud.com/portal23441/jsp/100mp/login_otp.jsp"
    );
  });

  it("renders a nav link to /about", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about");
  });

  it("renders a nav link to /network", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Network" })).toHaveAttribute("href", "/network");
  });

  it("renders a nav link to /foundation", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/foundation"
    );
  });

  it("renders nav links to Careers and Insurance", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
    expect(screen.getByRole("link", { name: "Insurance" })).toHaveAttribute("href", "/insurance");
  });

  it("renders a nav link to /services", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services"
    );
  });

  it("renders a nav link to /blog", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("renders a nav link to /testimonials", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute(
      "href",
      "/testimonials"
    );
  });

  it("toggles the desktop 'More' dropdown open and closed", async () => {
    renderWithIntl(<Header />);
    const moreButton = screen.getByRole("button", { name: "More" });
    expect(moreButton).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(moreButton);
    expect(moreButton).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the mobile menu open and closed", async () => {
    renderWithIntl(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");

    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("hidden");
  });

  it("closes the mobile menu after clicking a nav link", async () => {
    renderWithIntl(<Header />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });

    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-menu")).not.toHaveClass("hidden");

    await userEvent.click(screen.getByRole("link", { name: "Doctors" }));
    expect(screen.getByTestId("mobile-menu")).toHaveClass("hidden");
  });

  it("renders an EN/ES language switcher linking to the same page in the other locale", () => {
    renderWithIntl(<Header />, "en");
    expect(screen.getByRole("link", { name: "ES" })).toBeInTheDocument();

    renderWithIntl(<Header />, "es");
    expect(screen.getByRole("link", { name: "EN" })).toBeInTheDocument();
  });

  it("renders the color theme toggle", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("group", { name: /color theme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });
});
