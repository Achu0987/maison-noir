"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Btn, Reveal, Split } from "@/components/ui";
import { postJSON } from "@/lib/client";

const SLOTS = ["11:00", "12:30", "14:00", "15:30", "17:00", "18:30"];
const HOURS = [["Monday to Friday", "11:00 to 19:30"], ["Saturday", "10:30 to 20:00"], ["Sunday", "By appointment"]];

export default function Visit() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", people: "1", note: "" });
  const [err, setErr] = useState("");
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    postJSON<{ taken: string[] }>("/api/forms", { type: "slots", date }).then((r) => { if (live && r.ok) { setTaken(r.data.taken); setSlot((s) => (r.data.taken.includes(s) ? "" : s)); } });
    return () => { live = false; };
  }, [date]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!slot) { setErr("Pick a time slot."); return; }
    const r = await postJSON<{ id: string }>("/api/forms", { type: "booking", date, slot, ...f });
    if (r.ok) setDone(r.data.id); else setErr(r.data.error || "Something went wrong.");
  };

  return (
    <main>
      <PageBanner title="Visit the studio" crumb="Visit" />
      <section className="section">
        <div className="wrap two" style={{ alignItems: "start" }}>
          <div>
            <Split text="Come try it on" className="display" />
            <Reveal delay={0.1}>
              <div className="prose" style={{ marginTop: 24 }}>
                <p>Our Chennai studio is where everything is cut, sewn and fitted. Book a slot and we will have your sizes pulled, a rail ready and tea on.</p>
                <div className="hours">{HOURS.map(([d, h]) => <div key={d}><span>{d}</span><b>{h}</b></div>)}</div>
                <p className="note">Studio address and hours are placeholders. Replace them with your own.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="map">
                <iframe title="Studio location" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=80.20%2C13.00%2C80.32%2C13.12&layer=mapnik" />
              </div>
            </Reveal>
          </div>
          <div className="book">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="ok" className="book-ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  <h2 className="display">You are booked</h2>
                  <p>Booking <b>{done}</b> on {new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {slot}. We will confirm by email.</p>
                  <Btn href="/shop" variant="ghost">Browse the shop</Btn>
                </motion.div>
              ) : (
                <motion.form key="f" className="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="display" style={{ fontSize: 44 }}>Book a fitting</h2>
                  <label className="field">Date<input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required /></label>
                  <div role="radiogroup" aria-label="Time slot" className="slots">
                    {SLOTS.map((s) => {
                      const off = taken.includes(s);
                      return <button type="button" key={s} role="radio" aria-checked={s === slot} disabled={off} className={"slot" + (s === slot ? " on" : "")} onClick={() => setSlot(s)}>{s}{off && <small>Taken</small>}</button>;
                    })}
                  </div>
                  <label className="field">Name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>
                  <label className="field">Email<input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></label>
                  <label className="field">Phone<input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} required /></label>
                  <label className="field">People<input type="number" min={1} max={6} value={f.people} onChange={(e) => setF({ ...f, people: e.target.value })} /></label>
                  <label className="field">Anything we should prepare?<textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} style={{ minHeight: 90 }} /></label>
                  {err && <p role="alert" className="form-err">{err}</p>}
                  <Btn type="submit" variant="red">Confirm booking</Btn>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
