"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { PressBio } from "@/data/pressBios";
import { withBasePath } from "@/lib/basePath";

type PressBioArticleProps = {
  bio: PressBio;
};

export function PressBioArticle({ bio }: PressBioArticleProps) {
  const t = useTranslations("Media");
  const isEs = useLocale() === "es";

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/media"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← {t("backToMedia")}
      </Link>

      <article className="mt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <Image
            src={withBasePath(bio.portraitSrc)}
            alt={`${bio.name}, ${bio.credentials}`}
            width={192}
            height={192}
            className="h-28 w-28 shrink-0 rounded-2xl object-cover sm:h-36 sm:w-36"
          />
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {bio.name}, {bio.credentials}
            </h1>
            <p className="mt-2 font-display text-base font-semibold text-teal-dark">
              {isEs ? bio.roleEs : bio.role}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 leading-relaxed text-ink-soft">
          {bio.body.map((paragraph) => (
            <p key={paragraph.text.slice(0, 48)}>{isEs ? paragraph.textEs : paragraph.text}</p>
          ))}
        </div>

        {/* The one deliberately louder block on the page. The source PDF closed
            with this as an ordinary paragraph, but it is the only part of the
            biography that asks the reader to do something. */}
        {bio.speaking ? (
          <section
            aria-labelledby="bio-speaking"
            className="mt-10 rounded-2xl border border-gold/40 bg-gold-tint p-5 sm:p-6"
          >
            <h2 id="bio-speaking" className="font-display text-lg font-bold text-ink">
              {t("speakingHeading")}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {isEs ? bio.speaking.textEs : bio.speaking.text}
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center rounded-xl bg-teal px-4 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-teal-dark"
            >
              {t("speakingCta")}
            </Link>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
          <Link
            href={`/doctors/${bio.doctorId}`}
            className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
          >
            {t("patientProfile")}
          </Link>
          <a
            href={withBasePath(bio.pdfHref)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-teal-dark hover:text-teal"
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
        </div>
      </article>
    </main>
  );
}
