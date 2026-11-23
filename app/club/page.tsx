"use client";
import { useEffect, useState } from "react";
import { animate, motion } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Btn, Reveal, Split } from "@/components/ui";
import { postJSON } from "@/lib/client";

const TIERS = [
  { n: "Member", from: 0, perks: ["1 point for every ₹100", "Early access to new drops", "Birthday surprise"] },
  { n: "Silver", from: 500, perks: ["Everything in Member", "Free alterations on tailoring", "Priority styling help"] },
  { n: "Gold", from: 1500, perks: ["Everything in Silver", "First look at limited runs", "Studio fitting, by appointment"] },
];

function Ring({ points }: { points: number }) {
  const next = points >= 1500 ? 1500 : points >= 500 ? 1500 : 500;
  const base = points >= 500 ? 500 : 0;
  const pct = points >= 1500 ? 1 : (points - base) / (next - base);
  const [v, setV] = useState(0);
  useEffect(() => { const c = animate(0, points, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [points]);
  const C = 2 * Math.PI * 70;
  return (
    <div className="ring">
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="70" fill="none" stroke="#e6e6e8" strokeWidth="12" />
        <motion.circle cx="80" cy="80" r="70" fill="none" stroke="#d3121e" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pct) }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 80 80)" />
      </svg>
      <div><b className="tnum">{v}</b><span>points</span></div>
    </div>
  );
}

export default function Club() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [err, setErr] = useState("");
  const [lookup, setLookup] = useState("");
  const [res, setRes] = useState<{ points: number; orders: number; tier: string } | null>(null);
  const [lerr, setLerr] = useState("");

  const join = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await postJSON("/api/forms", { type: "member", name, email });
    if (r.ok) setJoined(true); else setErr(r.data.error || "Something went wrong.");
  };
  const check = async (e: React.FormEvent) => {
    e.preventDefault(); setLerr(""); setRes(null);
    const r = await postJSON<{ points: number; orders: number; tier: string }>("/api/forms", { type: "points", email: lookup });
    if (r.ok) setRes(r.data); else setLerr(r.data.error || "Something went wrong.");
  };

  return (
    <main>
      <PageBanner title="Noir Club" crumb="Noir Club" />
      <section className="section">
        <div className="wrap">
          <div className="sec-head"><Reveal><span className="tagpill">Rewards</span></Reveal><Split text="Earn points on every order" className="display" /></div>
          <div className="tiers">
            {TIERS.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.1}>
                <div className={"tier t" + i}>
                  <h3 className="display">{t.n}</h3>
                  <p className="tier-from">{t.from === 0 ? "Join free" : `${t.from} points`}</p>
                  <ul>{t.perks.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="wrap two" style={{ alignItems: "start" }}>
          <div>
            <Split text="Join the club" className="display" />
            {joined ? <p style={{ marginTop: 24, fontSize: 21 }}>Welcome in. Your points start with your next order.</p> : (
              <form className="form" style={{ marginTop: 24 }} onSubmit={join}>
                <label className="field">Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
                <label className="field">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                {err && <p role="alert" className="form-err">{err}</p>}
                <Btn type="submit" variant="red">Join free</Btn>
              </form>
            )}
          </div>
          <div>
            <Split text="Check your points" className="display" />
            <form className="form" style={{ marginTop: 24 }} onSubmit={check}>
              <label className="field">Email you ordered with<input type="email" value={lookup} onChange={(e) => setLookup(e.target.value)} required /></label>
              {lerr && <p role="alert" className="form-err">{lerr}</p>}
              <Btn type="submit">Show my points</Btn>
            </form>
            {res && (
              <motion.div className="pts" key={res.points} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <Ring points={res.points} />
                <div><p className="display" style={{ fontSize: 42 }}>{res.tier}</p><p className="muted">{res.orders} order{res.orders === 1 ? "" : "s"} so far. {res.points >= 1500 ? "You are at the top tier." : `${(res.points >= 500 ? 1500 : 500) - res.points} points to the next tier.`}</p></div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
