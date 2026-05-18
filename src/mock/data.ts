import type { ActivityEvent, Integration, Invoice, MetricPoint, Notification, Order, PaymentMethod, Product, User } from "@/types";

export const metrics: MetricPoint[] = [
  { name: "Jan", revenue: 42000, customers: 2100, conversion: 4.1, orders: 840 },
  { name: "Feb", revenue: 47000, customers: 2460, conversion: 4.5, orders: 910 },
  { name: "Mar", revenue: 52000, customers: 2880, conversion: 4.8, orders: 1040 },
  { name: "Apr", revenue: 61000, customers: 3210, conversion: 5.2, orders: 1180 },
  { name: "May", revenue: 76000, customers: 3820, conversion: 5.9, orders: 1410 },
  { name: "Jun", revenue: 84000, customers: 4490, conversion: 6.4, orders: 1580 },
  { name: "Jul", revenue: 93000, customers: 5010, conversion: 6.8, orders: 1760 },
  { name: "Aug", revenue: 110000, customers: 5740, conversion: 7.1, orders: 1990 },
  { name: "Sep", revenue: 125000, customers: 6480, conversion: 7.6, orders: 2250 },
  { name: "Oct", revenue: 138000, customers: 7190, conversion: 8.2, orders: 2490 },
  { name: "Nov", revenue: 151000, customers: 7920, conversion: 8.5, orders: 2680 },
  { name: "Dec", revenue: 168000, customers: 8610, conversion: 8.9, orders: 2940 },
];

export const orders: Order[] = Array.from({ length: 36 }, (_, index) => {
  const statuses: Order["status"][] = ["paid", "pending", "failed", "refunded"];
  const channels: Order["channel"][] = ["Website", "Marketplace", "Partner", "API"];
  const products = ["Zenith Core", "Pulse AI", "Orbit Teams", "Nova Insights", "Atlas Billing"];
  const names = ["Mara Chen", "Theo Brooks", "Ava Patel", "Nico Reyes", "Iris Stone", "Daria Volkov", "Samira Okafor", "Luca Moretti", "Kei Tanaka"];
  const name = names[index % names.length];
  return {
    id: `ZN-${8490 + index}`,
    customer: name,
    email: `${name.toLowerCase().replace(" ", ".")}@northstarhq.com`,
    product: products[index % products.length],
    status: statuses[index % statuses.length],
    total: 240 + index * 57,
    date: `2026-05-${String((index % 27) + 1).padStart(2, "0")}`,
    channel: channels[index % channels.length],
  };
});

export const users: User[] = [
  {
    id: "usr_01",
    name: "Mara Chen",
    email: "mara@zenithos.io",
    role: "Owner",
    status: "active",
    avatar: "MC",
    location: "San Francisco",
    lastSeen: "2 min ago",
    activity: ["Approved enterprise invoice", "Invited 3 teammates", "Updated workspace limits"],
  },
  {
    id: "usr_02",
    name: "Theo Brooks",
    email: "theo@zenithos.io",
    role: "Engineer",
    status: "active",
    avatar: "TB",
    location: "London",
    lastSeen: "14 min ago",
    activity: ["Resolved API latency alert", "Published changelog", "Reviewed audit logs"],
  },
  {
    id: "usr_03",
    name: "Ava Patel",
    email: "ava@zenithos.io",
    role: "Designer",
    status: "pending",
    avatar: "AP",
    location: "Toronto",
    lastSeen: "1 hour ago",
    activity: ["Created onboarding flow", "Commented on dashboard polish", "Uploaded brand assets"],
  },
  {
    id: "usr_04",
    name: "Nico Reyes",
    email: "nico@zenithos.io",
    role: "Analyst",
    status: "inactive",
    avatar: "NR",
    location: "Berlin",
    lastSeen: "Yesterday",
    activity: ["Exported revenue report", "Saved cohort segment", "Shared forecast snapshot"],
  },
  {
    id: "usr_05",
    name: "Iris Stone",
    email: "iris@zenithos.io",
    role: "Admin",
    status: "blocked",
    avatar: "IS",
    location: "New York",
    lastSeen: "3 days ago",
    activity: ["Failed SSO challenge", "Requested security review", "Changed notification rules"],
  },
];

export const products: Product[] = [
  {
    id: "prd_01",
    name: "Zenith Core",
    category: "Platform",
    price: 149,
    stock: 128,
    sold: 4200,
    rating: 4.9,
    image: "linear-gradient(135deg, #7c5cff, #10d7c4)",
    status: "In stock",
  },
  {
    id: "prd_02",
    name: "Pulse AI",
    category: "Automation",
    price: 249,
    stock: 42,
    sold: 3100,
    rating: 4.8,
    image: "linear-gradient(135deg, #111827, #7c5cff)",
    status: "Low stock",
  },
  {
    id: "prd_03",
    name: "Orbit Teams",
    category: "Collaboration",
    price: 99,
    stock: 210,
    sold: 7600,
    rating: 4.7,
    image: "linear-gradient(135deg, #10d7c4, #2563eb)",
    status: "In stock",
  },
  {
    id: "prd_04",
    name: "Nova Insights",
    category: "Analytics",
    price: 399,
    stock: 0,
    sold: 1900,
    rating: 4.9,
    image: "linear-gradient(135deg, #f43f5e, #7c5cff)",
    status: "Backorder",
  },
  {
    id: "prd_05",
    name: "Atlas Billing",
    category: "Finance",
    price: 179,
    stock: 86,
    sold: 2800,
    rating: 4.6,
    image: "linear-gradient(135deg, #f59e0b, #10d7c4)",
    status: "In stock",
  },
  {
    id: "prd_06",
    name: "Signal SSO",
    category: "Security",
    price: 299,
    stock: 23,
    sold: 2300,
    rating: 4.8,
    image: "linear-gradient(135deg, #0f172a, #22c55e)",
    status: "Low stock",
  },
];

