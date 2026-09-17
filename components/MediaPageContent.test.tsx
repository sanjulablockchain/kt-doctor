import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { MediaPageContent } from "./MediaPageContent";
import { pressReleases } from "@/data/pressReleases";
import { pressBios } from "@/data/pressBios";
import { mediaKitSections, mediaDownloads, uscFlyer } from "@/data/mediaKit";

describe("MediaPageContent", () => {
  it("renders the English page heading", () => {
    render(<MediaPageContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Press and Media Interest"
    );
  });

  it("renders the Spanish page heading and section headings when locale is es", () => {
    render(<MediaPageContent />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Interés de Prensa y Medios"
    );
    expect(screen.getByRole("heading", { name: "Comunicados de Prensa" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kit de Prensa" })).toBeInTheDocument();
  });

  it("names the leadership section for the biography it holds", () => {
    render(<MediaPageContent />);
    expect(screen.getByRole("heading", { name: "Leadership Biography" })).toBeInTheDocument();
    expect(screen.getByText("Meet the Founder, Kids & Teens Medical Group")).toBeInTheDocument();
  });

  // The invitation to get in touch is the one line on the hub that asks the
  // reader to act, so the closing words are a real link rather than flat text.
  it("turns the closing words of the contact invitation into a link to /contact", () => {
    render(<MediaPageContent />);
    const link = screen.getByRole("link", { name: "Contact Us" });
    expect(link).toHaveAttribute("href", "/contact");
    expect(link.closest("p")?.textContent).toContain("Media, Partnership, Events Interest");
  });

  it("renders the contact invitation in Spanish when locale is es", () => {
    render(<MediaPageContent />, "es");
    expect(screen.getByRole("link", { name: "ponerse en contacto" })).toHaveAttribute(
      "href",
      "/es/contact"
    );
  });

  it("renders both lines of the downloads introduction", () => {
    render(<MediaPageContent />);
    expect(screen.getByText("For Print and Publication Interest")).toBeInTheDocument();
    expect(
      screen.getByText("Convenient Ready-to-Download Files from Our Media Kit")
    ).toBeInTheDocument();
  });

  it("leads with the press release, linking to its own page", () => {
    render(<MediaPageContent />);
    const release = pressReleases[0];
    expect(screen.getByText(release.title)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /read the release/i });
    expect(link).toHaveAttribute("href", `/media/press/${release.id}`);
  });

  it("shows the press release date as a machine-readable time element", () => {
    const { container } = render(<MediaPageContent />);
    const time = container.querySelector("time");
    expect(time).toHaveAttribute("dateTime", pressReleases[0].date);
    expect(time).toHaveTextContent(pressReleases[0].displayDate);
  });

  it("renders the press release title in Spanish when locale is es", () => {
    render(<MediaPageContent />, "es");
    expect(screen.getByText(pressReleases[0].titleEs)).toBeInTheDocument();
  });

  it("links the leadership card to the press biography page", () => {
    render(<MediaPageContent />);
    const link = screen.getByRole("link", { name: /read the biography/i });
    expect(link).toHaveAttribute("href", `/media/leadership/${pressBios[0].id}`);
  });

  // Scoped to the leadership card: the USC flyer's alt text names her too.
  it("gives the founder portrait meaningful alt text naming her", () => {
    render(<MediaPageContent />);
    const leadership = screen.getByRole("region", { name: /leadership/i });
    const portrait = within(leadership).getByRole("img", { name: /janesri de silva/i });
    expect(portrait).toBeInTheDocument();
  });

  it("renders every media kit tab as a link to its page on this site", () => {
    render(<MediaPageContent />);
    const kit = screen.getByRole("region", { name: /media kit/i });
    for (const section of mediaKitSections) {
      const link = within(kit).getByRole("link", { name: new RegExp(section.title, "i") });
      expect(link).toHaveAttribute("href", section.href);
    }
  });

  it("offers each kit section's PDF as a separate download link", () => {
    render(<MediaPageContent />);
    const kit = screen.getByRole("region", { name: /media kit/i });
    const pdfLinks = within(kit)
      .getAllByRole("link")
      .filter((a) => (a.getAttribute("href") ?? "").endsWith(".pdf"));
    expect(pdfLinks).toHaveLength(mediaKitSections.length);
    for (const link of pdfLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  // Matched on exact text rather than a RegExp built from the title: the title
  // contains a pipe, which would be read as regex alternation.
  it("offers the complete media kit as a download", () => {
    render(<MediaPageContent />);
    const kit = mediaDownloads.find((d) => d.id === "media-kit")!;
    expect(screen.getByRole("link", { name: kit.title })).toHaveAttribute("href", kit.href);
    expect(screen.getByText(kit.description)).toBeInTheDocument();
  });

  it("gives each section a labelled region so the page is navigable by landmark", () => {
    render(<MediaPageContent />);
    for (const name of [
      /press releases/i,
      /leadership/i,
      /media kit/i,
      /USC partnership/i,
      /downloads/i,
    ]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
  });
});

describe("MediaPageContent USC flyer section", () => {
  it("renders the flyer with alt text describing it", () => {
    render(<MediaPageContent />);
    const image = screen.getByRole("img", { name: uscFlyer.alt });
    expect(image).toBeInTheDocument();
  });

  // She asked for this piece specifically "right before the Downloads section".
  it("sits between the media kit and the downloads section", () => {
    render(<MediaPageContent />);
    const kit = screen.getByRole("region", { name: /media kit/i });
    const flyer = screen.getByRole("region", { name: /USC partnership/i });
    const downloads = screen.getByRole("region", { name: /downloads/i });

    expect(kit.compareDocumentPosition(flyer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      flyer.compareDocumentPosition(downloads) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("restates the flyer's key facts as real text beside the image", () => {
    render(<MediaPageContent />);
    const flyer = screen.getByRole("region", { name: /USC partnership/i });
    for (const highlight of uscFlyer.highlights) {
      expect(within(flyer).getByText(highlight.text)).toBeInTheDocument();
    }
  });

  it("offers a full-size view of the flyer in a new tab", () => {
    render(<MediaPageContent />);
    const flyer = screen.getByRole("region", { name: /USC partnership/i });
    const link = within(flyer).getByRole("link", { name: /view full size/i });
    expect(link).toHaveAttribute("href", uscFlyer.imageSrc);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders the section heading and highlights in Spanish when locale is es", () => {
    render(<MediaPageContent />, "es");
    const flyer = screen.getByRole("region", { name: /alianza con USC/i });
    expect(within(flyer).getByText(uscFlyer.highlights[0].textEs)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: uscFlyer.altEs })).toBeInTheDocument();
  });
});
