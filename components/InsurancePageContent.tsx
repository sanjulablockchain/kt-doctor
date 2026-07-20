"use client";

import { useTranslations } from "next-intl";
import { insuranceInfo } from "@/data/insurance";
import { MAIN_PHONE } from "@/lib/constants";

function toE164(usPhone: string): string {
  return `+1${usPhone.replace(/\D/g, "")}`;
}

export function InsurancePageContent() {
  const t = useTranslations("Insurance");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-card">
        <p className="font-display text-lg font-bold text-ink">{t("hmoRestrictionsTitle")}</p>
        <p className="mt-2 text-ink-soft">{t("hmoRestrictionsBody")}</p>
        <a
          href={insuranceInfo.serendibUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-display font-semibold text-teal-dark hover:text-teal"
        >
          {t("serendibLink")} →
        </a>
      </div>

      <a
        href={`tel:${toE164(MAIN_PHONE)}`}
        className="mt-8 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        {t("callToVerify")}
      </a>
    </main>
  );
}
