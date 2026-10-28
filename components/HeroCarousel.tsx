"use client";

import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

export type HeroSlide = {
  id: string;
  label: string;
  content: ReactNode;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  label: string;
  pauseLabel: string;
  playLabel: string;
};

export const AUTO_ADVANCE_MS = 10_000;
const SWIPE_THRESHOLD_PX = 50;

// The hero's slides, switched by a labelled tab row rather than dots, so the
// second slide is discoverable.
//
// Auto-advance: a progress bar fills inside the active tab over
// AUTO_ADVANCE_MS, and its animationend moves to the next slide, so the bar and
// the switch can never drift apart. Pausing the bar's animation pauses the
// carousel: while hovered, while keyboard focus is inside it, or via the
// pause button (WCAG 2.2.2 needs a way to stop content that moves for more
// than 5s). Under reduced motion the bar and the button are hidden, and with
// no animation to end, nothing advances on its own.
//
// From `xl` both slides share one grid cell, so the area is as tall as the
// taller slide and the stats strip below never jumps; slides cross-fade with
// a small rise. Below `xl` the first slide stacks into a long column, so
// sharing a cell would leave the short slide floating in empty space: there
// the inactive slide is removed and the incoming one fades up instead, and the
// tabs move above the slides where they are visible without scrolling.
//
// The inactive slide is `inert`, so it is skipped by keyboard and screen
// readers, but it stays in the markup for search engines. Tabs follow the
// WAI-ARIA tabs pattern (roving tabindex, arrow/Home/End keys), and a
// horizontal swipe on touch screens switches slides too.
export function HeroCarousel({ slides, label, pauseLabel, playLabel }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const running = !stopped && !hovered && !keyboardFocus;

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

  // Only keyboard focus pauses: a mouse click on a tab also focuses it, and
  // that should not leave the carousel stopped once the pointer moves away.
  function handleFocus(event: FocusEvent) {
    let visible = false;
    try {
      visible = event.target.matches(":focus-visible");
    } catch {
      // Selector unsupported: treat as pointer focus.
    }
    setKeyboardFocus(visible);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
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
    <div
      className="flex flex-col gap-6 xl:flex-1 xl:gap-[clamp(0.75rem,2.4svh,1.5rem)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="order-first flex items-center gap-1 self-center rounded-full border border-white/15 bg-black/30 p-1 backdrop-blur-md xl:order-last">
        <div role="tablist" aria-label={label} className="flex items-center gap-1">
          {slides.map((slide, index) => {
            const selected = index === active;
            return (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`hero-tab-${slide.id}`}
                aria-selected={selected}
                aria-controls={`hero-slide-${slide.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={handleKeyDown}
                className={`relative cursor-pointer overflow-hidden rounded-full px-4 py-2 font-display text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:px-5 ${
                  selected ? "bg-teal text-white shadow-soft" : "text-ivory/75 hover:text-ivory"
                }`}
              >
                {slide.label}
                {selected && (
                  <span
                    // Remounted per slide (key) so the fill restarts from empty.
                    key={`progress-${active}`}
                    data-testid="hero-slide-progress"
                    aria-hidden
                    onAnimationEnd={() => select(active + 1)}
                    className="absolute inset-x-4 bottom-1 h-0.5 origin-left rounded-full bg-white/70 motion-reduce:hidden"
                    style={{
                      animationName: "ktmg-progress",
                      animationDuration: `${AUTO_ADVANCE_MS}ms`,
                      animationTimingFunction: "linear",
                      animationFillMode: "forwards",
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? playLabel : pauseLabel}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ivory/75 transition-colors hover:bg-white/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-tint motion-reduce:hidden"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-3.5 w-3.5">
            {stopped ? <path d="M8 5.5v13l10.5-6.5L8 5.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
        </button>
      </div>

      <div
        className="grid xl:flex-1"
        // Rotating content must not interrupt a screen reader; once stopped,
        // a slide change made by the visitor is announced politely.
        aria-live={running ? "off" : "polite"}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            id={`hero-slide-${slide.id}`}
            role="tabpanel"
            aria-labelledby={`hero-tab-${slide.id}`}
            inert={index !== active}
            className={`min-w-0 transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none xl:[grid-area:1/1] xl:self-center ${
              index === active
                ? "translate-y-0 opacity-100 max-xl:motion-safe:animate-[ktmg-fade-up_500ms_ease-out]"
                : "pointer-events-none opacity-0 max-xl:hidden xl:translate-y-3"
            }`}
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
}
