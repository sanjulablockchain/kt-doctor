import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { MediaPageContent } from "@/components/MediaPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/media",
    title: t("media.title"),
    description: t("media.description"),
  });
}

export default function MediaPage() {
  return <MediaPageContent />;
}
