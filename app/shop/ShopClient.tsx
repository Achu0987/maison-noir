"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "@/components/ProductCard";
import { Btn } from "@/components/ui";
import { categories, inr, products } from "@/lib/products";

export default function ShopClient() {
  const params = useSearchParams();
  const initial = params.get("c");
  const names = categories.map((c) => c.slug);
  const [cat, setCat] = useState(initial && names.includes(initial) ? initial : "All");
  const [sort, setSort] = useState("featured");
  const [max, setMax] = useState(20000);
  const [sale, setSale] = useState(false);

  const list = useMemo(() => {
    const l = products.filter((p) => (cat === "All" || p.category === cat) && p.price <= max && (!sale || p.compareAt));
    if (sort === "low") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [cat, sort, max, sale]);

  return (
    <div className="wrap shop-layout">
      <aside className="side" aria-label="Filters">
        <div>
          <h4>Categories</h4>
          {["All", ...names].map((c) => (
            <button key={c} className={"opt" + (c === cat ? " on" : "")} onClick={() => setCat(c)} aria-pressed={c === cat}>
              <span>{c}</span>
              <span className="muted tnum">{c === "All" ? products.length : products.filter((p) => p.category === c).length}</span>
            </button>
          ))}
        </div>
        <div>
          <h4>Max price</h4>
          <input type="range" min={2000} max={20000} step={500} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Maximum price" />
          <p className="tnum">Up to {inr(max)}</p>
        </div>
        <div>
          <h4>Offers</h4>
          <button className={"opt" + (sale ? " on" : "")} onClick={() => setSale((v) => !v)} aria-pressed={sale}><span>On sale only</span><span>{sale ? "On" : "Off"}</span></button>
        </div>
      </aside>
      <div>
        <div className="shop-top">
          <p className="muted tnum">{list.length} pieces</p>
          <label className="small muted">Sort{" "}
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </label>
        </div>
        {list.length === 0 ? (
          <div className="empty"><p>No pieces match these filters.</p><Btn variant="ghost" onClick={() => { setCat("All"); setMax(20000); setSale(false); }}>Reset filters</Btn></div>
        ) : (
          <motion.div className="grid3" layout>
            <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.slug} p={p} i={i} lay />)}</AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
