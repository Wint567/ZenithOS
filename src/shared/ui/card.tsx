import { cn } from "@/lib/utils";

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("glass rounded-xl p-5", className)}>{children}</div>;
}
