import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/lib/test-utils";
import { ResourceCard } from "./ResourceCard";

describe("ResourceCard", () => {
  it("renders the name and description", () => {
    render(
      <ResourceCard
        resource={{
          id: "developmental-milestones",
          name: "Developmental Milestone Guides",
          description: "What to expect at each stage.",
          available: false,
        }}
      />
    );
    expect(screen.getByText("Developmental Milestone Guides")).toBeInTheDocument();
    expect(screen.getByText("What to expect at each stage.")).toBeInTheDocument();
  });

  it("shows a 'contact us for a copy' state when not available", () => {
    render(
      <ResourceCard
        resource={{
          id: "developmental-milestones",
          name: "Developmental Milestone Guides",
          description: "What to expect at each stage.",
          available: false,
        }}
      />
    );
    expect(screen.getByText(/contact us for a copy/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders an external link when available and external", () => {
    render(
      <ResourceCard
        resource={{
          id: "patient-forms",
          name: "Patient Forms",
          description: "New patient intake forms.",
          available: true,
          href: "https://healow.com/apps/jsp/webview/signIn.jsp",
          external: true,
        }}
      />
    );
    const link = screen.getByRole("link", { name: /patient forms/i });
    expect(link).toHaveAttribute("href", "https://healow.com/apps/jsp/webview/signIn.jsp");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders an internal link when available and not external", () => {
    render(
      <ResourceCard
        resource={{
          id: "our-doctors",
          name: "Our Doctors",
          description: "Meet our team.",
          available: true,
          href: "/doctors",
        }}
      />
    );
    const link = screen.getByRole("link", { name: /our doctors/i });
    expect(link).toHaveAttribute("href", "/doctors");
    expect(link).not.toHaveAttribute("target");
  });
});
