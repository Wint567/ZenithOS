"use client";

import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, icon, className, ...props }, ref) => {
  const id = useId();
  return (
    <label className="grid gap-2 text-sm" htmlFor={id}>
      {label ? <span className="font-medium text-foreground/90">{label}</span> : null}
      <span className="relative block">
        {icon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">{icon}</span> : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-11 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-foreground outline-none transition placeholder:text-foreground/35",
            "border-[var(--line)] bg-[var(--input-bg)] shadow-sm focus:border-[var(--brand)]/45 focus:bg-[var(--input-bg-focus)] focus:ring-4 focus:ring-[var(--focus)]/20",
            icon && "pl-10",
            error && "border-red-400/50 focus:border-red-400 focus:ring-red-400/10",
            className,
          )}
          {...props}
        />
      </span>
      {error ? (
        <span className="inline-flex items-center gap-1 text-xs text-[var(--danger)]">
          <AlertCircle className="size-3" />
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-foreground/45">{hint}</span>
      ) : null}
    </label>
  );
});

Input.displayName = "Input";
