"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export function Tabs({ tabs, active, onChange }: TabsProps) {
  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const last = tabs.length - 1;
    const nextIndex =
      event.key === "Home" ? 0 :
      event.key === "End" ? last :
      event.key === "ArrowRight" ? Math.min(index + 1, last) :
      Math.max(index - 1, 0);
    onChange(tabs[nextIndex]);
  }

  return (
    <div role="tablist" aria-label="Settings sections" className="inline-flex rounded-lg border border-white/10 bg-white/[0.05] p-1">
      {tabs.map((tab, index) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === tab}
          tabIndex={active === tab ? 0 : -1}
          key={tab}
          onKeyDown={(event) => onKeyDown(event, index)}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium text-foreground/60 transition",
            active === tab && "bg-white/12 text-foreground shadow-sm",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
