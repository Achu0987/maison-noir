"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "motion/react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Template({ children }: { children: React.ReactNode }) {
  const [wipe, setWipe] = useState(false);
  useIso(() => {
    const w = window as unknown as { __mnNav?: boolean };
    if (w.__mnNav) setWipe(true);
    w.__mnNav = true;
  }, []);
  return (
    <>
      {wipe && (
        <div className="route-wipe" aria-hidden="true">
          <motion.i initial={{ y: 0 }} animate={{ y: "-101%" }} transition={{ duration: 0.9, delay: 0.05, ease: [0.76, 0, 0.24, 1] }} />
          <motion.i initial={{ y: 0 }} animate={{ y: "-101%" }} transition={{ duration: 0.9, delay: 0.18, ease: [0.76, 0, 0.24, 1] }} />
        </div>
      )}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
