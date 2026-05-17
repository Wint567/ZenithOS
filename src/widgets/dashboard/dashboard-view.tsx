"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpRight, CreditCard, MousePointerClick, RotateCcw, Sparkles, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { OnboardingCard } from "@/widgets/dashboard/onboarding-card";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { downloadCsv } from "@/lib/export";

export function DashboardView() {
  const metrics = useWorkspaceStore((state) => state.metrics);
  const orders = useWorkspaceStore((state) => state.orders);
  const users = useWorkspaceStore((state) => state.users);
  const products = useWorkspaceStore((state) => state.products);
  const auditLog = useWorkspaceStore((state) => state.auditLog);
  const widgets = useWorkspaceStore((state) => state.dashboardWidgets);
  const toggleWidget = useWorkspaceStore((state) => state.toggleWidget);
  const moveWidget = useWorkspaceStore((state) => state.moveWidget);
  const resetDashboard = useWorkspaceStore((state) => state.resetDashboard);
  const aiHistory = useWorkspaceStore((state) => state.aiHistory);
  const latest = metrics.at(-1);
  const lowStock = products.filter((product) => product.stock < 50).length;
  const kpis = [
    { label: "Revenue", value: formatCurrency(latest?.revenue ?? 0), delta: `${orders.length} orders`, icon: CreditCard },
    { label: "Active users", value: formatCompact(users.length), delta: `${users.filter((user) => user.status === "pending").length} pending`, icon: Users },
    { label: "Conversion", value: `${latest?.conversion ?? 0}%`, delta: "+1.3% from last month", icon: MousePointerClick },
    { label: "Inventory watch", value: String(lowStock), delta: "items below target", icon: Sparkles },
  ];
  const visible = (id: string) => widgets.find((widget) => widget.id === id)?.visible;

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

      <Card className="bg-white/[0.035]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Dashboard layout</h2>
            <p className="mt-1 text-sm text-foreground/45">Persisted widget visibility and order, stored locally for the workspace.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={resetDashboard}><RotateCcw className="size-4" /> Reset</Button>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 p-2">
              <button type="button" onClick={() => toggleWidget(widget.id)} className={`size-3 rounded-full ${widget.visible ? "bg-[var(--accent)]" : "bg-white/20"}`} aria-label={`Toggle ${widget.label}`} />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground/70">{widget.label}</span>
              <button type="button" onClick={() => moveWidget(widget.id, "up")} className="rounded p-1 text-foreground/40 hover:bg-white/10 hover:text-foreground" aria-label={`Move ${widget.label} up`}><ArrowUp className="size-3" /></button>
              <button type="button" onClick={() => moveWidget(widget.id, "down")} className="rounded p-1 text-foreground/40 hover:bg-white/10 hover:text-foreground" aria-label={`Move ${widget.label} down`}><ArrowDown className="size-3" /></button>
            </div>
          ))}
        </div>
      </Card>

      {visible("kpis") ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card className="transition hover:-translate-y-1 hover:bg-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/50">{kpi.label}</span>
                  <span className="grid size-9 place-items-center rounded-lg bg-white/10"><Icon className="size-4" /></span>
                </div>
                <p className="mt-5 text-3xl font-semibold tracking-tight">{kpi.value}</p>
                <p className="mt-2 text-sm text-emerald-300">{kpi.delta} from last month</p>
              </Card>
            </motion.div>
          );
        })}
      </section> : null}

      {(visible("revenue") || visible("sales")) ? <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {visible("revenue") ? (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div><h2 className="font-semibold">Revenue trajectory</h2><p className="text-sm text-foreground/45">Monthly recurring revenue and expansion</p></div>
            <Badge tone="success">Healthy</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--chart-axis)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-axis)" tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ background: "var(--tooltip-bg)", color: "var(--tooltip-fg)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-soft)" }} formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#9b87ff" strokeWidth={3} fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>) : null}
        {visible("sales") ? (
        <Card>
          <h2 className="font-semibold">Sales overview</h2>
          <p className="mt-1 text-sm text-foreground/45">Orders by month</p>
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
        </Card>) : null}
      </section> : null}

      {(visible("activity") || visible("onboarding")) ? <section className="grid gap-5 xl:grid-cols-3">
        {visible("activity") ? (
        <Card className="xl:col-span-2">
          <h2 className="font-semibold">Audit activity</h2>
          <div className="mt-5 grid gap-3">
            {auditLog.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-xs font-semibold">{index + 1}</span>
                <p className="text-sm text-foreground/70">{item.actor} {item.action} <span className="text-foreground/45">{item.target}</span></p>
                <span className="ml-auto text-xs text-foreground/35">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>) : null}
        {visible("onboarding") ? <OnboardingCard /> : null}
      </section> : null}

      {(visible("realtime") || visible("ai")) ? <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        {visible("realtime") ? (
        <Card>
          <h2 className="font-semibold">Realtime activity</h2>
          <p className="mt-1 text-sm text-foreground/45">Simulated live events from orders, users, payments, and system health.</p>
          <div className="mt-5 grid gap-3">
            {auditLog.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-foreground/70">
                {item.action} · {item.target}
              </div>
            ))}
          </div>
        </Card>) : null}
        {visible("ai") ? (
        <Card className="bg-[linear-gradient(135deg,rgba(124,92,255,.14),rgba(16,215,196,.06))]">
          <h2 className="font-semibold">AI recommendations</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {aiHistory.filter((message) => message.role === "assistant").slice(-3).map((tip) => (
              <div key={tip.id} className="rounded-lg border border-white/10 bg-black/15 p-4 text-sm leading-6 text-foreground/70">{tip.text}</div>
            ))}
          </div>
        </Card>) : null}
      </section> : null}
    </div>
  );
}
