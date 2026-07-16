import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { stories } from "@/data/stories";

export const metadata: Metadata = {
  title: "Blog | Kids & Teens Medical Group",
  description:
    "Parent-friendly stories and tips from Kids & Teens Medical Group, from seasonal health advice to guidance on choosing the right care.",
};

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        From Our Blog
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Parent Stories & Tips
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Seasonal health advice, safety tips, and guidance from our pediatric team to help your
        family stay informed.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/blog/${story.id}`}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
          >
            <Image
              src={story.imageSrc}
              alt={story.title}
              width={300}
              height={225}
              unoptimized
              className="h-40 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold text-ink-soft">{story.date}</p>
              <p className="mt-2 font-display text-base font-bold text-ink">{story.title}</p>
              <p className="mt-2 text-sm text-ink-soft">{story.excerpt}</p>
              <span className="mt-auto pt-4 font-display text-sm font-semibold text-teal-dark">
                Read the full story →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
