import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { NetworkPageContent } from "@/components/NetworkPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/network",
    title: t("network.title"),
    description: t("network.description"),
  });
}

export default function NetworkPage() {
  return <NetworkPageContent />;
}
