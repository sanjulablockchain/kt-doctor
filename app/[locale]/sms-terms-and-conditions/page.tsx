import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { LegalPageContent } from "@/components/LegalPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/sms-terms-and-conditions",
    title: t("smsTermsAndConditions.title"),
    description: t("smsTermsAndConditions.description"),
  });
}

export default function SmsTermsAndConditionsPage() {
  return <LegalPageContent doc="smsTerms" />;
}
