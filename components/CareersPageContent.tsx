"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { PositionDetailsModal } from "@/components/PositionDetailsModal";
import { FilterDropdown } from "@/components/FilterDropdown";
import { CAREERS_EMAILS } from "@/lib/constants";
import {
  positions,
  DEPARTMENTS,
  type Department,
  type EmploymentType,
} from "@/data/careers";

const DEPT_KEY: Record<Department, string> = {
  Clinical: "deptClinical",
  "Clinical Support": "deptClinicalSupport",
  Administration: "deptAdministration",
  Operations: "deptOperations",
  Therapy: "deptTherapy",
  Finance: "deptFinance",
};

const TYPE_KEY: Record<EmploymentType, string> = {
  "Full-time": "typeFullTime",
  "Part-time": "typePartTime",
  "Full-time / Part-time": "typeFullPartTime",
};

const PERKS = ["perk1", "perk2", "perk3", "perk4"] as const;

// One distinct glyph per perk: salary (dollar sign), scheduling (clock),
// locations (map pin), team culture (two people).
const PERK_ICONS = {
  perk1: (
    <>
      <path d="M12 2v20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M17 6.5c0-2-2.2-3-5-3s-5 1.2-5 3.2 2.2 2.8 5 3.3 5 1.5 5 3.3-2.2 3.2-5 3.2-5-1-5-3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  perk2: (
    <>
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  perk3: (
    <>
      <path
        d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </>
  ),
  perk4: (
    <>
      <path
        d="M16 18v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path
        d="M22 18v-2a3 3 0 0 0-2.2-2.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 2.1a3.5 3.5 0 0 1 0 6.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
} as const;
const CULTURE_VALUES = ["cultureValue1", "cultureValue2", "cultureValue3", "cultureValue4"] as const;
const BENEFITS = [
  ["benefit1Title", "benefit1Body"],
  ["benefit2Title", "benefit2Body"],
  ["benefit3Title", "benefit3Body"],
  ["benefit4Title", "benefit4Body"],
] as const;

export function CareersPageContent() {
  const t = useTranslations("Careers");
  const locale = useLocale();
  const [department, setDepartment] = useState<"all" | Department>("all");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const shown = positions.filter((p) => department === "all" || p.department === department);
  const detailsPosition = detailsId ? positions.find((p) => p.id === detailsId) ?? null : null;

  function applyTo(id: string) {
    setDetailsId(null);
    setSelectedPositionId(id);
    if (typeof document !== "undefined") {
      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <Image
          src="/careers/hero.jpg"
          alt={t("heroImageAlt")}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-tint">
            {t("eyebrow")}
          </span>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t("heroHeading")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">{t("heroSubhead")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#positions"
              className="rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
            >
              {t("heroCtaPositions")}
            </a>
            <a
              href="#apply"
              className="rounded-full border border-white/40 px-7 py-3.5 text-center font-display font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("heroCtaApply")}
            </a>
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="bg-ivory-deep">
        <div className="mx-auto grid max-w-5xl gap-3 px-5 py-8 sm:grid-cols-2 sm:px-8 md:grid-cols-4">
          {PERKS.map((key) => (
            <div
              key={key}
              className="group relative flex flex-col items-start gap-2 overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              {/* Accent bar lives inside the card, clipped by overflow-hidden,
                  so it can never float above or misalign with the card edge.
                  Short at rest, grows to full height on hover. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-[0.28] bg-linear-to-b from-teal to-teal-dark transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-9 w-9 text-teal">
                {PERK_ICONS[key]}
              </svg>
              <span className="font-display text-sm font-semibold leading-snug text-navy sm:text-base">
                {t(key)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("benefitsHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t("benefitsIntro")}</p>
        </Reveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(([title, body], i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="h-full rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-teal/30 hover:shadow-soft">
                  <h3 className="font-display text-base font-bold text-ink">{t(title)}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{t(body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delayMs={120}>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/benefits.jpg"
                alt={t("benefitsImageAlt")}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Open positions */}
      <section id="positions" className="bg-ivory-deep">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("positionsHeading", { count: positions.length })}
            </h2>
            <FilterDropdown
              ariaLabel={t("filterLabel")}
              value={department === "all" ? "" : department}
              placeholder={t("deptAll")}
              options={DEPARTMENTS.map((d) => ({ value: d, label: t(DEPT_KEY[d]) }))}
              onChange={(value) => setDepartment((value === "" ? "all" : value) as "all" | Department)}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {shown.length === 0 && <p className="text-ink-soft">{t("noOpenings")}</p>}
            {shown.map((p, i) => (
              <Reveal key={p.id} delayMs={Math.min(i, 6) * 40}>
                <article className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {locale === "es" ? p.titleEs : p.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                      <span>{p.locations}</span>
                      <span aria-hidden>·</span>
                      <span>{t(TYPE_KEY[p.employmentType])}</span>
                      <span className="rounded-full bg-teal-tint px-2.5 py-0.5 font-display font-semibold text-teal-dark">
                        {t(DEPT_KEY[p.department])}
                      </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-ink-soft">
                      {locale === "es" ? p.summaryEs : p.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailsId(p.id)}
                      className="rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
                    >
                      {t("detailsLabel")}
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTo(p.id)}
                      className="rounded-full bg-teal px-6 py-2.5 font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
                    >
                      {t("applyLabel")}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/culture.jpg"
                alt={t("cultureImageAlt")}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {t("cultureHeading")}
            </h2>
            <p className="mt-3 text-ink-soft">{t("cultureBody")}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {CULTURE_VALUES.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-tint text-teal-dark">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3 w-3">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="bg-ivory-deep">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
            {t("formEyebrow")}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("formHeading")}
          </h2>
          <p className="mt-2 text-ink-soft">{t("formIntro")}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {t("emailDirect")}{" "}
            <a
              href={`mailto:${CAREERS_EMAILS.join(",")}`}
              className="font-display font-semibold text-teal-dark underline underline-offset-2"
            >
              {CAREERS_EMAILS.join(" and ")}
            </a>
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-card">
            <JobApplicationForm
              positionId={selectedPositionId}
              onPositionChange={setSelectedPositionId}
            />
          </div>
        </div>
      </section>

      {/* Anti-scam notice — small bottom padding only; the footer's mt-16
          already provides the gap before it (avoids doubling up the band). */}
      <section className="mx-auto max-w-4xl px-5 pt-10 pb-4 sm:px-8">
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm text-ink-soft shadow-card">
          {t("postingsNotice")}
        </div>
      </section>

      {detailsPosition && (
        <PositionDetailsModal
          position={detailsPosition}
          onClose={() => setDetailsId(null)}
          onApply={applyTo}
        />
      )}
    </main>
  );
}
