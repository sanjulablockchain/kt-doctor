"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { locations } from "@/data/locations";
import { insuranceInfo } from "@/data/insurance";
import { BOOKING_URL } from "@/lib/constants";

export function AboutPageContent() {
  const t = useTranslations("About");

  const careAreas = [
    t("careaRoutineCheckups"),
    t("careAreaAllergies"),
    t("careAreaAdhd"),
    t("careAreaUrgentCare"),
    t("careAreaPrenatal"),
    t("careAreaAfterHours"),
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl font-display text-lg font-semibold text-teal-dark">
        {t("tagline")}
      </p>

      <p className="mt-5 max-w-2xl text-ink-soft">{t("intro")}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {careAreas.map((area) => (
          <span
            key={area}
            className="rounded-full bg-teal-tint px-4 py-2 font-display text-sm font-semibold text-teal-dark"
          >
            {area}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">
        {t("locationsIntro", { count: locations.length })}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {insuranceInfo.acceptedCategories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-gold-tint px-4 py-2 font-display text-sm font-semibold text-gold"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-ink-soft">{t("closing")}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
        >
          {t("bookAppointment")}
        </a>
        <Link
          href="/locations"
          className="rounded-full border border-border bg-surface px-7 py-3.5 text-center font-display font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
        >
          {t("findClinic")}
        </Link>
      </div>
    </main>
  );
}
