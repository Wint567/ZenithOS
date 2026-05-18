"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bot, Download, ExternalLink, FileClock, ReceiptText } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Timeline } from "@/shared/ui/timeline";
import { formatCurrency } from "@/lib/utils";
import { downloadCsv, downloadJson } from "@/lib/export";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { ActivityEvent, AuditEvent, Invoice, Order, Product } from "@/types";

type EntityKind = "order" | "user" | "product" | "invoice";

const orderTone: Record<Order["status"], "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "neutral",
};

const productTone: Record<Product["status"], "success" | "warning" | "danger"> = {
  "In stock": "success",
  "Low stock": "warning",
  Backorder: "danger",
};

const invoiceTone: Record<Invoice["status"], "success" | "warning" | "danger"> = {
  paid: "success",
  open: "warning",
  failed: "danger",
};

function auditToTimeline(events: AuditEvent[]): ActivityEvent[] {
  return events.map((event) => ({
    id: event.id,
    title: event.action,
    description: `${event.actor} · ${event.target}`,
    time: event.timestamp,
    tone: event.severity === "info" ? "brand" : event.severity,
  }));
}

export function EntityDetailView({ kind }: { kind: EntityKind }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const pushToast = useAppStore((state) => state.pushToast);
  const orders = useWorkspaceStore((state) => state.orders);
  const users = useWorkspaceStore((state) => state.users);
  const products = useWorkspaceStore((state) => state.products);
  const invoices = useWorkspaceStore((state) => state.invoices);
  const auditLog = useWorkspaceStore((state) => state.auditLog);
  const addAIMessage = useWorkspaceStore((state) => state.addAIMessage);

  const order = kind === "order" ? orders.find((item) => item.id === id) : undefined;
  const user = kind === "user" ? users.find((item) => item.id === id) : users.find((item) => item.email === order?.email || item.name === order?.customer);
  const product = kind === "product" ? products.find((item) => item.id === id) : products.find((item) => item.name === order?.product);
  const invoice = kind === "invoice" ? invoices.find((item) => item.id === id) : invoices[Math.abs((order?.id ?? "").length) % invoices.length];
  const entity = kind === "order" ? order : kind === "user" ? user : kind === "product" ? product : invoice;
  const entityAudits = auditLog.filter((event) => event.entityId === id || event.target.includes(id) || (entity && event.target.includes("name" in entity ? String(entity.name) : "customer" in entity ? String(entity.customer) : String(entity.id))));
  const relatedOrders = kind === "user" && user
    ? orders.filter((item) => item.email === user.email || item.customer === user.name)
    : kind === "product" && product
      ? orders.filter((item) => item.product === product.name)
      : order
        ? orders.filter((item) => item.customer === order.customer || item.product === order.product).filter((item) => item.id !== order.id)
        : orders.slice(0, 4);

  if (!entity) {
    return (
      <DetailShell title="Entity not found" eyebrow="Missing record" description="This local workspace does not contain the requested entity." backHref="/dashboard">
        <EmptyState icon={FileClock} title="No matching entity" description="The record may have been created in a different local workspace state or removed from persisted data." action="Return to dashboard" onAction={() => router.push("/dashboard")} />
      </DetailShell>
    );
  }

  function exportEntity() {
    downloadJson(`zenithos-${kind}-${id}.json`, { kind, entity, relatedOrders, audit: entityAudits });
    pushToast({ title: "Entity exported", message: `${id} exported as JSON with related context.`, tone: "brand" });
  }

  function askAI() {
    const insight =
      kind === "order" && order
        ? `${order.id} is a ${order.status} ${formatCurrency(order.total)} order for ${order.product}. Related customer and invoice context are available from this detail view.`
        : kind === "product" && product
          ? `${product.name} has ${product.stock} units available and ${relatedOrders.length} related orders. ${product.status === "Low stock" ? "Inventory is below target." : "Inventory is stable."}`
          : kind === "user" && user
            ? `${user.name} has ${relatedOrders.length} related orders and currently holds the ${user.role} role. Review audit history before changing access.`
            : `${id} has status ${(entity as Invoice).status}. Export finance context or review related order activity.`;
    addAIMessage({ role: "assistant", text: insight });
    pushToast({ title: "AI insight generated", message: "Zenith AI added contextual analysis to the assistant history.", tone: "brand" });
  }

  const title = kind === "order" && order ? order.id : kind === "user" && user ? user.name : kind === "product" && product ? product.name : id;

  return (
    <DetailShell title={title} eyebrow={`${kind} detail`} description="A connected operational record with related entities, audit history, exports, notes, and contextual AI recommendations." backHref={kind === "invoice" ? "/billing" : `/${kind}s`}>
      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div><h2 className="text-xl font-semibold">Overview</h2><p className="mt-1 text-sm text-[var(--muted)]">Primary record metadata and business context.</p></div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={exportEntity}><Download className="size-4" /> Export JSON</Button>
              <Button size="sm" onClick={askAI}><Bot className="size-4" /> Ask AI</Button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {kind === "order" && order ? [
              ["Customer", order.customer], ["Email", order.email], ["Product", order.product], ["Status", <Badge key="status" tone={orderTone[order.status]}>{order.status}</Badge>], ["Total", formatCurrency(order.total)], ["Channel", order.channel],
            ].map(([label, value]) => <Meta key={String(label)} label={String(label)} value={value} />) : null}
            {kind === "user" && user ? [
              ["Email", user.email], ["Role", user.role], ["Status", <Badge key="status" tone={user.status === "active" ? "success" : user.status === "pending" ? "warning" : user.status === "blocked" ? "danger" : "neutral"}>{user.status}</Badge>], ["Location", user.location], ["Last seen", user.lastSeen], ["Related orders", relatedOrders.length],
            ].map(([label, value]) => <Meta key={String(label)} label={String(label)} value={value} />) : null}
            {kind === "product" && product ? [
              ["Category", product.category], ["Price", formatCurrency(product.price)], ["Stock", product.stock], ["Sold", product.sold], ["Rating", product.rating], ["Status", <Badge key="status" tone={productTone[product.status]}>{product.status}</Badge>],
            ].map(([label, value]) => <Meta key={String(label)} label={String(label)} value={value} />) : null}
            {kind === "invoice" && invoice ? [
              ["Invoice", invoice.id], ["Date", invoice.date], ["Amount", formatCurrency(invoice.amount)], ["Status", <Badge key="status" tone={invoiceTone[invoice.status]}>{invoice.status}</Badge>], ["Related orders", relatedOrders.length], ["Workspace", "Northstar Labs"],
            ].map(([label, value]) => <Meta key={String(label)} label={String(label)} value={value} />) : null}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Contextual recommendation</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {kind === "product" && product?.stock && product.stock < 50
              ? "Inventory is below the operational target. Consider reviewing acquisition campaigns and procurement timing."
              : kind === "invoice" && invoice?.status !== "paid"
                ? "This invoice should be reviewed before the next renewal cycle. Export the invoice context for finance reconciliation."
                : kind === "user"
                  ? "Review access changes against audit history before changing permissions for this teammate."
                  : "This record is healthy. Use related entities to understand downstream operational impact."}
          </p>
          <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Linked invoice</p>
            <Link href={`/billing/invoices/${invoice?.id}`} className="mt-2 inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--accent)]">
              <ReceiptText className="size-4" /> {invoice?.id} <ExternalLink className="size-3" />
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <h2 className="font-semibold">Related orders</h2>
          <div className="mt-5 grid gap-3">
            {relatedOrders.slice(0, 5).map((item) => (
              <Link key={item.id} href={`/orders/${item.id}`} className="grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-1)] p-3 text-sm transition hover:bg-[var(--surface-2)] sm:grid-cols-[1fr_auto]">
                <span><span className="font-medium">{item.id}</span> · {item.customer}</span>
                <span className="font-semibold">{formatCurrency(item.total)}</span>
              </Link>
            ))}
            {!relatedOrders.length ? <p className="text-sm text-[var(--muted)]">No related orders found in local workspace state.</p> : null}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Audit history</h2>
          <div className="mt-5">
            {entityAudits.length ? <Timeline events={auditToTimeline(entityAudits.slice(0, 8))} /> : <p className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm text-[var(--muted)]">No direct audit events are linked yet. Future mutations on this record will appear here.</p>}
          </div>
        </Card>
      </section>

      <Card>
        <h2 className="font-semibold">Operator notes</h2>
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm leading-6 text-[var(--muted)]">
          Notes are simulated locally for portfolio realism. In this frontend-only prototype, the strongest signal is the connected record model: exports, audit history, related entities, and AI analysis all derive from persisted mock state.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => downloadCsv(`zenithos-${kind}-${id}-orders.csv`, relatedOrders.map(({ id, customer, product, status, total, date }) => ({ id, customer, product, status, total, date })))}>Export related orders</Button>
          <Button variant="ghost" size="sm" onClick={() => router.push("/audit")}>Open audit logs</Button>
        </div>
      </Card>
    </DetailShell>
  );
}

function DetailShell({ title, eyebrow, description, backHref, children }: React.PropsWithChildren<{ title: string; eyebrow: string; description: string; backHref: string }>) {
  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm"><Link href={backHref}><ArrowLeft className="size-4" /> Back</Link></Button>
          <div className="mt-4"><Badge tone="brand">{eyebrow}</Badge></div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </section>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}
