"use client";

import { useMemo, useState } from "react";
import { FileClock, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { EnterpriseTable, type BulkAction, type EnterpriseColumn } from "@/shared/ui/enterprise-table";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Modal } from "@/shared/ui/modal";
import { Timeline } from "@/shared/ui/timeline";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { AuditEvent } from "@/types";

const severityTone: Record<AuditEvent["severity"], "brand" | "success" | "warning" | "danger"> = {
  info: "brand",
  success: "success",
  warning: "warning",
  danger: "danger",
};

function dateGroup(timestamp: string) {
  return timestamp.split(",")[0] ?? "Recent";
}

export function AuditLogsView() {
  const auditLog = useWorkspaceStore((state) => state.auditLog);
  const addAuditEvent = useWorkspaceStore((state) => state.addAuditEvent);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [selected, setSelected] = useState<AuditEvent | null>(null);

  const filtered = useMemo(
    () =>
      auditLog.filter((event) => {
        const search = `${event.actor} ${event.action} ${event.target} ${event.entityType ?? ""}`.toLowerCase();
        return search.includes(query.toLowerCase()) && (severity === "all" || event.severity === severity);
      }),
    [auditLog, query, severity],
  );

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, AuditEvent[]>>((acc, event) => {
        const group = dateGroup(event.timestamp);
        acc[group] = [...(acc[group] ?? []), event];
        return acc;
      }, {}),
    [filtered],
  );

  const columns: EnterpriseColumn<AuditEvent>[] = [
    {
      id: "timestamp",
      header: "Time",
      sortable: true,
      accessor: (event) => event.timestamp,
      render: (event) => <span className="text-foreground/60">{event.timestamp}</span>,
    },
    {
      id: "actor",
      header: "Actor",
      sortable: true,
      accessor: (event) => event.actor,
      render: (event) => <span className="font-medium text-foreground">{event.actor}</span>,
    },
    {
      id: "action",
      header: "Action",
      sortable: true,
      accessor: (event) => event.action,
      render: (event) => <span className="capitalize">{event.action}</span>,
    },
    {
      id: "target",
      header: "Target",
      sortable: true,
      accessor: (event) => event.target,
      render: (event) => (
        <div>
          <p className="font-medium text-foreground">{event.target}</p>
          <p className="text-xs text-[var(--muted)]">{event.entityType ?? "system"} {event.entityId ? `· ${event.entityId}` : ""}</p>
        </div>
      ),
    },
    {
      id: "severity",
      header: "Severity",
      sortable: true,
      accessor: (event) => event.severity,
      render: (event) => <Badge tone={severityTone[event.severity]}>{event.severity}</Badge>,
    },
  ];

  const bulkActions: BulkAction<AuditEvent>[] = [
    {
      id: "reviewed",
      label: "Mark selected as reviewed",
      action: (rows) =>
        addAuditEvent({
          actor: "Dara Founder",
          action: "reviewed audit selection",
          target: `${rows.length} event${rows.length === 1 ? "" : "s"}`,
          severity: "success",
          entityType: "system",
        }),
    },
  ];

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <Badge tone="brand">Enterprise visibility</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Audit logs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Trace every operational mutation across workspace, commerce, billing, users, integrations, and realtime automation.
          </p>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--accent)]">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">{auditLog.length}</p>
              <p className="text-xs text-[var(--muted)]">Persisted audit events</p>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actors, actions, targets..." icon={<Search className="size-4" />} />
          <Select value={severity} onChange={(event) => setSeverity(event.target.value)}>
            <option value="all">All severities</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </Select>
        </div>
        <EnterpriseTable
          tableId="audit-log"
          rows={filtered}
          columns={columns}
          getRowId={(event) => event.id}
          onRowOpen={setSelected}
          bulkActions={bulkActions}
          empty={<EmptyState icon={FileClock} title="No audit events match" description="Try a broader search or remove the severity filter to inspect more workspace history." />}
          mobileCard={(event, selected, toggle) => (
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-3">
                <button type="button" onClick={() => setSelected(event)} className="text-left">
                  <p className="font-semibold text-foreground">{event.action}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{event.actor} · {event.timestamp}</p>
                </button>
                <Badge tone={severityTone[event.severity]}>{event.severity}</Badge>
              </div>
              <button type="button" onClick={toggle} className="text-left text-xs text-[var(--muted)]">{selected ? "Selected" : "Tap to select"} · {event.target}</button>
            </div>
          )}
        />
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Date-grouped history</h2>
            <p className="text-sm text-[var(--muted)]">A timeline view for quick compliance scanning.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(grouped).slice(0, 4).map(([group, events]) => (
            <div key={group} className="rounded-xl border border-[var(--line)] bg-[var(--surface-0)] p-4">
              <p className="mb-3 text-sm font-semibold">{group}</p>
              <Timeline
                events={events.slice(0, 4).map((event) => ({
                  id: event.id,
                  title: event.action,
                  description: `${event.actor} · ${event.target}`,
                  time: event.timestamp,
                  tone: event.severity === "info" ? "brand" : event.severity,
                }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Modal open={Boolean(selected)} title="Audit event detail" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid gap-4">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
              <Badge tone={severityTone[selected.severity]}>{selected.severity}</Badge>
              <h3 className="mt-3 text-xl font-semibold capitalize">{selected.action}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{selected.timestamp}</p>
            </div>
            {[
              ["Actor", selected.actor],
              ["Target", selected.target],
              ["Entity", `${selected.entityType ?? "system"}${selected.entityId ? ` · ${selected.entityId}` : ""}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-[var(--line)] pb-3 text-sm">
                <span className="text-[var(--muted)]">{label}</span>
                <span className="text-right">{value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
