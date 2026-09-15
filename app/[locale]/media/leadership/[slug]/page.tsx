import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pressBios } from "@/data/pressBios";
import { buildMetadata, pressBioJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PressBioArticle } from "@/components/PressBioArticle";

function findBio(slug: string) {
  return pressBios.find((b) => b.id === slug) ?? null;
}

export function generateStaticParams() {
  return pressBios.map((bio) => ({ slug: bio.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const bio = findBio(slug);
  if (!bio) return {};
  return buildMetadata({
    locale,
    path: `/media/leadership/${bio.id}`,
    title: `${bio.name}, ${bio.credentials}`,
    description: locale === "es" ? bio.summaryEs : bio.summary,
    type: "profile",
  });
}

export default async function PressBioPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale } = await params;
  const bio = findBio(slug);
  if (!bio) {
    notFound();
  }

  return (
    <>
      <JsonLd data={pressBioJsonLd(bio, locale ?? "en")} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: locale === "es" ? "Inicio" : "Home", path: "/" },
            { name: locale === "es" ? "Prensa" : "Media", path: "/media" },
            { name: bio.name, path: `/media/leadership/${bio.id}` },
          ],
          locale ?? "en"
        )}
      />
      <PressBioArticle bio={bio} />
    </>
  );
}
