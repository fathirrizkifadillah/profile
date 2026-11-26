"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * React Bits-inspired SpotlightCard calibrated to our warm terracotta stone palette.
 * Uses compositor-only opacity reveal on pointer hover; silent on touch devices.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(184, 74, 39, 0.085)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          opacity,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 72%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
