import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { MAIN_PHONE, TEXT_PHONE } from "@/lib/constants";
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
  it("renders always-visible nav links to Doctors and Locations", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Doctors" })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
  });

  it("renders a Resources link inside the More menu to /resources", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute("href", "/resources");
  });

  it("renders the real booking, pay online, and patient portal links", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: /book an appointment/i })).toHaveAttribute(
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

  it("draws attention to the Book an Appointment button with a heartbeat pulse", () => {
    renderWithIntl(<Header />);
    const bookButton = screen.getByRole("link", { name: /book an appointment/i });
    expect(bookButton.className).toContain("animate-[heartbeat");
  });

  it("renders the call action as a handset icon only, with no number in its label", () => {
    renderWithIntl(<Header />);
    const call = screen.getByRole("link", { name: "Call us" });
    expect(call).toHaveAttribute("href", `tel:+1${MAIN_PHONE.replace(/\D/g, "")}`);
    expect(call.textContent).toBe("");
    expect(call.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the text action as an icon only, linking to sms:", () => {
    renderWithIntl(<Header />);
    const text = screen.getByRole("link", { name: "Text us" });
    expect(text).toHaveAttribute("href", `sms:+1${TEXT_PHONE.replace(/\D/g, "")}`);
    expect(text.textContent).toBe("");
    expect(text.querySelector("svg")).toBeInTheDocument();
  });

  it("shows neither phone number as visible text anywhere in the header", () => {
    const { container } = renderWithIntl(<Header />);
    expect(container.textContent).not.toContain(MAIN_PHONE);
    expect(container.textContent).not.toContain(TEXT_PHONE);
  });

  it("gives the call and text icons identical sizing so they read as one pair", () => {
    renderWithIntl(<Header />);
    const call = screen.getByRole("link", { name: "Call us" });
    const text = screen.getByRole("link", { name: "Text us" });
    for (const size of ["h-11", "w-11", "xl:h-9", "xl:w-9"]) {
      expect(call.className).toContain(size);
      expect(text.className).toContain(size);
    }
  });

  it("keeps the call and text actions on one row at every breakpoint", () => {
    renderWithIntl(<Header />);
    const call = screen.getByRole("link", { name: "Call us" });
    const text = screen.getByRole("link", { name: "Text us" });
    const row = call.parentElement;
    expect(row).toBe(text.parentElement);
    expect(row?.className).toContain("flex items-center");
    expect(row?.className).not.toContain("flex-col");
  });

  it("gives both icon-only actions a 44px touch target below the desktop breakpoint", () => {
    renderWithIntl(<Header />);
    for (const name of ["Call us", "Text us"]) {
      const action = screen.getByRole("link", { name });
      expect(action.className).toContain("h-11");
      expect(action.className).toContain("w-11");
      expect(action.className).toContain("xl:h-9");
      expect(action.className).toContain("xl:w-9");
    }
  });

  it("gives both icon-only actions a hover tooltip so sighted users can identify them", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Call us" })).toHaveAttribute("title", "Call us");
    expect(screen.getByRole("link", { name: "Text us" })).toHaveAttribute("title", "Text us");
  });

  // With no visible copy left on either action, the aria-label is the only
  // thing telling a Spanish speaker what they do, so it has to be translated.
  it("labels the call and text actions in Spanish too", () => {
    renderWithIntl(<Header />, "es");
    expect(screen.getByRole("link", { name: "Llámenos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mensaje de texto" })).toHaveAttribute(
      "href",
      `sms:+1${TEXT_PHONE.replace(/\D/g, "")}`
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

  it("renders a Telehealth link in the More menu to /services/telehealth", () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole("link", { name: "Telehealth" })).toHaveAttribute(
      "href",
      "/services/telehealth"
    );
  });

  it("renders a Contact link in the More menu to /contact", () => {
    renderWithIntl(<Header />);
    const links = screen.getAllByRole("link", { name: "Contact" });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/contact");
  });

  it("pins the header row to the --header-h token so the hero can size against it", () => {
    const { container } = renderWithIntl(<Header />);
    const row = container.querySelector("header .max-w-7xl");
    expect(row?.className).toContain("h-[var(--header-h,4rem)]");
    expect(row?.className).not.toContain("sm:h-auto");
  });

  it("hangs the mobile drawer off the same --header-h token as the header row", () => {
    const { container } = renderWithIntl(<Header />);
    const drawer = container.querySelector("#mobile-nav, nav");
    expect(drawer?.className).toContain("top-[var(--header-h,4rem)]");
    expect(drawer?.className).not.toContain("top-16");
  });

  it("lets the desktop nav row wrap instead of overflowing if it ever runs out of horizontal space", () => {
    const { container } = renderWithIntl(<Header />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("xl:flex-wrap");
  });

  it("only switches to the inline desktop nav at the xl breakpoint, keeping the hamburger menu through tablet widths (the full row doesn't fit at 1024px)", () => {
    const { container } = renderWithIntl(<Header />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("xl:flex");
    expect(nav?.className).not.toContain("lg:flex ");
    expect(nav?.className).not.toContain("lg:static");

    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggle.className).toContain("xl:hidden");
    expect(toggle.className).not.toContain("lg:hidden");
  });
});
