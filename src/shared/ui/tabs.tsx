"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.05] p-1">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
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
