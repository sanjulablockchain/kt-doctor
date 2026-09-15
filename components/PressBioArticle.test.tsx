import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { PressBioArticle } from "./PressBioArticle";
import { pressBios } from "@/data/pressBios";

const bio = pressBios[0];

describe("PressBioArticle", () => {
  it("renders the name and credentials as the page's only h1", () => {
    render(<PressBioArticle bio={bio} />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Janesri De Silva, MD, FAAP");
  });

  it("renders the role beneath the name", () => {
    render(<PressBioArticle bio={bio} />);
    expect(screen.getByText(bio.role)).toBeInTheDocument();
  });

  it("gives the portrait alt text naming the subject", () => {
    render(<PressBioArticle bio={bio} />);
    expect(screen.getByRole("img", { name: /janesri de silva/i })).toBeInTheDocument();
  });

  it("renders every body paragraph", () => {
    const { container } = render(<PressBioArticle bio={bio} />);
    const text = container.textContent ?? "";
    for (const paragraph of bio.body) {
      expect(text).toContain(paragraph.text);
    }
  });

  // The speaking availability is a real call to action that the source PDF
  // buried in its closing paragraph.
  it("gives speaking availability its own section with a contact link", () => {
    render(<PressBioArticle bio={bio} />);
    const heading = screen.getByRole("heading", { name: /speaking and interviews/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(bio.speaking!.text)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("cross-links to the patient-facing doctor profile", () => {
    render(<PressBioArticle bio={bio} />);
    expect(screen.getByRole("link", { name: /patient-facing profile/i })).toHaveAttribute(
      "href",
      `/doctors/${bio.doctorId}`
    );
  });

  it("offers the original PDF in a new tab", () => {
    render(<PressBioArticle bio={bio} />);
    const link = screen.getByRole("link", { name: /download pdf/i });
    expect(link).toHaveAttribute("href", bio.pdfHref);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("links back to the media hub", () => {
    render(<PressBioArticle bio={bio} />);
    expect(screen.getByRole("link", { name: /back to media/i })).toHaveAttribute("href", "/media");
  });

  it("renders the Spanish role, body and speaking copy when locale is es", () => {
    const { container } = render(<PressBioArticle bio={bio} />, "es");
    expect(screen.getByText(bio.roleEs)).toBeInTheDocument();
    expect(container.textContent).toContain(bio.body[0].textEs);
    expect(screen.getByText(bio.speaking!.textEs)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /póngase en contacto/i })).toHaveAttribute(
      "href",
      "/es/contact"
    );
  });
});
