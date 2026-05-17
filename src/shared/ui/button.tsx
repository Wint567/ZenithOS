"use client";

import { cloneElement, forwardRef, isValidElement } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, asChild, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-55",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
      variant === "primary" &&
        "border-[var(--line)] bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] shadow-[var(--shadow-soft)] hover:bg-[var(--button-primary-hover)]",
      variant === "secondary" && "border-[var(--line)] bg-[var(--button-secondary-bg)] text-foreground shadow-sm hover:bg-[var(--button-secondary-hover)]",
      variant === "ghost" && "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-1)] hover:text-foreground",
      variant === "danger" && "border-[var(--badge-danger-line)] bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)] hover:brightness-95",
      size === "sm" && "h-8 px-3",
      size === "md" && "h-10 px-4",
      size === "lg" && "h-12 px-5",
      size === "icon" && "size-10 p-0",
      className,
    );

    if (asChild && isValidElement<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(children)) {
      return (
        <motion.span whileTap={{ scale: disabled || loading ? 1 : 0.98 }} className="inline-flex">
          {cloneElement(children, {
            className: cn(classes, children.props.className),
            "aria-disabled": disabled || loading || undefined,
            children: (
              <>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {children.props.children}
              </>
            ),
          })}
        </motion.span>
      );
    }

    return (
      <motion.span whileTap={{ scale: disabled || loading ? 1 : 0.98 }} className="inline-flex">
        <button
          ref={ref}
          className={classes}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {children}
        </button>
      </motion.span>
    );
  },
);

Button.displayName = "Button";
