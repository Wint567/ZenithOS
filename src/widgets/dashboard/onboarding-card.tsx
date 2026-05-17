"use client";

import { Check, CloudUpload, FolderKanban, PlugZap, Users } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { useAppStore } from "@/store/use-app-store";

const steps = [
  { label: "Create first project", icon: FolderKanban },
  { label: "Upload workspace logo", icon: CloudUpload },
  { label: "Invite team members", icon: Users },
  { label: "Connect integrations", icon: PlugZap },
];

export function OnboardingCard() {
  const done = useAppStore((state) => state.onboardingDone);
  const toggle = useAppStore((state) => state.toggleOnboardingStep);
  const progress = Math.round((done.length / steps.length) * 100);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">Workspace setup</h2>
          <p className="mt-1 text-sm text-foreground/45">Finish the steps that make the workspace feel launch-ready.</p>
        </div>
        <span className="text-sm font-semibold text-[var(--accent)]">{progress}%</span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5 grid gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const active = done.includes(step.label);
          return (
            <button
              type="button"
              key={step.label}
              onClick={() => toggle(step.label)}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.07]"
            >
              <span className={`grid size-8 place-items-center rounded-lg ${active ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10"}`}>
                {active ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>
              <span className="text-sm font-medium">{step.label}</span>
              <span className="ml-auto text-xs text-foreground/40">{active ? "Complete" : "Open"}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
