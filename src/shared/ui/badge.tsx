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
        tone === "brand" && "border-violet-300/20 bg-violet-400/10 text-violet-100",
        tone === "success" && "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
        tone === "warning" && "border-amber-300/20 bg-amber-400/10 text-amber-200",
        tone === "danger" && "border-rose-300/20 bg-rose-400/10 text-rose-200",
        tone === "neutral" && "border-white/10 bg-white/8 text-foreground/75",
        className,
      )}
    >
      {children}
    </span>
  );
}
