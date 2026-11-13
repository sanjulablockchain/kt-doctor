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
    path: "/sms-privacy-policy",
    title: t("smsPrivacyPolicy.title"),
    description: t("smsPrivacyPolicy.description"),
  });
}

export default function SmsPrivacyPolicyPage() {
  return <LegalPageContent doc="smsPrivacy" />;
}
