"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor navigation through Lenis
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      if (hash === "#top") {
        event.preventDefault();
        lenis.scrollTo(0, { duration: 1.1 });
        return;
      }
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -20, duration: 1.15 });
    };

    const handleCustomScroll = (event: Event) => {
      const custom = event as CustomEvent<{ target?: string }>;
      const targetStr = custom.detail?.target;
      if (!targetStr) return;
      if (targetStr === "#top" || targetStr === "top") {
        lenis.scrollTo(0, { duration: 1.1 });
        return;
      }
      const el = document.querySelector<HTMLElement>(targetStr);
      if (el) {
        lenis.scrollTo(el, { offset: -20, duration: 1.15 });
      }
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("vedora:scroll-to", handleCustomScroll);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    return () => {
      window.clearTimeout(refreshTimer);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("vedora:scroll-to", handleCustomScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
