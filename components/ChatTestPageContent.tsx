"use client";

import { useTranslations } from "next-intl";
import { RingCentralChat } from "@/components/RingCentralChat";

export function ChatTestPageContent() {
  const t = useTranslations("ChatTest");

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <span className="block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-6 text-ink-soft">{t("intro")}</p>
      <p className="mt-4 text-ink-soft">{t("instructions")}</p>
      <p className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm font-semibold text-ink">
        {t("privacyNote")}
      </p>
      <RingCentralChat />
    </main>
  );
}
