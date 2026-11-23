import { NextResponse } from "next/server";
import crypto from "crypto";
import { clean, read, write, type Order } from "@/lib/db";

/* Razorpay needs RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local. Without them this returns 501 and checkout falls back to cash on delivery. */
export async function POST(req: Request) {
  const key = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) return NextResponse.json({ error: "Online payment is not configured yet." }, { status: 501 });
  const b = await req.json().catch(() => ({}));
  const orders = await read<Order[]>("orders", []);
  const o = orders.find((x) => x.id === clean(b.id, 30) && x.email === clean(b.email, 120).toLowerCase());
  if (!o) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (b.verify) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = b.verify as Record<string, string>;
    const expected = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expected !== razorpay_signature || razorpay_order_id !== o.rzpOrderId) return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 });
    o.paid = true; o.payment = "razorpay";
    await write("orders", orders);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64") },
    body: JSON.stringify({ amount: o.total * 100, currency: "INR", receipt: o.id }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.error?.description || "Payment gateway error" }, { status: 502 });
  o.rzpOrderId = data.id;
  await write("orders", orders);
  return NextResponse.json({ key, rzpOrderId: data.id, amount: o.total * 100 });
}
