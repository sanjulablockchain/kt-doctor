"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pressReleases } from "@/data/pressReleases";
import { pressBios } from "@/data/pressBios";
import { mediaKitSections, mediaDownloads } from "@/data/mediaKit";
import { withBasePath } from "@/lib/basePath";

const sectionHeadingClass =
  "font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl";

const cardClass = "rounded-2xl border border-border bg-surface p-5 shadow-card";

const actionClass =
  "inline-flex items-center gap-1 font-display text-sm font-semibold text-teal-dark hover:text-teal";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 shrink-0">
      <path
        d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MediaPageContent() {
  const t = useTranslations("Media");
  const locale = useLocale();
  const isEs = locale === "es";

  const release = pressReleases[0];
  const bio = pressBios[0];
  const downloads = mediaDownloads.filter((d) => d.available);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("description")}</p>

      {/* Press release. Given a lead treatment rather than a card in a grid:
          it is the newest piece and the reason most journalists arrive here. */}
      <section aria-labelledby="media-press" className="mt-12">
        <h2 id="media-press" className={sectionHeadingClass}>
          {t("pressHeading")}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{t("pressDescription")}</p>

        <article className={`mt-5 ${cardClass} sm:p-7`}>
          <time
            dateTime={release.date}
            className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft"
          >
            {isEs ? release.displayDateEs : release.displayDate}
          </time>
          <h3 className="mt-2 max-w-3xl font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
            {isEs ? release.titleEs : release.title}
          </h3>
          <p className="mt-3 max-w-3xl text-ink-soft">{isEs ? release.excerptEs : release.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={`/media/press/${release.id}`} className={actionClass}>
              {t("readRelease")}
            </Link>
            <a
              href={withBasePath(release.pdfHref)}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              <DownloadIcon />
              {t("downloadPdf")}
            </a>
          </div>
        </article>
      </section>

      {/* Leadership. */}
      <section aria-labelledby="media-leadership" className="mt-12">
        <h2 id="media-leadership" className={sectionHeadingClass}>
          {t("leadershipHeading")}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{t("leadershipDescription")}</p>

        <article className={`mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6 ${cardClass} sm:p-7`}>
          <Image
            src={withBasePath(bio.portraitSrc)}
            alt={`${bio.name}, ${bio.credentials}`}
            width={160}
            height={160}
            className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-32 sm:w-32"
          />
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold text-ink">
              {bio.name}, {bio.credentials}
            </h3>
            <p className="mt-1 text-sm font-medium text-teal-dark">{isEs ? bio.roleEs : bio.role}</p>
            <p className="mt-3 max-w-2xl text-ink-soft">{isEs ? bio.summaryEs : bio.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={`/media/leadership/${bio.id}`} className={actionClass}>
                {t("readBiography")}
              </Link>
              <a
                href={withBasePath(bio.pdfHref)}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                <DownloadIcon />
                {t("downloadPdf")}
              </a>
            </div>
          </div>
        </article>
      </section>

      {/* Media kit. Each tab opens the matching page on this site; the original
          PDF for that section sits alongside it as a separate download. */}
      <section aria-labelledby="media-kit" className="mt-12">
        <h2 id="media-kit" className={sectionHeadingClass}>
          {t("kitHeading")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("kitDescription")}</p>

        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mediaKitSections.map((section) => (
            <li
              key={section.id}
              className={`flex flex-col ${cardClass} transition-all hover:-translate-y-1 hover:shadow-soft`}
            >
              <h3 className="font-display text-base font-bold text-ink">
                <Link href={section.href} className="hover:text-teal-dark">
                  {isEs ? section.titleEs : section.title}
                </Link>
              </h3>
              <p className="mt-2 grow text-sm text-ink-soft">
                {isEs ? section.descriptionEs : section.description}
              </p>
              <a
                href={withBasePath(section.pdfHref)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 ${actionClass}`}
              >
                <DownloadIcon />
                {t("downloadPdf")}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Downloads. */}
      <section aria-labelledby="media-downloads" className="mt-12">
        <h2 id="media-downloads" className={sectionHeadingClass}>
          {t("downloadsHeading")}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{t("downloadsDescription")}</p>

        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {downloads.map((download) => (
            <li key={download.id} className={cardClass}>
              <a
                href={withBasePath(download.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-base font-bold text-ink hover:text-teal-dark"
              >
                {isEs ? download.titleEs : download.title}
              </a>
              <p className="mt-2 text-sm text-ink-soft">
                {isEs ? download.descriptionEs : download.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
