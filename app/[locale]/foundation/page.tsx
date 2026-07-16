import type { Metadata } from "next";
import Image from "next/image";
import { foundation, sriLankaProgram, sriLankaSchools } from "@/data/foundation";
import { ProgramCard } from "@/components/ProgramCard";
import { SriLankaTimeline } from "@/components/SriLankaTimeline";

export const metadata: Metadata = {
  title: "Kids and Teens Foundation | Kids & Teens Medical Group",
  description:
    "The Kids and Teens Foundation provides free clinic days, medical missions, mentorship, scholarships, community outreach, and a school wellness initiative in Negombo, Sri Lanka, alongside Kids & Teens Medical Group.",
};

export default function FoundationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-white p-8 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={foundation.logoSrc}
            alt={`${foundation.name} logo`}
            width={160}
            height={53}
            unoptimized
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="font-display text-xl font-bold text-ink">{foundation.name}</h1>
            <p className="mt-1 max-w-md text-sm text-ink-soft">{foundation.mission}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={foundation.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-teal px-5 py-2.5 text-center font-display text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
          >
            Donate now
          </a>
          <a
            href={foundation.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-white px-5 py-2.5 text-center font-display text-sm font-semibold text-ink transition-colors hover:border-teal hover:text-teal-dark"
          >
            Visit the Foundation site →
          </a>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Our programs
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {foundation.programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <span className="mt-14 block font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Sri Lanka Initiative
      </span>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {sriLankaProgram.heading}
      </h2>
      <p className="mt-2 max-w-2xl text-ink-soft">{sriLankaProgram.mission}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="font-display text-sm font-bold text-ink">
            Preventive Health Screenings
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Early detection of health issues through regular screenings for
            vision, hearing, dental, and nutrition, reducing long-term
            healthcare costs.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">Student Mental Wellness</p>
          <p className="mt-1 text-sm text-ink-soft">
            On-campus counseling and mental health support programs that
            improve academic performance, reduce absenteeism, and build
            resilience.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">
            International Healthcare Standards
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Bringing US-trained pediatric expertise and evidence-based
            protocols to Sri Lanka, elevating the quality of school-based
            healthcare.
          </p>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-ink">Community Health Impact</p>
          <p className="mt-1 text-sm text-ink-soft">
            Wellness centers serve not just students but entire families,
            creating a ripple effect of health literacy and preventive care
            across Negombo.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SriLankaTimeline schools={sriLankaSchools} />
      </div>

      <a
        href={foundation.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block font-display font-semibold text-teal-dark hover:text-teal"
      >
        See live campaign progress &amp; donate →
      </a>
    </main>
  );
}
