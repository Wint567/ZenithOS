"use client";

import Link from "next/link";
import { Check, CreditCard, Download, Gem, ReceiptText, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { paymentMethods } from "@/mock/data";
import { downloadCsv } from "@/lib/export";

export function BillingView() {
  const pushToast = useAppStore((state) => state.pushToast);
  const workspace = useWorkspaceStore((state) => state.workspace);
  const invoices = useWorkspaceStore((state) => state.invoices);
  const setPlan = useWorkspaceStore((state) => state.setPlan);
  const usage = [
    { label: "Automation credits", used: 84200 + invoices.length * 90, limit: 100000 },
    { label: "Tracked customers", used: 8610, limit: 12000 },
    { label: "Team seats", used: 42, limit: 60 },
  ];

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Subscription</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Billing</h1>
        <p className="mt-2 text-sm text-foreground/55">A complete SaaS billing surface for plans, usage, invoices, payment methods, and upgrades.</p>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="bg-[linear-gradient(135deg,rgba(124,92,255,.16),rgba(16,215,196,.07))]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge tone="success">Current plan</Badge>
              <h2 className="mt-4 text-3xl font-semibold">{workspace.plan}</h2>
              <p className="mt-2 text-sm text-foreground/55">Renews on June 17, 2026. Includes advanced automation, analytics, and priority support.</p>
            </div>
            <Button onClick={() => { setPlan("Enterprise"); pushToast({ title: "Upgrade request created", message: "Enterprise plan selected and saved locally.", tone: "success" }); }}><Sparkles className="size-4" /> Upgrade plan</Button>
          </div>
          <div className="mt-7 grid gap-4">
            {usage.map((item) => {
              const percent = Math.round((item.used / item.limit) * 100);
              return (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm"><span>{item.label}</span><span className="text-foreground/45">{percent}%</span></div>
                  <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" style={{ width: `${percent}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Payment methods</h2>
          <div className="mt-5 grid gap-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-white/10"><CreditCard className="size-4" /></span>
                <div><p className="font-medium">{method.brand} ending {method.last4}</p><p className="text-sm text-foreground/45">Expires {method.expires}</p></div>
                <Badge className="ml-auto" tone="success">Default</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="font-semibold">Upgrade comparison</h2>
          <div className="mt-5 grid gap-3">
            {["Unlimited dashboards", "SAML SSO", "Audit exports", "Custom procurement terms"].map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm">
                <Check className="size-4 text-emerald-300" /> {feature}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Invoices</h2>
            <Button variant="secondary" size="sm" onClick={() => { downloadCsv("zenithos-invoices.csv", invoices.map(({ id, date, amount, status }) => ({ id, date, amount, status }))); pushToast({ title: "Invoices exported", message: "A CSV export was generated locally.", tone: "brand" }); }}><Download className="size-4" /> Export</Button>
          </div>
          <div className="grid gap-3">
            {invoices.map((invoice) => (
              <Link key={invoice.id} href={`/billing/invoices/${invoice.id}`} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:bg-[var(--surface-2)] sm:grid-cols-[auto_1fr_auto_auto] sm:items-center">
                <ReceiptText className="size-5 text-foreground/45" />
                <div><p className="font-medium">{invoice.id}</p><p className="text-sm text-foreground/45">{invoice.date}</p></div>
                <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                <Badge tone={invoice.status === "paid" ? "success" : invoice.status === "open" ? "warning" : "danger"}>{invoice.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {["Launch", "Scale", "Enterprise"].map((plan, index) => (
          <Card key={plan} className={plan === workspace.plan ? "border-[var(--accent)]/40 bg-white/[0.08]" : ""}>
            <Gem className="size-5 text-[var(--accent)]" />
            <h3 className="mt-4 text-xl font-semibold">{plan}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/50">{["For early product teams.", "For scaling SaaS operations.", "For security-first organizations."][index]}</p>
            <p className="mt-5 text-3xl font-semibold">{index === 2 ? "Custom" : formatCurrency([49, 149][index])}<span className="text-sm text-foreground/40">{index === 2 ? "" : "/mo"}</span></p>
          </Card>
        ))}
      </section>
    </div>
  );
}
