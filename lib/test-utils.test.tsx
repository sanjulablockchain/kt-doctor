import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "./test-utils";

function Greeting() {
  return <p>Hello</p>;
}

describe("renderWithIntl", () => {
  it("renders a component wrapped with NextIntlClientProvider", () => {
    renderWithIntl(<Greeting />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
