"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { bySlug, type Product } from "@/lib/products";

export type CartLine = { slug: string; size: string; qty: number };
type Ctx = {
  lines: CartLine[]; count: number; subtotal: number;
  open: boolean; setOpen: (v: boolean) => void;
  menu: boolean; setMenu: (v: boolean) => void;
  search: boolean; setSearch: (v: boolean) => void;
  add: (slug: string, size: string, silent?: boolean) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  detailed: { line: CartLine; product: Product }[];
  wish: string[]; toggleWish: (slug: string) => void;
  quick: string | null; setQuick: (slug: string | null) => void;
  guide: boolean; setGuide: (v: boolean) => void;
  recent: string[]; pushRecent: (slug: string) => void;
  calm: boolean; setCalm: (v: boolean) => void;
};
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};

function useStored<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setV(JSON.parse(raw)); } catch {}
  }, [key]);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [lines, setLines] = useStored<CartLine[]>("mn-cart", []);
  const [wish, setWish] = useStored<string[]>("mn-wish", []);
  const [recent, setRecent] = useStored<string[]>("mn-recent", []);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [quick, setQuick] = useState<string | null>(null);
  const [guide, setGuide] = useState(false);
  const [calm, setCalm] = useStored<boolean>("mn-calm", false);
  useEffect(() => { if (calm) document.documentElement.setAttribute("data-calm", ""); else document.documentElement.removeAttribute("data-calm"); }, [calm]);

  useEffect(() => {
    if (calm) return;
    if (new URLSearchParams(window.location.search).has("nolenis")) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [calm]);

  useEffect(() => {
    document.documentElement.style.overflow = open || menu || search || quick || guide ? "hidden" : "";
  }, [open, menu, search, quick, guide]);

  const add = useCallback((slug: string, size: string, silent = false) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.size === size);
      if (i >= 0) { const n = [...prev]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n; }
      return [...prev, { slug, size, qty: 1 }];
    });
    if (!silent) { setQuick(null); setOpen(true); }
  }, [setLines]);
  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((prev) => prev.flatMap((l) => (l.slug === slug && l.size === size ? (qty > 0 ? [{ ...l, qty }] : []) : [l])));
  }, [setLines]);
  const clear = useCallback(() => setLines([]), [setLines]);
  const toggleWish = useCallback((slug: string) => setWish((w) => (w.includes(slug) ? w.filter((x) => x !== slug) : [...w, slug])), [setWish]);
  const pushRecent = useCallback((slug: string) => setRecent((r) => [slug, ...r.filter((x) => x !== slug)].slice(0, 8)), [setRecent]);

  const value = useMemo<Ctx>(() => {
    const detailed = lines.flatMap((line) => { const product = bySlug(line.slug); return product ? [{ line, product }] : []; });
    return {
      lines, open, setOpen, menu, setMenu, search, setSearch, add, setQty, clear, detailed,
      wish, toggleWish, quick, setQuick, guide, setGuide, recent, pushRecent, calm, setCalm,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: detailed.reduce((s, d) => s + d.product.price * d.line.qty, 0),
    };
  }, [lines, open, menu, search, add, setQty, clear, wish, toggleWish, quick, guide, recent, pushRecent, calm, setCalm]);

  return (
    <CartCtx.Provider value={value}>
      <MotionConfig reducedMotion={calm ? "always" : "never"}>{children}</MotionConfig>
    </CartCtx.Provider>
  );
}
