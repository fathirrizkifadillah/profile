"use client";

import { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  className?: string;
  speedMs?: number;
}

const GLYPHS = "ABCDEF0123456789/_-.@#";

/**
 * React Bits-inspired DecryptedText (hover-activated for crisp technical identifiers).
 * Keeps initial text 100% readable for SEO and accessibility, decodes smoothly on hover.
 */
export function DecryptedText({
  text,
  className = "",
  speedMs = 24,
}: DecryptedTextProps) {
  const [scrambled, setScrambled] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  function startDecode() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    let revealed = 0;
    timerRef.current = window.setInterval(() => {
      revealed += 1;
      if (revealed >= text.length) {
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setScrambled(null);
        return;
      }

      const next = text
        .split("")
        .map((char, idx) => {
          if (char === " " || idx < revealed) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setScrambled(next);
    }, speedMs);
  }

  return (
    <span
      onMouseEnter={startDecode}
      className={className}
      aria-label={text}
    >
      {scrambled ?? text}
    </span>
  );
}
