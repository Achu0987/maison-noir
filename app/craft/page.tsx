"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Pic, Reveal, Split } from "@/components/ui";

const STEPS = [
  { t: "Cloth", d: "Every garment starts with the fabric. We pick heavy weights and long fibres from mills that can tell us where the wool was grown and how it was dyed.", img: { src: "/products/knit-stack.jpg", pos: "50% 50%" } },
  { t: "Pattern", d: "One relaxed unisex block, drawn by hand and graded across six sizes. A single pattern means every piece layers with every other.", img: { src: "/products/blazer.jpg", pos: "50% 52%" } },
  { t: "Cut", d: "We cut in small runs of two hundred or fewer, by hand on the table, so the grain sits where it should and nothing is wasted.", img: { src: "/products/denim.jpg", pos: "60% 55%" } },
  { t: "Sew", d: "Stitched in our own studio by people we know. Seams are pressed as they are sewn, which is why the finished garment hangs the way it does.", img: { src: "/products/leather-1.jpg", pos: "50% 64%", scale: 1.9 } },
  { t: "Finish", d: "Washed, pressed and checked piece by piece before it is folded. If it would not pass our own wardrobe, it does not ship.", img: { src: "/products/shirt.jpg", pos: "40% 50%" } },
];
const MATS = [
  ["Merino wool", "Extra-fine, naturally temperature regulating and soft against the skin."],
  ["Lambskin leather", "Full-grain and vegetable-tanned where possible. Ages with character."],
  ["Selvedge denim", "Dense, rigid indigo that fades to your own wear pattern."],
  ["Washed linen", "Pre-washed so it is soft from the first day and never stiff."],
];
const CARE = [
  ["Knitwear", "Hand wash cold with wool detergent. Dry flat, away from direct heat. Fold, never hang."],
  ["Denim", "Wash rarely, cold and inside out. Hang to dry. Spot clean in between."],
  ["Leather", "Wipe with a soft dry cloth. Condition once a season. Store on a wide hanger."],
  ["Tailoring", "Dry clean only, and only when needed. Steam to refresh between wears."],
];

function Step({ i, s, on }: { i: number; s: (typeof STEPS)[number]; on: (n: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) on(i); }, [inView, i, on]);
  return (
    <div ref={ref} className={"step" + (inView ? " on" : "")}>
      <Split text={s.t} className="display" />
      <p>{s.d}</p>
    </div>
  );
}

export default function Craft() {
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <main>
      <PageBanner title="Craft and care" crumb="Craft" />
      <div className="progress-line" aria-hidden="true"><motion.i style={{ scaleX: p }} /></div>
      <div className="wrap craft" ref={wrap}>
        <div className="craft-stick">
          <AnimatePresence mode="popLayout">
            <motion.div key={active} style={{ position: "absolute", inset: 0 }} initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 0.6 }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
              <Pic img={STEPS[active].img} alt={STEPS[active].t} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div>{STEPS.map((s, i) => <Step key={s.t} i={i} s={s} on={setActive} />)}</div>
      </div>

      <section className="section soft" aria-label="Materials">
        <div className="wrap">
          <div className="sec-head"><Reveal><span className="tagpill">Materials</span></Reveal><Split text="What we make with" className="display" /></div>
          <div className="mats">{MATS.map(([t, d], i) => <Reveal key={t} delay={i * 0.08}><div className="mat"><h3 className="display">{t}</h3><p>{d}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section" aria-label="Care guide">
        <div className="wrap" style={{ maxWidth: 980 }}>
          <div className="sec-head"><Reveal><span className="tagpill">Care guide</span></Reveal><Split text="Make it last" className="display" /></div>
          <div className="acc">{CARE.map(([t, d], i) => <Reveal key={t} delay={i * 0.05}><details open={i === 0}><summary>{t}</summary><div className="body">{d}</div></details></Reveal>)}</div>
        </div>
      </section>
    </main>
  );
}
