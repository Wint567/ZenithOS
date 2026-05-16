import { wait } from "@/lib/utils";
import { metrics, notifications, orders, products, users } from "@/mock/data";

export async function fakeLogin(email: string, password: string) {
  await wait(900);
  if (!email.includes("@") || password.length < 6) {
    throw new Error("Use a valid email and a password with at least 6 characters.");
  }
  return { id: "usr_demo", name: "Dara Founder", email };
}

export async function fakeRegister(name: string, email: string, password: string) {
  await wait(1000);
  if (name.length < 2 || !email.includes("@") || password.length < 8) {
    throw new Error("Please complete all fields with valid account details.");
  }
  return { id: "usr_new", name, email };
}

export async function fakeForgotPassword(email: string) {
  await wait(850);
  if (!email.includes("@")) throw new Error("Enter the email connected to your workspace.");
  return true;
}

export async function fakeResetPassword(password: string) {
  await wait(850);
  if (password.length < 8) throw new Error("Choose a stronger password before continuing.");
  return true;
}

export async function fetchDashboard() {
  await wait(700);
  return { metrics, notifications, orders: orders.slice(0, 8), users: users.slice(0, 4) };
}

export async function fetchOrders() {
  await wait(680);
  return orders;
}

export async function fetchUsers() {
  await wait(620);
  return users;
}

export async function fetchProducts() {
  await wait(620);
  return products;
}

export async function updateSettings() {
  await wait(900);
  return { ok: true };
}
