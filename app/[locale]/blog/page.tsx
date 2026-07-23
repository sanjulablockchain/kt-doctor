import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { BlogPageContent } from "@/components/BlogPageContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Seo" });
  return buildMetadata({
    locale,
    path: "/blog",
    title: t("blog.title"),
    description: t("blog.description"),
  });
}

export default function BlogPage() {
  return <BlogPageContent />;
}
