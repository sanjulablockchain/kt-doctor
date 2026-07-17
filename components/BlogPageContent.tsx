"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { stories } from "@/data/stories";

export function BlogPageContent() {
  const t = useTranslations("Blog");
  const locale = useLocale();

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("intro")}</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => {
          const title = locale === "es" ? story.titleEs : story.title;
          const excerpt = locale === "es" ? story.excerptEs : story.excerpt;

          return (
            <Link
              key={story.id}
              href={`/blog/${story.id}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <Image
                src={story.imageSrc}
                alt={title}
                width={300}
                height={225}
                unoptimized
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold text-ink-soft">{story.date}</p>
                <p className="mt-2 font-display text-base font-bold text-ink">{title}</p>
                <p className="mt-2 text-sm text-ink-soft">{excerpt}</p>
                <span className="mt-auto pt-4 font-display text-sm font-semibold text-teal-dark">
                  {t("readFullStory")} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
