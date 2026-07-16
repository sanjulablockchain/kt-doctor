import type { SriLankaSchool } from "@/data/foundation";

type SriLankaTimelineProps = {
  schools: SriLankaSchool[];
};

export function SriLankaTimeline({ schools }: SriLankaTimelineProps) {
  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
      <div className="relative pl-6">
        <div
          className="absolute bottom-1 left-1.75 top-1 w-0.5 bg-teal-tint"
          aria-hidden="true"
          data-testid="sri-lanka-timeline-line"
        />
        <ul className="flex flex-col gap-4">
          {schools.map((school) => (
            <li key={school.id} className="relative">
              <span
                className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-teal-tint bg-teal"
                aria-hidden="true"
              />
              <p className="font-display text-base font-bold text-ink">{school.name}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {school.location} · {school.studentCount}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {school.programs.map((program) => (
                  <span
                    key={program}
                    className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
