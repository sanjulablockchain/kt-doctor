import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ContactPageContent } from "@/components/ContactPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
  });
}

export default function ContactPage() {
  return <ContactPageContent />;
}
