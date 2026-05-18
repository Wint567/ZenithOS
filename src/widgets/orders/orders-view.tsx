"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Search, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { EnterpriseTable, type BulkAction, type EnterpriseColumn } from "@/shared/ui/enterprise-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { Timeline } from "@/shared/ui/timeline";
import { orderTimeline } from "@/mock/data";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { downloadCsv } from "@/lib/export";

const statusTone: Record<Order["status"], "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "neutral",
};

export function OrdersView() {
  const router = useRouter();
  const pushToast = useAppStore((state) => state.pushToast);
  const orders = useWorkspaceStore((state) => state.orders);
  const updateOrderStatus = useWorkspaceStore((state) => state.updateOrderStatus);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const sortKey = "date";
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const rows = [...orders].filter((order) => {
      const matchesSearch = `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || order.status === status;
      return matchesSearch && matchesStatus;
    });
    rows.sort((a, b) => {
      const left = a[sortKey as keyof Order];
      const right = b[sortKey as keyof Order];
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * -1;
    });
    return rows;
  }, [orders, search, status, sortKey]);

  const pageSize = 8;
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const columns: EnterpriseColumn<Order>[] = [
    { id: "id", header: "Order", sortable: true, accessor: (row) => row.id, render: (row) => <span className="font-medium text-foreground">{row.id}</span>, hideable: false },
    { id: "customer", header: "Customer", sortable: true, accessor: (row) => row.customer, render: (row) => <div><p className="font-medium text-foreground">{row.customer}</p><p className="text-xs text-foreground/40">{row.email}</p></div> },
    { id: "product", header: "Product", sortable: true, accessor: (row) => row.product },
    { id: "status", header: "Status", sortable: true, accessor: (row) => row.status, render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge> },
    { id: "total", header: "Total", sortable: true, accessor: (row) => row.total, render: (row) => formatCurrency(row.total) },
    { id: "date", header: "Date", sortable: true, accessor: (row) => row.date },
  ];

  const bulkActions: BulkAction<Order>[] = [
    {
      id: "paid",
      label: "Mark as paid",
      action: (rows) => {
        updateOrderStatus(rows.map((row) => row.id), "paid");
        pushToast({ title: "Orders updated", message: `${rows.length} selected order${rows.length === 1 ? "" : "s"} marked paid.`, tone: "success" });
      },
    },
    {
      id: "pending",
      label: "Move to pending review",
      action: (rows) => {
        updateOrderStatus(rows.map((row) => row.id), "pending");
        pushToast({ title: "Orders updated", message: `${rows.length} selected order${rows.length === 1 ? "" : "s"} moved to pending.`, tone: "warning" });
      },
    },
  ];

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Commerce ops</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-foreground/55">Search, filter, sort, and inspect customer orders with a reusable table system.</p>
      </section>
      <Card>
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search orders..." icon={<Search className="size-4" />} />
          <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Button variant="secondary" onClick={() => { downloadCsv("zenithos-orders.csv", filtered.map(({ id, customer, product, status, total, date }) => ({ id, customer, product, status, total, date }))); pushToast({ title: "Orders exported", message: "Filtered order data downloaded as CSV.", tone: "brand" }); }}><CreditCard className="size-4" /> Export</Button>
        </div>
        {pageRows.length ? (
          <>
            <EnterpriseTable
              tableId="orders"
              rows={pageRows}
              columns={columns}
              getRowId={(order) => order.id}
              onRowOpen={(order) => router.push(`/orders/${order.id}`)}
              bulkActions={bulkActions}
              mobileCard={(order, selectedRow, toggle) => (
                <div className="grid gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => router.push(`/orders/${order.id}`)} className="text-left">
                      <p className="font-semibold">{order.id}</p>
                      <p className="mt-1 text-sm text-foreground/45">{order.customer}</p>
                    </button>
                    <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/50">{order.product}</span>
                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                  </div>
                  <button type="button" onClick={toggle} className="text-left text-xs text-[var(--muted)]">{selectedRow ? "Selected for bulk actions" : "Select order"}</button>
                </div>
              )}
            />
          </>
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Your filters are hiding every order. Clear the search or change status to inspect the full commerce pipeline."
            action="Clear filters"
            onAction={() => {
              setSearch("");
              setStatus("all");
            }}
          />
        )}
        <div className="mt-5 flex items-center justify-between text-sm text-foreground/55">
          <span>{filtered.length} results</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
            <span>Page {page} of {pages}</span>
            <Button variant="secondary" size="sm" disabled={page === pages} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </div>
        </div>
      </Card>
      <Modal open={Boolean(selected)} title="Order details" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
              <p className="text-sm text-foreground/45">{selected.id}</p>
              <h3 className="mt-1 text-xl font-semibold">{selected.product}</h3>
            </div>
            {[
              ["Customer", selected.customer],
              ["Email", selected.email],
              ["Channel", selected.channel],
              ["Total", formatCurrency(selected.total)],
              ["Date", selected.date],
            ].map(([label, value]) => <div key={label} className="flex justify-between border-b border-white/10 pb-3 text-sm"><span className="text-foreground/45">{label}</span><span>{value}</span></div>)}
            <div>
              <h4 className="mb-3 font-semibold">Order timeline</h4>
              <Timeline events={orderTimeline} />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
