import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { bySlug, FREE_SHIP } from "./products";

/* Tiny JSON-file store. Good for local use and demos. Swap for a real database (Postgres, Supabase, Shopify) before launch. */
const dir = path.join(process.cwd(), "data");

export async function read<T>(name: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(path.join(dir, name + ".json"), "utf8")) as T; } catch { return fallback; }
}
export async function write<T>(name: string, data: T) {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name + ".json"), JSON.stringify(data, null, 2), "utf8");
}
export const uid = (prefix: string, n = 6) => prefix + Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
export const clean = (v: unknown, max = 400) => String(v ?? "").trim().slice(0, max);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export type Status = "Placed" | "Packed" | "Shipped" | "Delivered";
export type OrderItem = { name: string; size?: string; qty: number; price: number; slug?: string };
export type Order = {
  id: string; createdAt: string; kind: "order" | "giftcard";
  name: string; email: string; phone: string; address: string; note?: string;
  items: OrderItem[]; subtotal: number; shipping: number; total: number;
  status: Status; payment: "cod" | "razorpay"; paid: boolean; rzpOrderId?: string;
};

export function priceItems(raw: unknown, kind: "order" | "giftcard") {
  const list = Array.isArray(raw) ? raw : [];
  const items: OrderItem[] = [];
  for (const r of list.slice(0, 40)) {
    const it = r as { slug?: string; size?: string; qty?: number; name?: string; price?: number };
    const qty = Math.max(1, Math.min(20, Math.floor(Number(it.qty) || 1)));
    if (kind === "giftcard") {
      const price = Math.floor(Number(it.price) || 0);
      if (price < 500 || price > 100000) continue;
      items.push({ name: clean(it.name, 80) || "Gift card", qty: 1, price });
    } else {
      const p = it.slug ? bySlug(it.slug) : undefined;
      if (!p) continue;
      items.push({ slug: p.slug, name: p.name, size: clean(it.size, 4), qty, price: p.price });
    }
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = kind === "giftcard" || subtotal >= FREE_SHIP || subtotal === 0 ? 0 : 150;
  return { items, subtotal, shipping, total: subtotal + shipping };
}

/* Admin */
export const adminPassword = () => process.env.ADMIN_PASSWORD || "maison-admin";
export const adminToken = () => crypto.createHash("sha256").update(adminPassword() + "|mn-admin").digest("hex");
export function publicOrder(o: Order) {
  const { rzpOrderId, ...rest } = o; void rzpOrderId;
  return rest;
}
export const tierFor = (points: number) => (points >= 1500 ? "Gold" : points >= 500 ? "Silver" : "Member");
