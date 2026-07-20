"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  privacyPolicy,
  termsAndConditions,
  type LegalBlock,
  type LegalDocument,
} from "@/data/legal";

type DocKey = "privacy" | "terms";
type TitleKey = "privacyTitle" | "termsTitle";

const DOCS: Record<DocKey, { document: LegalDocument; titleKey: TitleKey }> = {
  privacy: { document: privacyPolicy, titleKey: "privacyTitle" },
  terms: { document: termsAndConditions, titleKey: "termsTitle" },
};

// Format an ISO date for display. UTC keeps the rendered day stable across
// timezones so server and client markup match.
function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function BlockView({ block, es }: { block: LegalBlock; es: boolean }) {
  if (block.type === "paragraph") {
    return <p className="mt-4 text-ink-soft">{es ? block.textEs : block.text}</p>;
  }

  return (
    <ul className="mt-4 flex flex-col gap-3 text-ink-soft">
      {block.items.map((item) => {
        const label = es ? item.labelEs : item.label;
        return (
          <li key={item.text} className="flex gap-2.5">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
            <span>
              {label ? <strong className="font-semibold text-ink">{label} </strong> : null}
              {es ? item.textEs : item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function LegalPageContent({ doc }: { doc: DocKey }) {
  const t = useTranslations("Legal");
  const locale = useLocale();
  const es = locale === "es";
  const { document, titleKey } = DOCS[doc];

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        href="/"
        className="font-display text-sm font-semibold text-teal-dark hover:text-teal"
      >
        ← {t("backToHome")}
      </Link>

      <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        {t("eyebrow")}
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {t(titleKey)}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t("effectiveLabel")}: {formatDate(document.effectiveDate, locale)}
      </p>

      <p className="mt-6 text-ink-soft">{es ? document.intro.textEs : document.intro.text}</p>

      <div className="mt-8 flex flex-col gap-8">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-bold text-ink">
              {es ? section.headingEs : section.heading}
            </h2>
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} es={es} />
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
