"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BookingOptionsDialog } from "@/components/BookingOptionsDialog";

type BookAppointmentButtonProps = {
  children: ReactNode;
  className?: string;
  /** Needed only where the call site renders an icon with no visible text. */
  "aria-label"?: string;
};

// Drop-in replacement for the "Book an Appointment" anchors that used to link
// straight to Healow. The call site keeps owning the look by passing its own
// className and children, so each CTA (nav pill, footer pill, hero button,
// navy banner button, hero panel row) stays visually unchanged - only the
// destination changes, from Healow to the three-way chooser.
export function BookAppointmentButton({
  children,
  className,
  "aria-label": ariaLabel,
}: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={className}
      >
        {children}
      </button>

      {open && <BookingOptionsDialog onClose={() => setOpen(false)} />}
    </>
  );
}
