"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Btn, Reveal, Split } from "@/components/ui";
import { postJSON } from "@/lib/client";
import { inr } from "@/lib/products";

const AMOUNTS = [2000, 5000, 10000, 25000];

export default function GiftCards() {
  const router = useRouter();
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const value = custom ? Math.max(0, Math.floor(Number(custom))) : amount;

  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 120, damping: 14 }), sy = useSpring(ry, { stiffness: 120, damping: 14 });
  const rotY = useTransform(sx, (v) => v * 18), rotX = useTransform(sy, (v) => v * -14);
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    rx.set((e.clientX - r.left) / r.width - 0.5);
    ry.set((e.clientY - r.top) / r.height - 0.5);
  };

  const buy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value < 500 || value > 100000) { setErr("Choose an amount between ₹500 and ₹1,00,000."); return; }
    setBusy(true); setErr("");
    const r = await postJSON<{ order: { id: string } }>("/api/orders", {
      kind: "giftcard", name: from, email, phone: "", address: "", payment: "cod",
      items: [{ name: `Gift card for ${to || "you"}`, price: value }],
      note: `To: ${to}\nFrom: ${from}\nMessage: ${msg}`,
    });
    setBusy(false);
    if (!r.ok) { setErr(r.data.error || "Something went wrong."); return; }
    router.push(`/order?id=${r.data.order.id}&e=${encodeURIComponent(email)}`);
  };

  return (
    <main>
      <PageBanner title="Gift cards" crumb="Gift cards" />
      <section className="section">
        <div className="wrap two" style={{ alignItems: "start" }}>
          <div className="gc-stage" ref={ref} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0); }}>
            <motion.div className="gc" style={{ rotateY: rotY, rotateX: rotX }} initial={{ opacity: 0, y: 60, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              <span className="gc-logo">Maison<i>.</i>Noir</span>
              <motion.b key={value} className="gc-amt tnum" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>{value ? inr(value) : "₹0"}</motion.b>
              <div className="gc-foot">
                <span>For <b>{to || "someone special"}</b></span>
                <span>{msg ? `“${msg.slice(0, 70)}${msg.length > 70 ? "…" : ""}”` : "Wear the dark."}</span>
                <span>From <b>{from || "you"}</b></span>
              </div>
              <i className="gc-shine" aria-hidden="true" />
            </motion.div>
          </div>
          <div>
            <Split text="Give the gift of a better fit" className="display" />
            <Reveal delay={0.1}><p className="muted" style={{ margin: "18px 0 26px", fontSize: 19, maxWidth: "44ch" }}>Send a Maison Noir gift card by email. It never expires, and it works on every piece in the shop.</p></Reveal>
            <form className="form" onSubmit={buy}>
              <div className="sizes" role="radiogroup" aria-label="Amount">
                {AMOUNTS.map((a) => <button type="button" key={a} role="radio" aria-checked={!custom && a === amount} className={"size" + (!custom && a === amount ? " on" : "")} onClick={() => { setAmount(a); setCustom(""); }}>{inr(a)}</button>)}
              </div>
              <label className="field">Or a custom amount (₹500 to ₹1,00,000)<input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 7500" /></label>
              <label className="field">Recipient name<input value={to} onChange={(e) => setTo(e.target.value)} maxLength={40} /></label>
              <label className="field">Your name<input value={from} onChange={(e) => setFrom(e.target.value)} required maxLength={40} /></label>
              <label className="field">Your email (we send the card here)<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <label className="field">Message<textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={160} style={{ minHeight: 90 }} /></label>
              {err && <p role="alert" className="form-err">{err}</p>}
              <Btn type="submit" variant="red" disabled={busy}>{busy ? "Creating…" : `Buy gift card · ${inr(value)}`}</Btn>
              <p className="note">Payment is collected by us after you order, until online payment is switched on.</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
