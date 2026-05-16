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
                <XAxis dataKey="name" stroke="rgba(255,255,255,.35)" axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,.35)" axisLine={false} tickLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ background: "rgba(10,12,20,.92)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="customers" stroke="#10d7c4" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="#7c5cff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Acquisition mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channels} innerRadius={68} outerRadius={105} paddingAngle={4} dataKey="value">
                  {channels.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,12,20,.92)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {channels.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: channel.color }} />{channel.name}</span>
                <span className="text-foreground/55">{channel.value}%</span>
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
              <XAxis dataKey="name" stroke="rgba(255,255,255,.35)" axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,.35)" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip contentStyle={{ background: "rgba(10,12,20,.92)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} formatter={(value, name) => name === "revenue" ? formatCurrency(Number(value)) : `${value}%`} />
              <Area type="monotone" dataKey="conversion" stroke="#10d7c4" strokeWidth={3} fill="url(#conversion)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
