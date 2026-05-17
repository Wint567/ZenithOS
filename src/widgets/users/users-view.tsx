"use client";

import { useState } from "react";
import { Clock, MapPin, Search, UserPlus } from "lucide-react";
import type { User } from "@/types";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Drawer } from "@/shared/ui/drawer";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { DataTable, type Column } from "@/shared/ui/table";
import { Timeline } from "@/shared/ui/timeline";
import { userTimeline } from "@/mock/data";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";

const statusTone: Record<User["status"], "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending: "warning",
  blocked: "danger",
  inactive: "neutral",
};

export function UsersView() {
  const pushToast = useAppStore((state) => state.pushToast);
  const team = useWorkspaceStore((state) => state.users);
  const invitePersistedUser = useWorkspaceStore((state) => state.inviteUser);
  const updateUserRole = useWorkspaceStore((state) => state.updateUserRole);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name: "Elena Morris", email: "elena@northstarhq.com", role: "Analyst" as User["role"] });

  const users = team.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));

  function inviteUser(event: React.FormEvent) {
    event.preventDefault();
    const next: User = {
      id: `usr_${Date.now()}`,
      name: invite.name,
      email: invite.email,
      role: invite.role,
      status: "pending",
      avatar: invite.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      location: "Remote",
      lastSeen: "Invitation sent",
      activity: ["Invitation sent by admin", "Workspace role assigned", "Security policy queued"],
    };
    invitePersistedUser(next);
    setInviteOpen(false);
    pushToast({ title: "Invitation sent", message: `${next.name} was invited as ${next.role}.`, tone: "success" });
  }

  function changeRole(role: User["role"]) {
    if (!selected) return;
    const updated = { ...selected, role };
    setSelected(updated);
    updateUserRole(selected.id, role);
    pushToast({ title: "Role updated", message: `${selected.name} is now ${role}.`, tone: "brand" });
  }
  const columns: Column<User>[] = [
    { key: "name", header: "User", render: (row) => <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-xs font-bold text-white">{row.avatar}</span><div><p className="font-medium text-foreground">{row.name}</p><p className="text-xs text-foreground/40">{row.email}</p></div></div> },
    { key: "role", header: "Role" },
    { key: "status", header: "Status", render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge> },
    { key: "location", header: "Location" },
    { key: "lastSeen", header: "Last seen" },
  ];

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="brand">Identity</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Users</h1>
          <p className="mt-2 text-sm text-foreground/55">Manage roles, status, access, and workspace activity from one clean view.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}><UserPlus className="size-4" /> Invite user</Button>
      </section>
      <Card>
        <div className="mb-5 max-w-md"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." icon={<Search className="size-4" />} /></div>
        <DataTable data={users as unknown as Record<string, unknown>[]} columns={columns as unknown as Column<Record<string, unknown>>[]} onRowClick={(row) => setSelected(row as unknown as User)} />
      </Card>
      <Drawer open={Boolean(selected)} title="User profile" onClose={() => setSelected(null)}>
        {selected ? (
          <div>
            <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-lg font-bold text-white">{selected.avatar}</div>
              <h3 className="mt-4 text-xl font-semibold">{selected.name}</h3>
              <p className="text-sm text-foreground/45">{selected.email}</p>
              <div className="mt-4 flex justify-center gap-2"><Badge>{selected.role}</Badge><Badge tone={statusTone[selected.status]}>{selected.status}</Badge></div>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center gap-2 text-foreground/60"><MapPin className="size-4" />{selected.location}</div>
              <div className="flex items-center gap-2 text-foreground/60"><Clock className="size-4" />{selected.lastSeen}</div>
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <Select label="Workspace role" value={selected.role} onChange={(event) => changeRole(event.target.value as User["role"])}>
                <option>Owner</option>
                <option>Admin</option>
                <option>Designer</option>
                <option>Engineer</option>
                <option>Analyst</option>
              </Select>
            </div>
            <h4 className="mt-7 font-semibold">Activity history</h4>
            <div className="mt-3 grid gap-3">
              {selected.activity.map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-foreground/70">{item}</div>)}
            </div>
            <h4 className="mt-7 mb-3 font-semibold">Security timeline</h4>
            <Timeline events={userTimeline} />
          </div>
        ) : null}
      </Drawer>
      <Modal open={inviteOpen} title="Invite teammate" onClose={() => setInviteOpen(false)}>
        <form onSubmit={inviteUser} className="grid gap-4">
          <Input label="Name" value={invite.name} onChange={(event) => setInvite((value) => ({ ...value, name: event.target.value }))} />
          <Input label="Email" value={invite.email} onChange={(event) => setInvite((value) => ({ ...value, email: event.target.value }))} />
          <Select label="Role" value={invite.role} onChange={(event) => setInvite((value) => ({ ...value, role: event.target.value as User["role"] }))}>
            <option>Admin</option>
            <option>Designer</option>
            <option>Engineer</option>
            <option>Analyst</option>
          </Select>
          <Button type="submit">Send invitation</Button>
        </form>
      </Modal>
    </div>
  );
}
