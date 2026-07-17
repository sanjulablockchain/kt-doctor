import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import DoctorsPage from "./page";

describe("DoctorsPage", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView; the page calls it on page change.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("shows only the first page of doctors and filters by search", async () => {
    renderWithIntl(<DoctorsPage />);

    // Adrienne is on page 1; Faiza is page 2 and Martin page 3, so both are hidden.
    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.queryByText("Faiza Iram")).not.toBeInTheDocument();
    expect(screen.queryByText("Martin Fineberg")).not.toBeInTheDocument();

    const searchBox = screen.getByPlaceholderText("Search by name...");
    await userEvent.type(searchBox, "fineberg");

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
  });

  it("navigates to the second page of results", async () => {
    renderWithIntl(<DoctorsPage />);

    expect(screen.queryByText("Faiza Iram")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(screen.getByText("Faiza Iram")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
  });

  it("resets to the first page when a filter changes", async () => {
    renderWithIntl(<DoctorsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    expect(screen.getByText("Faiza Iram")).toBeInTheDocument();

    // "a" matches most names, so multiple pages remain and pagination stays visible.
    await userEvent.type(screen.getByPlaceholderText("Search by name..."), "a");

    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("filters by location", async () => {
    renderWithIntl(<DoctorsPage />);

    await userEvent.click(screen.getByRole("button", { name: "Filter by location" }));
    await userEvent.click(screen.getByRole("option", { name: "Valencia" }));

    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();
    expect(screen.queryByText("Martin Fineberg")).not.toBeInTheDocument();
  });

  it("renders the heading and search placeholder in Spanish when locale is es", () => {
    renderWithIntl(<DoctorsPage />, "es");
    expect(screen.getByText("Nuestros Doctores")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por nombre...")).toBeInTheDocument();
  });
});
