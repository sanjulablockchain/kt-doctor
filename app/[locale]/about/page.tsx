import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { AboutPageContent } from "@/components/AboutPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("about.title"),
    description: t("about.description"),
  });
}

export default function AboutPage() {
  return <AboutPageContent />;
}
