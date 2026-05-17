"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";

type DropdownProps = {
  trigger: React.ReactNode;
  align?: "left" | "right";
  children: (close: () => void) => React.ReactNode;
};

export function Dropdown({ trigger, align = "right", children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const triggerProps = {
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: (event: React.MouseEvent) => {
      if (isValidElement<{ onClick?: (event: React.MouseEvent) => void }>(trigger)) {
        trigger.props.onClick?.(event);
      }
      if (!event.defaultPrevented) setOpen((value) => !value);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (isValidElement<{ onKeyDown?: (event: React.KeyboardEvent) => void }>(trigger)) {
        trigger.props.onKeyDown?.(event);
      }
      if (event.defaultPrevented) return;
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
      }
    },
  };

  const renderedTrigger = isValidElement<React.HTMLAttributes<HTMLElement>>(trigger)
    ? cloneElement(trigger, {
      ...triggerProps,
      role: typeof trigger.type === "string" && !["button", "a", "input", "select", "textarea"].includes(trigger.type) ? "button" : trigger.props.role,
      tabIndex:
        typeof trigger.type === "string" && !["button", "a", "input", "select", "textarea"].includes(trigger.type)
          ? (trigger.props.tabIndex ?? 0)
          : trigger.props.tabIndex,
    })
    : (
      <button type="button" className="contents" {...triggerProps}>
        {trigger}
      </button>
    );

  return (
    <div ref={ref} className="relative">
      {renderedTrigger}
      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
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
