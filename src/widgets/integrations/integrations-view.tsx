"use client";

import { useMemo, useState } from "react";
import { Bot, CheckCircle2, Github, MessageCircle, PlugZap, RefreshCw, Settings2, Slack, Unplug, Workflow, Zap } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Timeline } from "@/shared/ui/timeline";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import type { Integration, IntegrationId } from "@/types";

const iconMap: Record<IntegrationId, React.ElementType> = {
  slack: Slack,
  github: Github,
  stripe: Zap,
  discord: MessageCircle,
  notion: Bot,
  linear: Workflow,
  zapier: PlugZap,
};

const statusTone: Record<Integration["status"], "brand" | "success" | "warning" | "danger" | "neutral"> = {
  available: "neutral",
  connected: "success",
  syncing: "brand",
  error: "danger",
};

export function IntegrationsView() {
  const pushToast = useAppStore((state) => state.pushToast);
  const integrations = useWorkspaceStore((state) => state.integrations);
  const connectIntegration = useWorkspaceStore((state) => state.connectIntegration);
  const disconnectIntegration = useWorkspaceStore((state) => state.disconnectIntegration);
  const syncIntegration = useWorkspaceStore((state) => state.syncIntegration);
  const [category, setCategory] = useState("all");
  const [pendingConnect, setPendingConnect] = useState<Integration | null>(null);
  const [logTarget, setLogTarget] = useState<Integration | null>(null);

  const filtered = useMemo(
    () => integrations.filter((integration) => category === "all" || integration.category === category),
    [category, integrations],
  );

  function connect(item: Integration) {
    connectIntegration(item.id);
    pushToast({ title: `${item.name} connected`, message: "Permissions saved and sync logs updated.", tone: "success" });
    setPendingConnect(null);
  }

  function sync(item: Integration) {
    syncIntegration(item.id);
    pushToast({ title: `${item.name} synced`, message: "Manual sync completed and audit event recorded.", tone: "brand" });
  }

  function disconnect(item: Integration) {
    disconnectIntegration(item.id);
    pushToast({ title: `${item.name} disconnected`, message: "Workspace automations using this integration are paused.", tone: "warning" });
  }

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
        <div>
          <Badge tone="brand">Marketplace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Integrations</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Connect the tools that make ZenithOS feel operational: finance sync, release context, alerts, docs, and workflow automation.
          </p>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--accent)]">
              <PlugZap className="size-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold">{integrations.filter((item) => item.connected).length}/{integrations.length}</p>
              <p className="text-xs text-[var(--muted)]">Connected systems</p>
            </div>
          </div>
        </Card>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Select className="w-full sm:w-56" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          <option value="Communication">Communication</option>
          <option value="Developer">Developer</option>
          <option value="Finance">Finance</option>
          <option value="Knowledge">Knowledge</option>
          <option value="Automation">Automation</option>
        </Select>
        <p className="text-sm text-[var(--muted)]">Connection state persists locally and writes audit events.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const Icon = iconMap[item.id];
          return (
            <Card key={item.id} className="group flex min-h-[18rem] flex-col p-5 transition hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface-1)]">
                  <Icon className="size-5 text-[var(--accent)]" />
                </span>
                <Badge tone={statusTone[item.status]}>{item.status}</Badge>
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  {item.connected ? <CheckCircle2 className="size-4 text-[var(--badge-success-fg)]" /> : null}
                </div>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </div>
              <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface-0)] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Last sync</p>
                <p className="mt-1 text-sm font-medium">{item.lastSync}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {item.connected ? (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => sync(item)}><RefreshCw className="size-4" /> Sync</Button>
                    <Button variant="ghost" size="sm" onClick={() => setLogTarget(item)}><Settings2 className="size-4" /> Logs</Button>
                    <Button variant="danger" size="sm" onClick={() => disconnect(item)}><Unplug className="size-4" /> Disconnect</Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setPendingConnect(item)}><PlugZap className="size-4" /> Connect</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={Boolean(pendingConnect)} title="Review integration permissions" onClose={() => setPendingConnect(null)}>
        {pendingConnect ? (
          <div className="grid gap-4">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
              <p className="text-sm text-[var(--muted)]">{pendingConnect.category}</p>
              <h3 className="mt-1 text-xl font-semibold">Connect {pendingConnect.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pendingConnect.description}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Requested permissions</p>
              <div className="grid gap-2">
                {pendingConnect.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-0)] px-3 py-2 text-sm">
                    <CheckCircle2 className="size-4 text-[var(--badge-success-fg)]" />
                    {permission}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPendingConnect(null)}>Cancel</Button>
              <Button onClick={() => connect(pendingConnect)}>Approve and connect</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={Boolean(logTarget)} title="Integration sync logs" onClose={() => setLogTarget(null)}>
        {logTarget ? (
          <div className="grid gap-4">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
              <h3 className="text-xl font-semibold">{logTarget.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Status: {logTarget.status} · Last sync: {logTarget.lastSync}</p>
            </div>
            {logTarget.logs.length ? (
              <Timeline
                events={logTarget.logs.map((log) => ({
                  id: log.id,
                  title: log.message,
                  description: logTarget.name,
                  time: log.timestamp,
                  tone: log.severity === "info" ? "brand" : log.severity,
                }))}
              />
            ) : (
              <p className="rounded-xl border border-[var(--line)] bg-[var(--surface-0)] p-4 text-sm text-[var(--muted)]">No sync logs yet. Connect or run a manual sync to generate operational history.</p>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
