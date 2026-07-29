"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { roleCategories, positions, type Department } from "@/data/careers";

type Props = {
  onExplore: (departments: Department[]) => void;
};

export function CareersRoleBrowser({ onExplore }: Props) {
  const t = useTranslations("Careers");
  const locale = useLocale();

  return (
    <section className="bg-ivory-deep">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t("roleBrowserHeading")}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t("roleBrowserIntro")}</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roleCategories.map((category, i) => {
            const title = locale === "es" ? category.titleEs : category.title;
            const description = locale === "es" ? category.descriptionEs : category.description;
            const count = positions.filter((p) => category.departments.includes(p.department)).length;
            return (
              <Reveal key={category.id} delayMs={Math.min(i, 6) * 40}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-ink">{title}</h3>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{description}</p>
                  <p className="mt-3 text-xs font-semibold text-teal-dark">
                    {t("roleBrowserOpenRoles", { count })}
                  </p>
                  <button
                    type="button"
                    onClick={() => onExplore(category.departments)}
                    className="mt-4 self-start rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
                  >
                    {t("roleBrowserExplore")}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal delayMs={160}>
            <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
              {t("roleBrowserClosingHeading")}
            </h3>
            <p className="mt-3 text-ink-soft">{t("roleBrowserClosingBody")}</p>
          </Reveal>
          <Reveal delayMs={220}>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/careers/culture.jpg"
                alt={t("roleBrowserImageAlt")}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
