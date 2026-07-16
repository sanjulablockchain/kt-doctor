import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CareersPage from "./page";

describe("CareersPage", () => {
  it("renders an Email Us button linking to the real mailto address", () => {
    render(<CareersPage />);
    const link = screen.getByRole("link", { name: /email us your resume/i });
    expect(link).toHaveAttribute(
      "href",
      "mailto:customerservice@ktdoctor.com?subject=Job%20Application"
    );
  });

  it("renders the real note that official postings are on social media, company channels, and Indeed", () => {
    render(<CareersPage />);
    expect(screen.getByText(/indeed/i)).toBeInTheDocument();
  });

  it("does not render any specific job position listing", () => {
    render(<CareersPage />);
    expect(screen.queryByText(/pediatrician \(md\/do\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/medical assistant/i)).not.toBeInTheDocument();
  });
});
