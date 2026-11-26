"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  className?: string;
}

/**
 * React Bits-inspired Magnet wrapper for tactile primary CTAs.
 * Automatically disabled on touch devices and prefers-reduced-motion.
 */
export function Magnet({
  children,
  padding = 44,
  magnetStrength = 6,
  className = "",
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!canHover || reduced) return;

    const handleMouseMove = (event: MouseEvent) => {
      const node = wrapperRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setActive(true);
        setOffset({
          x: (event.clientX - centerX) / magnetStrength,
          y: (event.clientY - centerY) / magnetStrength,
        });
      } else {
        setActive(false);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, magnetStrength]);

  return (
    <div ref={wrapperRef} className={`inline-block ${className}`}>
      <div
        style={{
          transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
          transition: active
            ? "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)"
            : "transform 420ms cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: active ? "transform" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
