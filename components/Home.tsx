"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence, motion, useAnimationFrame, useInView, useMotionValue,
  useScroll, useSpring, useTransform, useVelocity,
} from "motion/react";
import { Band, Drawn, Process, ScrollBar, Statement } from "./Fx";
import ProductCard from "./ProductCard";
import { useCart } from "./Providers";
import { Btn, Icon, Pic, Reveal, Split } from "./ui";
import { postJSON } from "@/lib/client";
import { bySlug, categories, inr, onSale, posts, products, reviews, services } from "@/lib/products";

/* ---------- Hero: light editorial diptych ---------- */
const EASE = [0.22, 1, 0.36, 1] as const;

function Chars({ text, base, step = 0.034, cls = "" }: { text: string; base: number; step?: number; cls?: string }) {
  return (
    <span className={"hline " + cls} aria-hidden="true">
      {text.split("").map((c, n) => (
        <span className="hchar" key={n}>
          <motion.span style={{ display: "inline-block" }} initial={{ y: "120%", rotate: 8 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1, delay: base + n * step, ease: EASE }}>
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Spot({ x, y, slug, delay = 1.6 }: { x: string; y: string; slug: string; delay?: number }) {
  const p = bySlug(slug)!;
  const { calm } = useCart();
  return (
    <div className="spot" style={{ left: x, top: y }}>
      <motion.span className="spot-pop" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: calm ? 0 : delay }}>
        <Link href={`/product/${p.slug}`} className="spot-btn" aria-label={`Shop ${p.name}`} data-cursor="View"><i /></Link>
      </motion.span>
      <motion.div className="spot-card" initial={{ opacity: 0, y: 18, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: calm ? 0 : delay + 0.25, ease: EASE }}>
        <Link href={`/product/${p.slug}`} data-cursor="View">
          <span className="th"><Pic img={p.images[0]} alt="" eager /></span>
          <span><b>{p.name}</b><span className="tnum">{inr(p.price)}</span></span>
        </Link>
      </motion.div>
    </div>
  );
}

function Hero() {
  const { calm } = useCart();
  const ref = useRef<HTMLElement>(null);
  const d = calm ? 0 : 1;
  const mx = useMotionValue(0), my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 18 }), smy = useSpring(my, { stiffness: 50, damping: 18 });
  const ax = useTransform(smx, (v) => v * -22), ay = useTransform(smy, (v) => v * -14);
  const bx = useTransform(smx, (v) => v * 30), by = useTransform(smy, (v) => v * 20);
  const dx = useTransform(smx, (v) => v * -60), dy = useTransform(smy, (v) => v * -40);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yD = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yC = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const frame = (delay: number) => ({
    initial: { clipPath: "inset(100% 0 0 0)" },
    animate: { clipPath: "inset(0% 0 0 0)" },
    transition: { duration: 1.5, delay: delay * d, ease: [0.76, 0, 0.24, 1] as const },
  });
  const grow = (delay: number) => ({
    initial: { scale: 1.3 },
    animate: { scale: 1.02 },
    transition: { duration: 2.8, delay: delay * d, ease: EASE },
  });

  return (
    <section ref={ref} className="lh" aria-label="Featured" onMouseMove={onMove}>
      <motion.div className="lh-copy" style={{ y: yC, opacity: fade }}>
        <motion.span className="lh-kicker" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15 * d, ease: EASE }}>
          <i /> Autumn–Winter 2026
        </motion.span>
        <h1 className="lh-h1" aria-label="Dressed with intent.">
          <Chars text="Dressed" base={0.3 * d} />
          <Chars text="with intent." base={0.6 * d} cls="ital" />
        </h1>
        <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 * d, ease: EASE }}>
          Unisex tailoring and outerwear, cut sharp and made to last.
        </motion.p>
        <motion.div className="lh-cta" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.35 * d, ease: EASE }}>
          <Btn href="/shop">Shop the collection</Btn>
          <Link href="/lookbook" className="lh-link u" data-cursor="Look">View the lookbook <span aria-hidden="true">→</span></Link>
        </motion.div>
      </motion.div>

      <div className="lh-stage">
        <motion.i className="lh-disc" style={{ x: dx, y: dy }} aria-hidden="true">
          <motion.i style={{ y: yD }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.6, delay: 0.1 * d, ease: EASE }} />
        </motion.i>

        <motion.figure className="lf lf-a" style={{ y: yA }}>
          <motion.div className="lf-clip" {...frame(0.25)}>
            <motion.div className="lf-in" style={{ x: ax, y: ay }}>
              <motion.img src="/editorial/e13.jpg" alt="Model in a white shirt and black wide-leg trousers" style={{ objectPosition: "50% 18%" }} fetchPriority="high" {...grow(0.25)} />
            </motion.div>
          </motion.div>
          <Spot x="45%" y="33%" slug="linen-oxford-shirt" delay={1.7} />
        </motion.figure>

        <motion.figure className="lf lf-b" style={{ y: yB }}>
          <motion.div className="lf-clip" {...frame(0.5)}>
            <motion.div className="lf-in" style={{ x: bx, y: by }}>
              <motion.img src="/editorial/e04.jpg" alt="Man in a camel overcoat and dark sunglasses" style={{ objectPosition: "50% 30%" }} {...grow(0.5)} />
            </motion.div>
          </motion.div>
          <Spot x="50%" y="55%" slug="sable-pinstripe-blazer" delay={2.0} />
        </motion.figure>
      </div>
    </section>
  );
}

