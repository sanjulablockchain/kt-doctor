"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
  durationMs?: number;
};

type ParsedValue = {
  prefix: string;
  target: number;
  suffix: string;
};

// Animates the last number found in the string (e.g. "56+" -> 56, "0-21" ->
// animates the 21 while "0-" stays a static prefix). Falls back to rendering
// the raw string untouched if it contains no digits at all.
function parseValue(value: string): ParsedValue | null {
  const matches = [...value.matchAll(/\d+/g)];
  if (matches.length === 0) return null;
  const last = matches[matches.length - 1];
  const start = last.index ?? 0;
  return {
    prefix: value.slice(0, start),
    target: parseInt(last[0], 10),
    suffix: value.slice(start + last[0].length),
  };
}

const STEPS = 30;

export function AnimatedCounter({ value, durationMs = 1200 }: AnimatedCounterProps) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!parsed) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplay(parsed.target);
      return;
    }

    function animate() {
      if (hasAnimated.current || !parsed) return;
      hasAnimated.current = true;

      let step = 0;
      const stepMs = durationMs / STEPS;
      const interval = setInterval(() => {
        step += 1;
        const progress = Math.min(step / STEPS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * parsed.target));
        if (step >= STEPS) clearInterval(interval);
      }, stepMs);
    }

    const node = spanRef.current;
    if (typeof IntersectionObserver === "undefined" || !node) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [parsed, durationMs]);

  if (!parsed) {
    return <span>{value}</span>;
  }

  return (
    <span ref={spanRef}>
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </span>
  );
}
