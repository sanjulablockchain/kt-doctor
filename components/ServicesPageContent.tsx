"use client";

import { useLocale, useTranslations } from "next-intl";
import { serviceCategories } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";

export function ServicesPageContent() {
  const t = useTranslations("Services");
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

      {serviceCategories.map((category) => (
        <section key={category.id} className="mt-10">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {locale === "es" ? category.nameEs : category.name}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
