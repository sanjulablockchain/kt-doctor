"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pressReleases } from "@/data/pressReleases";
import { pressBios } from "@/data/pressBios";
import { mediaKitSections, mediaDownloads, uscFlyer } from "@/data/mediaKit";
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

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{t("description")}</p>
      <p className="mt-2 max-w-2xl text-ink-soft">
        {t.rich("contactInvite", {
          link: (chunks) => (
            <Link href="/contact" className="font-semibold text-teal-dark hover:text-teal">
              {chunks}
            </Link>
          ),
        })}
      </p>

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

      {/* USC partnership flyer. Placed between the kit and the downloads at the
          client's request. The flyer's own text is restated beside it because a
          JPEG is unreadable to screen readers and to search. */}
      <section aria-labelledby="media-flyer" className="mt-12">
        <h2 id="media-flyer" className={sectionHeadingClass}>
          {t("flyerHeading")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("flyerDescription")}</p>

        {/* Full-bleed artwork. The flyer meets the card's top, bottom and left
            edges with no padding, so the card reads as one object instead of a
            picture floating inside a box: overflow-hidden clips the image to
            the card's radius, and the padding moves onto the text column. The
            card is also capped at 4xl, since four short lines stretched across
            the full 7xl column read as a mostly empty panel.

            Stacked until md, where the flyer bleeds across the top instead: a
            side-by-side row at 640px leaves the text barely 230px wide and
            wraps every line four ways. */}
        <div className="mt-5 flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:flex-row">
          {/* White plate behind the near-white flyer, so any letterboxing at
              the extremes reads as part of the artwork rather than as a gap.

              h-auto keeps the flyer uncropped while it is the taller column,
              which it is at every width with this copy. md:h-full with
              object-cover is the fallback if the text ever outgrows it, so the
              column still fills the card rather than leaving a white strip. */}
          <div className="w-full shrink-0 border-border bg-white md:w-60 md:border-r lg:w-72">
            <Image
              src={withBasePath(uscFlyer.imageSrc)}
              alt={isEs ? uscFlyer.altEs : uscFlyer.alt}
              width={uscFlyer.imageWidth}
              height={uscFlyer.imageHeight}
              sizes="(min-width: 1024px) 18rem, (min-width: 768px) 15rem, 100vw"
              className="h-auto w-full md:h-full md:object-cover md:object-top"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center p-5 md:p-7">
            <ul className="flex flex-col gap-3.5">
              {uscFlyer.highlights.map((highlight) => (
                <li key={highlight.text} className="flex gap-3 leading-relaxed text-ink-soft">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="mt-1 h-4 w-4 shrink-0 text-teal-dark"
                  >
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{isEs ? highlight.textEs : highlight.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={withBasePath(uscFlyer.imageSrc)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 font-display text-sm font-semibold text-teal-dark transition-colors hover:border-teal hover:bg-teal-tint hover:text-teal"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4 shrink-0">
                <path
                  d="M15 3h6v6M21 3l-8 8M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("flyerViewFull")}
            </a>
          </div>
        </div>
      </section>

      {/* Downloads. */}
      <section aria-labelledby="media-downloads" className="mt-12">
        <h2 id="media-downloads" className={sectionHeadingClass}>
          {t("downloadsHeading")}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">{t("downloadsDescription")}</p>
        <p className="mt-1 text-sm text-ink-soft">{t("downloadsSubline")}</p>

        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {mediaDownloads.map((download) => (
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
