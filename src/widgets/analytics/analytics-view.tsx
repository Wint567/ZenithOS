"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Select } from "@/shared/ui/select";
import { metrics as baseMetrics } from "@/mock/data";
import { formatCompact, formatCurrency } from "@/lib/utils";
import { downloadJson } from "@/lib/export";
import { useAppStore } from "@/store/use-app-store";

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
  const pushToast = useAppStore((state) => state.pushToast);
  const [range, setRange] = useState("12");
  const [segment, setSegment] = useState("all");
  const [compare, setCompare] = useState(true);
  const [overlay, setOverlay] = useState<"orders" | "conversion">("orders");

  const metrics = useMemo(() => {
    const rangeSize = Number(range);
    const multiplier = segment === "enterprise" ? 1.18 : segment === "self-serve" ? 0.88 : 1;
    return baseMetrics.slice(-rangeSize).map((point, index) => ({
      ...point,
      revenue: Math.round(point.revenue * multiplier),
      customers: Math.round(point.customers * (segment === "enterprise" ? 0.72 : segment === "self-serve" ? 1.16 : 1)),
      previousConversion: Number((point.conversion * (0.82 + index * 0.01)).toFixed(1)),
    }));
  }, [range, segment]);

  function exportSnapshot() {
    downloadJson("zenithos-analytics-snapshot.json", { range, segment, compare, overlay, metrics, exportedAt: "2026-05-18" });
    pushToast({ title: "Analytics snapshot exported", message: "Current chart configuration and data were exported as JSON.", tone: "brand" });
  }

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
        <Badge tone="brand">Analytics suite</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Revenue intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">A polished view of customer growth, conversion velocity, and operational performance.</p>
        </div>
        <Button variant="secondary" onClick={exportSnapshot}>Export snapshot</Button>
      </section>
      <Card className="bg-[var(--surface-0)]">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="Date range" value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="6">Last 6 months</option>
            <option value="9">Last 9 months</option>
            <option value="12">Last 12 months</option>
          </Select>
          <Select label="Segment" value={segment} onChange={(event) => setSegment(event.target.value)}>
            <option value="all">All customers</option>
            <option value="enterprise">Enterprise</option>
            <option value="self-serve">Self-serve</option>
          </Select>
          <Select label="Overlay" value={overlay} onChange={(event) => setOverlay(event.target.value as "orders" | "conversion")}>
            <option value="orders">Orders</option>
            <option value="conversion">Conversion</option>
          </Select>
          <div className="grid gap-2 text-sm">
            <span className="font-medium text-foreground/90">Comparison</span>
            <button
              type="button"
              onClick={() => setCompare((value) => !value)}
              className="flex h-10 items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--input-bg)] px-3 text-left transition hover:bg-[var(--surface-1)]"
              aria-pressed={compare}
            >
              Previous period
              <span className={`size-2.5 rounded-full ${compare ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`} />
            </button>
          </div>
        </div>
      </Card>
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Customer growth</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Filtered by {segment === "all" ? "all customer segments" : segment} over {range} months</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-1"><span className="size-2 rounded-full bg-[#10d7c4]" /> Customers</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-1"><span className="size-2 rounded-full bg-[#7c5cff]" /> {overlay}</span>
            </div>
          </div>
          <div className="mt-6 h-80" role="img" aria-label="Customer growth and selected metric overlay chart">
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
                <Line type="monotone" dataKey={overlay} stroke="#7c5cff" strokeWidth={3} dot={false} />
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
          <div className="relative mt-4 h-72" role="img" aria-label="Acquisition mix donut chart by qualified source">
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">Conversion metrics</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Annotated with operational milestones and optional previous-period comparison.</p>
          </div>
          <Badge tone="brand">Drill-down ready</Badge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Pricing change", metrics.at(-5)?.name ?? "Aug", "Expansion revenue increased after packaging update."],
            ["Partner launch", metrics.at(-3)?.name ?? "Oct", "Marketplace-qualified pipeline began outperforming baseline."],
            ["SLA review", metrics.at(-1)?.name ?? "Dec", "Support health remained above 99% through growth period."],
          ].map(([title, month, text]) => (
            <div key={title} className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3 text-sm">
              <p className="font-medium">{title} · {month}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 h-80" role="img" aria-label="Conversion trend chart with previous period comparison">
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
              {compare ? <Area type="monotone" dataKey="previousConversion" stroke="#7c5cff" strokeWidth={2} strokeDasharray="5 5" fill="transparent" /> : null}
              <Area type="monotone" dataKey="conversion" stroke="#10d7c4" strokeWidth={3} fill="url(#conversion)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
