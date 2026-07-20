"use client";

import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

export function FilterDropdown({
  ariaLabel,
  value,
  placeholder,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border bg-ivory px-4 py-2.5 text-sm outline-none transition-colors ${
          open
            ? "border-teal text-teal-dark shadow-soft"
            : "border-border text-ink hover:border-teal"
        }`}
      >
        <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{selectedLabel}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-3.5 w-3.5 shrink-0 text-teal-dark transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full z-20 mt-2 max-h-64 min-w-full overflow-auto rounded-2xl border border-border bg-surface p-1.5 shadow-card"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                value === ""
                  ? "bg-teal font-semibold text-white"
                  : "text-ink hover:bg-teal-tint hover:text-teal-dark"
              }`}
            >
              {placeholder}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  value === opt.value
                    ? "bg-teal font-semibold text-white"
                    : "text-ink hover:bg-teal-tint hover:text-teal-dark"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
