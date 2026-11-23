"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Btn, Reveal, Split } from "./ui";
import { postJSON } from "@/lib/client";
import type { Product } from "@/lib/products";

export function NotifyMe({ p }: { p: Product }) {
  const sold = p.soldOut ?? [];
  const [size, setSize] = useState(sold[0] ?? "");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  if (sold.length === 0) return null;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await postJSON("/api/forms", { type: "notify", slug: p.slug, size, email });
    if (r.ok) setDone(true); else setErr(r.data.error || "Something went wrong.");
  };
  return (
    <div className="notify">
      <p className="small"><b>Sold out in {sold.join(", ")}.</b> We will email you when it is back.</p>
      {done ? <p className="small" role="status">Done. We will let you know.</p> : (
        <form onSubmit={submit}>
          <select aria-label="Size" className="select" value={size} onChange={(e) => setSize(e.target.value)}>{sold.map((s) => <option key={s}>{s}</option>)}</select>
          <input type="email" required placeholder="Your email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn" type="submit"><span className="roll"><span>Notify me</span><span aria-hidden="true">Notify me</span></span></button>
        </form>
      )}
      {err && <p role="alert" className="form-err">{err}</p>}
    </div>
  );
}

type Rv = { id: string; name: string; rating: number; text: string; photo?: string; createdAt: string };
const Stars = ({ n }: { n: number }) => <span className="stars" aria-label={`${n} out of 5`}>{"★★★★★".slice(0, n)}<i>{"★★★★★".slice(n)}</i></span>;

export function ReviewsBlock({ slug, name }: { slug: string; name: string }) {
  const [list, setList] = useState<Rv[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [who, setWho] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { fetch(`/api/reviews?slug=${slug}`).then((r) => r.json()).then((d) => setList(d.reviews ?? [])).catch(() => {}); }, [slug]);
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 2_000_000) { setErr("Photo must be under 2 MB"); return; }
    const rd = new FileReader();
    rd.onload = () => setPhoto(String(rd.result));
    rd.readAsDataURL(f);
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await postJSON<{ message: string }>("/api/reviews", { slug, name: who, rating, text, photo });
    if (r.ok) { setMsg(r.data.message); setOpen(false); setWho(""); setText(""); setPhoto(""); } else setErr(r.data.error || "Something went wrong.");
  };

  return (
    <section className="section" aria-label="Reviews" style={{ paddingTop: 0 }}>
      <div className="wrap" style={{ maxWidth: 1100 }}>
        <div className="rv-head">
          <Split text="Reviews" className="display" />
          <div className="rv-sum">{list.length ? <><Stars n={Math.round(avg)} /> <b className="tnum">{avg.toFixed(1)}</b> from {list.length}</> : <span className="muted">No reviews yet</span>}</div>
          <Btn variant="ghost" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Write a review"}</Btn>
        </div>
        {msg && <p role="status" className="form-ok">{msg}</p>}
        {open && (
          <motion.form className="form rv-form" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="small">Reviewing <b>{name}</b></p>
            <div className="rate" role="radiogroup" aria-label="Rating">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} role="radio" aria-checked={n === rating} aria-label={`${n} stars`} className={n <= rating ? "on" : ""} onClick={() => setRating(n)}>★</button>)}</div>
            <label className="field">Your name<input value={who} onChange={(e) => setWho(e.target.value)} required maxLength={60} /></label>
            <label className="field">Your review<textarea value={text} onChange={(e) => setText(e.target.value)} required minLength={10} maxLength={1200} /></label>
            <label className="field">Add a photo (optional, under 2 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e.target.files?.[0])} /></label>
            {photo && <img className="rv-prev" src={photo} alt="Your photo preview" />}
            {err && <p role="alert" className="form-err">{err}</p>}
            <Btn type="submit" variant="red">Submit review</Btn>
          </motion.form>
        )}
        <div className="rv-list">
          {list.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.06}>
              <article className="rv">
                {r.photo && <img src={r.photo} alt={`Photo from ${r.name}`} loading="lazy" />}
                <div><Stars n={r.rating} /><p>{r.text}</p><small>{r.name} · {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</small></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
