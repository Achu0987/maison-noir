import { NextResponse } from "next/server";
import { clean, isEmail, priceItems, publicOrder, read, tierFor, uid, write, type Order } from "@/lib/db";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const kind = b.kind === "giftcard" ? "giftcard" : "order";
  const name = clean(b.name, 80), email = clean(b.email, 120).toLowerCase(), phone = clean(b.phone, 20), address = clean(b.address, 400);
  if (!name || !isEmail(email)) return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });
  if (kind === "order" && (!address || !phone)) return NextResponse.json({ error: "Phone and address are required" }, { status: 400 });
  const { items, subtotal, shipping, total } = priceItems(b.items, kind);
  if (items.length === 0) return NextResponse.json({ error: "No valid items" }, { status: 400 });
  const orders = await read<Order[]>("orders", []);
  let id = uid("MN-");
  while (orders.some((o) => o.id === id)) id = uid("MN-");
  const order: Order = {
    id, createdAt: new Date().toISOString(), kind, name, email, phone, address, note: clean(b.note, 600) || undefined,
    items, subtotal, shipping, total, status: "Placed", payment: b.payment === "razorpay" ? "razorpay" : "cod", paid: false,
  };
  orders.push(order);
  await write("orders", orders);
  return NextResponse.json({ order: publicOrder(order), points: Math.floor(total / 100) });
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = clean(u.searchParams.get("id"), 30).toUpperCase();
  const email = clean(u.searchParams.get("email"), 120).toLowerCase();
  const orders = await read<Order[]>("orders", []);
  const o = orders.find((x) => x.id === id && x.email === email);
  if (!o) return NextResponse.json({ error: "We could not find that order. Check the order number and email." }, { status: 404 });
  const points = orders.filter((x) => x.email === email).reduce((s, x) => s + Math.floor(x.total / 100), 0);
  return NextResponse.json({ order: publicOrder(o), points, tier: tierFor(points), razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) });
}
