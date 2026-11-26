"use client";

import { motion, useReducedMotion } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delayMs?: number;
  as?: "h1" | "h2" | "p" | "span";
}

/**
 * React Bits-inspired BlurText component.
 * Animates word-by-word with subtle GPU-friendly blur (<= 8px) and vertical rise.
 */
export function BlurText({
  text,
  className = "",
  delayMs = 42,
  as = "h1",
}: BlurTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, idx) => (
        <motion.span
          key={`${text}-${idx}-${word}`}
          initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.42,
            delay: (idx * delayMs) / 1000,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="inline-block will-change-[transform,opacity,filter]"
        >
          {word}
          {idx < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
