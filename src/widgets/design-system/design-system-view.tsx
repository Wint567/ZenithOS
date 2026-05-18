"use client";

import { useState } from "react";
import { BarChart3, Layers3, MousePointer2, ShieldCheck, Type } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Tabs } from "@/shared/ui/tabs";

const colors = [
  ["Background", "var(--background)"],
  ["Surface 0", "var(--surface-0)"],
  ["Surface 1", "var(--surface-1)"],
  ["Surface 2", "var(--surface-2)"],
  ["Brand", "var(--brand)"],
  ["Accent", "var(--accent)"],
  ["Line", "var(--line)"],
  ["Focus", "var(--focus)"],
];

const principles = [
  { icon: Layers3, title: "Layered surfaces", text: "Semantic surfaces let light and dark modes differ without component rewrites." },
  { icon: MousePointer2, title: "Tactile controls", text: "Actions, overlays, and tables share consistent focus, hover, pressed, and disabled states." },
  { icon: ShieldCheck, title: "Accessible defaults", text: "Primitives expose roles, labels, focus rings, Escape behavior, and keyboard paths where practical." },
  { icon: BarChart3, title: "Operational density", text: "Charts, cards, and tables prioritize scan speed and realistic SaaS information hierarchy." },
];

export function DesignSystemView() {
  const [activeTab, setActiveTab] = useState("Foundations");

  return (
    <div className="grid gap-6 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Internal system</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Design system</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          A living implementation reference for ZenithOS tokens, surfaces, components, table states, motion philosophy, and accessibility expectations.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <Icon className="size-5 text-[var(--accent)]" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-5">
        <Tabs tabs={["Foundations", "Components", "Accessibility"]} active={activeTab} onChange={setActiveTab} />
        {activeTab === "Foundations" ? (
          <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
            <Card>
              <div className="flex items-center gap-3">
                <Type className="size-5 text-[var(--accent)]" />
                <h2 className="font-semibold">Typography scale</h2>
              </div>
              <div className="mt-5 grid gap-5">
                <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Display</p><p className="mt-2 text-4xl font-semibold tracking-tight">Executive dashboard</p></div>
                <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Section</p><p className="mt-2 text-xl font-semibold">Revenue trajectory</p></div>
                <div><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Body</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Muted text remains readable in both themes and avoids fragile one-off opacity choices.</p></div>
              </div>
            </Card>
            <Card>
              <h2 className="font-semibold">Semantic color tokens</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {colors.map(([name, value]) => (
                  <div key={name} className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3">
                    <div className="h-14 rounded-lg border border-[var(--line)]" style={{ background: value }} />
                    <p className="mt-3 text-sm font-medium">{name}</p>
                    <p className="text-xs text-[var(--muted)]">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}
        {activeTab === "Components" ? (
          <div className="grid gap-5 xl:grid-cols-2">
            <Card>
              <h2 className="font-semibold">Actions and badges</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="brand">brand</Badge>
                <Badge tone="success">success</Badge>
                <Badge tone="warning">warning</Badge>
                <Badge tone="danger">danger</Badge>
                <Badge>neutral</Badge>
              </div>
            </Card>
            <Card>
              <h2 className="font-semibold">Forms and loading states</h2>
              <div className="mt-5 grid gap-4">
                <Input label="Workspace name" defaultValue="Northstar Labs" />
                <Select label="Density" defaultValue="comfortable">
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </Select>
                <Skeleton className="h-16" />
              </div>
            </Card>
          </div>
        ) : null}
        {activeTab === "Accessibility" ? (
          <Card>
            <h2 className="font-semibold">Interaction contract</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                "Command palette supports keyboard navigation and Escape close.",
                "Dropdown triggers avoid nested interactive elements and expose menu state.",
                "Enterprise tables support selection labels, keyboard row movement, and persisted view preferences.",
                "Motion is subtle and respects reduced-motion global CSS fallbacks.",
                "Focus rings use a semantic token instead of one-off colors.",
                "Mobile table cards provide touch-friendly alternatives to horizontal overflow.",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-6 text-[var(--muted)]">{item}</div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
