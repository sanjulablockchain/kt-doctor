import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Hero } from "./Hero";
import { locations } from "@/data/locations";
import { partners } from "@/data/partners";
import { BOOKING_URL } from "@/lib/constants";

// The slide 1 ("Care today") panel, which is the one showing on load.
function careSlide() {
  return within(screen.getByRole("tabpanel", { name: "Care today" }));
}

async function expectBookingChooser() {
  const dialog = within(screen.getByRole("dialog"));
  expect(dialog.getByRole("link", { name: /book online/i })).toHaveAttribute("href", BOOKING_URL);
  expect(dialog.getByRole("link", { name: /text us/i })).toBeInTheDocument();
  expect(dialog.getByRole("link", { name: /361-5437/ })).toBeInTheDocument();
}

describe("Hero", () => {
  it("renders the headline and subheading with the live clinic count", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Seen today. Known for life."
    );
    expect(
      screen.getByText(`${locations.length} clinics, 18+ years, and one pediatrician from newborn to 21.`)
    ).toBeInTheDocument();
  });

  it("renders the Spanish copy", () => {
    render(<Hero />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Lo atendemos hoy. Lo conocemos de por vida."
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Visitas y exámenes físicos el mismo día" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Telesalud 24/7" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Por qué nos eligen" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reservar una visita de telesalud/i })
    ).toBeInTheDocument();
  });

  it("opens the booking options chooser from the primary CTA", async () => {
    render(<Hero />);
    const user = userEvent.setup();
    await user.click(careSlide().getByRole("button", { name: /book an appointment/i }));
    await expectBookingChooser();
  });

  it("renders Find a Doctor and Find a Clinic links", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /find a doctor/i })).toHaveAttribute("href", "/doctors");
    expect(screen.getByRole("link", { name: /find a clinic/i })).toHaveAttribute("href", "/locations");
  });

  describe("care cards", () => {
    it("renders three cards, each with a title and an image with alt text", () => {
      render(<Hero />);
      const cards = careSlide()
        .getAllByRole("heading", { level: 2 })
        .map((h) => h.textContent);
      expect(cards).toEqual([
        "Same-day visits & physicals",
        "Telehealth 24/7",
        "Sick after 6? We're still here.",
      ]);
      for (const [name, src] of [
        ["A pediatrician checking a young girl's pulse during a clinic visit", "same-day"],
        [
          "A mother comforting her sick child at home while a pediatrician joins them on a phone video call",
          "telehealth",
        ],
        ["A mother checking her sick child's temperature in bed", "after-hours"],
      ]) {
        expect(screen.getByRole("img", { name })).toHaveAttribute("src", `/home/hero-cards/${src}.webp`);
      }
    });

    it("keeps each card's photo frame short", () => {
      render(<Hero />);
      const photo = screen.getByRole("img", {
        name: "A pediatrician checking a young girl's pulse during a clinic visit",
      });
      const frame = photo.parentElement?.className ?? "";
      expect(frame).toContain("sm:aspect-[4/3]");
      expect(frame).toContain("lg:aspect-[16/9]");
      expect(frame).toContain("xl:h-[clamp(7.5rem,18svh,10rem)]");
    });

    it("opens the booking chooser from the same-day card", async () => {
      render(<Hero />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /book a visit/i }));
      await expectBookingChooser();
    });

    it("describes telehealth as a bookable appointment type, 24/7", () => {
      render(<Hero />);
      expect(
        screen.getByText(
          "Day or night, a video appointment with a pediatrician from home. Call us or book online."
        )
      ).toBeInTheDocument();
    });

    it("opens the booking chooser from the telehealth card", async () => {
      render(<Hero />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /book a telehealth visit/i }));
      await expectBookingChooser();
    });

    it("colors every card call to action with the bright teal", () => {
      render(<Hero />);
      for (const cta of [
        screen.getByRole("button", { name: /book a visit/i }),
        screen.getByRole("button", { name: /book a telehealth visit/i }),
        screen.getByRole("link", { name: /get urgent care now/i }),
      ]) {
        expect(cta.className).toContain("text-teal-bright");
      }
    });

    it("links the after-hours card to the After-Hours site in a new tab, announced", () => {
      render(<Hero />);
      const link = screen.getByRole("link", { name: /get urgent care now \(opens in a new tab\)/i });
      expect(link).toHaveAttribute("href", "https://pediatricafterhour.com/");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(screen.getByRole("img", { name: "After-Hours Pediatric Urgent Care" })).toBeInTheDocument();
    });

    it("keeps the after-hours phone number tappable as its own tel: link", () => {
      render(<Hero />);
      expect(screen.getByRole("link", { name: "Call (818) 280-4268" })).toHaveAttribute(
        "href",
        "tel:+18182804268"
      );
    });
  });

  describe("partner marquee", () => {
    // Logos with a dark-mode copy carry the alt on both images; CSS shows one
    // per theme (jsdom loads no CSS, so both are counted here).
    it("exposes each partner logo once per theme to assistive tech, in a labelled list", () => {
      render(<Hero />);
      const strip = within(screen.getByRole("list", { name: "Trusted Partners & Affiliations" }));
      for (const partner of partners) {
        expect(strip.getAllByRole("img", { name: partner.name })).toHaveLength(partner.markDarkSrc ? 2 : 1);
      }
    });

    it("includes the USC logo", () => {
      render(<Hero />);
      const strip = within(screen.getByRole("list", { name: "Trusted Partners & Affiliations" }));
      expect(strip.getByRole("img", { name: "University of Southern California" })).toHaveAttribute(
        "src",
        "/partners/usc.png"
      );
    });

    it("follows the theme: a surface-coloured band, with dark-mode logo copies swapped in", () => {
      render(<Hero />);
      const list = screen.getByRole("list", { name: "Trusted Partners & Affiliations" });
      const band = list.closest(".backdrop-blur-lg");
      expect(band?.className).toContain("bg-surface/95");
      expect(band?.className).not.toContain("bg-white");
      for (const partner of partners.filter((p) => p.markDarkSrc)) {
        const [light, dark] = within(list).getAllByRole("img", { name: partner.name });
        expect(light).toHaveAttribute("src", partner.markSrc);
        expect(light.className).toContain("logo-light");
        expect(dark).toHaveAttribute("src", partner.markDarkSrc);
        expect(dark.className).toContain("logo-dark");
      }
    });

    it("has no visible heading over the strip", () => {
      render(<Hero />);
      expect(screen.queryByText("Trusted Partners & Affiliations")).not.toBeInTheDocument();
    });

    it("shows the cropped logos in their brand colours with no tile behind them", () => {
      render(<Hero />);
      const strip = within(screen.getByRole("list", { name: "Trusted Partners & Affiliations" }));
      for (const partner of partners) {
        const [logo] = strip.getAllByRole("img", { name: partner.name });
        expect(logo).toHaveAttribute("src", partner.markSrc);
        expect(logo.className).toContain("xl:h-10");
        expect(logo.className).not.toContain("invert");
        expect(logo.className).not.toContain("brightness-0");
        expect(logo.closest("li")?.className ?? "").not.toContain("bg-white");
      }
    });

    it("loops a duplicated track that is hidden from assistive tech", () => {
      const { container } = render(<Hero />);
      const items = container.querySelectorAll("ul.w-max > li");
      expect(items).toHaveLength(partners.length * 4);
      const hidden = container.querySelectorAll('ul.w-max > li[aria-hidden="true"]');
      expect(hidden).toHaveLength(partners.length * 3);
    });

    it("stops for reduced motion", () => {
      const { container } = render(<Hero />);
      const track = container.querySelector("ul.w-max");
      expect(track?.className).toContain("animate-[ktmg-marquee_46s_linear_infinite]");
      expect(track?.className).toContain("motion-reduce:animate-none");
    });

    it("pauses on hover and has no pause button", () => {
      const { container } = render(<Hero />);
      const track = container.querySelector("ul.w-max");
      expect(track?.className).toContain("hover:[animation-play-state:paused]");
      expect(screen.queryByRole("button", { name: /partner logos/i })).not.toBeInTheDocument();
    });
  });

  it("renders all 4 stats as term/definition pairs in the bottom strip", () => {
    render(<Hero />);
    const terms = screen.getAllByRole("term").map((el) => el.textContent);
    expect(terms).toEqual([
      "Clinic locations",
      "Board-certified providers",
      "Years of pediatric care",
      "Ages served",
    ]);
  });

  it("renders the embedded One Network panel with its social row", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the network/i })).toHaveAttribute(
      "href",
      "/network"
    );
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  });

  it("is at least one screenful below the sticky header on large viewports", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("lg:min-h-[calc(100svh-var(--header-h,4rem))]");
  });

  it("scales vertical padding with viewport height and goes two-column only at xl", () => {
    const { container } = render(<Hero />);
    const content = container.querySelector("section > div.max-w-7xl.flex-col");
    expect(content?.className).toContain("lg:py-[clamp(1rem,2.75svh,2.25rem)]");
    const care = screen.getByRole("tabpanel", { name: "Care today" }).firstElementChild;
    expect(care?.className).toContain("xl:grid-cols-[minmax(0,1fr)_28rem]");
    expect(care?.className).not.toContain("lg:grid-cols-");
  });

  describe("slides", () => {
    it("shows the care slide first, with the why-us slide in the page but inert", () => {
      render(<Hero />);
      expect(screen.getByRole("tab", { name: "Care today" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: "Why families choose us" })).toHaveAttribute(
        "aria-selected",
        "false"
      );
      const why = screen.getByRole("tabpanel", { name: "Why families choose us" });
      expect(why).toHaveAttribute("inert");
      expect(within(why).getByRole("heading", { level: 2 })).toHaveTextContent("Every kid. Every plan.");
    });

    it("switches to the why-us slide from its tab", async () => {
      render(<Hero />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("tab", { name: "Why families choose us" }));
      expect(screen.getByRole("tabpanel", { name: "Why families choose us" })).not.toHaveAttribute("inert");
      expect(screen.getByRole("tabpanel", { name: "Care today" })).toHaveAttribute("inert");
    });

    it("keeps the one h1 on the care slide", () => {
      render(<Hero />);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(careSlide().getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
