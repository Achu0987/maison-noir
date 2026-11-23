import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminPassword, adminToken, read, write, type Order, type Status } from "@/lib/db";

const STATUSES: Status[] = ["Placed", "Packed", "Shipped", "Delivered"];
const authed = async () => (await cookies()).get("mn_admin")?.value === adminToken();

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.password !== adminPassword()) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mn_admin", adminToken(), { httpOnly: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
  return res;
}

export async function GET() {
  if (!(await authed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [orders, bookings, notify, reviews, members, subscribers] = await Promise.all([
    read<Order[]>("orders", []), read<unknown[]>("bookings", []), read<unknown[]>("notify", []),
    read<unknown[]>("reviews", []), read<unknown[]>("members", []), read<unknown[]>("subscribers", []),
  ]);
  return NextResponse.json({ orders: orders.slice().reverse(), bookings, notify, reviews, members, subscribers, defaultPassword: !process.env.ADMIN_PASSWORD });
}

export async function PATCH(req: Request) {
  if (!(await authed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (b.type === "order") {
    const orders = await read<Order[]>("orders", []);
    const o = orders.find((x) => x.id === b.id);
    if (!o || !STATUSES.includes(b.status)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    o.status = b.status;
    if (typeof b.paid === "boolean") o.paid = b.paid;
    await write("orders", orders);
    return NextResponse.json({ ok: true });
  }
  if (b.type === "review") {
    const rows = await read<{ id: string; status: string }[]>("reviews", []);
    const r = rows.find((x) => x.id === b.id);
    if (!r || !["approved", "rejected", "pending"].includes(b.status)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    r.status = b.status;
    await write("reviews", rows);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("mn_admin");
  return res;
}
