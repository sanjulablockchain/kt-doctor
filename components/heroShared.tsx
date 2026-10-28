// Pieces shared by the hero's slides (Hero, HeroWhySlide).

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

export function ArrowIcon({ diagonal = false, colorClass = "text-teal" }: { diagonal?: boolean; colorClass?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`h-3.5 w-3.5 shrink-0 ${colorClass} transition-transform group-hover:translate-x-0.5`}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={diagonal ? "M7 17 17 7M9 7h8v8" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}
