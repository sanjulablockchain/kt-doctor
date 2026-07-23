import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/services",
    title: t("services.title"),
    description: t("services.description"),
  });
}

export default function ServicesPage() {
  return <ServicesPageContent />;
}
