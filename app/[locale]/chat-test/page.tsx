import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ChatTestPageContent } from "@/components/ChatTestPageContent";

// Unlisted page for testing the RingCentral web chat before it goes site-wide.
// Kept out of search results via noindex and out of app/sitemap.ts, and not
// linked from any navigation. Anyone with the URL can still open it.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return {
    ...buildMetadata({
      locale,
      path: "/chat-test",
      title: t("chatTest.title"),
      description: t("chatTest.description"),
    }),
    robots: { index: false, follow: false },
  };
}

export default function ChatTestPage() {
  return <ChatTestPageContent />;
}
