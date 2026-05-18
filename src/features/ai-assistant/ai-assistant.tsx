"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ExternalLink, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { useAppStore } from "@/store/use-app-store";
import { downloadCsv } from "@/lib/export";

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pushToast = useAppStore((state) => state.pushToast);
  const messages = useWorkspaceStore((state) => state.aiHistory);
  const addAIMessage = useWorkspaceStore((state) => state.addAIMessage);
  const orders = useWorkspaceStore((state) => state.orders);
  const products = useWorkspaceStore((state) => state.products);
  const invoices = useWorkspaceStore((state) => state.invoices);
  const metrics = useWorkspaceStore((state) => state.metrics);
  const integrations = useWorkspaceStore((state) => state.integrations);
  const auditLog = useWorkspaceStore((state) => state.auditLog);

  const routeContext =
    pathname === "/billing"
      ? "billing"
      : pathname === "/orders"
        ? "orders"
        : pathname === "/products"
          ? "inventory"
          : pathname === "/integrations"
            ? "integrations"
            : pathname === "/audit"
              ? "audit"
              : "workspace";

  function ask() {
    const lowStock = products.filter((product) => product.stock < 50).map((product) => product.name);
    const openInvoices = invoices.filter((invoice) => invoice.status !== "paid").length;
    const latest = metrics.at(-1);
    const disconnected = integrations.filter((integration) => !integration.connected).length;
    const next =
      routeContext === "orders"
        ? `${orders.filter((order) => order.status === "pending").length} pending orders remain in review. Export the queue or inspect failed payments before the next finance sync.`
        : routeContext === "billing"
          ? `${openInvoices} invoice${openInvoices > 1 ? "s require" : " requires"} finance review. Current plan usage suggests reviewing automation credits this week.`
          : routeContext === "integrations"
            ? `${disconnected} integrations are available but disconnected. GitHub and Notion would improve release and documentation context.`
            : routeContext === "audit"
              ? `${auditLog.length} audit events are retained locally. The latest mutations are coming from realtime orders, integrations, and role changes.`
              : lowStock.length
                ? `${lowStock.slice(0, 2).join(" and ")} inventory is below target. Consider pausing acquisition campaigns until replenishment.`
                : `Revenue is tracking at ${latest?.revenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} after ${orders.length} recorded orders.`;
    addAIMessage({ role: "user", text: "What needs attention?" });
    addAIMessage({ role: "assistant", text: next });
  }

  function runAction(action: "billing" | "orders-export" | "products" | "integrations" | "audit") {
    if (action === "orders-export") {
      downloadCsv("zenithos-ai-orders.csv", orders.map(({ id, customer, product, status, total, date }) => ({ id, customer, product, status, total, date })));
      pushToast({ title: "Orders exported", message: "Zenith AI generated a current order export.", tone: "brand" });
      return;
    }
    const routes = { billing: "/billing", products: "/products", integrations: "/integrations", audit: "/audit" };
    router.push(routes[action]);
    setOpen(false);
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(0,0,0,.35)] lg:bottom-5"
      >
        <Sparkles className="size-4" /> Zenith AI
      </motion.button>
      <AnimatePresence>
        {open ? (
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Zenith AI"
            className="glass fixed bottom-4 right-4 z-[75] flex h-[min(34rem,calc(100vh-2rem))] w-[min(26rem,calc(100vw-2rem))] flex-col rounded-xl p-4"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent)]"><Bot className="size-4 text-white" /></span>
              <div><p className="font-semibold">Zenith AI</p><p className="text-xs text-foreground/45">Workspace analyst</p></div>
              <Button className="ml-auto size-8" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close AI assistant"><X className="size-4" /></Button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-xl p-3 text-sm leading-6 ${message.role === "assistant" ? "bg-white/[0.07] text-foreground/75" : "ml-auto bg-white text-black"}`}
                >
                  {message.text}
                </motion.div>
              ))}
            </div>
            <div className="grid gap-2 border-t border-white/10 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => runAction("billing")} className="rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-2 text-left text-xs transition hover:bg-[var(--surface-2)]">
                  Review invoices <ExternalLink className="mt-1 size-3 text-[var(--muted)]" />
                </button>
                <button type="button" onClick={() => runAction("orders-export")} className="rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-2 text-left text-xs transition hover:bg-[var(--surface-2)]">
                  Export orders <ExternalLink className="mt-1 size-3 text-[var(--muted)]" />
                </button>
                <button type="button" onClick={() => runAction("products")} className="rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-2 text-left text-xs transition hover:bg-[var(--surface-2)]">
                  Low stock <ExternalLink className="mt-1 size-3 text-[var(--muted)]" />
                </button>
                <button type="button" onClick={() => runAction(routeContext === "integrations" ? "audit" : "integrations")} className="rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-2 text-left text-xs transition hover:bg-[var(--surface-2)]">
                  {routeContext === "integrations" ? "Audit syncs" : "Open integrations"} <ExternalLink className="mt-1 size-3 text-[var(--muted)]" />
                </button>
              </div>
              <button type="button" onClick={ask} className="rounded-lg border border-white/10 bg-white/[0.05] p-3 text-left text-sm transition hover:bg-white/[0.08]">
                Generate {routeContext} recommendation
              </button>
              <Button onClick={ask}><Send className="size-4" /> Ask Zenith AI</Button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
