import Link from "next/link";
import { ArrowRight, BarChart3, Check, Command, CreditCard, Shield, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { LandingHero } from "@/widgets/landing/landing-hero";

const companies = ["Northstar", "HelioWorks", "AstraPay", "Relay", "Orbital", "Kite"];

const features = [
  ["Executive clarity", "Unify revenue, customers, orders, and operational health in one command surface.", BarChart3],
  ["AI-assisted ops", "Surface anomalies, growth opportunities, and next actions before teams ask.", Sparkles],
  ["Secure by default", "Model permissions, SSO signals, audit activity, and security alerts in the UI.", Shield],
  ["Billing native", "Plans, invoices, payment methods, and usage limits feel first-class.", CreditCard],
  ["Keyboard-first", "Command navigation and shortcuts make the dashboard feel fast and professional.", Command],
  ["Realtime signals", "Simulated live updates make the app feel active without any backend.", Zap],
];

const pricing = [
  ["Launch", "$49", "For boutique teams shipping their first SaaS dashboard.", ["5 seats", "10K automation credits", "Core analytics"]],
  ["Scale", "$149", "For funded teams operating revenue and support workflows.", ["25 seats", "100K credits", "AI insights", "Priority support"]],
  ["Enterprise", "Custom", "For organizations with security and procurement requirements.", ["SSO policy", "Audit exports", "Custom controls"]],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--shell)] px-4 py-4 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white text-black shadow-2xl"><Zap className="size-5 fill-black" /></span>
            <span className="font-semibold">ZenithOS</span>
          </Link>
          <div className="ml-6 hidden items-center gap-6 text-sm text-foreground/55 md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#analytics" className="hover:text-foreground">Analytics</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="hidden text-sm font-medium text-foreground/65 hover:text-foreground sm:block">Log in</Link>
            <Button size="sm" asChild>
              <Link href="/dashboard">Open app <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </nav>
      </header>

      <LandingHero />

      <section className="border-y border-white/10 bg-white/[0.03] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm font-semibold uppercase tracking-[.18em] text-foreground/35">
          {companies.map((company) => <span key={company}>{company}</span>)}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-24">
        <div className="max-w-2xl"><Badge tone="brand">Built like a product</Badge><h2 className="mt-4 text-4xl font-semibold tracking-tight">Everything recruiters expect from a serious SaaS frontend.</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, desc, Icon]) => (
            <Card key={String(title)} className="transition hover:-translate-y-1 hover:bg-white/[0.08]">
              <Icon className="size-5 text-[var(--accent)]" />
              <h3 className="mt-5 font-semibold">{String(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/55">{String(desc)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="analytics" className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <Badge tone="success">Analytics showcase</Badge>
          <h2 className="mt-4 text-3xl font-semibold">Revenue intelligence that feels alive.</h2>
          <p className="mt-3 text-sm leading-6 text-foreground/55">Premium chart styling, realtime signals, usage states, and AI summaries make the dashboard feel funded and operational.</p>
          <div className="mt-8 grid gap-3">
            {["Expansion revenue is pacing 18% above forecast.", "Mid-market activation improved after onboarding updates.", "Security policy caught 2 risky access attempts."].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm">
                <Check className="size-4 text-emerald-300" /> {item}
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-[linear-gradient(135deg,rgba(124,92,255,.16),rgba(16,215,196,.08))]">
          <p className="text-sm text-foreground/45">Projected ARR</p>
          <p className="mt-3 text-5xl font-semibold">$2.04M</p>
          <div className="mt-8 grid gap-3">
            {["Churn risk", "Expansion pipeline", "Support SLA"].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-sm"><span>{item}</span><span className="text-foreground/45">{[12, 78, 99][index]}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" style={{ width: `${[12, 78, 99][index]}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-24">
        <div className="text-center"><Badge tone="brand">Pricing</Badge><h2 className="mt-4 text-4xl font-semibold">Plans that mirror real SaaS packaging.</h2></div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricing.map(([name, price, desc, items], index) => (
            <Card key={String(name)} className={index === 1 ? "border-[var(--accent)]/40 bg-white/[0.08]" : ""}>
              <h3 className="text-xl font-semibold">{String(name)}</h3>
              <p className="mt-3 text-4xl font-semibold">{String(price)}<span className="text-sm text-foreground/40">{price !== "Custom" ? "/mo" : ""}</span></p>
              <p className="mt-3 text-sm leading-6 text-foreground/55">{String(desc)}</p>
              <div className="mt-6 grid gap-3">
                {(items as string[]).map((item) => <p key={item} className="flex items-center gap-2 text-sm"><Check className="size-4 text-emerald-300" />{item}</p>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-4 lg:grid-cols-3">
          {["Looks like something a funded startup would ship.", "The motion is polished without getting in the way.", "It demonstrates real frontend architecture, not just UI shots."].map((quote, index) => (
            <Card key={quote}><p className="text-lg leading-8">“{quote}”</p><p className="mt-5 text-sm text-foreground/45">{["VP Product, Relay", "Design Lead, AstraPay", "Frontend Manager, HelioWorks"][index]}</p></Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 pb-24">
        <h2 className="text-center text-4xl font-semibold">FAQ</h2>
        <div className="mt-8 grid gap-3">
          {[
            ["Does ZenithOS use a backend?", "No. It is intentionally frontend-only with mock APIs, localStorage, and simulated realtime behavior."],
            ["What does it demonstrate?", "Architecture, typed UI systems, charts, state management, animation, responsive UX, and product thinking."],
            ["Can it deploy to Vercel?", "Yes. The app builds statically and does not depend on a database or server process."],
          ].map(([q, a]) => <Card key={q}><h3 className="font-semibold">{q}</h3><p className="mt-2 text-sm leading-6 text-foreground/55">{a}</p></Card>)}
        </div>
      </section>

      <section className="px-4 pb-12">
        <Card className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-semibold">Open the operating layer.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-foreground/55">Explore the dashboard, command palette, realtime updates, billing flows, AI assistant, and responsive SaaS interface.</p>
          <div className="mt-6"><Button size="lg" asChild><Link href="/dashboard">View ZenithOS <ArrowRight className="size-4" /></Link></Button></div>
        </Card>
      </section>

      <footer className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-foreground/45 md:flex-row md:items-center md:justify-between">
          <p>ZenithOS. Premium SaaS frontend portfolio platform.</p>
          <div className="flex gap-5"><Link href="/login">Login</Link><Link href="/register">Register</Link><Link href="/dashboard">Dashboard</Link></div>
        </div>
      </footer>
    </main>
  );
}
