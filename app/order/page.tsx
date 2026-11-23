"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import PageBanner from "@/components/PageBanner";
import Timeline from "@/components/Timeline";
import { Btn } from "@/components/ui";
import { payOrder } from "@/lib/client";
import { inr } from "@/lib/products";

type O = { id: string; name: string; email: string; address: string; kind: string; items: { name: string; size?: string; qty: number; price: number }[]; subtotal: number; shipping: number; total: number; status: string; paid: boolean; payment: string };

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 46 }, (_, i) => ({ x: ((Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1) - 0.5) * 760, r: i * 47 % 360, d: 0.6 + (i % 7) * 0.12, c: ["#d3121e", "#0e0e0f", "#ff4d57", "#8a8a90", "#fff"][i % 5], w: 6 + (i % 4) * 3 })), []);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <motion.i key={i} style={{ background: b.c, width: b.w, height: b.w * 1.8 }} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: b.x, y: [0, -220 - (i % 5) * 40, 360], opacity: [1, 1, 0], rotate: b.r * 3 }} transition={{ duration: 2.6 + b.d, ease: "easeOut", delay: 0.2 }} />
      ))}
    </div>
  );
}

function Inner() {
  const q = useSearchParams();
  const id = q.get("id") ?? "", email = q.get("e") ?? "";
  const [o, setO] = useState<O | null>(null);
  const [points, setPoints] = useState(0);
  const [rz, setRz] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => fetch(`/api/orders?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`).then((r) => r.json()).then((d) => { if (d.order) { setO(d.order); setPoints(d.points); setRz(d.razorpay); } else setMsg(d.error || "Order not found"); }).catch(() => setMsg("Order lookup needs the live server. This static preview cannot show orders."));
  useEffect(() => { if (id && email) load(); /* eslint-disable-next-line */ }, [id, email]);

  const pay = async () => {
    if (!o) return;
    setMsg("Opening secure payment…");
    const r = await payOrder(o.id, o.email, o.name);
    setMsg(r === "paid" ? "Payment received. Thank you." : r === "cancelled" ? "Payment window closed. You can pay any time from this page." : r);
    if (r === "paid") load();
  };

  if (!o) return <div className="wrap" style={{ padding: "120px 0" }}><p>{msg || "Loading your order…"}</p></div>;
  return (
    <div className="wrap order-ok">
      <Confetti />
      <motion.svg viewBox="0 0 120 120" className="check" aria-hidden="true" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#d3121e" strokeWidth="6" initial={{ pathLength: 0 } as never} animate={{ pathLength: 1 } as never} transition={{ duration: 1, ease: "easeInOut" }} />
        <motion.path d="M36 62l16 16 32-34" fill="none" stroke="#0e0e0f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 } as never} animate={{ pathLength: 1 } as never} transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }} />
      </motion.svg>
      <h2 className="display">{o.kind === "giftcard" ? "Your gift card is on its way" : "Thank you, " + o.name.split(" ")[0]}</h2>
      <p className="muted" style={{ fontSize: 20 }}>Order <b>{o.id}</b>. We sent the details to {o.email}.</p>
      <Timeline status={o.status} />
      <div className="track-grid">
        <div className="summary">
          <h3 className="display">Summary</h3>
          {o.items.map((i, n) => <div className="sub" key={n}><span>{i.name}{i.size ? ` · ${i.size}` : ""} × {i.qty}</span><span className="tnum">{inr(i.price * i.qty)}</span></div>)}
          <div className="sub"><span>Delivery</span><span className="tnum">{o.shipping ? inr(o.shipping) : "Free"}</span></div>
          <div className="sub display" style={{ fontSize: 32 }}><span>Total</span><span className="tnum">{inr(o.total)}</span></div>
        </div>
        <div className="summary">
          <h3 className="display">What next</h3>
          <p>{o.paid ? "Paid online. We will pack it within two working days." : o.payment === "razorpay" ? "Payment is still pending." : "Pay on delivery. We will pack it within two working days."}</p>
          {!o.paid && o.payment === "razorpay" && (rz ? <Btn variant="red" onClick={pay}>Pay now</Btn> : <p className="note">Online payment is not switched on yet. We will contact you to complete payment.</p>)}
          <p className="small">You earn <b>{Math.floor(o.total / 100)}</b> Noir Club points on this order. Total so far: <b>{points}</b>.</p>
          {msg && <p role="status" className="note">{msg}</p>}
          <div className="row-tools"><Btn href="/shop" variant="ghost">Keep shopping</Btn><Link className="u small" href="/track-order">Track this order later</Link></div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <main>
      <PageBanner title="Order placed" crumb="Order" />
      <Suspense fallback={null}><Inner /></Suspense>
    </main>
  );
}
