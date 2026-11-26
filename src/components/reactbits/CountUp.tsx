"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * React Bits-inspired CountUp component using Framer Motion spring interpolation.
 */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  duration = 1.2,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });

  const motionVal = useMotionValue(prefersReducedMotion ? to : from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springVal = useSpring(motionVal, { damping, stiffness });

  useEffect(() => {
    if (prefersReducedMotion) {
      if (ref.current) {
        ref.current.textContent = to.toFixed(decimals);
      }
      return;
    }

    if (inView) {
      motionVal.set(to);
    }
  }, [inView, motionVal, to, decimals, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Number(latest).toFixed(decimals);
      }
    });

    return () => unsubscribe();
  }, [springVal, decimals, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefersReducedMotion ? to.toFixed(decimals) : from.toFixed(decimals)}
    </span>
  );
}
