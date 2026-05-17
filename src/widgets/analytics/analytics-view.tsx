"use client";

import { Area, AreaChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { metrics } from "@/mock/data";
import { formatCompact, formatCurrency } from "@/lib/utils";

const channels = [
  { name: "Direct", value: 42, color: "#7c5cff" },
  { name: "Partners", value: 28, color: "#10d7c4" },
  { name: "Marketplace", value: 18, color: "#f59e0b" },
  { name: "API", value: 12, color: "#f43f5e" },
];

type TooltipPayload = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  valueFormatter?: (value: number | string, item: TooltipPayload) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="animate-[tooltip-in_140ms_ease-out] rounded-xl border border-[var(--line)] bg-[var(--tooltip-bg)] px-4 py-3 text-[var(--tooltip-fg)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
      {label ? <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] opacity-55">{label}</p> : null}
      <div className="grid gap-2">
        {payload.map((item) => (
          <div key={`${item.name}-${item.dataKey}`} className="flex min-w-36 items-center justify-between gap-5 text-sm">
            <span className="flex items-center gap-2 opacity-75">
              <span className="size-2 rounded-full shadow-[0_0_14px_currentColor]" style={{ background: item.color, color: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold">{valueFormatter ? valueFormatter(item.value ?? "", item) : item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="animate-[tooltip-in_140ms_ease-out] rounded-xl border border-[var(--line)] bg-[var(--tooltip-bg)] px-4 py-3 text-[var(--tooltip-fg)] shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full shadow-[0_0_16px_currentColor]" style={{ background: item.color, color: item.color }} />
        <p className="text-sm font-medium">{item.name}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}%</p>
      <p className="mt-1 text-xs opacity-55">Share of qualified acquisition</p>
    </div>
  );
}

export function AnalyticsView() {
  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Analytics suite</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Revenue intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">A polished view of customer growth, conversion velocity, and operational performance.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Net revenue retention", "124%", "+6.2%"],
          ["CAC payback", "4.8 mo", "-1.1 mo"],
          ["Pipeline velocity", "$2.4M", "+22%"],
          ["Support SLA", "99.2%", "+0.4%"],
        ].map(([label, value, delta]) => (
          <Card key={label}>
            <p className="text-sm text-foreground/45">{label}</p>
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-emerald-300">{delta}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-semibold">Customer growth</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--chart-axis)" axisLine={false} tickLine={false} />
                <YAxis stroke="var(--chart-axis)" axisLine={false} tickLine={false} tickFormatter={formatCompact} />
                <Tooltip
                  content={<ChartTooltip valueFormatter={(value, item) => item.dataKey === "customers" ? formatCompact(Number(value)) : String(value)} />}
                  cursor={{ stroke: "var(--line-strong)", strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="customers" stroke="#10d7c4" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#7c5cff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-8 top-16 h-32 rounded-full bg-[var(--brand)]/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Acquisition mix</h2>
              <p className="mt-1 text-sm text-foreground/45">Qualified pipeline by source</p>
            </div>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="relative mt-4 h-72">
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/35">Top source</p>
              <p className="mt-1 text-2xl font-semibold">Direct</p>
              <p className="mt-1 text-xs text-emerald-300">42%</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channels}
                  innerRadius={76}
                  outerRadius={108}
                  paddingAngle={5}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="var(--surface-solid)"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={850}
                >
                  {channels.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      className="outline-none transition-opacity duration-200 hover:opacity-90"
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} wrapperStyle={{ outline: "none", zIndex: 30 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="relative grid gap-2">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-foreground/72"><span className="size-2 rounded-full shadow-[0_0_12px_currentColor]" style={{ background: channel.color, color: channel.color }} />{channel.name}</span>
                <span className="font-medium text-foreground/75">{channel.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <Card>
        <h2 className="font-semibold">Conversion metrics</h2>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="conversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10d7c4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10d7c4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--chart-axis)" axisLine={false} tickLine={false} />
              <YAxis stroke="var(--chart-axis)" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                content={<ChartTooltip valueFormatter={(value, item) => item.dataKey === "revenue" ? formatCurrency(Number(value)) : `${value}%`} />}
                cursor={{ stroke: "rgba(16,215,196,.22)", strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="conversion" stroke="#10d7c4" strokeWidth={3} fill="url(#conversion)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
