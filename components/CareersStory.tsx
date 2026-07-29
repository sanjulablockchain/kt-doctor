"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

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
        <p className="mt-4 text-ink-soft">{t("storyBody1")}</p>
        <p className="mt-3 text-ink-soft">{t("storyBody2")}</p>
      </Reveal>
      <Reveal delayMs={100}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-card">
          <video
            controls
            preload="none"
            poster="/careers/story-video-poster.jpg"
            width={1280}
            height={720}
            className="aspect-video w-full bg-black"
          >
            <source src="/careers/story-video.mp4" type="video/mp4" />
          </video>
        </div>
        <p className="mt-2 text-xs text-ink-soft">{t("storyVideoCaptionNote")}</p>
      </Reveal>
    </section>
  );
}
