import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BackLink } from "@/components/BackLink";
import { stories } from "@/data/stories";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

function findStory(slug: string) {
  return stories.find((s) => s.id === slug) ?? null;
}

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const story = findStory(slug);
  if (!story) return {};
  const title = locale === "es" ? story.titleEs : story.title;
  const description = locale === "es" ? story.excerptEs : story.excerpt;
  return buildMetadata({
    locale,
    path: `/blog/${story.id}`,
    title,
    description,
    type: "article",
    dedicatedOgImage: true,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}) {
  const { slug, locale } = await params;
  const story = findStory(slug);
  if (!story) {
    notFound();
  }
  const title = locale === "es" ? story.titleEs : story.title;
  const excerpt = locale === "es" ? story.excerptEs : story.excerpt;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <JsonLd data={articleJsonLd(story, locale ?? "en")} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: locale === "es" ? "Inicio" : "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: story.title, path: `/blog/${story.id}` },
          ],
          locale ?? "en"
        )}
      />
      <BackLink href="/blog" messageKey="backToBlog" namespace="Blog" />

      <p className="mt-6 flex flex-wrap gap-x-2 text-xs font-semibold text-ink-soft">
        <span>{story.date}</span>
        {story.author ? <span>{story.author}</span> : null}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <Image
          src={story.imageSrc}
          alt={title}
          width={800}
          height={450}
          unoptimized
          className="h-64 w-full object-cover sm:h-80"
        />
      </div>

      <p className="mt-6 text-lg font-semibold text-ink-soft">{excerpt}</p>

      <div className="mt-8 flex flex-col gap-6">
        {story.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-xl font-bold text-ink">
              {locale === "es" ? section.headingEs : section.heading}
            </h2>
            <p className="mt-2 text-ink-soft">
              {locale === "es" ? section.bodyEs : section.body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
