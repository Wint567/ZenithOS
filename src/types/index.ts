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
