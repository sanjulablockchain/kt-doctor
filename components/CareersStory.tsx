"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { withBasePath } from "@/lib/basePath";

export function CareersStory() {
  const t = useTranslations("Careers");

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <Reveal>
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
          {t("storyEyebrow")}
        </span>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t("storyHeading")}
        </h2>
        {/* storyBody1/storyBody2 (messages/en.json, messages/es.json) are a minimal,
            fact-limited draft of the founder story pending client confirmation. They
            reference real named individuals (Dr. Janesri De Silva, Sunil De Silva), so
            only claims already verifiable elsewhere in this codebase (e.g. data/foundation.ts)
            are stated; client to confirm/edit before launch, same as the seed position list
            in data/careers.ts and the FAQ content in data/careersFaq.ts. */}
        <p className="mt-4 text-ink-soft">{t("storyBody1")}</p>
        <p className="mt-3 text-ink-soft">{t("storyBody2")}</p>
      </Reveal>
      <Reveal delayMs={100}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-card">
          <video
            controls
            preload="none"
            poster={withBasePath("/careers/story-video-poster.jpg")}
            width={1280}
            height={720}
            className="aspect-video w-full bg-black"
          >
            <source src={withBasePath("/careers/story-video.mp4")} type="video/mp4" />
          </video>
        </div>
      </Reveal>
    </section>
  );
}
