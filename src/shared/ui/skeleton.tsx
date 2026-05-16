import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-lg bg-white/10", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-5">
      <Skeleton className="mb-5 h-4 w-28" />
      <Skeleton className="mb-3 h-8 w-36" />
      <Skeleton className="h-3 w-44" />
    </div>
  );
}
