"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  CLINIC_TIME_ZONE,
  formatClockTime,
  formatUtcOffset,
  formatZonedClockTime,
  zoneOffsetMinutes,
} from "@/lib/clock";

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
// One interval is shared by both clocks and torn down with the last unmount.
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

type ReadoutProps = {
  caption: string;
  label: string;
  time: string;
  offset: string | null;
};

function ClockReadout({ caption, label, time, offset }: ReadoutProps) {
  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
        {caption}
      </p>
      <div className="mt-0.5 flex items-start gap-1">
        <time
          aria-label={label}
          dateTime={offset ? time : undefined}
          className="font-display text-xl font-bold leading-none tracking-tight text-ink tabular-nums"
        >
          {time}
        </time>
        {offset ? (
          <span className="text-[0.55rem] font-semibold uppercase leading-none text-ink-soft">
            {offset}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Live wall clocks: the visitor's own timezone, read from their device, next to
// the clinics' Los Angeles time. No geolocation and no network lookup involved.
export function LocalClock() {
  const t = useTranslations("SeasonTab");
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Until the client takes over, both clocks show the placeholder and neither
  // reports an offset. Rendering a real time here would be a hydration error.
  const isLive = timestamp !== NOT_LIVE;
  const now = isLive ? new Date(timestamp) : null;

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-ivory px-3 py-2.5">
      <ClockReadout
        caption={t("yourTime")}
        label={t("clockLabel")}
        time={now ? formatClockTime(now) : PLACEHOLDER}
        offset={now ? formatUtcOffset(now.getTimezoneOffset()) : null}
      />
      <ClockReadout
        caption={t("clinicTime")}
        label={t("clinicClockLabel")}
        time={now ? formatZonedClockTime(now, CLINIC_TIME_ZONE) : PLACEHOLDER}
        offset={now ? formatUtcOffset(zoneOffsetMinutes(now, CLINIC_TIME_ZONE)) : null}
      />
    </div>
  );
}
