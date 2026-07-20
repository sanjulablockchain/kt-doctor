"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = "theme";

// Safe default so components (e.g. Header in isolation tests) can call
// useTheme() without an explicit provider. The real provider overrides it.
const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  setPreference: () => {},
});

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage can throw (privacy mode / disabled) — fall back to system.
  }
  return "system";
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", preference);
  }
}

// The persisted preference is external mutable state. Read it with
// useSyncExternalStore rather than useState+useEffect: this avoids
// set-state-in-effect (which this repo's eslint config errors on) while still
// reconciling the server-rendered default to the stored value after mount,
// with no hydration mismatch.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // Cross-tab changes to the stored preference.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): ThemePreference {
  return readStoredPreference();
}

function getServerSnapshot(): ThemePreference {
  // Deterministic on the server and for the first (hydration) client render so
  // they match. The pre-paint inline script (root layout) has already applied
  // the real theme to <html>, so nothing flashes while this reconciles.
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the DOM still updates below.
    }
    // Apply the DOM attribute on user action. Mount-time reconciliation does
    // NOT touch the DOM: the pre-paint script already set it before paint, and
    // re-applying it during hydration could cause a visible flash.
    applyPreference(next);
    listeners.forEach((notify) => notify());
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
