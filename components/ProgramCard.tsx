import type { FoundationProgram } from "@/data/foundation";

type ProgramCardProps = {
  program: FoundationProgram;
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <p className="font-display text-base font-bold text-ink">{program.name}</p>
      <p className="mt-2 text-sm text-ink-soft">{program.description}</p>
    </div>
  );
}
