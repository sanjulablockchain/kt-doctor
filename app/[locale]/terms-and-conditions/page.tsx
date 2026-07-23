import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { LegalPageContent } from "@/components/LegalPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/terms-and-conditions",
    title: t("termsAndConditions.title"),
    description: t("termsAndConditions.description"),
  });
}

export default function TermsAndConditionsPage() {
  return <LegalPageContent doc="terms" />;
}
