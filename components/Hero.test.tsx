import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { Hero } from "./Hero";
import { locations } from "@/data/locations";
import { partners } from "@/data/partners";
import { BOOKING_URL } from "@/lib/constants";

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
      "Where little smiles mean everything"
    );
    expect(
      screen.getByText(new RegExp(`at ${locations.length} clinics across Greater LA`))
    ).toBeInTheDocument();
  });

  it("renders the Spanish copy", () => {
    render(<Hero />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Donde las pequeñas sonrisas lo significan todo"
    );
    expect(screen.getByRole("heading", { level: 2, name: "Citas el mismo día" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Citas de telesalud" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reservar una visita de telesalud/i })
    ).toBeInTheDocument();
  });

  it("opens the booking options chooser from the primary CTA", async () => {
    render(<Hero />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /book an appointment/i }));
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
      const cards = screen
        .getAllByRole("heading", { level: 2 })
        .map((h) => h.textContent);
      expect(cards).toEqual(["Same-day appointments", "Telehealth appointments", "After hours urgent care"]);
      expect(
        screen.getByRole("img", { name: "A pediatrician listening to a child's chest with a stethoscope" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: "A pediatrician taking notes during a video telehealth visit" })
      ).toBeInTheDocument();
    });

    it("gives the photo the larger share of each stacked card", () => {
      render(<Hero />);
      const photo = screen.getByRole("img", {
        name: "A pediatrician listening to a child's chest with a stethoscope",
      });
      const frame = photo.parentElement?.className ?? "";
      expect(frame).toContain("sm:aspect-square");
      expect(frame).toContain("xl:h-[clamp(9rem,25svh,15rem)]");
    });

    it("opens the booking chooser from the same-day card", async () => {
      render(<Hero />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /book a visit/i }));
      await expectBookingChooser();
    });

    it("describes telehealth as a bookable appointment type, 7 days a week", () => {
      render(<Hero />);
      expect(
        screen.getByText(
          "Available 7 days a week. A video appointment from home, easy to arrange. Call us or book online."
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
    it("exposes each partner logo once to assistive tech, in a labelled list", () => {
      render(<Hero />);
      expect(screen.getByRole("list", { name: "Trusted Partners & Affiliations" })).toBeInTheDocument();
      for (const partner of partners) {
        expect(screen.getAllByRole("img", { name: partner.name })).toHaveLength(1);
      }
    });

    it("has no visible heading over the strip", () => {
      render(<Hero />);
      expect(screen.queryByText("Trusted Partners & Affiliations")).not.toBeInTheDocument();
    });

    it("shows the cropped logos in their brand colours with no tile behind them", () => {
      render(<Hero />);
      for (const partner of partners) {
        const logo = screen.getByRole("img", { name: partner.name });
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
      expect(track?.className).toContain("animate-[ktmg-marquee_40s_linear_infinite]");
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
    const content = container.querySelector("section > div.grid");
    expect(content?.className).toContain("lg:py-[clamp(1rem,3.5svh,2.75rem)]");
    expect(content?.className).toContain("xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]");
    expect(content?.className).not.toContain("lg:grid-cols-");
  });
});
