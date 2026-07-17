import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/lib/test-utils";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders a button per page and reports clicks", async () => {
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
    );

    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 3" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page with aria-current", () => {
    renderWithIntl(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Go to page 2" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("button", { name: "Go to page 1" })
    ).not.toHaveAttribute("aria-current");
  });

  it("disables Previous on the first page and Next on the last", () => {
    const { unmount } = renderWithIntl(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    unmount();

    renderWithIntl(
      <Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("moves to the neighbouring page via Previous and Next", async () => {
    const onPageChange = vi.fn();
    renderWithIntl(
      <Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("collapses long page lists with ellipses", () => {
    renderWithIntl(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: "Go to page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 6" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to page 10" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to page 3" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go to page 8" })
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("renders nothing when there is only one page", () => {
    renderWithIntl(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
