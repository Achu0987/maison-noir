"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Btn, Pic, Reveal, Split } from "@/components/ui";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref as React.RefObject<HTMLElement>}>{to === 2021 ? v : v.toLocaleString("en-IN")}{suffix}</b>;
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <main>
      <PageBanner title="About us" crumb="About us" />
      <section className="section">
        <div className="wrap two">
          <div>
            <Reveal><span className="tagpill">Our story</span></Reveal>
            <Split text="Clothes made to be worn for years" className="display" />
            <Reveal delay={0.15}>
              <div className="prose" style={{ marginTop: 28 }}>
                <p>Maison Noir is a small studio that cuts, sews and finishes everything in one place. We draw every pattern on a single unisex block and grade it across six sizes, so the same coat fits whoever asks for it.</p>
                <p>We work with mills that will tell us where the wool was grown and what the dye was. If a fabric cannot be explained in a sentence, it does not go into a garment.</p>
                <Btn href="/shop" variant="red">Shop the collection</Btn>
              </div>
            </Reveal>
          </div>
          <div className="img-reveal" ref={ref} style={{ aspectRatio: "4/5" }}>
            <motion.div style={{ y, height: "120%", marginTop: "-10%" }}><Pic img={{ src: "/editorial/e01.jpg", pos: "50% 30%" }} alt="Model in a teal pinstripe blazer" /></motion.div>
          </div>
        </div>
      </section>
      <section className="section soft" aria-label="By the numbers">
        <div className="wrap stats">
          <div className="stat"><Count to={2021} /><span>Founded</span></div>
          <div className="stat"><Count to={200} suffix="" /><span>Pieces per run, at most</span></div>
          <div className="stat"><Count to={12} /><span>Pieces in the collection</span></div>
          <div className="stat"><Count to={14} /><span>Day returns</span></div>
        </div>
      </section>
      <section className="section" aria-label="What we believe">
        <div className="wrap">
          <div className="sec-head"><Split text="What we stand for" className="display" /></div>
          <div className="blogs">
            {[["Fewer, better", "A short list of clothes, each one made properly and never rushed out to fill a calendar."], ["Honest cloth", "Heavier weights, longer fibres and natural fabrics that age well instead of wearing out."], ["Made to mix", "Every piece is cut on the same block, so it layers with everything else we make."]].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.1}><div className="review" style={{ background: "var(--soft)", height: "100%" }}><h3 className="display" style={{ fontSize: 40 }}>{t}</h3><p className="muted">{d}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
