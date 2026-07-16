import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import DoctorsPage from "./page";

describe("DoctorsPage", () => {
  it("renders all doctors by default and filters by search", async () => {
    renderWithIntl(<DoctorsPage />);

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.getByText("Adrienne C. Altman")).toBeInTheDocument();

    const searchBox = screen.getByPlaceholderText("Search by name...");
    await userEvent.type(searchBox, "fineberg");

    expect(screen.getByText("Martin Fineberg")).toBeInTheDocument();
    expect(screen.queryByText("Adrienne C. Altman")).not.toBeInTheDocument();
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
