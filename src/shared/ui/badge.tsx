import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "brand" | "success" | "warning" | "danger" | "neutral";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        tone === "brand" && "border-[var(--badge-brand-line)] bg-[var(--badge-brand-bg)] text-[var(--badge-brand-fg)]",
        tone === "success" && "border-[var(--badge-success-line)] bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]",
        tone === "warning" && "border-[var(--badge-warning-line)] bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]",
        tone === "danger" && "border-[var(--badge-danger-line)] bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)]",
        tone === "neutral" && "border-[var(--line)] bg-[var(--surface-1)] text-foreground/75",
        className,
      )}
    >
      {children}
    </span>
  );
}
