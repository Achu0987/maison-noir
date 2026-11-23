"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useCart } from "./Providers";
import { Btn, Icon, Pic } from "./ui";
import { FREE_SHIP, bySlug, categories, inr, products } from "@/lib/products";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/build-a-look", label: "Build a look" },
  { href: "/craft", label: "Craft" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
const NOTES = ["Free delivery on orders over ₹10,000", "14-day easy returns on every piece", "New: build a full look and add it in one tap"];

function Heart() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>;
}

export function Header() {
  const { count, wish, setOpen, setMenu, setSearch } = useCart();
  const path = usePathname();
  const [compact, setCompact] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    const on = () => setCompact(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const t = setInterval(() => setN((v) => (v + 1) % NOTES.length), 3800);
    return () => { window.removeEventListener("scroll", on); clearInterval(t); };
  }, []);
  return (
    <header className={"header" + (compact ? " compact" : "")}>
      <div className="annc" role="status" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span key={n} initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -22, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>{NOTES[n]}</motion.span>
        </AnimatePresence>
      </div>
      <div className="hrow">
        <div className="left">
          <Link href="/" className="logo" aria-label="Maison Noir home">Maison<i>.</i>Noir</Link>
          <button className="cat-btn" onClick={() => setMenu(true)} aria-label="Open menu"><Icon n="grid" /><span className="cat-label">Menu</span></button>
        </div>
        <nav aria-label="Primary">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={(l.href === "/" ? path === "/" : path.startsWith(l.href)) ? "on" : ""}>{l.label}</Link>
          ))}
        </nav>
        <div className="right">
          <button className="ic" onClick={() => setSearch(true)} aria-label="Search"><Icon n="search" /></button>
          <Link className="ic" href="/wishlist" aria-label={`Wishlist, ${wish.length} items`}><Heart />{wish.length > 0 && <span className="badge-n tnum">{wish.length}</span>}</Link>
          <Link className="ic" href="/sign-up" aria-label="Account"><Icon n="user" /></Link>
          <button className="ic" onClick={() => setOpen(true)} aria-label={`Open bag, ${count} items`}>
            <Icon n="bag" /><span className="badge-n tnum">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function MenuPanel() {
  const { menu, setMenu } = useCart();
  const more: [string, string][] = [["/lookbook", "Lookbook"], ["/build-a-look", "Build a look"], ["/gift-cards", "Gift cards"], ["/club", "Noir Club"], ["/visit", "Visit the studio"], ["/track-order", "Track order"], ["/craft", "Craft and care"], ["/about", "About us"], ["/blog", "Blog"], ["/wishlist", "Wishlist"], ["/faq", "FAQ"], ["/contact", "Contact"]];
  return (
    <AnimatePresence>
      {menu && (
        <>
          <motion.div className="scrim" key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
          <motion.aside className="panel left mnav" key="p" role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} exit={{ clipPath: "inset(0 100% 0 0)" }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }} data-lenis-prevent>
            <div className="mnav-head">
              <Link href="/" className="logo" onClick={() => setMenu(false)}>Maison<i>.</i>Noir</Link>
              <button className="ic" onClick={() => setMenu(false)} aria-label="Close menu"><Icon n="close" /></button>
            </div>
            <div className="mnav-body">
              <p className="mnav-k">Shop</p>
              {categories.map((c, i) => (
                <motion.div key={c.slug} className="mnav-mask" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  <Link href={`/shop?c=${encodeURIComponent(c.slug)}`} className="mnav-row" onClick={() => setMenu(false)}>
                    <span className="mnav-th"><Pic img={c.image} /></span>
                    <span className="mnav-name">{c.slug}</span>
                    <span className="mnav-arrow" aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              ))}
              <p className="mnav-k" style={{ marginTop: 34 }}>Explore</p>
              <div className="mnav-grid">
                {more.map(([h, l], i) => (
                  <motion.div key={h} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.035, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <Link href={h} className="mnav-link" onClick={() => setMenu(false)}>{l}</Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mnav-foot">
              <span>hello@maisonnoir.example</span>
              <div className="socials"><a href="#" aria-label="Instagram"><Social n="instagram" /></a><a href="#" aria-label="Facebook"><Social n="facebook" /></a><a href="#" aria-label="Pinterest"><Social n="pinterest" /></a></div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function SearchOverlay() {
  const { search, setSearch } = useCart();
  const [q, setQ] = useState("");
  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? products.filter((p) => (p.name + p.category + p.fabric).toLowerCase().includes(s)) : products.slice(0, 4);
  }, [q]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setSearch(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setSearch]);
  return (
    <AnimatePresence>
      {search && (
        <motion.div className="search-ov" role="dialog" aria-modal="true" aria-label="Search" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} data-lenis-prevent>
          <button className="ic close-x" onClick={() => setSearch(false)} aria-label="Close search"><Icon n="close" /></button>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the collection" aria-label="Search products" />
          <div className="results">
            {res.length === 0 && <p>No pieces found.</p>}
            {res.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="res" onClick={() => setSearch(false)}>
                <span className="im"><Pic img={p.images[0]} alt={p.name} /></span>
                <span className="display" style={{ fontSize: 24 }}>{p.name}</span>
                <span className="tnum" style={{ color: "#ff6b74" }}>{inr(p.price)}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { open, setOpen, detailed, subtotal, setQty, count, add } = useCart();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);
  const left = Math.max(0, FREE_SHIP - subtotal);
  const inCart = new Set(detailed.map((d) => d.product.slug));
  const upsell = products.filter((p) => !inCart.has(p.slug) && p.price <= Math.max(left, 4000)).slice(0, 2);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="panel right" key="d" role="dialog" aria-modal="true" aria-label="Shopping bag" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} data-lenis-prevent>
            <div className="panel-head">
              <h2 className="display">Your cart ({count})</h2>
              <button className="ic" onClick={() => setOpen(false)} aria-label="Close bag"><Icon n="close" /></button>
            </div>
            <div className="drawer-list">
              {detailed.length === 0 && (
                <div className="empty"><p>No items found.</p><Btn href="/shop" variant="red" onClick={() => setOpen(false)}>Browse the shop</Btn></div>
              )}
              {detailed.map(({ line, product }, i) => (
                <motion.div className="line" key={line.slug + line.size} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  <span className="im"><Pic img={product.images[0]} alt={product.name} /></span>
                  <div>
                    <h3>{product.name}</h3>
                    <p className="small muted">Size {line.size}</p>
                    <div className="qty">
                      <button aria-label="Decrease quantity" onClick={() => setQty(line.slug, line.size, line.qty - 1)}>−</button>
                      <span>{line.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => setQty(line.slug, line.size, line.qty + 1)}>+</button>
                    </div>
                    <button className="rm u" onClick={() => setQty(line.slug, line.size, 0)}>Remove</button>
                  </div>
                  <div className="tnum">{inr(product.price * line.qty)}</div>
                </motion.div>
              ))}
              {detailed.length > 0 && upsell.length > 0 && (
                <div className="upsell">
                  <h3 className="display">Add to your order</h3>
                  {upsell.map((p) => (
                    <div className="up" key={p.slug}>
                      <span className="im"><Pic img={p.images[0]} alt="" /></span>
                      <span><b>{p.name}</b><br /><span className="tnum small muted">{inr(p.price)}</span></span>
                      <button className="u small" onClick={() => add(p.slug, "M", true)}>Add M</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {detailed.length > 0 && (
              <div className="drawer-foot">
                <div className="ship">
                  <span>{left === 0 ? "You have free delivery." : `${inr(left)} away from free delivery`}</span>
                  <div className="bar"><i style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} /></div>
                </div>
                <div className="sub"><span>Subtotal</span><span className="tnum">{inr(subtotal)}</span></div>
                <Btn href="/checkout" variant="red" full onClick={() => setOpen(false)}>Continue to checkout</Btn>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QuickView() {
  const { quick, setQuick, add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const p = quick ? bySlug(quick) : null;
  useEffect(() => { setSize(null); }, [quick]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setQuick(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setQuick]);
  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.div className="scrim" key="qs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuick(null)} />
          <motion.div className="modal" key="qm" role="dialog" aria-modal="true" aria-label={`Quick view ${p.name}`} initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.97 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} data-lenis-prevent>
            <button className="ic modal-x" onClick={() => setQuick(null)} aria-label="Close quick view"><Icon n="close" /></button>
            <div className="qv-img"><Pic img={p.images[0]} alt={p.name} /></div>
            <div className="qv-info">
              <h2 className="display">{p.name}</h2>
              <p className="pdp-price tnum">{inr(p.price)}{p.compareAt && <del>{inr(p.compareAt)}</del>}</p>
              <p className="muted">{p.blurb}</p>
              <div className="sizes" role="radiogroup" aria-label="Size">
                {p.sizes.map((s) => <button key={s} role="radio" aria-checked={s === size} disabled={p.soldOut?.includes(s)} aria-label={p.soldOut?.includes(s) ? `${s}, sold out` : s} className={"size" + (s === size ? " on" : "")} onClick={() => setSize(s)}>{s}</button>)}
              </div>
              <Btn variant="red" full onClick={() => size && add(p.slug, size)} disabled={!size}>{size ? `Add to cart · ${inr(p.price)}` : "Select a size"}</Btn>
              <Link className="u small" href={`/product/${p.slug}`} onClick={() => setQuick(null)}>View full details</Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const GUIDE = [["XS", "86–91", "66"], ["S", "91–96", "68"], ["M", "96–101", "70"], ["L", "101–106", "72"], ["XL", "106–111", "74"], ["XXL", "111–118", "76"]];
export function SizeGuide() {
  const { guide, setGuide } = useCart();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setGuide(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setGuide]);
  return (
    <AnimatePresence>
      {guide && (
        <>
          <motion.div className="scrim" key="gs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGuide(false)} />
          <motion.div className="modal guide" key="gm" role="dialog" aria-modal="true" aria-label="Size guide" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} data-lenis-prevent>
            <button className="ic modal-x" onClick={() => setGuide(false)} aria-label="Close size guide"><Icon n="close" /></button>
            <h2 className="display">Size guide</h2>
            <p className="muted">All pieces are cut on one relaxed unisex block. Measure your chest at the fullest point and choose the nearest size. For a closer fit, size down.</p>
            <table>
              <thead><tr><th scope="col">Size</th><th scope="col">Chest (cm)</th><th scope="col">Body length (cm)</th></tr></thead>
              <tbody>{GUIDE.map(([s, c, l]) => <tr key={s}><th scope="row">{s}</th><td className="tnum">{c}</td><td className="tnum">{l}</td></tr>)}</tbody>
            </table>
            <p className="note">Sample measurements. Replace with your real size chart before launch.</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 }), sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState("");
  useEffect(() => {
    const mv = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const ov = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? "");
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", ov);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", ov); };
  }, [x, y]);
  return <motion.div className={"cursor" + (label ? " big" : "")} style={{ x: sx, y: sy }} aria-hidden="true">{label}</motion.div>;
}


export function Social({ n }: { n: "instagram" | "facebook" | "x" | "pinterest" | "youtube" | "whatsapp" }) {
  const p: Record<string, React.ReactNode> = {
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9" /><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" /><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" /></>,
    facebook: <path fill="currentColor" d="M14 8.2V6.6c0-.6.4-.8.8-.8H17V2.2h-3C11 2.2 9.6 4 9.6 6.4v1.8H7v3.7h2.6V22H14V11.9h2.8l.5-3.7H14Z" />,
    x: <path fill="currentColor" d="M17.9 3h3l-6.5 7.5L22 21h-5.9l-4.7-6.1L5.9 21h-3l6.9-8L2.5 3h6l4.2 5.6L17.9 3Zm-1 16.2h1.7L7.7 4.7H5.9l11 14.5Z" />,
    pinterest: <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />,
    youtube: <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800ZM10 15V9l5.200 3L10 15Z" />,
    whatsapp: <path fill="currentColor" d="M12 2a10 10 0 0 0-8.600 15L2 22l5.100-1.300A10 10 0 1 0 12 2Zm0 18.200a8.200 8.200 0 0 1-4.200-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200Zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.5-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.1-1.200-.1-.1-.2-.2-.5-.3Z" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{p[n]}</svg>;
}

const FOLLOW = [
  ["/editorial/e06.jpg", "50% 30%"], ["/editorial/e13.jpg", "50% 22%"], ["/products/knit-stack.jpg", "50% 50%"],
  ["/editorial/e07.jpg", "50% 30%"], ["/products/denim-jacket.jpg", "50% 34%"], ["/editorial/e04.jpg", "50% 30%"],
];
export function Follow() {
  return (
    <section className="follow" aria-label="Instagram">
      <div className="wrap follow-head">
        <h2 className="display">On Instagram</h2>
        <a className="btn red" href="#"><span className="roll"><span>Follow us</span><span aria-hidden="true">Follow us</span></span></a>
      </div>
      <div className="follow-grid">
        {FOLLOW.map(([src, pos], i) => (
          <motion.a key={src} href="#" className="fol" aria-label="Open on Instagram" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
            <img src={src} alt="" loading="lazy" style={{ objectPosition: pos }} />
            <span className="fol-ov"><Social n="instagram" /></span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export function Floaters() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="floaters">
      <AnimatePresence>
        {top && (
          <motion.button key="up" className="fl totop" aria-label="Back to top" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.button>
        )}
      </AnimatePresence>
      <motion.a className="fl wa" href="https://wa.me/919876543210?text=Hi%20Maison%20Noir" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" data-cursor="Chat" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.4, type: "spring", stiffness: 220, damping: 14 }}>
        <Social n="whatsapp" />
      </motion.a>
    </div>
  );
}

export function Footer() {
  const { calm, setCalm } = useCart();
  return (
    <>
    <Follow />
    <footer className="footer">
      <div className="wrap foot-grid">
        <div>
          <Link href="/" className="logo">Maison<i>.</i>Noir</Link>
          <p>We make a short list of unisex tailoring, knitwear, denim and outerwear, in black and earth tones, in small runs.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul><li><Link href="/shop">Shop</Link></li><li><Link href="/lookbook">Lookbook</Link></li><li><Link href="/build-a-look">Build a look</Link></li><li><Link href="/craft">Craft and care</Link></li><li><Link href="/gift-cards">Gift cards</Link></li><li><Link href="/club">Noir Club</Link></li></ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul><li><Link href="/contact">Contact</Link></li><li><Link href="/faq">FAQ</Link></li><li><Link href="/track-order">Track order</Link></li><li><Link href="/visit">Visit the studio</Link></li><li><Link href="/wishlist">Wishlist</Link></li><li><Link href="/privacy-policy">Privacy policy</Link></li></ul>
        </div>
        <div>
          <h4>Contact us</h4>
          <ul><li>Email: hello@maisonnoir.example</li><li>Phone: +91 98765 43210</li><li>Chennai, India</li></ul>
        </div>
      </div>
      <div className="foot-big">
        <svg viewBox="0 0 1000 150" role="img" aria-label="Maison Noir">
          <text x="0" y="132" textLength="1000" lengthAdjust="spacingAndGlyphs" fontSize="168" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fill: "#232326", textTransform: "uppercase" }}>MAISON NOIR</text>
        </svg>
      </div>
      <div className="foot-bar">
        <span>© 2026 Maison Noir. Photography from Pexels and Unsplash (free licences). Sample products, prices and details are placeholders.</span>
        <button className="calm-btn" onClick={() => setCalm(!calm)} aria-pressed={calm}>{calm ? "Motion: reduced (tap to enable)" : "Motion: on (tap to reduce)"}</button>
        <div className="socials" aria-label="Social links">
          <a href="#" aria-label="Instagram"><Social n="instagram" /></a>
          <a href="#" aria-label="Facebook"><Social n="facebook" /></a>
          <a href="#" aria-label="X"><Social n="x" /></a>
          <a href="#" aria-label="Pinterest"><Social n="pinterest" /></a>
          <a href="#" aria-label="YouTube"><Social n="youtube" /></a>
        </div>
      </div>
    </footer>
    </>
  );
}
