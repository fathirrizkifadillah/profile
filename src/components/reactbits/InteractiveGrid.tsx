"use client";

import { useEffect, useRef } from "react";

interface PulseWave {
  col: number;
  row: number;
  startTime: number;
  maxRadius: number;
  duration: number;
}

/**
 * Interactive Architectural Grid (React Bits Squares/DotGrid-inspired).
 * Midnight Monochrome calibration: #292929 subtle lines, #1C1C1C hover cell,
 * and damped Champagne Gold (#C8A96B) ripple waves when pressing/clicking anywhere.
 * Stops RAF completely when idle (0% idle CPU).
 */
export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const CELL = 48;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let hoverCol = -1;
    let hoverRow = -1;
    const waves: PulseWave[] = [];
    let rafId: number | null = null;

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(performance.now());
    }

    function drawFrame(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / CELL) + 1;
      const rows = Math.ceil(height / CELL) + 1;

      // 1. Crisp minimalist architectural grid lines (#292929 at subtle opacity)
      ctx.strokeStyle = "rgba(41, 41, 41, 0.42)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * CELL + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * CELL + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Subtle hover cell highlight (fine pointers)
      if (!prefersReducedMotion && hoverCol >= 0 && hoverRow >= 0) {
        const hx = hoverCol * CELL;
        const hy = hoverRow * CELL;
        ctx.fillStyle = "rgba(28, 28, 28, 0.72)";
        ctx.fillRect(hx + 1, hy + 1, CELL - 1, CELL - 1);
        ctx.strokeStyle = "rgba(200, 169, 107, 0.28)";
        ctx.strokeRect(hx + 0.5, hy + 0.5, CELL, CELL);
      }

      // 3. Active click/press concentric grid wave ripples (Champagne Gold, flat, zero neon)
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        const elapsed = now - wave.startTime;
        const progress = elapsed / wave.duration;

        if (progress >= 1) {
          waves.splice(i, 1);
          continue;
        }

        // Strong ease-out expansion
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRadius = eased * wave.maxRadius;
        const bandWidth = 1.45;
        const fade = Math.pow(1 - progress, 1.4);

        const minC = Math.max(0, Math.floor(wave.col - currentRadius - 2));
        const maxC = Math.min(cols, Math.ceil(wave.col + currentRadius + 2));
        const minR = Math.max(0, Math.floor(wave.row - currentRadius - 2));
        const maxR = Math.min(rows, Math.ceil(wave.row + currentRadius + 2));

        for (let c = minC; c <= maxC; c++) {
          for (let r = minR; r <= maxR; r++) {
            const dist = Math.hypot(c - wave.col, r - wave.row);
            const delta = Math.abs(dist - currentRadius);
            if (delta < bandWidth) {
              const strength = (1 - delta / bandWidth) * fade;
              const x = c * CELL;
              const y = r * CELL;
              ctx.fillStyle = `rgba(200, 169, 107, ${(strength * 0.2).toFixed(3)})`;
              ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1);
              ctx.strokeStyle = `rgba(200, 169, 107, ${(strength * 0.45).toFixed(3)})`;
              ctx.strokeRect(x + 0.5, y + 0.5, CELL, CELL);
            }
          }
        }
      }

      if (waves.length > 0) {
        rafId = window.requestAnimationFrame(drawFrame);
      } else {
        rafId = null;
      }
    }

    function scheduleDraw() {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || prefersReducedMotion) return;
      const nextCol = Math.floor(event.clientX / CELL);
      const nextRow = Math.floor(event.clientY / CELL);
      if (nextCol !== hoverCol || nextRow !== hoverRow) {
        hoverCol = nextCol;
        hoverRow = nextRow;
        scheduleDraw();
      }
    }

    function onPointerLeave() {
      if (hoverCol !== -1 || hoverRow !== -1) {
        hoverCol = -1;
        hoverRow = -1;
        scheduleDraw();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (prefersReducedMotion) return;
      const col = Math.floor(event.clientX / CELL);
      const row = Math.floor(event.clientY / CELL);
      waves.push({
        col,
        row,
        startTime: performance.now(),
        maxRadius: 5.5,
        duration: 680,
      });
      // Cap concurrent ripples to keep 60fps under rapid clicking
      if (waves.length > 5) {
        waves.shift();
      }
      scheduleDraw();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
