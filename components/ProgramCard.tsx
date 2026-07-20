import { useLocale } from "next-intl";
import type { FoundationProgram } from "@/data/foundation";

type ProgramCardProps = {
  program: FoundationProgram;
};

export function ProgramCard({ program }: ProgramCardProps) {
  const locale = useLocale();
  const name = locale === "es" ? program.nameEs : program.name;
  const description = locale === "es" ? program.descriptionEs : program.description;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <p className="font-display text-base font-bold text-ink">{name}</p>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
    </div>
  );
}
