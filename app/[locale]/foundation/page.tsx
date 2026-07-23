import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { FoundationPageContent } from "@/components/FoundationPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/foundation",
    title: t("foundation.title"),
    description: t("foundation.description"),
  });
}

export default function FoundationPage() {
  return <FoundationPageContent />;
}
