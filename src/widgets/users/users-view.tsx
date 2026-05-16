"use client";

import { useCallback, useState } from "react";
import { Clock, MapPin, Search } from "lucide-react";
import { fetchUsers } from "@/mock/api";
import type { User } from "@/types";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Drawer } from "@/shared/ui/drawer";
import { Input } from "@/shared/ui/input";
import { DataTable, type Column } from "@/shared/ui/table";
import { CardSkeleton } from "@/shared/ui/skeleton";
import { useFakeQuery } from "@/hooks/use-fake-query";

const statusTone: Record<User["status"], "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending: "warning",
  blocked: "danger",
  inactive: "neutral",
};

export function UsersView() {
  const query = useCallback(() => fetchUsers(), []);
  const { data, loading } = useFakeQuery(query);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const users = (data ?? []).filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));
  const columns: Column<User>[] = [
    { key: "name", header: "User", render: (row) => <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-xs font-bold text-white">{row.avatar}</span><div><p className="font-medium text-foreground">{row.name}</p><p className="text-xs text-foreground/40">{row.email}</p></div></div> },
    { key: "role", header: "Role" },
    { key: "status", header: "Status", render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge> },
    { key: "location", header: "Location" },
    { key: "lastSeen", header: "Last seen" },
  ];

  if (loading) return <div className="grid gap-5"><CardSkeleton /><CardSkeleton /></div>;

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Identity</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Users</h1>
        <p className="mt-2 text-sm text-foreground/55">Manage roles, status, access, and workspace activity from one clean view.</p>
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
            <h4 className="mt-7 font-semibold">Activity history</h4>
            <div className="mt-3 grid gap-3">
              {selected.activity.map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-foreground/70">{item}</div>)}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
