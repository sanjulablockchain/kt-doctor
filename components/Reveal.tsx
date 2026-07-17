"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
};

// Fade-and-slide-up-on-scroll wrapper. Renders children in a div that animates
// from translate-y-4/opacity-0 to fully visible the first time it enters the
// viewport, then stays put (fires once). Inert under reduced motion or when
// IntersectionObserver is unavailable: in those cases it renders fully visible
// so content is never trapped hidden (SSR / no-JS / jsdom). Because every reveal
// target on the homepage sits below the fold, the post-mount arm→hide step is
// never visible.
export function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof IntersectionObserver === "undefined") return;
    const node = ref.current;
    if (!node) return;

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const hidden = armed && !revealed && !reducedMotion;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${
        hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
