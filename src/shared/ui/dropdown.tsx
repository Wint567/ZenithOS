"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type DropdownProps = {
  trigger: React.ReactNode;
  align?: "left" | "right";
  children: (close: () => void) => React.ReactNode;
};

export function Dropdown({ trigger, align = "right", children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="contents">
        {trigger}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            className={`glass absolute top-full z-40 mt-3 w-80 rounded-xl p-2 ${align === "right" ? "right-0" : "left-0"}`}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            {children(() => setOpen(false))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
