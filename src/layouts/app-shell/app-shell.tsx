"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  Boxes,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Tooltip } from "@/shared/ui/tooltip";
import { NotificationDropdown } from "@/features/notifications/notification-dropdown";
import { useAppStore } from "@/store/use-app-store";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Users", href: "/users", icon: Users },
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const setCommandOpen = useAppStore((state) => state.setCommandOpen);

  return (
    <div className="min-h-screen lg:flex">
      <motion.aside
        animate={{ width: collapsed ? 88 : 280 }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-black/25 p-4 backdrop-blur-2xl lg:block"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-lg bg-white text-black shadow-xl">
              <Zap className="size-5 fill-black" />
            </div>
            {!collapsed ? <div><p className="font-semibold">ZenithOS</p><p className="text-xs text-foreground/45">Command center</p></div> : null}
          </div>
          <nav className="mt-8 grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              const link = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground/58 transition hover:bg-white/[0.07] hover:text-foreground",
                    active && "bg-white/12 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              );
              return collapsed ? <Tooltip key={item.href} label={item.label}>{link}</Tooltip> : <div key={item.href}>{link}</div>;
            })}
          </nav>
          <div className="mt-auto grid gap-3">
            <div className={cn("rounded-xl border border-white/10 bg-white/[0.05] p-4", collapsed && "hidden")}>
              <p className="text-sm font-medium">Scale plan</p>
              <p className="mt-1 text-xs leading-5 text-foreground/45">86% of monthly automation credits used.</p>
              <div className="mt-4 h-1.5 rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" />
              </div>
            </div>
            <Button variant="ghost" onClick={toggleSidebar} className="justify-start">
              <PanelLeftClose className="size-4" />
              {!collapsed ? "Collapse" : null}
            </Button>
          </div>
        </div>
      </motion.aside>
      <div className={cn("min-h-screen flex-1 transition-[padding] duration-300", collapsed ? "lg:pl-[88px]" : "lg:pl-[280px]")}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,6,10,0.7)] px-4 py-3 backdrop-blur-2xl lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="icon" className="lg:hidden" aria-label="Open navigation">
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
              <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-xs font-bold text-white">DF</div>
              <div className="leading-tight">
                <p className="text-sm font-medium">Dara Founder</p>
                <p className="text-xs text-foreground/45">Admin</p>
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {children}
          </motion.div>
        </main>
        <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 rounded-xl border border-white/10 bg-black/70 p-1.5 backdrop-blur-2xl lg:hidden">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("grid place-items-center rounded-lg py-2 text-foreground/50", active && "bg-white/12 text-white")}>
                <Icon className="size-4" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
