"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CreditCard, MousePointerClick, Sparkles, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { fetchDashboard } from "@/mock/api";
import { activity, metrics } from "@/mock/data";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { Card } from "@/shared/ui/card";
import { CardSkeleton } from "@/shared/ui/skeleton";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useFakeQuery } from "@/hooks/use-fake-query";

const kpis = [
  { label: "Revenue", value: "$168K", delta: "+12.4%", icon: CreditCard },
  { label: "Active users", value: "8.6K", delta: "+9.1%", icon: Users },
  { label: "Conversion", value: "8.9%", delta: "+1.3%", icon: MousePointerClick },
  { label: "AI automations", value: "42.8K", delta: "+18.7%", icon: Sparkles },
];

export function DashboardView() {
  const query = useCallback(() => fetchDashboard(), []);
  const { data, loading } = useFakeQuery(query);

  if (loading || !data) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}</div>
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><CardSkeleton /><CardSkeleton /></div>
      </div>
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
        <Button>
          Export report
          <ArrowUpRight className="size-4" />
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
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
                <XAxis dataKey="name" stroke="rgba(255,255,255,.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,.35)" tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ background: "rgba(10,12,20,.92)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#9b87ff" strokeWidth={3} fill="url(#revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Sales overview</h2>
          <p className="mt-1 text-sm text-foreground/45">Orders by month</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.slice(-7)}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,.35)" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(10,12,20,.92)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Bar dataKey="orders" fill="#10d7c4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-semibold">Recent activity</h2>
          <div className="mt-5 grid gap-3">
            {activity.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <span className="grid size-8 place-items-center rounded-lg bg-white/10 text-xs font-semibold">{index + 1}</span>
                <p className="text-sm text-foreground/70">{item}</p>
                <span className="ml-auto text-xs text-foreground/35">{index + 4}m</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Onboarding</h2>
          <p className="mt-1 text-sm text-foreground/45">Workspace launch readiness</p>
          <div className="mt-5 grid gap-4">
            {["Invite leadership", "Connect billing", "Tune automations", "Publish dashboard"].map((step, index) => (
              <div key={step}>
                <div className="mb-2 flex justify-between text-sm"><span>{step}</span><span className="text-foreground/45">{index < 3 ? "Done" : "Next"}</span></div>
                <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" style={{ width: `${index < 3 ? 100 : 42}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
