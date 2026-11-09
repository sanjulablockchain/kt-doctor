"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

// Light is the default for everyone, whatever the OS says; dark is opt-in via
// the header toggle and remembered in localStorage.
export type ThemePreference = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = "theme";

// Safe default so components (e.g. Header in isolation tests) can call
// useTheme() without an explicit provider. The real provider overrides it.
const ThemeContext = createContext<ThemeContextValue>({
  preference: "light",
  setPreference: () => {},
});

function readStoredPreference(): ThemePreference {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "dark") return "dark";
  } catch {
    // localStorage can throw (privacy mode / disabled); fall back to light.
  }
  return "light";
}

// Light is the no-attribute default in globals.css, so only dark is written
// to the DOM. This keeps the boot script in app/[locale]/layout.tsx trivial.
function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
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
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "dark") localStorage.setItem(STORAGE_KEY, "dark");
      else localStorage.removeItem(STORAGE_KEY);
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
