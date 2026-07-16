import type { Metadata } from "next";
import { parentResources } from "@/data/resources";
import { ResourceCard } from "@/components/ResourceCard";

export const metadata: Metadata = {
  title: "Parent Resources | Kids & Teens Medical Group",
  description:
    "Vaccine schedules, patient forms, and developmental milestone guides for Kids & Teens Medical Group families.",
};

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Parent Resources
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Everything in one place.
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Vaccine schedules, patient forms, and developmental guides for your
        family. Downloads are being added here soon. Contact your clinic in
        the meantime for a copy.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {parentResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </main>
  );
}
