"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";

export type HeroSlide = {
  id: string;
  label: string;
  content: ReactNode;
};

const SWIPE_THRESHOLD_PX = 50;

// The hero's slides, switched by a labelled tab row rather than dots, so the
// second slide is discoverable. Manual only: the photo slideshow behind it
// already moves, and a second auto-advancing layer of long copy would be hard
// to read.
//
// From `xl` both slides share one grid cell, so the area is as tall as the
// taller slide and the stats strip below never jumps; the tabs sit under the
// slides. Below `xl` the first slide stacks into a long column, so sharing a
// cell would leave the short slide floating in empty space: there the inactive
// slide is removed instead, and the tabs move above the slides where they are
// visible without scrolling.
//
// The inactive slide is `inert`, so it is skipped by keyboard and screen
// readers, but it stays in the markup for search engines. Tabs follow the
// WAI-ARIA tabs pattern (roving tabindex, arrow/Home/End keys), and a
// horizontal swipe on touch screens switches slides too.
export function HeroCarousel({ slides, label }: { slides: HeroSlide[]; label: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function select(index: number, focus = false) {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: slides.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  }

  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: TouchEvent) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
    select(dx < 0 ? active + 1 : active - 1);
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-1 xl:gap-[clamp(0.75rem,2.4svh,1.5rem)]">
      <div
        role="tablist"
        aria-label={label}
        className="order-first inline-flex self-center rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md xl:order-last"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`hero-tab-${slide.id}`}
            aria-selected={index === active}
            aria-controls={`hero-slide-${slide.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={handleKeyDown}
            className={`cursor-pointer rounded-full px-4 py-2 font-display text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:px-5 ${
              index === active ? "bg-teal text-white shadow-soft" : "text-ivory/75 hover:text-ivory"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div className="grid xl:flex-1" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            id={`hero-slide-${slide.id}`}
            role="tabpanel"
            aria-labelledby={`hero-tab-${slide.id}`}
            inert={index !== active}
            className={`min-w-0 transition-opacity duration-500 motion-reduce:transition-none xl:[grid-area:1/1] xl:self-center ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0 max-xl:hidden"
            }`}
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
}
