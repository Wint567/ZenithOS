"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Tooltip({ label, children }: React.PropsWithChildren<{ label: string }>) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      <AnimatePresence>
        {open ? (
          <motion.span
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line)] bg-[var(--tooltip-bg)] px-2 py-1 text-xs text-[var(--tooltip-fg)] shadow-xl"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
