import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ContactPageContent } from "./ContactPageContent";
import { MAIN_PHONE, TEXT_PHONE, GENERAL_EMAIL } from "@/lib/constants";

describe("ContactPageContent", () => {
  it("renders the hero heading", () => {
    render(<ContactPageContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: /how can we help/i })
    ).toBeInTheDocument();
  });

  it("shows the practice contact channels from constants", () => {
    render(<ContactPageContent />);
    expect(screen.getByText(MAIN_PHONE)).toBeInTheDocument();
    expect(screen.getByText(TEXT_PHONE)).toBeInTheDocument();
    expect(screen.getByText(GENERAL_EMAIL)).toBeInTheDocument();
  });

  it("renders office hours and the emergency notice", () => {
    render(<ContactPageContent />);
    expect(screen.getByText(/office hours/i)).toBeInTheDocument();
    expect(screen.getByText(/telehealth only/i)).toBeInTheDocument();
    expect(screen.getByText(/medical emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/911/)).toBeInTheDocument();
  });

  it("renders the message form", () => {
    render(<ContactPageContent />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});
