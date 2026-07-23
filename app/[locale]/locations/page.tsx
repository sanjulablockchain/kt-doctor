import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { LocationsPageContent } from "@/components/LocationsPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/locations",
    title: t("locations.title"),
    description: t("locations.description"),
  });
}

export default function LocationsPage() {
  return <LocationsPageContent />;
}
