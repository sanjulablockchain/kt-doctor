"use client";

import { useTranslations } from "next-intl";
import { useTheme, type ThemePreference } from "./ThemeProvider";

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const OPTIONS: { value: ThemePreference; Icon: () => React.JSX.Element }[] = [
  { value: "system", Icon: SystemIcon },
  { value: "light", Icon: SunIcon },
  { value: "dark", Icon: MoonIcon },
];

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center gap-1 self-start rounded-full bg-ivory-deep p-1"
    >
      {OPTIONS.map(({ value, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={t(value)}
            title={t(value)}
            onClick={() => setPreference(value)}
            className={
              active
                ? "flex items-center justify-center rounded-full bg-teal p-1.5 text-white"
                : "flex items-center justify-center rounded-full p-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-teal-dark"
            }
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