export const notifications: Notification[] = [
  {
    id: "not_01",
    title: "Revenue milestone",
    message: "MRR crossed $168K with 12.4% month-over-month growth.",
    time: "Now",
    category: "growth",
    timestamp: 1778985600000,
    unread: true,
    tone: "success",
  },
  {
    id: "not_02",
    title: "Inventory watch",
    message: "Pulse AI has 42 seats left before the next procurement sync.",
    time: "7 min",
    category: "commerce",
    timestamp: 1778985180000,
    unread: true,
    tone: "warning",
  },
  {
    id: "not_03",
    title: "Security review",
    message: "One admin account requires SSO verification.",
    time: "21 min",
    category: "security",
    timestamp: 1778984340000,
    unread: false,
    tone: "danger",
  },
];

export const orderTimeline: ActivityEvent[] = [
  { id: "evt_o1", title: "Payment completed", description: "Stripe confirmed settlement and tax calculation.", time: "2 min ago", tone: "success" },
  { id: "evt_o2", title: "Order routed", description: "Assigned to enterprise fulfillment queue.", time: "9 min ago", tone: "brand" },
  { id: "evt_o3", title: "Invoice generated", description: "Invoice and receipt sent to finance contact.", time: "14 min ago", tone: "brand" },
  { id: "evt_o4", title: "Risk check passed", description: "No fraud signals detected for this transaction.", time: "18 min ago", tone: "success" },
];

export const userTimeline: ActivityEvent[] = [
  { id: "evt_u1", title: "Login detected", description: "Successful SSO login from a trusted device.", time: "4 min ago", tone: "success" },
  { id: "evt_u2", title: "Role reviewed", description: "Access permissions were checked by workspace policy.", time: "36 min ago", tone: "brand" },
  { id: "evt_u3", title: "Password changed", description: "User completed a scheduled security rotation.", time: "2 days ago", tone: "warning" },
  { id: "evt_u4", title: "Account created", description: "User joined through an admin invitation.", time: "12 days ago", tone: "brand" },
];

export const invoices: Invoice[] = [
  { id: "INV-2026-0517", date: "2026-05-17", amount: 12840, status: "paid" },
  { id: "INV-2026-0417", date: "2026-04-17", amount: 11980, status: "paid" },
  { id: "INV-2026-0317", date: "2026-03-17", amount: 10820, status: "paid" },
  { id: "INV-2026-0217", date: "2026-02-17", amount: 9820, status: "open" },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm_01", brand: "Visa", last4: "4242", expires: "08/29" },
  { id: "pm_02", brand: "Amex", last4: "1005", expires: "11/28" },
];

export const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Route billing alerts, high-value orders, and workspace approvals into a channel.",
    connected: true,
    status: "connected",
    lastSync: "May 18, 09:24 AM",
    permissions: ["Post channel alerts", "Read workspace channels", "Create incident threads"],
    logs: [
      { id: "int_slack_01", timestamp: "May 18, 09:24 AM", message: "Posted revenue milestone to #growth-ops.", severity: "success" },
      { id: "int_slack_02", timestamp: "May 17, 04:18 PM", message: "Synced channel directory.", severity: "info" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    category: "Developer",
    description: "Connect release events, deployment notes, and incident reviews to product activity.",
    connected: false,
    status: "available",
    lastSync: "Not connected",
    permissions: ["Read repositories", "Read deployment status", "Create release notes"],
    logs: [],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Finance",
    description: "Mirror invoice status, subscription movement, and payment exceptions into ZenithOS.",
    connected: true,
    status: "connected",
    lastSync: "May 18, 08:58 AM",
    permissions: ["Read invoices", "Read subscriptions", "Export payment events"],
    logs: [
      { id: "int_stripe_01", timestamp: "May 18, 08:58 AM", message: "Imported 4 invoice records and 12 payment events.", severity: "success" },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    category: "Communication",
    description: "Broadcast lifecycle events to customer community and internal operator channels.",
    connected: false,
    status: "available",
    lastSync: "Not connected",
    permissions: ["Read servers", "Post channel messages", "Create webhook alerts"],
    logs: [],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Knowledge",
    description: "Publish weekly analytics snapshots and onboarding summaries to shared team docs.",
    connected: false,
    status: "available",
    lastSync: "Not connected",
    permissions: ["Read selected pages", "Create database items", "Update analytics pages"],
    logs: [],
  },
  {
    id: "linear",
    name: "Linear",
    category: "Developer",
    description: "Turn operational anomalies into triaged issues with linked customer and invoice context.",
    connected: true,
    status: "connected",
    lastSync: "May 17, 06:40 PM",
    permissions: ["Read teams", "Create issues", "Link issue metadata"],
    logs: [
      { id: "int_linear_01", timestamp: "May 17, 06:40 PM", message: "Created issue OPS-218 for failed SSO review.", severity: "warning" },
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    description: "Trigger lightweight workflows when orders close, users are invited, or invoices change.",
    connected: false,
    status: "available",
    lastSync: "Not connected",
    permissions: ["Read trigger events", "Execute selected automations", "Write sync logs"],
    logs: [],
  },
];

export const activity = [
  "Enterprise workspace upgraded to Scale plan",
  "A new cohort report finished processing",
  "3 invoices were paid through Stripe Connect",
  "Nova Insights waitlist increased by 18%",
  "Support satisfaction reached 97.2%",
];
