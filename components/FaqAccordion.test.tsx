import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl as render } from "@/lib/test-utils";
import { FaqAccordion } from "./FaqAccordion";
import type { FaqItem } from "@/data/faq";

const items: FaqItem[] = [
  {
    id: "one",
    question: "First question?",
    questionEs: "¿Primera pregunta?",
    answer: "First answer.",
    answerEs: "Primera respuesta.",
  },
  {
    id: "two",
    question: "Second question?",
    questionEs: "¿Segunda pregunta?",
    answer: "Second answer.",
    answerEs: "Segunda respuesta.",
  },
];

describe("FaqAccordion", () => {
  it("renders every question", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByText("First question?")).toBeInTheDocument();
    expect(screen.getByText("Second question?")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "First question?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Second question?" })).toBeInTheDocument();
  });

  it("keeps every answer collapsed by default", () => {
    render(<FaqAccordion items={items} />);
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText("First answer.")).not.toBeVisible();
  });

  it("expands an answer when its question is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: "First question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("First answer.")).toBeVisible();
  });

  it("closes the previously open answer when a different question is clicked", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    await user.click(screen.getByRole("button", { name: "First question?" }));
    await user.click(screen.getByRole("button", { name: "Second question?" }));
    expect(screen.getByRole("button", { name: "First question?" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.getByRole("button", { name: "Second question?" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("re-collapses an open answer when its question is clicked again", async () => {
    const user = userEvent.setup();
    render(<FaqAccordion items={items} />);
    const button = screen.getByRole("button", { name: "First question?" });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders the Spanish question and answer when locale is es", () => {
    render(
      <FaqAccordion
        items={[
          {
            id: "first-visit",
            question: "What should I bring to my child's first visit?",
            questionEs: "¿Qué debo llevar a la primera visita de mi hijo?",
            answer: "Please bring your child's insurance card.",
            answerEs: "Por favor traiga la tarjeta de seguro de su hijo.",
          },
        ]}
      />,
      "es"
    );
    expect(screen.getByText("¿Qué debo llevar a la primera visita de mi hijo?")).toBeInTheDocument();
  });

  it("still renders every question when revealOnScroll is enabled", () => {
    render(<FaqAccordion items={items} revealOnScroll />);
    for (const item of items) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });
});
