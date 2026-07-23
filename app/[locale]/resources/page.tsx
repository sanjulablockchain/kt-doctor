import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ResourcesPageContent } from "@/components/ResourcesPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/resources",
    title: t("resources.title"),
    description: t("resources.description"),
  });
}

export default function ResourcesPage() {
  return <ResourcesPageContent />;
}
