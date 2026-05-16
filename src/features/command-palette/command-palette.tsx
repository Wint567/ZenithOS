"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, Command, LayoutDashboard, Search, Settings, ShoppingCart, Users, X } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Button } from "@/shared/ui/button";

const commands = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Users", href: "/users", icon: Users },
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const open = useAppStore((state) => state.commandOpen);
  const setOpen = useAppStore((state) => state.setCommandOpen);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70] bg-black/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="glass mx-auto mt-[10vh] w-full max-w-2xl rounded-xl p-3"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2">
              <Search className="size-5 text-foreground/45" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, reports, customers..."
                className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
              />
              <Button size="icon" variant="ghost" className="size-8" onClick={() => setOpen(false)} aria-label="Close command palette">
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid gap-1 p-2">
              {filtered.map((command) => {
                const Icon = command.icon;
                return (
                  <Link
                    key={command.href}
                    href={command.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-white/[0.07]"
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-white/10">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-medium">{command.label}</span>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-foreground/45">
                      <Command className="size-3" /> K
                    </span>
                  </Link>
                );
              })}
              {!filtered.length ? <div className="px-3 py-8 text-center text-sm text-foreground/45">No matching command found.</div> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
