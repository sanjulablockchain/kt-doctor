"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { formatClockTime, formatUtcOffset } from "@/lib/clock";

// The server cannot know the visitor's timezone, so it renders this instead of
// committing to a time. Same character count as a real reading, so filling it
// in after hydration does not shift the layout.
const PLACEHOLDER = "--:--:--";

// Sentinel for "the client has not taken over yet". Zero is safe because a real
// snapshot is a current epoch timestamp.
const NOT_LIVE = 0;

// A module-level store rather than useEffect + setState: `useSyncExternalStore`
// gives us the SSR placeholder for free via getServerSnapshot, and this repo
// lints against setState inside an effect body (react-hooks/set-state-in-effect).
// One interval is shared by every mounted clock and torn down with the last one.
const listeners = new Set<() => void>();
let snapshot = NOT_LIVE;
let timer: ReturnType<typeof setInterval> | null = null;

// Truncated to the second: the snapshot must stay referentially stable between
// visible changes or React re-renders in a loop.
function currentSecond(): number {
  return Math.floor(Date.now() / 1000) * 1000;
}

function tick() {
  const next = currentSecond();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === null) {
    // Refresh immediately: the module may have loaded long before the drawer
    // was opened, leaving `snapshot` stale.
    snapshot = currentSecond();
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
      snapshot = NOT_LIVE;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return NOT_LIVE;
}

// Live wall clock in the visitor's own timezone, read from their device: a
// visitor in Sri Lanka sees Sri Lankan time, one in the UK sees UK time. No
// geolocation prompt and no network lookup involved.
export function LocalClock() {
  const t = useTranslations("SeasonTab");
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Until the client takes over, the placeholder shows and there is no offset
  // to report. Rendering a real time here would be a hydration error.
  const isLive = timestamp !== NOT_LIVE;
  const now = isLive ? new Date(timestamp) : null;
  const time = now ? formatClockTime(now) : PLACEHOLDER;
  const offset = now ? formatUtcOffset(now.getTimezoneOffset()) : null;

  return (
    <div className="mt-4 flex items-start gap-1.5 self-start rounded-xl border border-border bg-ivory px-3 py-2">
      <time
        aria-label={t("clockLabel")}
        dateTime={now ? time : undefined}
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
