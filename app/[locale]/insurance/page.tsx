import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { InsurancePageContent } from "@/components/InsurancePageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/insurance",
    title: t("insurance.title"),
    description: t("insurance.description"),
  });
}

export default function InsurancePage() {
  return <InsurancePageContent />;
}
