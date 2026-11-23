"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/components/Providers";
import ProductCard from "@/components/ProductCard";
import PageBanner from "@/components/PageBanner";
import { Btn, Pic, Reveal, Split } from "@/components/ui";
import { NotifyMe, ReviewsBlock } from "@/components/ProductExtras";
import { bySlug, inr, products, recommendSize, type Product } from "@/lib/products";

export default function ProductClient({ p }: { p: Product }) {
  const { add, recent, pushRecent, setGuide, wish, toggleWish } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [h, setH] = useState(172);
  const [w, setW] = useState(68);
  const [hint, setHint] = useState(false);
  const rec = recommendSize(h, w);
  const liked = wish.includes(p.slug);

  useEffect(() => { pushRecent(p.slug); }, [p.slug, pushRecent]);

  const gallery = p.images.length > 1 ? p.images : [p.images[0], { ...p.images[0], scale: (p.images[0].scale ?? 1) * 1.45, pos: "50% 38%" }];
  const related = products.filter((x) => x.slug !== p.slug && x.category !== p.category).slice(0, 4);
  const look = useMemo(() => {
    const want = ["Jeans", "Sweater", "Jackets", "T-Shirts"].filter((c) => c !== p.category);
    return want.slice(0, 3).map((c) => products.find((x) => x.category === c && x.slug !== p.slug)).filter(Boolean) as Product[];
  }, [p.slug, p.category]);
  const lookTotal = look.reduce((s, x) => s + x.price, 0);
  const recentList = recent.filter((s) => s !== p.slug).map(bySlug).filter(Boolean) as Product[];

  const addMain = () => { if (!size) { setHint(true); return; } add(p.slug, size); };

  return (
    <main>
      <PageBanner title={p.category} crumb={p.name} />
      <div className="wrap pdp">
        <div className="pdp-imgs">
          {gallery.map((img, i) => (
            <motion.div className="pi" key={i} initial={{ opacity: 0, clipPath: "inset(14% 0 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <Pic img={img} alt={`${p.name}, view ${i + 1}`} eager={i === 0} />
            </motion.div>
          ))}
        </div>
        <div className="pdp-info">
          <div>
            {p.tag && <span className="tagpill" style={{ marginBottom: 14 }}>{p.tag}</span>}
            <Split tag="h2" text={p.name} className="display" immediate delay={0.3} />
          </div>
          <p className="pdp-price tnum">{inr(p.price)}{p.compareAt && <del>{inr(p.compareAt)}</del>}</p>
          <p className="muted">{p.blurb}</p>
          <div className="meta">
            <span><b>SKU:</b>{p.sku}</span>
            <span><b>Stock:</b><span className="ok">{p.stock > 0 ? "Available" : "Sold out"}</span></span>
            <span><b>Gender:</b><span className="ok">{p.gender}</span></span>
            <span><b>Fabric:</b>{p.fabric}</span>
          </div>

          <div>
            <p className="small" style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
              <span>Size {size ? <b>{size}</b> : <span className="muted">select one</span>}</span>
              <button className="u small" onClick={() => setGuide(true)}>Size guide</button>
            </p>
            <div className="sizes" role="radiogroup" aria-label="Size">
              {p.sizes.map((s) => (
                <button key={s} role="radio" aria-checked={s === size} className={"size" + (s === size ? " on" : "")} disabled={p.soldOut?.includes(s)} aria-label={p.soldOut?.includes(s) ? `${s}, sold out` : s} onClick={() => { setSize(s); setHint(false); }}>{s}</button>
              ))}
            </div>
            {hint && <p role="alert" className="small" style={{ color: "var(--red)", marginTop: 10 }}>Choose a size to add this to your cart.</p>}
            <div style={{ marginTop: 12 }}><NotifyMe p={p} /></div>
          </div>

          <div className="fit">
            <p><b>Find your size</b></p>
            <label>Height <b>{h} cm</b>
              <input type="range" min={150} max={200} value={h} onChange={(e) => setH(+e.target.value)} aria-label="Height in centimetres" />
            </label>
            <label>Weight <b>{w} kg</b>
              <input type="range" min={40} max={120} value={w} onChange={(e) => setW(+e.target.value)} aria-label="Weight in kilograms" />
            </label>
            <p className="res">We suggest <strong>{rec}</strong>{" "}<button className="small muted u" onClick={() => { setSize(rec); setHint(false); }}>Use this size</button></p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
            <Btn variant="red" full onClick={addMain}>{`Add to cart · ${inr(p.price)}`}</Btn>
            <button className={"tool" + (liked ? " on" : "")} style={{ width: 52, height: 52, borderRadius: 0, background: liked ? undefined : "var(--soft)", transform: "none", opacity: 1 }} onClick={() => toggleWish(p.slug)} aria-pressed={liked} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
            </button>
          </div>

          <div className="look-block">
            <h3 className="display">Complete the look</h3>
            <div className="look-row">
              {look.map((x) => (
                <Link key={x.slug} href={`/product/${x.slug}`} className="look-item">
                  <span className="im"><Pic img={x.images[0]} alt={x.name} /></span>
                  <span>{x.name}</span>
                  <span className="tnum muted">{inr(x.price)}</span>
                </Link>
              ))}
            </div>
            <div className="look-total"><span>Whole look with this piece</span><b className="tnum">{inr(lookTotal + p.price)}</b></div>
            <Btn variant="ghost" full onClick={() => { look.forEach((x) => add(x.slug, size ?? "M", true)); add(p.slug, size ?? "M"); }}>Add the whole look</Btn>
          </div>

          <div className="acc">
            <details open><summary>Details</summary><div className="body"><ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul></div></details>
            <details><summary>Fabric and care</summary><div className="body">{p.fabric}. {p.care} <Link href="/craft" className="u">Full care guide</Link></div></details>
            <details><summary>Delivery and returns</summary><div className="body">Free delivery on orders over ₹10,000. Dispatched in 2 working days. Returns accepted within 14 days, unworn with tags.</div></details>
          </div>
        </div>
      </div>

      <ReviewsBlock slug={p.slug} name={p.name} />

      {recentList.length > 0 && (
        <section className="section" aria-label="Recently viewed" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Reveal><h2 className="display" style={{ fontSize: 44, marginBottom: 24 }}>Recently viewed</h2></Reveal>
            <div className="recent-row">
              {recentList.slice(0, 6).map((x) => (
                <Link key={x.slug} href={`/product/${x.slug}`} data-cursor="View"><span className="im"><Pic img={x.images[0]} alt="" /></span><b>{x.name}</b><span className="tnum small muted">{inr(x.price)}</span></Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section soft" aria-label="You may also like">
        <div className="wrap">
          <div className="sec-head"><Reveal><span className="tagpill">Related</span></Reveal><Split text="You may also like" className="display" /></div>
          <div className="grid4">{related.map((r, i) => <ProductCard key={r.slug} p={r} i={i} />)}</div>
        </div>
      </section>

      <div className="atc-bar" aria-hidden={false}>
        <div><b className="display" style={{ fontSize: 22 }}>{p.name}</b><div className="tnum" style={{ color: "var(--red)" }}>{inr(p.price)}</div></div>
        <Btn variant="red" onClick={addMain}>Add to cart</Btn>
      </div>
    </main>
  );
}
