import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { TestimonialsPageContent } from "@/components/TestimonialsPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/testimonials",
    title: t("testimonials.title"),
    description: t("testimonials.description"),
  });
}

export default function TestimonialsPage() {
  return <TestimonialsPageContent />;
}
