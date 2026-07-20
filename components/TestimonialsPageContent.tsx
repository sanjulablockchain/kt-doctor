"use client";

import { useTranslations } from "next-intl";
import { locations } from "@/data/locations";
import type { Location } from "@/lib/types";

function googleReviewsUrl(location: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Kids & Teens Medical Group ${location.name} ${location.address}`
  )}`;
}

export function TestimonialsPageContent() {
  const t = useTranslations("Testimonials");

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("intro1")}</p>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("intro2")}</p>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        {t("googleReviewsHeading")}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t("googleReviewsSubheading")}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {locations.map((location) => (
          <a
            key={location.id}
            href={googleReviewsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-center font-display text-sm font-semibold text-teal-dark shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
          >
            {location.name}
          </a>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-ink-soft">{t("closing")}</p>
    </main>
  );
}
