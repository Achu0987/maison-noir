"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageBanner from "@/components/PageBanner";
import Timeline from "@/components/Timeline";
import { Btn, Reveal, Split } from "@/components/ui";
import { inr } from "@/lib/products";

type O = { id: string; createdAt: string; name: string; address: string; items: { name: string; size?: string; qty: number; price: number }[]; total: number; status: string; paid: boolean; payment: string };

export default function Track() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [order, setOrder] = useState<O | null>(null);

  const find = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(""); setOrder(null);
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`);
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) setErr(d.error || "Something went wrong."); else setOrder(d.order);
  };

  return (
    <main>
      <PageBanner title="Track order" crumb="Track order" />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <Split text="Where is my order?" className="display" />
          <Reveal delay={0.1}>
            <form className="form track-form" onSubmit={find}>
              <label className="field">Order number<input value={id} onChange={(e) => setId(e.target.value)} placeholder="MN-123456" required /></label>
              <label className="field">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
              <Btn type="submit" variant="red" disabled={busy}>{busy ? "Looking…" : "Track my order"}</Btn>
            </form>
          </Reveal>
          {err && <p role="alert" className="form-err">{err}</p>}
          <AnimatePresence>
            {order && (
              <motion.div className="track-res" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <div className="track-head"><h2 className="display">{order.id}</h2><span className="tagpill">{order.status}</span></div>
                <Timeline status={order.status} />
                <div className="track-grid">
                  <div className="summary">
                    <h3 className="display">Items</h3>
                    {order.items.map((i, n) => <div className="sub" key={n}><span>{i.name}{i.size ? ` · ${i.size}` : ""} × {i.qty}</span><span className="tnum">{inr(i.price * i.qty)}</span></div>)}
                    <div className="sub display" style={{ fontSize: 30 }}><span>Total</span><span className="tnum">{inr(order.total)}</span></div>
                    <p className="note">{order.paid ? "Paid online." : order.payment === "cod" ? "Pay on delivery." : "Payment pending."}</p>
                  </div>
                  <div className="summary">
                    <h3 className="display">Delivering to</h3>
                    <p>{order.name}<br />{order.address || "Digital delivery by email"}</p>
                    <p className="note">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
