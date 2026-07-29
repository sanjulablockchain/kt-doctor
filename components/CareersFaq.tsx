"use client";

import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { careersFaq } from "@/data/careersFaq";

export function CareersFaq() {
  const t = useTranslations("Careers");
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <Reveal>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("faqHeading")}
        </h2>
      </Reveal>
      <div className="mt-8 flex flex-col gap-3">
        {careersFaq.map((item, i) => {
          const question = locale === "es" ? item.questionEs : item.question;
          const answer = locale === "es" ? item.answerEs : item.answer;
          return (
            <Reveal key={item.id} delayMs={Math.min(i, 6) * 40}>
              <details className="group rounded-2xl border border-border bg-surface p-5 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {question}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-teal-dark transition-transform group-open:rotate-180"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-ink-soft">{answer}</p>
              </details>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
