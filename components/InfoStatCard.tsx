"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type InfoStatCardProps = {
  href: string;
  // "teal" is the brand action panel (careers), "navy" the deep panel (insurance).
  variant: "teal" | "navy";
  icon: ReactNode; // inner <path>/<rect> of a 24x24 stroke icon
  stat: string; // e.g. "56+" — the last number animates in on scroll
  statLabel: string;
  heading: string;
  body: string;
  cta: string;
};

export function InfoStatCard({
  href,
  variant,
  icon,
  stat,
  statLabel,
  heading,
  body,
  cta,
}: InfoStatCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const textureRef = useRef<HTMLDivElement>(null);

  // Scroll parallax: the dotted texture drifts a few px as the card crosses the
  // viewport. The layer is oversized (-inset) so the shift never bares an edge.
  useEffect(() => {
    if (reducedMotion) return;
    const texture = textureRef.current;
    if (!texture) return;

    let frameId: number | null = null;

    function update() {
      frameId = null;
      if (!texture) return;
      const panel = texture.parentElement;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const fromCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);
      const offset = Math.max(-12, Math.min(12, fromCenter * 0.05));
      texture.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    function onScroll() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [reducedMotion]);

  const panelBg =
    variant === "teal" ? "bg-gradient-to-br from-teal to-teal-dark" : "bg-navy";
  const iconChip =
    variant === "teal" ? "bg-white/20 text-white" : "bg-teal/20 text-teal";

  return (
    <Link
      href={href}
      className="group relative flex min-h-[15rem] overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      {/* Stat panel */}
      <div
        className={`relative flex w-[38%] shrink-0 flex-col justify-between overflow-hidden p-5 sm:p-6 ${panelBg}`}
      >
        {/* Deepen the navy toward the corner so it reads with depth, not flat. */}
        {variant === "navy" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-black/35"
          />
        )}

        <div
          ref={textureRef}
          aria-hidden
          className="pointer-events-none absolute -inset-4 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.18) 1.3px, transparent 1.3px)",
            backgroundSize: "16px 16px",
          }}
        />

        <span
          className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${iconChip}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </span>

        <div className="relative mt-4">
          <span className="block font-display text-3xl font-extrabold leading-none text-white sm:text-4xl">
            <AnimatedCounter value={stat} />
          </span>
          <span className="mt-1 block font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
            {statLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-7">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {heading}
        </h3>
        <p className="mt-2 text-sm text-ink-soft">{body}</p>
        <span className="mt-4 inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-teal-dark">
          {cta}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
