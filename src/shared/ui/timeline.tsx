import { CheckCircle2, CircleAlert, Clock, Sparkles } from "lucide-react";
import type { ActivityEvent } from "@/types";

const icons = {
  brand: Sparkles,
  success: CheckCircle2,
  warning: Clock,
  danger: CircleAlert,
};

export function Timeline({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="grid gap-3">
      {events.map((event, index) => {
        const Icon = icons[event.tone];
        return (
          <div key={event.id} className="relative flex gap-3">
            {index !== events.length - 1 ? <span className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-white/10" /> : null}
            <span className="relative grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.07]">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-foreground/35">{event.time}</p>
              </div>
              <p className="mt-1 text-xs leading-5 text-foreground/50">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
