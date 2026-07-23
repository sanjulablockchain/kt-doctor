import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/data/faq";
import { HomePageContent } from "@/components/HomePageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("home.title"),
    description: t("home.description"),
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs, locale)} />
      <HomePageContent />
    </>
  );
}
