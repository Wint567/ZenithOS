"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Boxes,
  ChevronDown,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Menu,
  Moon,
  PanelLeftClose,
  Search,
  Settings,
  ShoppingCart,
  Sun,
  Users,
  Zap,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import { NotificationDropdown } from "@/features/notifications/notification-dropdown";
import { useAppStore } from "@/store/use-app-store";
import { AIAssistant } from "@/features/ai-assistant/ai-assistant";

const navGroups = [
  {
    label: "Command",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
      { label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G A" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Orders", href: "/orders", icon: ShoppingCart, shortcut: "G O" },
      { label: "Users", href: "/users", icon: Users, shortcut: "G U" },
      { label: "Products", href: "/products", icon: Boxes, shortcut: "G P" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard, shortcut: "G B" },
      { label: "Settings", href: "/settings", icon: Settings, shortcut: "G S" },
    ],
  },
];

export function AppShell({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);
  const session = useAppStore((state) => state.session);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(["Command", "Operations", "Workspace"]);
  const nav = useMemo(() => navGroups.flatMap((group) => group.items), []);

  useEffect(() => {
    let pendingG = false;
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (event.target as HTMLElement | null)?.isContentEditable;
      if (event.key === "Escape") {
        setCommandOpen(false);
        setMobileOpen(false);
      }
      if (typing) return;
      if (event.key === "/") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key.toLowerCase() === "g") {
        pendingG = true;
        window.setTimeout(() => {
          pendingG = false;
        }, 900);
        return;
      }
      if (pendingG) {
        const routes: Record<string, string> = { d: "/dashboard", o: "/orders", u: "/users", p: "/products", a: "/analytics", b: "/billing", s: "/settings" };
        const href = routes[event.key.toLowerCase()];
        if (href) {
          event.preventDefault();
          router.push(href);
        }
        pendingG = false;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, setCommandOpen]);

  function toggleGroup(group: string) {
    setOpenGroups((groups) => (groups.includes(group) ? groups.filter((item) => item !== group) : [...groups, group]));
  }

  function NavContent({ mobile = false }: { mobile?: boolean }) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-lg bg-white text-black shadow-xl">
            <Zap className="size-5 fill-black" />
          </div>
          {!collapsed || mobile ? (
            <div>
              <p className="font-semibold">ZenithOS</p>
              <p className="text-xs text-foreground/45">Command center</p>
            </div>
          ) : null}
          {mobile ? (
            <Button className="ml-auto size-8" variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <button
          type="button"
          className={cn(
            "mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-left transition hover:bg-white/[0.09]",
            collapsed && !mobile && "justify-center px-2",
          )}
        >
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--accent)]">
            <Building2 className="size-4 text-white" />
          </span>
          {!collapsed || mobile ? (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">Northstar Labs</span>
                <span className="block text-xs text-foreground/40">Scale workspace</span>
              </span>
              <ChevronDown className="size-4 text-foreground/40" />
            </>
          ) : null}
        </button>

        <nav className="mt-6 grid gap-4">
          {navGroups.map((group) => {
            const groupOpen = openGroups.includes(group.label) || collapsed;
            return (
              <div key={group.label}>
                {!collapsed || mobile ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="mb-1 flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/35"
                  >
                    {group.label}
                    <ChevronRight className={cn("size-3 transition", groupOpen && "rotate-90")} />
                  </button>
                ) : null}
                <AnimatePresence initial={false}>
                  {groupOpen ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid gap-1 overflow-hidden">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        const link = (
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground/58 transition hover:bg-white/[0.07] hover:text-foreground",
                              active && "text-foreground",
                            )}
                          >
                            {active ? <motion.span layoutId={mobile ? "mobile-active" : "desktop-active"} className="absolute inset-0 rounded-lg bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" /> : null}
                            {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]" /> : null}
                            <Icon className="relative size-4 shrink-0 transition group-hover:scale-110" />
                            {!collapsed || mobile ? <span className="relative">{item.label}</span> : null}
                            {!collapsed || mobile ? <span className="relative ml-auto text-[10px] text-foreground/30">{item.shortcut}</span> : null}
                          </Link>
                        );
                        return collapsed && !mobile ? <Tooltip key={item.href} label={item.label}>{link}</Tooltip> : <div key={item.href}>{link}</div>;
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-3">
          <div className={cn("rounded-xl border border-white/10 bg-white/[0.05] p-4", collapsed && !mobile && "hidden")}>
            <p className="text-sm font-medium">Scale plan</p>
            <p className="mt-1 text-xs leading-5 text-foreground/45">86% of monthly automation credits used.</p>
            <div className="mt-4 h-1.5 rounded-full bg-white/10">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" />
            </div>
          </div>
          {!mobile ? (
            <Button variant="ghost" onClick={toggleSidebar} className={cn("justify-start", collapsed && "justify-center")}>
              <PanelLeftClose className={cn("size-4 transition", collapsed && "rotate-180")} />
              {!collapsed ? "Collapse" : null}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <motion.aside
        animate={{ width: collapsed ? 88 : 280 }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--line)] bg-[var(--shell)] p-4 backdrop-blur-2xl lg:block"
      >
        <NavContent />
      </motion.aside>
      <div className={cn("min-h-screen flex-1 transition-[padding] duration-300", collapsed ? "lg:pl-[88px]" : "lg:pl-[280px]")}>
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--shell)] px-4 py-3 backdrop-blur-2xl lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-left text-sm text-foreground/45 transition hover:bg-white/[0.09] md:max-w-md"
            >
              <Search className="size-4" />
              <span className="truncate">Search anything in ZenithOS</span>
              <span className="ml-auto hidden rounded-md border border-white/10 px-2 py-0.5 text-xs md:inline">⌘K</span>
            </button>
            <Button variant="secondary" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <NotificationDropdown />
            <div className="hidden items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-1.5 pr-3 sm:flex">
              <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-xs font-bold text-white">
                {(session?.name ?? "Dara Founder").split(" ").map((part) => part[0]).join("").slice(0, 2)}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium">{session?.name ?? "Dara Founder"}</p>
                <p className="text-xs text-foreground/45">{session?.role ?? "Admin"}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {children}
          </motion.div>
        </main>
        <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 rounded-xl border border-[var(--line)] bg-[var(--shell)] p-1.5 shadow-[var(--shadow-soft)] backdrop-blur-2xl lg:hidden">
          {nav.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("grid place-items-center rounded-lg py-2 text-foreground/60", active && "bg-[var(--surface-2)] text-foreground")}>
                <Icon className="size-4" />
              </Link>
            );
          })}
        </nav>
        <AIAssistant />
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div className="fixed inset-0 z-[65] bg-[var(--overlay)] p-3 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.aside
                className="glass h-full w-[min(22rem,calc(100vw-1.5rem))] rounded-xl p-4"
                initial={{ x: -32, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -32, opacity: 0 }}
              >
                <NavContent mobile />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