/* ---------- Velocity marquee ---------- */
const wrap = (min: number, max: number, v: number) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };
function Marquee({ items }: { items: string[] }) {
  const { calm: reduce } = useCart();
  const baseX = useMotionValue(0);
  // Constant, slow drift. Scrolling no longer speeds it up.
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    baseX.set(baseX.get() - 1.05 * (Math.min(delta, 50) / 1000));
  });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const list = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-label={items.join(". ")}>
      <motion.div className="track" style={{ x }} aria-hidden="true">
        {list.map((t, n) => <span key={n}>{t}</span>)}
      </motion.div>
    </div>
  );
}

/* ---------- Categories ---------- */
function Categories() {
  return (
    <section className="section" aria-label="Shop by category">
      <div className="wrap">
        <div className="sec-head"><Reveal><span className="tagpill">Categories</span></Reveal><Split text="Shop by category" className="display" /></div>
        <div className="cats">
          {categories.map((c, i) => (
            <motion.div key={c.slug} data-reveal initial={{ opacity: 0, y: 50, clipPath: "inset(12% 0 0 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 1.1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={`/shop?c=${encodeURIComponent(c.slug)}`} className="cat-tile" data-cursor="Shop">
                <Pic img={c.image} alt={c.slug} />
                <span className="lab">{c.slug}<span aria-hidden="true">→</span></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  return (
    <section className="section soft" style={{ padding: "0" }} aria-label="Our promise">
      <div className="wrap services">
        {services.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.08}>
            <Drawn><Icon n={s.icon} /><div><h3>{s.t}</h3><p>{s.d}</p></div></Drawn>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Latest jackets (deals slider) ---------- */
function Deals() {
  const jackets = useMemo(() => products.filter((p) => p.category === "Jackets"), []);
  const { add } = useCart();
  const [i, setI] = useState(0);
  const [size, setSize] = useState("M");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setI((v) => (v + 1) % jackets.length), 6500);
    return () => clearTimeout(t);
  }, [i, inView, jackets.length]);
  const p = jackets[i];
  return (
    <section className="section" aria-label="Latest jackets" ref={ref}>
      <div className="wrap">
        <div className="deals">
          <div className="deal-side">
            <Reveal><span className="tagpill">Monthly Deals</span></Reveal>
            <Split text="Latest jackets" className="display" />
            <div className="img"><Pic img={{ src: "/editorial/e11.jpg", pos: "50% 30%" }} alt="Model in a black leather jacket" /></div>
          </div>
          <div className="deal-main">
            <AnimatePresence mode="wait">
              <motion.div key={p.slug} className="deal" initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -70 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <div className="info">
                  <h3 className="display">{p.name}</h3>
                  <p className="price tnum">{inr(p.price)}{p.compareAt && <del>{inr(p.compareAt)}</del>}</p>
                  <div className="meta">
                    <span><b>SKU:</b>{p.sku}</span>
                    <span><b>Stock:</b><span className="ok">{p.stock > 0 ? "Available" : "Sold out"}</span></span>
                    <span><b>Gender:</b><span className="ok">{p.gender}</span></span>
                  </div>
                  <div className="sizes" role="radiogroup" aria-label="Size">
                    {["S", "M", "L", "XL"].map((s) => (
                      <button key={s} role="radio" aria-checked={s === size} className={"size" + (s === size ? " on" : "")} onClick={() => setSize(s)}>{s}</button>
                    ))}
                  </div>
                  <div className="row2">
                    <Btn variant="red" onClick={() => add(p.slug, size)}>Add to cart</Btn>
                    <Btn variant="ghost" href={`/product/${p.slug}`}>View details</Btn>
                  </div>
                </div>
                <Link href={`/product/${p.slug}`} className="im" data-cursor="View"><Pic img={p.images[0]} alt={p.name} /></Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="dots">{jackets.map((j, n) => <button key={j.slug} className={"dot" + (n === i ? " on" : "")} aria-label={`Show ${j.name}`} onClick={() => setI(n)} />)}</div>
      </div>
    </section>
  );
}

/* ---------- On sale ---------- */
function OnSale() {
  return (
    <section className="section soft" aria-label="On sale">
      <div className="wrap">
        <div className="sec-head"><Reveal><span className="tagpill">Flash Sale</span></Reveal><Split text="On sale products" className="display" /></div>
        <div className="grid4">{onSale.slice(0, 4).map((p, i) => <ProductCard key={p.slug} p={p} i={i} />)}</div>
      </div>
    </section>
  );
}

/* ---------- Banner ---------- */
function Banner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  return (
    <section className="banner" ref={ref} aria-label="Winter new arrivals">
      <div className="pn"><motion.img src="/editorial/e08.jpg" alt="Model in a black leather shirt" style={{ y: y1, objectPosition: "50% 30%" }} /></div>
      <div className="mid">
        <Reveal><span className="tag-green" style={{ background: "var(--red)", display: "inline-block", padding: "8px 18px", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Winter new arrivals</span></Reveal>
        <Split text="New season new collection" className="display" />
        <Reveal delay={0.2}><Btn href="/shop" variant="light">Shop now</Btn></Reveal>
      </div>
      <div className="pn"><motion.img src="/editorial/e04.jpg" alt="Man in a camel overcoat" style={{ y: y2, objectPosition: "50% 40%" }} /></div>
    </section>
  );
}

/* ---------- Featured with tabs ---------- */
function Featured() {
  const [cat, setCat] = useState("All");
  const list = useMemo(() => products.filter((p) => cat === "All" || p.category === cat).slice(0, 8), [cat]);
  return (
    <section className="section" aria-label="Latest products">
      <div className="wrap">
        <div className="sec-head"><Reveal><span className="tagpill">Featured</span></Reveal><Split text="Latest products" className="display" /></div>
        <div className="tabs" role="group" aria-label="Filter products">
          {["All", ...categories.map((c) => c.slug)].map((c) => (
            <button key={c} className={"tab" + (c === cat ? " on" : "")} onClick={() => setCat(c)} aria-pressed={c === cat}>{c}</button>
          ))}
        </div>
        <motion.div className="grid4" layout>
          <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.slug} p={p} i={i} lay />)}</AnimatePresence>
        </motion.div>
        <Reveal className="" delay={0.1}><div style={{ textAlign: "center", marginTop: 56 }}><Btn href="/shop" variant="ghost">View all products</Btn></div></Reveal>
      </div>
    </section>
  );
}

/* ---------- Hot deals: pinned horizontal scroll ---------- */
function Hot() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth)); };
    m();
    window.addEventListener("resize", m);
    const t = setTimeout(m, 600);
    return () => { window.removeEventListener("resize", m); clearTimeout(t); };
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  return (
    <section className="hot" ref={ref} aria-label="Hot deals">
      <div className="hot-stick">
        <motion.div className="hot-track" ref={track} style={{ x }}>
          <div className="hot-intro">
            <span className="tagpill" style={{ justifySelf: "start" }}>Winter offers</span>
            <h2 className="display">Best deals</h2>
            <div>
              <p style={{ color: "#c9c9cd", marginBottom: 22 }}>Keep scrolling. Every piece here is reduced for the season, while sizes last.</p>
              <div style={{ height: 4, background: "#333" }}><motion.i style={{ display: "block", height: "100%", background: "var(--red-2)", width: bar }} /></div>
            </div>
          </div>
          {onSale.map((pr, n) => <div className="hot-card" key={pr.slug}><ProductCard p={pr} i={n} still /></div>)}
          <div className="hot-intro" style={{ background: "var(--red)", width: "min(400px, 80vw)" }}>
            <span />
            <h2 className="display" style={{ fontSize: "clamp(36px, 3.3vw, 48px)" }}>See the whole collection</h2>
            <Btn href="/shop" variant="light">Shop all</Btn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Mix & match: before/after ---------- */
function Compare() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const seen = useRef(false);
  const inView = useInView(box, { once: true, margin: "-25% 0px" });
  useEffect(() => {
    if (!inView || seen.current) return;
    seen.current = true;
    let t = 0, raf = 0;
    const tick = () => { t += 0.03; if (drag.current || t > Math.PI * 2) return; setPos(50 + Math.sin(t) * 22 * (1 - t / (Math.PI * 2))); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);
  const update = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };
  const a = products[0].images[0], b = products[1].images[0];
  return (
    <section className="section" aria-label="Mix and match">
      <div className="wrap compare-wrap">
        <div
          className="compare" ref={box} data-cursor="Drag" role="slider" aria-label="Compare leather and denim" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} tabIndex={0}
          onPointerDown={(e) => { drag.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); update(e); }}
          onPointerMove={(e) => drag.current && update(e)}
          onPointerUp={() => { drag.current = false; }}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") setPos((v) => Math.max(0, v - 5)); if (e.key === "ArrowRight") setPos((v) => Math.min(100, v + 5)); }}
        >
          <Pic img={b} alt="Indigo chore jacket" />
          <div className="top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><Pic img={a} alt="Noir leather biker jacket" /></div>
          <span className="lab l">Leather</span><span className="lab r">Denim</span>
          <div className="grip" style={{ left: `${pos}%` }}><b>⇆</b></div>
        </div>
        <div className="mm">
          <Reveal><span className="tagpill">Mix &amp; Match</span></Reveal>
          <Split text="Add layers with carefully crafted pieces" className="display" />
          <Reveal delay={0.15}><p>Leather or denim, black or indigo. Every jacket in the collection is cut on the same block, so it layers over any knit, tee or shirt we make. Drag the slider to compare.</p></Reveal>
          <Reveal delay={0.25}><Btn href="/shop?c=Jackets" variant="red">Buy now</Btn></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setTimeout(() => setI((v) => (v + 1) % reviews.length), 6000); return () => clearTimeout(t); }, [i]);
  const shown = [reviews[i], reviews[(i + 1) % reviews.length]];
  return (
    <section className="section soft" aria-label="Customer reviews">
      <div className="wrap">
        <div className="sec-head"><Reveal><span className="tagpill">Testimonials</span></Reveal><Split text="Customer reviews" className="display" /></div>
        <div className="reviews">
          <AnimatePresence mode="popLayout">
            {shown.map((r) => (
              <motion.figure key={r.item} className="review" style={{ margin: 0 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <span className="q" aria-hidden="true">“</span>
                <blockquote style={{ margin: 0 }}>{r.text}</blockquote>
                <figcaption className="who"><span className="avatar" aria-hidden="true">{r.item[0]}</span><span><b>{r.name}</b><br /><span className="it">{r.item}</span></span></figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
        <div className="dots">{reviews.map((r, n) => <button key={r.item} className={"dot" + (n === i ? " on" : "")} aria-label={`Show review ${n + 1}`} onClick={() => setI(n)} />)}</div>
      </div>
    </section>
  );
}

/* ---------- Blog ---------- */
function Blog() {
  return (
    <section className="section" aria-label="From the blog">
      <div className="wrap">
        <div className="sec-head"><Reveal><span className="tagpill">Our Blogs</span></Reveal><Split text="Recent posts" className="display" /></div>
        <div className="blogs">
          {posts.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.1}>
              <Link href={`/blog/${b.slug}`} className="post" data-cursor="Read">
                <div className="im"><Pic img={b.image} alt={b.title} /></div>
                <div className="tx">
                  <span className="by"><b>{b.cat}</b> / By {b.by}</span>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <span className="more-link">Read more <i /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="wrap" style={{ paddingBottom: "clamp(60px,8vw,120px)" }} aria-label="Newsletter">
      <div className="news">
        <div className="tx">
          <Split text="Winter sale up to 40% off" className="display" />
          <Reveal delay={0.1}><p>Subscribe for the latest offers and early access to new drops.</p></Reveal>
          <Reveal delay={0.2}>
            {done ? <p>Thank you. You are on the list.</p> : (
              <form onSubmit={async (e) => { e.preventDefault(); const em = new FormData(e.currentTarget).get("email"); const r = await postJSON("/api/forms", { type: "newsletter", email: em }); if (r.ok) setDone(true); }}>
                <label className="sr" htmlFor="nl">Email</label>
                <input id="nl" name="email" type="email" required placeholder="Enter your email here" />
                <button type="submit">Submit now</button>
              </form>
            )}
          </Reveal>
        </div>
        <div className="im"><img src="/editorial/e13.jpg" alt="" /></div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Marquee items={["Free delivery over ₹10,000", "New season collection", "14-day easy returns", "Made in small runs"]} />
      <ScrollBar />
      <Categories />
      <Services />
      <Statement />
      <Deals />
      <Band words="Outerwear · Knitwear · Denim · Tailoring" />
      <OnSale />
      <Banner />
      <Featured />
      <Hot />
      <Process />
      <Compare />
      <Reviews />
      <Band words="Small runs · Made to last · Black first" flip />
      <Blog />
      <Newsletter />
    </main>
  );
}
