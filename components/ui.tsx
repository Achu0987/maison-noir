"use client";
import Link from "next/link";
import { createElement, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Img } from "@/lib/products";

export function Pic({ img, alt = "", className, eager }: { img: Img; alt?: string; className?: string; eager?: boolean }) {
  return (
    <img
      className={className} src={img.src} alt={alt} width={900} height={1125}
      loading={eager ? "eager" : "lazy"}
      style={{ objectPosition: img.pos, ["--s" as string]: img.scale ?? 1 }}
    />
  );
}

export function Split({
  text, tag = "h2", className, delay = 0, stagger = 0.06, immediate = false, dur = 1,
}: { text: string; tag?: "h1" | "h2" | "h3" | "p" | "div"; className?: string; delay?: number; stagger?: number; immediate?: boolean; dur?: number }) {
  const words = text.split(" ");
  return createElement(
    tag,
    { className, "aria-label": text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <motion.span
          className="mask"
          initial="h"
          {...(immediate ? { animate: "s" } : { whileInView: "s", viewport: { once: true, margin: "0px 0px 8% 0px" } })}
        >
          <motion.span
            variants={{ h: { y: "112%" }, s: { y: 0, transition: { duration: dur, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] } } }}
          >
            {w}
          </motion.span>
        </motion.span>
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}

export function Reveal({ children, delay = 0, y = 30, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      data-reveal className={className}
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const MLink = motion.create(Link);
export function Btn({
  href, children, variant = "", onClick, type, disabled, full,
}: { href?: string; children: string; variant?: "" | "red" | "light" | "ghost"; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; full?: boolean }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const leave = () => { x.set(0); y.set(0); };
  const cls = `btn ${variant} ${full ? "full" : ""}`;
  const inner = (<span className="roll"><span>{children}</span><span aria-hidden="true">{children}</span></span>);
  if (href) return <MLink href={href} className={cls} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} onClick={onClick}>{inner}</MLink>;
  return (
    <motion.button ref={ref as React.RefObject<HTMLButtonElement>} type={type ?? "button"} className={cls} disabled={disabled} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} onClick={onClick}>
      {inner}
    </motion.button>
  );
}

export function Icon({ n }: { n: string }) {
  const p: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    left: <path d="M15 5l-7 7 7 7" />,
    right: <path d="M9 5l7 7-7 7" />,
    close: <path d="M5 5l14 14M19 5L5 19" />,
    truck: <><path d="M2 7h11v9H2zM13 10h5l3 3v3h-8" /><circle cx="6.5" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" /></>,
    support: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1" /><rect x="17" y="14" width="4" height="6" rx="1" /><path d="M19 20c0 1.5-2 2-5 2" /></>,
    return: <><path d="M4 12a8 8 0 1 0 3-6.2" /><path d="M4 4v4h4" /><path d="m9 12 2 2 4-4" /></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{p[n]}</svg>;
}
