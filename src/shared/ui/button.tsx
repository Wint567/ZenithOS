"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <motion.span whileTap={{ scale: 0.98 }} className="inline-flex">
        <button
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-55",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60",
            variant === "primary" &&
              "border-white/10 bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] hover:bg-white/90",
            variant === "secondary" && "border-white/10 bg-white/10 text-foreground hover:bg-white/15",
            variant === "ghost" && "border-transparent bg-transparent text-muted-foreground hover:bg-white/10 hover:text-foreground",
            variant === "danger" && "border-red-400/20 bg-red-500/15 text-red-100 hover:bg-red-500/25",
            size === "sm" && "h-8 px-3",
            size === "md" && "h-10 px-4",
            size === "lg" && "h-12 px-5",
            size === "icon" && "size-10 p-0",
            className,
          )}
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
