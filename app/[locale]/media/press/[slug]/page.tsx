import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pressReleases } from "@/data/pressReleases";
import { buildMetadata, pressReleaseJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PressReleaseArticle } from "@/components/PressReleaseArticle";

function findRelease(slug: string) {
  return pressReleases.find((r) => r.id === slug) ?? null;
}

export function generateStaticParams() {
  return pressReleases.map((release) => ({ slug: release.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const release = findRelease(slug);
  if (!release) return {};
  const isEs = locale === "es";
  return buildMetadata({
    locale,
    path: `/media/press/${release.id}`,
    title: isEs ? release.titleEs : release.title,
    description: isEs ? release.excerptEs : release.excerpt,
    type: "article",
  });
}

export default async function PressReleasePage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale } = await params;
  const release = findRelease(slug);
  if (!release) {
    notFound();
  }

  return (
    <>
      <JsonLd data={pressReleaseJsonLd(release, locale ?? "en")} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: locale === "es" ? "Inicio" : "Home", path: "/" },
            { name: locale === "es" ? "Prensa" : "Media", path: "/media" },
            { name: release.title, path: `/media/press/${release.id}` },
          ],
          locale ?? "en"
        )}
      />
      <PressReleaseArticle release={release} />
    </>
  );
}
