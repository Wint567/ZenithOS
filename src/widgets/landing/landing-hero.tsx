"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { metrics } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { HeroAnalyticsPreview } from "@/widgets/landing/hero-analytics-preview";

const heroKpis = [
  { label: "MRR", value: formatCurrency(metrics.at(-1)?.revenue ?? 168000), trend: "+12.4%" },
  { label: "NDR", value: "124%", trend: "+6.2%" },
  { label: "SLA", value: "99.2%", trend: "+0.4%" },
];

export function LandingHero() {
  return (
    <section className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 md:pt-24 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[.92fr_1.08fr] lg:items-center">
      <div className="hero-ambient-a pointer-events-none absolute left-[-8rem] top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,.2),transparent_62%)] blur-3xl" />
      <div className="hero-ambient-b pointer-events-none absolute bottom-8 right-[-7rem] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(16,215,196,.14),transparent_64%)] blur-3xl" />

      <motion.div
        className="relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.55 }}>
          <Badge tone="brand">Premium SaaS operating layer</Badge>
        </motion.div>
        <motion.h1
          className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl"
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          Run your startup from a sharper command center.
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-8 text-foreground/60"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        >
          ZenithOS brings revenue, customers, operations, billing, and AI recommendations into a polished dashboard experience built for modern teams.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.55 }}
        >
          <Button size="lg" asChild>
            <Link href="/dashboard">Launch dashboard <ArrowRight className="size-4" /></Link>
          </Button>
          <Button size="lg" variant="secondary">
            <Play className="size-4" /> Watch preview
          </Button>
        </motion.div>
        <motion.div
          className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6 }}
        >
          {heroKpis.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-white/10 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[.12em] text-foreground/35">{item.label}</p>
                <TrendingUp className="size-3.5 text-emerald-300" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
              <p className="mt-1 text-xs text-emerald-300">{item.trend} live</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="mt-8 flex items-center gap-3 text-sm text-foreground/45"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.55 }}
        >
          <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.06]">
            <Zap className="size-4 text-[var(--accent)]" />
          </span>
          Built for keyboard-first operators, realtime teams, and AI-assisted revenue work.
        </motion.div>
      </motion.div>

      <HeroAnalyticsPreview />
    </section>
  );
}
