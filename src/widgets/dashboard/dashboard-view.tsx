"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpRight, CreditCard, GripVertical, Maximize2, MousePointerClick, RotateCcw, Sparkles, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { OnboardingCard } from "@/widgets/dashboard/onboarding-card";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { downloadCsv } from "@/lib/export";
import type { DashboardWidget } from "@/types";

export function DashboardView() {
  const metrics = useWorkspaceStore((state) => state.metrics);
  const orders = useWorkspaceStore((state) => state.orders);
  const users = useWorkspaceStore((state) => state.users);
  const products = useWorkspaceStore((state) => state.products);
  const auditLog = useWorkspaceStore((state) => state.auditLog);
  const widgets = useWorkspaceStore((state) => state.dashboardWidgets);
  const toggleWidget = useWorkspaceStore((state) => state.toggleWidget);
  const moveWidget = useWorkspaceStore((state) => state.moveWidget);
  const resizeWidget = useWorkspaceStore((state) => state.resizeWidget);
  const applyDashboardPreset = useWorkspaceStore((state) => state.applyDashboardPreset);
  const resetDashboard = useWorkspaceStore((state) => state.resetDashboard);
  const aiHistory = useWorkspaceStore((state) => state.aiHistory);
  const [dragging, setDragging] = useState<DashboardWidget["id"] | null>(null);
  const latest = metrics.at(-1);
  const lowStock = products.filter((product) => product.stock < 50).length;
  const kpis = [
    { label: "Revenue", value: formatCurrency(latest?.revenue ?? 0), delta: `${orders.length} orders`, icon: CreditCard },
    { label: "Active users", value: formatCompact(users.length), delta: `${users.filter((user) => user.status === "pending").length} pending`, icon: Users },
    { label: "Conversion", value: `${latest?.conversion ?? 0}%`, delta: "+1.3% from last month", icon: MousePointerClick },
    { label: "Inventory watch", value: String(lowStock), delta: "items below target", icon: Sparkles },
  ];

  const widgetSpan: Record<DashboardWidget["size"], string> = {
    sm: "xl:col-span-4",
    md: "xl:col-span-6",
    lg: "xl:col-span-12",
  };

  function moveBefore(targetId: DashboardWidget["id"]) {
    if (!dragging || dragging === targetId) return;
    const from = widgets.findIndex((widget) => widget.id === dragging);
    const to = widgets.findIndex((widget) => widget.id === targetId);
    if (from < 0 || to < 0) return;
    const direction = from > to ? "up" : "down";
    const steps = Math.abs(from - to);
    for (let index = 0; index < steps; index += 1) moveWidget(dragging, direction);
  }

  function renderWidget(widget: DashboardWidget) {
    if (widget.id === "kpis") {
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <Card className="h-full transition hover:-translate-y-1 hover:bg-[var(--surface-2)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--muted)]">{kpi.label}</span>
                    <span className="grid size-9 place-items-center rounded-lg bg-[var(--surface-2)]"><Icon className="size-4" /></span>
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-tight">{kpi.value}</p>
                  <p className="mt-2 text-sm text-[var(--badge-success-fg)]">{kpi.delta}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (widget.id === "revenue") {
      return (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div><h2 className="font-semibold">Revenue trajectory</h2><p className="text-sm text-[var(--muted)]">Monthly recurring revenue and expansion</p></div>
            <Badge tone="success">Healthy</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-axis)" tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ background: "var(--tooltip-bg)", color: "var(--tooltip-fg)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-soft)" }} formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#9b87ff" strokeWidth={3} fill="url(#dashboardRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      );
    }

    if (widget.id === "sales") {
      return (
        <Card>
          <h2 className="font-semibold">Sales overview</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Orders by month</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.slice(-7)}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "var(--tooltip-bg)", color: "var(--tooltip-fg)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-soft)" }} />
                <Bar dataKey="orders" fill="#10d7c4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      );
    }

    if (widget.id === "activity") {
      return (
        <Card>
          <h2 className="font-semibold">Audit activity</h2>
          <div className="mt-5 grid gap-3">
            {auditLog.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--surface-2)] text-xs font-semibold">{index + 1}</span>
                <p className="min-w-0 flex-1 text-sm text-foreground/70">{item.actor} {item.action} <span className="text-[var(--muted)]">{item.target}</span></p>
                <span className="hidden text-xs text-[var(--muted)] sm:block">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    if (widget.id === "onboarding") return <OnboardingCard />;

    if (widget.id === "realtime") {
      return (
        <Card>
          <h2 className="font-semibold">Realtime activity</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Simulated live events from orders, users, payments, and system health.</p>
          <div className="mt-5 grid gap-3">
            {auditLog.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-3 text-sm leading-6 text-foreground/70">
                {item.action} · {item.target}
              </div>
            ))}
          </div>
        </Card>
      );
    }

    return (
      <Card className="bg-[linear-gradient(135deg,rgba(124,92,255,.14),rgba(16,215,196,.06))]">
        <h2 className="font-semibold">AI recommendations</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {aiHistory.filter((message) => message.role === "assistant").slice(-3).map((tip) => (
            <div key={tip.id} className="rounded-lg border border-[var(--line)] bg-black/10 p-4 text-sm leading-6 text-foreground/70">{tip.text}</div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="brand">Live workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Executive dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">Monitor revenue, growth, operations, and customer signals from one polished control plane.</p>
        </div>
        <Button onClick={() => downloadCsv("zenithos-dashboard-metrics.csv", metrics)}>
          Export report
          <ArrowUpRight className="size-4" />
        </Button>
      </section>

      <Card className="bg-[var(--surface-0)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Dashboard layout</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Drag widgets, resize panels, apply presets, or hide low-priority modules. Preferences persist locally.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => applyDashboardPreset("executive")}>Executive</Button>
            <Button variant="secondary" size="sm" onClick={() => applyDashboardPreset("operations")}>Operations</Button>
            <Button variant="secondary" size="sm" onClick={() => applyDashboardPreset("growth")}>Growth</Button>
            <Button variant="secondary" size="sm" onClick={resetDashboard}><RotateCcw className="size-4" /> Reset</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-2">
              <GripVertical className="size-4 text-[var(--muted)]" />
              <button type="button" onClick={() => toggleWidget(widget.id)} className={`size-3 rounded-full ${widget.visible ? "bg-[var(--accent)]" : "bg-white/20"}`} aria-label={`Toggle ${widget.label}`} />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground/70">{widget.label}</span>
              <Select aria-label={`Resize ${widget.label}`} value={widget.size} onChange={(event) => resizeWidget(widget.id, event.target.value as DashboardWidget["size"])} className="h-8 w-20 text-xs">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </Select>
              <button type="button" onClick={() => moveWidget(widget.id, "up")} className="rounded p-1 text-foreground/40 hover:bg-[var(--surface-2)] hover:text-foreground" aria-label={`Move ${widget.label} up`}><ArrowUp className="size-3" /></button>
              <button type="button" onClick={() => moveWidget(widget.id, "down")} className="rounded p-1 text-foreground/40 hover:bg-[var(--surface-2)] hover:text-foreground" aria-label={`Move ${widget.label} down`}><ArrowDown className="size-3" /></button>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-5 xl:grid-cols-12">
        {widgets.filter((widget) => widget.visible).map((widget) => (
          <motion.div
            key={widget.id}
            layout
            draggable
            onDragStart={() => setDragging(widget.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveBefore(widget.id)}
            onDragEnd={() => setDragging(null)}
            className={widgetSpan[widget.size]}
          >
            <div className="mb-2 flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-0)] px-3 py-2 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-2"><GripVertical className="size-4" /> Drag to reorder · {widget.label}</span>
              <span className="inline-flex items-center gap-1 capitalize"><Maximize2 className="size-3" /> {widget.size}</span>
            </div>
            {renderWidget(widget)}
          </motion.div>
        ))}
      </section>
    </div>
  );
}
