"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, CircleDollarSign, MousePointerClick, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { metrics } from "@/mock/data";
import { formatCompact, formatCurrency } from "@/lib/utils";

const liveDeltas = [
  { revenue: 12.4, users: 9.1, conversion: 8.9, insight: "Revenue velocity is 18% above forecast." },
  { revenue: 12.9, users: 9.4, conversion: 9.1, insight: "Enterprise trials are converting faster this week." },
  { revenue: 13.2, users: 9.8, conversion: 9.2, insight: "AI expansion signals found 14 high-intent accounts." },
];

const metricCards = [
  { label: "Revenue", key: "revenue", icon: CircleDollarSign, suffix: "%" },
  { label: "Users", key: "users", icon: Users, suffix: "%" },
  { label: "Conversion", key: "conversion", icon: MousePointerClick, suffix: "%" },
] as const;

function HeroTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--tooltip-bg)] px-4 py-3 text-[var(--tooltip-fg)] shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.14em] text-foreground/35">{label}</p>
      <p className="mt-1 text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
      <p className="mt-1 text-xs text-emerald-300">+{(payload[0].value / 13400).toFixed(1)}% blended growth</p>
    </div>
  );
}

export function HeroAnalyticsPreview() {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = window.setInterval(() => {
      setPulseIndex((index) => (index + 1) % liveDeltas.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const active = liveDeltas[pulseIndex];
  const chartData = useMemo(
    () =>
      metrics.map((point, index) => ({
        ...point,
        forecast: Math.round(point.revenue * (1.08 + index * 0.006)),
      })),
    [],
  );
  const lastPoint = chartData.at(-1);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
    >
      <div className="hero-ambient-a absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(124,92,255,.34),transparent_58%)] blur-3xl" />
      <div className="hero-ambient-b absolute -right-12 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(16,215,196,.22),transparent_62%)] blur-3xl" />
      <Card className="relative overflow-hidden border-white/15 bg-[rgba(8,10,18,.68)] p-3 shadow-[0_42px_160px_rgba(0,0,0,.5)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,.12),transparent_24%,transparent_72%,rgba(16,215,196,.08))]" />
        <div className="relative rounded-xl border border-white/10 bg-black/30 p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-300" />
                </span>
                <p className="text-sm font-semibold">ZenithOS Live</p>
              </div>
              <p className="mt-1 text-xs text-foreground/40">Executive telemetry · updated just now</p>
            </div>
            <Badge tone="success">Online</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metricCards.map((item, index) => {
              const Icon = item.icon;
              const value = active[item.key];
              return (
                <motion.div
                  key={item.label}
                  className="group rounded-xl border border-white/10 bg-white/[0.055] p-3 transition hover:-translate-y-0.5 hover:bg-white/[0.085]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + index * 0.08 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-foreground/40">{item.label}</span>
                    <span className="grid size-7 place-items-center rounded-lg bg-white/10 text-[var(--accent)] transition group-hover:scale-105">
                      <Icon className="size-3.5" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <motion.p
                      key={value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xl font-semibold tracking-tight"
                    >
                      +{value.toFixed(1)}{item.suffix}
                    </motion.p>
                    <ArrowUpRight className="mb-1 size-4 text-emerald-300" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="relative mt-4 h-72 overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(124,92,255,.16),rgba(8,10,18,.2)_50%,rgba(16,215,196,.06))] p-3 sm:h-80">
            <div className="pointer-events-none absolute inset-x-8 top-8 h-24 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute left-4 top-4 z-10 rounded-lg border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[.14em] text-foreground/35">MRR</p>
              <p className="mt-0.5 text-sm font-semibold">{lastPoint ? formatCurrency(lastPoint.revenue) : "$168K"}</p>
            </div>

            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 38, right: 16, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="heroRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10d7c4" stopOpacity={0.42} />
                      <stop offset="45%" stopColor="#7c5cff" stopOpacity={0.16} />
                      <stop offset="100%" stopColor="#7c5cff" stopOpacity={0.01} />
                    </linearGradient>
                    <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--chart-axis)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis hide domain={["dataMin - 12000", "dataMax + 18000"]} tickFormatter={formatCompact} />
                  <Tooltip content={<HeroTooltip />} cursor={{ stroke: "rgba(16,215,196,.28)", strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10d7c4"
                    strokeWidth={3}
                    fill="url(#heroRevenueFill)"
                    filter="url(#heroGlow)"
                    isAnimationActive
                    animationDuration={1300}
                    animationEasing="ease-out"
                    dot={false}
                    activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2, fill: "#10d7c4" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-lg bg-white/[0.04]" />
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[active.insight, "3 invoices cleared and one enterprise trial converted."].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-foreground/65"
              >
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                  <Activity className="size-3.5" /> Live insight
                </span>
                <p>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
