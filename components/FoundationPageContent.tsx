"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { foundation, sriLankaProgram, sriLankaSchools } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";
import { SriLankaTimeline } from "@/components/SriLankaTimeline";

export function FoundationPageContent() {
  const t = useTranslations("Foundation");
  const locale = useLocale();
  const mission = locale === "es" ? foundation.missionEs : foundation.mission;
  const sriLankaHeading = locale === "es" ? sriLankaProgram.headingEs : sriLankaProgram.heading;
  const sriLankaMission = locale === "es" ? sriLankaProgram.missionEs : sriLankaProgram.mission;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <Image
            src={foundation.logoSrc}
            alt={`${foundation.name} logo`}
            width={160}
            height={53}
            unoptimized
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-ink">{foundation.name}</h1>
            <p className="mt-1 max-w-md text-sm text-ink-soft">{mission}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <a
            href={foundation.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-5 py-2.5 text-center font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            {t("donateNow")}
          </a>
          <a
            href={foundation.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-center font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
          >
            {t("visitFoundationSite")} →
          </a>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {t("programsHeading")}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <span className="mt-14 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("sriLankaEyebrow")}
      </span>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {sriLankaHeading}
      </h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{sriLankaMission}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("preventiveScreeningsTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("preventiveScreeningsBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("studentWellnessTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("studentWellnessBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("internationalStandardsTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("internationalStandardsBody")}</p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">{t("communityImpactTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t("communityImpactBody")}</p>
        </div>
      </div>

      <div className="mt-6">
        <SriLankaTimeline schools={sriLankaSchools} />
      </div>

      <a
        href={foundation.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
      >
        {t("seeLiveCampaign")} →
      </a>
    </main>
  );
}
