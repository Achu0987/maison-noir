"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useCart } from "./Providers";
import { Pic } from "./ui";
import { inr, type Product } from "@/lib/products";

export default function ProductCard({ p, i = 0, still = false, lay = false }: { p: Product; i?: number; still?: boolean; lay?: boolean }) {
  const { add, wish, toggleWish, setQuick } = useCart();
  const img2 = p.images[1];
  const liked = wish.includes(p.slug);
  return (
    <motion.article
      layout={lay}
      className="card"
      data-reveal
      initial={still ? false : { opacity: 0, y: 70, scale: 0.94, rotateX: -10 }}
      whileInView={still ? undefined : { opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.9, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-media">
        {p.tag && <span className={"flag" + (p.tag === "New" ? " new" : "")}>{p.tag}</span>}
        <Link href={`/product/${p.slug}`} aria-label={p.name} data-cursor="View" style={{ position: "absolute", inset: 0, zIndex: 2 }} />
        <Pic img={p.images[0]} alt={p.name} />
        {img2 && <Pic img={img2} className="alt" />}
        <div className="card-tools">
          <button className={"tool" + (liked ? " on" : "")} onClick={() => toggleWish(p.slug)} aria-pressed={liked} aria-label={liked ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
          </button>
          <button className="tool" onClick={() => setQuick(p.slug)} aria-label={`Quick view ${p.name}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
        </div>
        <div className="quick">
          <button className="quick-btn" onClick={() => add(p.slug, "M")} aria-label={`Quick add ${p.name}, size M`}>Quick add · M</button>
        </div>
      </div>
      <Link href={`/product/${p.slug}`}><h3>{p.name}</h3></Link>
      <span className="cat">{p.category}</span>
      <p className="price tnum">{inr(p.price)}{p.compareAt && <del>{inr(p.compareAt)}</del>}</p>
    </motion.article>
  );
}
