"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, Command, CreditCard, LayoutDashboard, Moon, Search, Settings, ShoppingCart, Sun, Users, X, Zap } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";
import { Button } from "@/shared/ui/button";
import { downloadCsv } from "@/lib/export";

type CommandItem = {
  id: string;
  label: string;
  description: string;
  group: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
};

function highlight(text: string, query: string) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-[var(--accent)]/20 px-0.5 text-[var(--accent)]">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const open = useAppStore((state) => state.commandOpen);
  const setOpen = useAppStore((state) => state.setCommandOpen);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const pushToast = useAppStore((state) => state.pushToast);
  const orders = useWorkspaceStore((state) => state.orders);
  const users = useWorkspaceStore((state) => state.users);
  const simulateOperationalEvent = useWorkspaceStore((state) => state.simulateOperationalEvent);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const commands = useMemo<CommandItem[]>(() => {
    const navigate = (href: string) => {
      router.push(href);
      setOpen(false);
    };
    return [
      { id: "dashboard", label: "Go to Dashboard", description: "Executive command center", group: "Navigation", icon: LayoutDashboard, shortcut: "G D", action: () => navigate("/dashboard") },
      { id: "orders", label: "Go to Orders", description: "Commerce operations and order details", group: "Navigation", icon: ShoppingCart, shortcut: "G O", action: () => navigate("/orders") },
      { id: "users", label: "Go to Users", description: "Team access, roles, and activity", group: "Navigation", icon: Users, shortcut: "G U", action: () => navigate("/users") },
      { id: "products", label: "Go to Products", description: "Catalog and inventory tracking", group: "Navigation", icon: Boxes, shortcut: "G P", action: () => navigate("/products") },
      { id: "analytics", label: "Go to Analytics", description: "Revenue and customer intelligence", group: "Navigation", icon: BarChart3, shortcut: "G A", action: () => navigate("/analytics") },
      { id: "billing", label: "Go to Billing", description: "Plan, invoices, and payment methods", group: "Navigation", icon: CreditCard, shortcut: "G B", action: () => navigate("/billing") },
      { id: "settings", label: "Go to Settings", description: "Workspace configuration", group: "Navigation", icon: Settings, shortcut: "G S", action: () => navigate("/settings") },
      { id: "theme", label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`, description: "Toggle global appearance", group: "Quick actions", icon: theme === "dark" ? Sun : Moon, action: toggleTheme },
      { id: "realtime", label: "Simulate Realtime Event", description: "Create a paid order, notification, audit entry, and AI insight", group: "Quick actions", icon: Zap, action: () => { const notification = simulateOperationalEvent(); pushToast({ title: notification.title, message: notification.message, tone: notification.tone }); } },
      { id: "export-orders", label: "Export Orders", description: "Download the current order book as CSV", group: "Quick actions", icon: CreditCard, action: () => { downloadCsv("zenithos-orders.csv", orders.map(({ id, customer, product, status, total, date }) => ({ id, customer, product, status, total, date }))); pushToast({ title: "Orders exported", message: "CSV generated from persisted workspace state.", tone: "brand" }); } },
      ...orders.slice(0, 8).map((order) => ({
        id: order.id,
        label: order.id,
        description: `${order.customer} · ${order.product} · ${order.status}`,
        group: "Orders",
        icon: ShoppingCart,
        action: () => navigate("/orders"),
      })),
      ...users.map((user) => ({
        id: user.id,
        label: user.name,
        description: `${user.role} · ${user.email} · ${user.status}`,
        group: "Users",
        icon: Users,
        action: () => navigate("/users"),
      })),
    ];
  }, [orders, pushToast, router, setOpen, simulateOperationalEvent, theme, toggleTheme, users]);

  const filtered = useMemo(
    () =>
      commands.filter((command) =>
        `${command.label} ${command.description} ${command.group}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [commands, query],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected((value) => Math.min(value + 1, filtered.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        filtered[selected]?.action();
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, open, selected, setOpen]);

  useEffect(() => setSelected(0), [query, open]);

  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    acc[item.group] = [...(acc[item.group] ?? []), item];
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70] bg-[var(--overlay)] p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="glass mx-auto mt-[8vh] w-full max-w-3xl overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="size-5 text-foreground/45" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, orders, users, actions..."
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
              />
              <Button size="icon" variant="ghost" className="size-8" onClick={() => setOpen(false)} aria-label="Close command palette">
                <X className="size-4" />
              </Button>
            </div>
            <div className="max-h-[62vh] overflow-y-auto p-2">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="py-2">
                  <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[.14em] text-foreground/35">{group}</p>
                  <div className="grid gap-1">
                    {items.map((command) => {
                      const absoluteIndex = filtered.findIndex((item) => item.id === command.id);
                      const Icon = command.icon;
                      return (
                        <button
                          type="button"
                          key={`${command.group}-${command.id}`}
                          onClick={command.action}
                          onMouseEnter={() => setSelected(absoluteIndex)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${selected === absoluteIndex ? "bg-white/[0.09]" : "hover:bg-white/[0.06]"}`}
                        >
                          <span className="grid size-9 place-items-center rounded-lg bg-white/10"><Icon className="size-4" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{highlight(command.label, query)}</span>
                            <span className="block truncate text-xs text-foreground/45">{highlight(command.description, query)}</span>
                          </span>
                          {command.shortcut ? <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-foreground/40">{command.shortcut}</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!filtered.length ? <div className="px-3 py-12 text-center text-sm text-foreground/45">No matching command found.</div> : null}
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-3 text-xs text-foreground/40">
              <span className="inline-flex items-center gap-1"><Command className="size-3" />K open</span>
              <span>↑↓ navigate</span>
              <span>Enter run</span>
              <span>Esc close</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
