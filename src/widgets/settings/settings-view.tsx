"use client";

import { useState } from "react";
import { Bell, Github, Lock, Mail, Moon, Shield, Slack, Sun, UserRound } from "lucide-react";
import { updateSettings } from "@/mock/api";
import { useAppStore } from "@/store/use-app-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Tabs } from "@/shared/ui/tabs";

export function SettingsView() {
  const [tab, setTab] = useState("Profile");
  const [loading, setLoading] = useState(false);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const pushToast = useAppStore((state) => state.pushToast);

  async function save() {
    setLoading(true);
    await updateSettings();
    setLoading(false);
    pushToast({ title: "Settings saved", message: "Your workspace preferences were updated.", tone: "success" });
  }

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section>
        <Badge tone="brand">Workspace controls</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-foreground/55">Reusable form patterns for profile, appearance, notifications, security, and integrations.</p>
      </section>
      <Tabs tabs={["Profile", "Appearance", "Notifications", "Security", "Connected"]} active={tab} onChange={setTab} />
      {tab === "Profile" ? (
        <Card className="max-w-3xl">
          <h2 className="font-semibold">Profile settings</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Input label="Full name" defaultValue="Dara Founder" icon={<UserRound className="size-4" />} />
            <Input label="Email" defaultValue="founder@zenithos.io" icon={<Mail className="size-4" />} />
            <Select label="Role" defaultValue="Admin"><option>Admin</option><option>Owner</option><option>Analyst</option></Select>
            <Input label="Workspace" defaultValue="Zenith Labs" />
          </div>
          <Button className="mt-6" loading={loading} onClick={save}>Save changes</Button>
        </Card>
      ) : null}
      {tab === "Appearance" ? (
        <Card className="max-w-3xl">
          <h2 className="font-semibold">Appearance</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setTheme("dark")} className={`rounded-xl border p-4 text-left transition ${theme === "dark" ? "border-white/30 bg-white/10" : "border-white/10 bg-white/[0.04]"}`}><Moon className="mb-4 size-5" /><p className="font-medium">Dark mode</p><p className="mt-1 text-sm text-foreground/45">High contrast executive cockpit.</p></button>
            <button type="button" onClick={() => setTheme("light")} className={`rounded-xl border p-4 text-left transition ${theme === "light" ? "border-white/30 bg-white/10" : "border-white/10 bg-white/[0.04]"}`}><Sun className="mb-4 size-5" /><p className="font-medium">Light mode</p><p className="mt-1 text-sm text-foreground/45">Clean boardroom reporting mode.</p></button>
          </div>
        </Card>
      ) : null}
      {tab === "Notifications" ? (
        <Card className="max-w-3xl">
          <h2 className="font-semibold">Notification preferences</h2>
          <div className="mt-5 grid gap-3">
            {["Revenue alerts", "Inventory warnings", "Security events", "Weekly executive digest"].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="flex items-center gap-3"><Bell className="size-4" />{item}</span>
                <input type="checkbox" defaultChecked className="size-4 accent-violet-400" />
              </label>
            ))}
          </div>
        </Card>
      ) : null}
      {tab === "Security" ? (
        <Card className="max-w-3xl">
          <h2 className="font-semibold">Security</h2>
          <div className="mt-5 grid gap-4">
            <Input label="Current password" type="password" icon={<Lock className="size-4" />} />
            <Input label="New password" type="password" icon={<Shield className="size-4" />} />
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">Two-factor authentication is enabled for this workspace.</div>
          </div>
        </Card>
      ) : null}
      {tab === "Connected" ? (
        <Card className="max-w-3xl">
          <h2 className="font-semibold">Connected accounts</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["GitHub", "Repository deploy signals connected", Github],
              ["Slack", "Revenue and security alerts connected", Slack],
              ["Email", "Weekly executive summary connected", Mail],
            ].map(([name, desc, Icon]) => (
              <div key={String(name)} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <Icon className="size-5" />
                <div><p className="font-medium">{String(name)}</p><p className="text-sm text-foreground/45">{String(desc)}</p></div>
                <Badge className="ml-auto" tone="success">Connected</Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
