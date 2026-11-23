"use client";
import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Btn, Split } from "./ui";

/* Thin red scroll progress bar at the very top */
export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return <motion.div className="scrollbar" style={{ scaleX: x }} aria-hidden="true" />;
}

/* Words fill from faint to solid as you scroll through them */
function Word({ w, p, a, b }: { w: string; p: MotionValue<number>; a: number; b: number }) {
  const o = useTransform(p, [a, b], [0.14, 1]);
  const y = useTransform(p, [a, b], [14, 0]);
  return <motion.span style={{ opacity: o, y, display: "inline-block" }}>{w}&nbsp;</motion.span>;
}
function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref as React.RefObject<HTMLElement>} className="tnum">{v}{suffix}</b>;
}
type Tok = { w: string } | { img: string; pos: string; alt: string };
const TOKENS: Tok[] = [
  ..."We make a short list".split(" ").map((w) => ({ w })),
  { img: "/products/knit-stack.jpg", pos: "50% 45%", alt: "Folded knitwear" },
  ..."of clothes and make them properly.".split(" ").map((w) => ({ w })),
  { img: "/editorial/e08.jpg", pos: "42% 38%", alt: "Black leather shirt" },
  ..."Black first, earth tones after,".split(" ").map((w) => ({ w })),
  { img: "/products/denim.jpg", pos: "62% 50%", alt: "Stacked denim" },
  ..."cut on one loose block and sewn in runs of two hundred or fewer.".split(" ").map((w) => ({ w })),
];

function Pill({ t, p, a, b }: { t: { img: string; pos: string; alt: string }; p: MotionValue<number>; a: number; b: number }) {
  const s = useTransform(p, [a, b], [0.15, 1]);
  const r = useTransform(p, [a, b], [-70, 0]);
  const o = useTransform(p, [a, Math.min(1, a + (b - a) * 0.5)], [0, 1]);
  const ir = useTransform(p, [a, 1], [1.5, 1]);
  return (
    <motion.span className="st-pill" style={{ scale: s, rotate: r, opacity: o }} role="img" aria-label={t.alt}>
      <motion.img src={t.img} alt="" style={{ objectPosition: t.pos, scale: ir }} loading="lazy" />
    </motion.span>
  );
}

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  // Track the sentence itself, so every word is fully lit by the time its last line is mid-screen.
  const { scrollYProgress } = useScroll({ target: pRef, offset: ["start 0.88", "end 0.5"] });
  const n = TOKENS.length;
  const label = TOKENS.flatMap((t) => ("w" in t ? [t.w] : [])).join(" ");
  return (
    <section className="statement" ref={ref} aria-label="Our approach">
      <div className="wrap">
        <p className="st-text display" ref={pRef} aria-label={label}>
          {TOKENS.map((t, i) => {
            const a = i / n, b = Math.min(1, (i + 3) / n);
            return "w" in t
              ? <Word key={i} w={t.w} p={scrollYProgress} a={a} b={b} />
              : <span key={i}><Pill t={t} p={scrollYProgress} a={a} b={b} />&nbsp;</span>;
          })}
        </p>
        <div className="st-stats">
          <div><Count to={200} /><span>Pieces per run, at most</span></div>
          <div><Count to={12} /><span>Pieces in the collection</span></div>
          <div><Count to={6} /><span>Sizes, one unisex block</span></div>
          <div><Count to={14} suffix="d" /><span>Easy returns</span></div>
        </div>
      </div>
    </section>
  );
}

/* Huge outlined words that travel sideways with the scroll */
export function Band({ words, flip = false }: { words: string; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 38, damping: 24, mass: 1.2 });
  const x = useTransform(p, [0, 1], flip ? ["-12%", "0%"] : ["0%", "-12%"]);
  const x2 = useTransform(p, [0, 1], flip ? ["0%", "-12%"] : ["-12%", "0%"]);
  const line = `${words} · ${words} · ${words} · `;
  return (
    <div className="band" ref={ref} aria-hidden="true">
      <motion.div style={{ x }} className="band-line">{line}</motion.div>
      <motion.div style={{ x: x2 }} className="band-line fill">{line}</motion.div>
    </div>
  );
}

/* Services icons draw themselves */
export function Drawn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return <div ref={ref} className={"svc" + (inView ? " drawn" : "")}>{children}</div>;
}

/* Pinned process scene: the picture and word change as you scroll */
const STEPS = [
  { t: "Cloth", d: "We pick heavy weights and long fibres from mills that can tell us where the wool was grown and how it was dyed.", img: "/products/knit-stack.jpg", pos: "50% 50%" },
  { t: "Pattern", d: "One relaxed unisex block, drawn by hand and graded across six sizes, so every piece layers with every other.", img: "/editorial/e01.jpg", pos: "50% 30%" },
  { t: "Cut", d: "Small runs of two hundred or fewer, cut by hand on the table so the grain sits where it should.", img: "/editorial/e07.jpg", pos: "50% 30%" },
  { t: "Sew", d: "Stitched in our own studio. Seams are pressed as they are sewn, which is why the garment hangs the way it does.", img: "/products/leather-1.jpg", pos: "50% 64%", scale: 1.9 },
  { t: "Finish", d: "Washed, pressed and checked piece by piece. If it would not pass our own wardrobe, it does not ship.", img: "/editorial/e13.jpg", pos: "50% 25%" },
];
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  useEffect(() => scrollYProgress.on("change", (v) => setI(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)))), [scrollYProgress]);
  const s = STEPS[i];
  return (
    <section className="process" ref={ref} aria-label="How it is made">
      <div className="proc-stick">
        <div className="proc-img">
          <AnimatePresence mode="popLayout">
            <motion.div key={i} style={{ position: "absolute", inset: 0 }} initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 0.5 }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
              <img src={s.img} alt={s.t} style={{ objectPosition: s.pos, transform: `scale(${"scale" in s ? (s as { scale: number }).scale : 1})` }} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="proc-copy">
          <span className="tagpill">How it is made</span>
          <div className="proc-word" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.span key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>{s.t}</motion.span>
            </AnimatePresence>
          </div>
          <h2 className="sr">{s.t}</h2>
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>{s.d}</motion.p>
          </AnimatePresence>
          <div className="proc-dots">{STEPS.map((x, n) => <span key={x.t} className={n === i ? "on" : ""} />)}</div>
          <div className="proc-bar"><motion.i style={{ scaleX: bar }} /></div>
          <Btn href="/craft" variant="light">See the craft</Btn>
        </div>
      </div>
    </section>
  );
}
