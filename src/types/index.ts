export type Status = "active" | "inactive" | "pending" | "blocked";

export type OrderStatus = "paid" | "pending" | "failed" | "refunded";

export type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  status: OrderStatus;
  total: number;
  date: string;
  channel: "Website" | "Marketplace" | "Partner" | "API";
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Designer" | "Engineer" | "Analyst";
  status: Status;
  avatar: string;
  location: string;
  lastSeen: string;
  activity: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  image: string;
  status: "In stock" | "Low stock" | "Backorder";
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  category?: "commerce" | "security" | "growth" | "system";
  timestamp?: number;
  unread: boolean;
  tone: "brand" | "success" | "warning" | "danger";
};

export type MetricPoint = {
  name: string;
  revenue: number;
  customers: number;
  conversion: number;
  orders: number;
};

export type ActivityEvent = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "brand" | "success" | "warning" | "danger";
};

export type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "open" | "failed";
};

export type PaymentMethod = {
  id: string;
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  expires: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  severity: "info" | "success" | "warning" | "danger";
  entityType?: "order" | "user" | "product" | "invoice" | "workspace" | "integration" | "system";
  entityId?: string;
};

export type DashboardWidget = {
  id: "kpis" | "revenue" | "sales" | "activity" | "onboarding" | "realtime" | "ai";
  label: string;
  visible: boolean;
  size: "sm" | "md" | "lg";
};

export type AIMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type IntegrationId = "slack" | "github" | "stripe" | "discord" | "notion" | "linear" | "zapier";

export type IntegrationLog = {
  id: string;
  timestamp: string;
  message: string;
  severity: "info" | "success" | "warning" | "danger";
};

export type Integration = {
  id: IntegrationId;
  name: string;
  category: "Communication" | "Developer" | "Finance" | "Knowledge" | "Automation";
  description: string;
  connected: boolean;
  status: "available" | "connected" | "syncing" | "error";
  lastSync: string;
  permissions: string[];
  logs: IntegrationLog[];
};

export type TableDensity = "compact" | "comfortable" | "spacious";

export type TablePreferences = {
  visibleColumns: string[];
  sortKey?: string;
  sortDir?: "asc" | "desc";
  density: TableDensity;
  savedFilter?: string;
};
