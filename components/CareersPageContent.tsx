"use client";

import { useTranslations } from "next-intl";
import { CAREERS_APPLY_MAILTO } from "@/data/careers";

export function CareersPageContent() {
  const t = useTranslations("Careers");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">{t("description")}</p>

      <a
        href={CAREERS_APPLY_MAILTO}
        className="mt-6 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {t("emailResume")}
      </a>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-5 text-sm text-ink-soft shadow-card">
        {t("postingsNotice")}
      </div>
    </main>
  );
}
