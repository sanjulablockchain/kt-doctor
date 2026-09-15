import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { PressReleaseArticle } from "./PressReleaseArticle";
import { pressReleases } from "@/data/pressReleases";

const release = pressReleases[0];

describe("PressReleaseArticle", () => {
  it("opens with the For Immediate Release kicker", () => {
    render(<PressReleaseArticle release={release} />);
    expect(screen.getByText("For Immediate Release")).toBeInTheDocument();
  });

  it("renders the headline as the page's only h1", () => {
    render(<PressReleaseArticle release={release} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(release.title);
  });

  it("renders the deck beneath the headline", () => {
    render(<PressReleaseArticle release={release} />);
    expect(screen.getByText(release.deck)).toBeInTheDocument();
  });

  it("renders the date as a machine-readable time element", () => {
    const { container } = render(<PressReleaseArticle release={release} />);
    const time = container.querySelector("time");
    expect(time).toHaveAttribute("dateTime", release.date);
    expect(time).toHaveTextContent(release.displayDate);
  });

  it("prefixes the opening paragraph with the dateline", () => {
    const { container } = render(<PressReleaseArticle release={release} />);
    const paragraphs = container.querySelectorAll("article p");
    const opening = Array.from(paragraphs).find((p) =>
      p.textContent?.includes(release.body[0].text)
    );
    expect(opening?.textContent).toContain(release.dateline);
  });

  it("renders every body paragraph", () => {
    const { container } = render(<PressReleaseArticle release={release} />);
    const text = container.textContent ?? "";
    for (const paragraph of release.body) {
      expect(text).toContain(paragraph.text);
    }
  });

  it("offers the original PDF in a new tab", () => {
    render(<PressReleaseArticle release={release} />);
    const link = screen.getByRole("link", { name: /download pdf/i });
    expect(link).toHaveAttribute("href", release.pdfHref);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links back to the media hub", () => {
    render(<PressReleaseArticle release={release} />);
    expect(screen.getByRole("link", { name: /back to media/i })).toHaveAttribute("href", "/media");
  });

  it("closes with the about boilerplate and an end marker", () => {
    render(<PressReleaseArticle release={release} />);
    expect(
      screen.getByRole("heading", { name: /about kids & teens medical group/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/end of release/i)).toBeInTheDocument();
  });

  it("renders a media contact section pointing at the practice", () => {
    render(<PressReleaseArticle release={release} />);
    expect(screen.getByRole("heading", { name: /media contact/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /customerservice@ktdoctor\.com/i })).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com"
    );
  });

  it("renders the Spanish headline, deck and body when locale is es", () => {
    const { container } = render(<PressReleaseArticle release={release} />, "es");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(release.titleEs);
    expect(screen.getByText(release.deckEs)).toBeInTheDocument();
    expect(container.textContent).toContain(release.body[0].textEs);
    expect(screen.getByText("Para publicación inmediata")).toBeInTheDocument();
  });
});
