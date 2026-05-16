"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm">
      {label ? <span className="font-medium text-foreground/90">{label}</span> : null}
      <span className="relative block">
        <select
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-white/10 bg-white/[0.06] px-3 pr-9 text-sm outline-none transition focus:border-[var(--brand)]/60 focus:ring-4 focus:ring-[var(--brand)]/10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-foreground/45" />
      </span>
    </label>
  );
}
