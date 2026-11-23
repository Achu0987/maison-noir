"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import PageBanner from "@/components/PageBanner";
import { Btn, Pic, Reveal, Split } from "@/components/ui";
import { bySlug, inr } from "@/lib/products";

const LOOKS = [
  { name: "After dark", img: "/hero/hero-dark.jpg", pos: "50% 30%", text: "Black on black, built on a belted coat and a soft leather layer. For late evenings and long walks home.", pieces: ["noir-leather-biker-jacket", "chunky-cable-knit", "raw-selvedge-jeans"] },
  { name: "Quilted", img: "/editorial/e06.jpg", pos: "50% 30%", text: "A quilted shell with the collar turned up. Texture does the talking, so everything else stays plain.", pieces: ["eclipse-long-puffer", "merino-knit-pullover", "stonewash-relaxed-jeans"] },
  { name: "Studio white", img: "/editorial/e13.jpg", pos: "50% 25%", text: "A crisp white shirt over wide black trousers. Quiet shapes, strong lines, nothing extra.", pieces: ["linen-oxford-shirt", "sable-pinstripe-blazer", "everyday-crew-tee"] },
  { name: "City coat", img: "/editorial/e04.jpg", pos: "50% 32%", text: "A long camel coat, a clean shirt and a pair of dark glasses. Easy to dress up, easier to wear every day.", pieces: ["sable-pinstripe-blazer", "heavyweight-v-neck-tee", "raw-selvedge-jeans"] },
  { name: "Indigo hour", img: "/products/denim-jacket.jpg", pos: "50% 34%", text: "Rigid denim worn over a fine knit. Workwear cuts that fade into your own wear pattern.", pieces: ["indigo-chore-jacket", "merino-knit-pullover", "stonewash-relaxed-jeans"] },
];

function Look({ l, flip }: { l: (typeof LOOKS)[number]; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  return (
    <section className={"look" + (flip ? " flip" : "")} aria-label={l.name}>
      <motion.div className="look-img" ref={ref} initial={{ clipPath: "inset(14% 0 0 0)", opacity: 0.4 }} whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }} viewport={{ once: true, margin: "0px 0px 10% 0px" }} transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}>
        <motion.img src={l.img} alt={l.name} style={{ y, objectPosition: l.pos }} />
      </motion.div>
      <div className="look-copy">
        <Split text={l.name} className="display" />
        <Reveal delay={0.1}><p>{l.text}</p></Reveal>
        <Reveal delay={0.2} className="with">
          {l.pieces.map((s) => {
            const p = bySlug(s)!;
            return (
              <Link key={s} href={`/product/${s}`} data-cursor="View">
                <span className="im"><Pic img={p.images[0]} alt="" /></span>
                <b>{p.name}</b>
                <span className="tnum" style={{ color: "var(--red)" }}>{inr(p.price)}</span>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export default function Lookbook() {
  return (
    <main>
      <PageBanner title="Lookbook" crumb="Lookbook" />
      <div className="wrap">
        {LOOKS.map((l, i) => <Look key={l.name} l={l} flip={i % 2 === 1} />)}
        <div style={{ textAlign: "center", padding: "20px 0 120px" }}><Btn href="/build-a-look" variant="red">Build your own look</Btn></div>
      </div>
    </main>
  );
}
