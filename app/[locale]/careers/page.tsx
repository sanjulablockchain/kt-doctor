import type { Metadata } from "next";
import { CAREERS_APPLY_MAILTO } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers | Kids & Teens Medical Group",
  description:
    "Join Kids & Teens Medical Group's pediatric network. Email your resume, and check our social media, company sites, or Indeed for current openings.",
};

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-teal-dark">
        Careers
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Build your career at Kids &amp; Teens.
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        We&apos;re always glad to hear from clinicians and staff who want to
        join a pediatric network built around same-day care and long-term
        patient relationships. Email us your resume and we&apos;ll reach out
        if there&apos;s a fit.
      </p>

      <a
        href={CAREERS_APPLY_MAILTO}
        className="mt-6 inline-block rounded-full bg-teal px-7 py-3.5 text-center font-display font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teal-dark"
      >
        Email Us Your Resume
      </a>

      <div className="mt-10 rounded-2xl border border-border bg-white p-5 text-sm text-ink-soft shadow-card">
        Our official job postings are only shared on our social media pages,
        our own company websites, and Indeed. Be cautious of postings
        claiming to represent Kids &amp; Teens Medical Group anywhere else.
      </div>
    </main>
  );
}
