"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PressRelease } from "@/data/pressReleases";
import { GENERAL_EMAIL, MAIN_PHONE, SITE_NAME } from "@/lib/constants";
import { toE164 } from "@/lib/phone";
import { withBasePath } from "@/lib/basePath";

type PressReleaseArticleProps = {
  release: PressRelease;
};

export function PressReleaseArticle({ release }: PressReleaseArticleProps) {
  const t = useTranslations("Media");
  const isEs = useLocale() === "es";

  const body = release.body.map((p) => (isEs ? p.textEs : p.text));

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/media"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← {t("backToMedia")}
      </Link>

      <article className="mt-6">
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("forImmediateRelease")}
        </p>

        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {isEs ? release.titleEs : release.title}
        </h1>

        <p className="mt-4 text-lg font-semibold leading-relaxed text-ink-soft">
          {isEs ? release.deckEs : release.deck}
        </p>

        <time
          dateTime={release.date}
          className="mt-5 block text-sm font-medium text-ink-soft"
        >
          {isEs ? release.displayDateEs : release.displayDate}
        </time>

        <div className="mt-8 flex flex-col gap-5 leading-relaxed text-ink-soft">
          {body.map((paragraph, index) => (
            <p key={paragraph.slice(0, 48)}>
              {index === 0 ? (
                <span className="font-semibold text-ink">
                  ({isEs ? release.datelineEs : release.dateline}){" "}
                </span>
              ) : null}
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-10 text-center font-display text-sm font-semibold tracking-widest text-ink-soft">
          {t("endOfRelease")}
        </p>

        <section
          aria-labelledby="release-boilerplate"
          className="mt-10 rounded-2xl border border-border bg-ivory-deep/50 p-5 sm:p-6"
        >
          <h2
            id="release-boilerplate"
            className="font-display text-base font-bold text-ink"
          >
            {t("boilerplateHeading")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("boilerplate")}</p>
        </section>

        <section aria-labelledby="release-contact" className="mt-8">
          <h2 id="release-contact" className="font-display text-base font-bold text-ink">
            {t("mediaContactHeading")}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">{t("mediaContactDescription")}</p>
          <p className="mt-3 flex flex-col gap-1 text-sm">
            <span className="font-semibold text-ink">{SITE_NAME}</span>
            <a
              href={`mailto:${GENERAL_EMAIL}`}
              className="font-medium text-teal-dark hover:text-teal"
            >
              {GENERAL_EMAIL}
            </a>
            <a
              href={`tel:${toE164(MAIN_PHONE)}`}
              className="font-medium text-teal-dark hover:text-teal"
            >
              {MAIN_PHONE}
            </a>
          </p>
        </section>

        <a
          href={withBasePath(release.pdfHref)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-tint px-4 py-2.5 font-display text-sm font-semibold text-teal-dark transition-colors hover:bg-teal hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 shrink-0">
            <path
              d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("downloadPdf")}
        </a>
      </article>
    </main>
  );
}
