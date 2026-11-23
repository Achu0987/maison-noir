"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { useCart } from "@/components/Providers";
import { Btn, Pic, Reveal, Split } from "@/components/ui";
import { inr, products, SIZES, type Product } from "@/lib/products";

const GROUPS: { key: "outer" | "top" | "bottom"; label: string; hint: string; cats: string[] }[] = [
  { key: "outer", label: "Outer layer", hint: "Jackets and tailoring", cats: ["Jackets", "Suit"] },
  { key: "top", label: "Top", hint: "Tees, shirts and knits", cats: ["T-Shirts", "Shirts", "Sweater"] },
  { key: "bottom", label: "Bottom", hint: "Denim", cats: ["Jeans"] },
];

export default function BuildALook() {
  const { add } = useCart();
  const [pick, setPick] = useState<Record<string, Product | null>>({ outer: products[0], top: products.find((p) => p.slug === "merino-knit-pullover")!, bottom: products.find((p) => p.slug === "raw-selvedge-jeans")! });
  const [size, setSize] = useState("M");
  const chosen = GROUPS.map((g) => pick[g.key]).filter(Boolean) as Product[];
  const total = chosen.reduce((s, p) => s + p.price, 0);
  const surprise = () => {
    const next: Record<string, Product | null> = {};
    GROUPS.forEach((g) => { const list = products.filter((p) => g.cats.includes(p.category)); next[g.key] = list[Math.floor(Math.random() * list.length)]; });
    setPick(next);
  };
  const addAll = () => {
    chosen.forEach((p) => add(p.slug, size, true));
    add(chosen[0].slug, size);
  };
  return (
    <main>
      <PageBanner title="Build a look" crumb="Build a look" />
      <div className="wrap builder">
        <div className="pick">
          <Reveal><p className="muted" style={{ maxWidth: "58ch", fontSize: 18 }}>Every piece is cut on the same block, so everything layers with everything else. Pick one from each row and watch the look come together.</p></Reveal>
          {GROUPS.map((g) => (
            <div key={g.key}>
              <h3 className="display">{g.label}<span>{g.hint}</span></h3>
              <div className="strip" role="radiogroup" aria-label={g.label}>
                {products.filter((p) => g.cats.includes(p.category)).map((p) => {
                  const on = pick[g.key]?.slug === p.slug;
                  return (
                    <button key={p.slug} role="radio" aria-checked={on} className={"opt-tile" + (on ? " on" : "")} onClick={() => setPick((s) => ({ ...s, [g.key]: on ? null : p }))}>
                      <span className="im"><Pic img={p.images[0]} alt="" /></span>
                      <span className="nm">{p.name}</span>
                      <span className="tnum small muted">{inr(p.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <aside className="stage" aria-label="Your look">
          <div className="stage-box">
            {GROUPS.map((g) => {
              const p = pick[g.key];
              return (
                <div key={g.key} className={"stage-slot" + (p ? "" : " empty-slot")}>
                  <AnimatePresence mode="popLayout">
                    {p ? (
                      <motion.div key={p.slug} style={{ position: "absolute", inset: 0 }} initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
                        <Pic img={p.images[0]} alt={p.name} />
                        <span className="tagpill">{p.name}</span>
                      </motion.div>
                    ) : <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{g.label}</motion.span>}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="stage-total"><span>{chosen.length} pieces</span><b className="tnum">{inr(total)}</b></div>
          <div className="sizes" role="radiogroup" aria-label="Size for all pieces">
            {SIZES.map((s) => <button key={s} role="radio" aria-checked={s === size} className={"size" + (s === size ? " on" : "")} onClick={() => setSize(s)}>{s}</button>)}
          </div>
          <div className="row-tools">
            <Btn variant="red" onClick={addAll} disabled={chosen.length === 0}>Add the look to cart</Btn>
            <Btn variant="ghost" onClick={surprise}>Surprise me</Btn>
          </div>
          <p className="note">{total >= 10000 ? "This look qualifies for free delivery." : "Add " + inr(10000 - total) + " more for free delivery."}</p>
        </aside>
      </div>
    </main>
  );
}
