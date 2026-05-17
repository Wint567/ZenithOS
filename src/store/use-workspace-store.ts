"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIMessage, AuditEvent, DashboardWidget, Invoice, MetricPoint, Notification, Order, Product, User } from "@/types";
import { invoices, metrics, notifications, orders, products, users } from "@/mock/data";

type Workspace = {
  id: string;
  name: string;
  plan: "Launch" | "Scale" | "Enterprise";
  accent: string;
};

type WorkspaceState = {
  workspace: Workspace;
  orders: Order[];
  users: User[];
  products: Product[];
  invoices: Invoice[];
  metrics: MetricPoint[];
  notifications: Notification[];
  auditLog: AuditEvent[];
  dashboardWidgets: DashboardWidget[];
  aiHistory: AIMessage[];
  addOrder: (order: Order) => void;
  upsertProduct: (product: Product) => void;
  inviteUser: (user: User) => void;
  updateUserRole: (id: string, role: User["role"]) => void;
  setPlan: (plan: Workspace["plan"]) => void;
  markNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  addAuditEvent: (event: Omit<AuditEvent, "id" | "timestamp">) => void;
  toggleWidget: (id: DashboardWidget["id"]) => void;
  moveWidget: (id: DashboardWidget["id"], direction: "up" | "down") => void;
  resetDashboard: () => void;
  addAIMessage: (message: Omit<AIMessage, "id">) => void;
  simulateOperationalEvent: () => Notification;
};

const defaultWidgets: DashboardWidget[] = [
  { id: "kpis", label: "Executive KPIs", visible: true, size: "lg" },
  { id: "revenue", label: "Revenue trajectory", visible: true, size: "lg" },
  { id: "sales", label: "Sales overview", visible: true, size: "md" },
  { id: "activity", label: "Recent activity", visible: true, size: "md" },
  { id: "onboarding", label: "Workspace setup", visible: true, size: "sm" },
  { id: "realtime", label: "Realtime activity", visible: true, size: "sm" },
  { id: "ai", label: "AI recommendations", visible: true, size: "md" },
];

function nowLabel() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspace: { id: "wrk_northstar", name: "Northstar Labs", plan: "Scale", accent: "#10d7c4" },
      orders,
      users,
      products,
      invoices,
      metrics,
      notifications,
      auditLog: [
        { id: "aud_01", actor: "Dara Founder", action: "created workspace", target: "Northstar Labs", timestamp: "May 17, 09:42 AM", severity: "success" },
        { id: "aud_02", actor: "Mara Chen", action: "updated billing plan", target: "Scale", timestamp: "May 17, 10:18 AM", severity: "info" },
      ],
      dashboardWidgets: defaultWidgets,
      aiHistory: [{ id: "ai_01", role: "assistant", text: "I scanned the workspace. Revenue, onboarding, and billing health are stable." }],
      addAuditEvent: (event) =>
        set((state) => ({
          auditLog: [{ ...event, id: crypto.randomUUID(), timestamp: nowLabel() }, ...state.auditLog].slice(0, 40),
        })),
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
          metrics: state.metrics.map((point, index, list) =>
            index === list.length - 1
              ? { ...point, revenue: point.revenue + order.total, orders: point.orders + 1 }
              : point,
          ),
        }));
        get().addAuditEvent({ actor: "Realtime engine", action: "created order", target: order.id, severity: "success" });
      },
      upsertProduct: (product) => {
        set((state) => ({
          products: state.products.some((item) => item.id === product.id)
            ? state.products.map((item) => (item.id === product.id ? product : item))
            : [product, ...state.products],
        }));
        get().addAuditEvent({ actor: "Dara Founder", action: "saved product", target: product.name, severity: "info" });
      },
      inviteUser: (user) => {
        set((state) => ({ users: [user, ...state.users] }));
        get().addAuditEvent({ actor: "Dara Founder", action: "invited teammate", target: user.email, severity: "success" });
      },
      updateUserRole: (id, role) => {
        const user = get().users.find((item) => item.id === id);
        set((state) => ({ users: state.users.map((item) => (item.id === id ? { ...item, role } : item)) }));
        get().addAuditEvent({ actor: "Dara Founder", action: "changed role", target: user?.name ?? id, severity: "warning" });
      },
      setPlan: (plan) => {
        set((state) => ({ workspace: { ...state.workspace, plan } }));
        get().addAuditEvent({ actor: "Dara Founder", action: "requested plan change", target: plan, severity: "info" });
      },
      markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, unread: false })) })),
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 24) })),
      toggleWidget: (id) =>
        set((state) => ({
          dashboardWidgets: state.dashboardWidgets.map((widget) => (widget.id === id ? { ...widget, visible: !widget.visible } : widget)),
        })),
      moveWidget: (id, direction) =>
        set((state) => {
          const widgets = [...state.dashboardWidgets];
          const index = widgets.findIndex((widget) => widget.id === id);
          const target = direction === "up" ? index - 1 : index + 1;
          if (index < 0 || target < 0 || target >= widgets.length) return state;
          [widgets[index], widgets[target]] = [widgets[target], widgets[index]];
          return { dashboardWidgets: widgets };
        }),
      resetDashboard: () => set({ dashboardWidgets: defaultWidgets }),
      addAIMessage: (message) => set((state) => ({ aiHistory: [...state.aiHistory, { ...message, id: crypto.randomUUID() }].slice(-24) })),
      simulateOperationalEvent: () => {
        const order: Order = {
          id: `ZN-${9000 + get().orders.length}`,
          customer: "HelioWorks Finance",
          email: "finance@helioworks.co",
          product: "Pulse AI",
          status: "paid",
          total: 1240,
          date: "2026-05-18",
          channel: "Website",
        };
        get().addOrder(order);
        const notification: Notification = {
          id: crypto.randomUUID(),
          title: "New paid order",
          message: `${order.customer} purchased ${order.product} for $${order.total.toLocaleString()}.`,
          time: "Now",
          category: "commerce",
          timestamp: Date.now(),
          unread: true,
          tone: "success",
        };
        get().addNotification(notification);
        get().addAIMessage({ role: "assistant", text: `Revenue moved after ${order.product} closed. Latest MRR is now tracking above plan.` });
        return notification;
      },
    }),
    {
      name: "zenithos-workspace",
      version: 1,
    },
  ),
);
