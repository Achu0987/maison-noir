"use client";
import { motion } from "motion/react";

const STEPS = ["Placed", "Packed", "Shipped", "Delivered"] as const;
const NOTES: Record<string, string> = {
  Placed: "We have your order",
  Packed: "Checked and folded",
  Shipped: "On its way to you",
  Delivered: "Enjoy the fit",
};

export default function Timeline({ status }: { status: string }) {
  const idx = Math.max(0, STEPS.indexOf(status as (typeof STEPS)[number]));
  return (
    <ol className="tl" aria-label="Order progress">
      <li className="tl-line" aria-hidden="true"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: idx / (STEPS.length - 1) }} transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} /></li>
      {STEPS.map((s, i) => (
        <motion.li key={s} className={"tl-step" + (i <= idx ? " done" : "") + (i === idx ? " now" : "")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} aria-current={i === idx ? "step" : undefined}>
          <span className="tl-dot">{i <= idx ? "✓" : ""}</span>
          <b>{s}</b>
          <span>{NOTES[s]}</span>
        </motion.li>
      ))}
    </ol>
  );
}
