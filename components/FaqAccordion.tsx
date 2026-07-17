"use client";

import { Fragment, useState } from "react";
import { useLocale } from "next-intl";
import type { FaqItem } from "@/data/faq";
import { Reveal } from "@/components/Reveal";

type FaqAccordionProps = {
  items: FaqItem[];
  revealOnScroll?: boolean;
};

export function FaqAccordion({ items, revealOnScroll = false }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const locale = useLocale();

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = item.id === openId;
        const buttonId = `faq-button-${item.id}`;
        const panelId = `faq-panel-${item.id}`;
        const question = locale === "es" ? item.questionEs : item.question;
        const answer = locale === "es" ? item.answerEs : item.answer;

        const card = (
          <div className="rounded-2xl bg-white shadow-card">
            <h3 className="contents">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-display font-bold text-ink transition-colors hover:text-teal-dark sm:py-5"
              >
                <span>{question}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-4 w-4 shrink-0 text-teal-dark transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-5 text-sm text-ink-soft sm:text-base"
            >
              {answer}
            </div>
          </div>
        );

        return revealOnScroll ? (
          <Reveal key={item.id} delayMs={Math.min(i, 4) * 70}>
            {card}
          </Reveal>
        ) : (
          <Fragment key={item.id}>{card}</Fragment>
        );
      })}
    </div>
  );
}
