"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { formatClockTime, formatUtcOffset } from "@/lib/clock";

// The server cannot know the visitor's timezone, so it renders this instead of
// committing to a time. Same character count as a real reading, so filling it
// in after hydration does not shift the layout.
const PLACEHOLDER = "--:--:--";

// A module-level store rather than useEffect + setState: `useSyncExternalStore`
// gives us the SSR placeholder for free via getServerSnapshot, and this repo
// lints against setState inside an effect body (react-hooks/set-state-in-effect).
// One interval is shared by every mounted clock and torn down with the last one.
const listeners = new Set<() => void>();
let snapshot = PLACEHOLDER;
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  const next = formatClockTime(new Date());
  // getSnapshot must stay referentially stable between real changes, otherwise
  // React re-renders in a loop.
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === null) {
    // Refresh immediately: the module may have loaded long before the drawer
    // was opened, leaving `snapshot` stale.
    snapshot = formatClockTime(new Date());
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
      snapshot = PLACEHOLDER;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return PLACEHOLDER;
}

// Live wall clock in the visitor's own timezone, read from their device. No
// geolocation and no network lookup involved.
export function LocalClock() {
  const t = useTranslations("SeasonTab");
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Only meaningful once the client has taken over; during SSR and hydration
  // the placeholder is showing and there is no offset to report yet.
  const isLive = time !== PLACEHOLDER;
  const offset = isLive ? formatUtcOffset(new Date().getTimezoneOffset()) : null;

  return (
    <div className="mt-4 flex items-start gap-1.5 self-start rounded-xl border border-border bg-ivory px-3 py-2">
      <time
        aria-label={t("clockLabel")}
        dateTime={isLive ? time : undefined}
        className="font-display text-2xl font-bold leading-none tracking-tight text-ink tabular-nums"
      >
        {time}
      </time>
      {offset ? (
        <span className="text-[0.6rem] font-semibold uppercase leading-none text-ink-soft">
          {offset}
        </span>
      ) : null}
    </div>
  );
}
