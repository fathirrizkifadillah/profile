"use client";

import type { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Minimalist Midnight Monochrome surface card.
 * Strictly obeys GRADIENT: disabled & NEON: disabled — uses crisp border shift
 * and subtle flat surface lift on hover instead of radial glows.
 */
export function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  return (
    <div
      className={`relative overflow-hidden transition-[border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-hairline-strong ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
