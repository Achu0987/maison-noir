import { NextResponse } from "next/server";
import { clean, isEmail, read, tierFor, uid, write, type Order } from "@/lib/db";

type Row = Record<string, unknown>;

/* One endpoint for the small forms: newsletter, club signup, restock alerts, studio bookings, points lookup. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const type = clean(b.type, 20);
  const email = clean(b.email, 120).toLowerCase();

  if (type === "newsletter" || type === "member") {
    if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    const file = type === "member" ? "members" : "subscribers";
    const rows = await read<Row[]>(file, []);
    if (!rows.some((r) => r.email === email)) rows.push({ id: uid("S"), email, name: clean(b.name, 80), createdAt: new Date().toISOString() });
    await write(file, rows);
    return NextResponse.json({ ok: true });
  }

  if (type === "notify") {
    if (!isEmail(email) || !clean(b.slug, 80) || !clean(b.size, 4)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    const rows = await read<Row[]>("notify", []);
    rows.push({ id: uid("N"), email, slug: clean(b.slug, 80), size: clean(b.size, 4), createdAt: new Date().toISOString() });
    await write("notify", rows);
    return NextResponse.json({ ok: true });
  }

  if (type === "booking") {
    const date = clean(b.date, 12), slot = clean(b.slot, 8), name = clean(b.name, 80), phone = clean(b.phone, 20);
    const today = new Date().toISOString().slice(0, 10);
    if (!name || !isEmail(email) || !phone || !slot || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) return NextResponse.json({ error: "Please fill in every field with a future date." }, { status: 400 });
    const rows = await read<Row[]>("bookings", []);
    if (rows.some((r) => r.date === date && r.slot === slot)) return NextResponse.json({ error: "That slot was just taken. Pick another time." }, { status: 409 });
    const id = uid("V-", 5);
    rows.push({ id, name, email, phone, date, slot, people: Math.max(1, Math.min(6, Number(b.people) || 1)), note: clean(b.note, 400), createdAt: new Date().toISOString() });
    await write("bookings", rows);
    return NextResponse.json({ ok: true, id });
  }

  if (type === "points") {
    if (!isEmail(email)) return NextResponse.json({ error: "Enter the email you ordered with" }, { status: 400 });
    const orders = await read<Order[]>("orders", []);
    const mine = orders.filter((o) => o.email === email);
    const points = mine.reduce((s, o) => s + Math.floor(o.total / 100), 0);
    return NextResponse.json({ points, orders: mine.length, tier: tierFor(points) });
  }

  if (type === "slots") {
    const date = clean(b.date, 12);
    const rows = await read<Row[]>("bookings", []);
    return NextResponse.json({ taken: rows.filter((r) => r.date === date).map((r) => r.slot) });
  }

  return NextResponse.json({ error: "Unknown form" }, { status: 400 });
}
