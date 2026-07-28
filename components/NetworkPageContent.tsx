"use client";

import { useTranslations } from "next-intl";
import { networkBrands, networkCategoryOrder } from "@/data/network";
import { NetworkCard } from "@/components/NetworkCard";

export function NetworkPageContent() {
  const t = useTranslations("Network");

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">{t("description")}</p>

      <div className="mt-12 space-y-14">
        {networkCategoryOrder.map((category) => {
          const brandsInCategory = networkBrands.filter((brand) => brand.category === category);
          if (brandsInCategory.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {t(`groups.${category}.title`)}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-ink-soft">
                {t(`groups.${category}.description`)}
              </p>

              <div
                className={`mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                  category === "care" ? "lg:grid-cols-3" : ""
                }`}
              >
                {brandsInCategory.map((brand) => (
                  <NetworkCard key={brand.id} brand={brand} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
