"use client";

import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { UI_COPY, type Locale } from "@/data/profile";
import { DecryptedText } from "./reactbits/DecryptedText";

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
}

const NAV_ITEMS = [
  { id: "work", key: "work" },
  { id: "systems", key: "systems" },
  { id: "timeline", key: "timeline" },
  { id: "contact", key: "contact" },
] as const;

export function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Single calibrated Champagne Gold hairline scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-accent"
      />

      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto max-w-[1280px]">
          <nav
            aria-label="Primary navigation"
            className="mx-auto flex items-center justify-between gap-4 rounded-[12px] border border-hairline bg-plate/92 px-3 py-2 backdrop-blur-md md:w-max md:gap-6 md:px-3.5"
          >
            <a
              href="#top"
              className="group flex min-h-[38px] items-center gap-2.5 rounded-[8px] px-1.5 text-ink transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-hairline bg-bench p-1 transition-colors duration-150 group-hover:border-accent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/elements/vedora_logo_gold.png"
                  alt="Vedora logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <DecryptedText
                text="vedora.my.id"
                className="font-mono text-xs font-semibold tracking-tight text-ink"
              />
            </a>

            <ul className="hidden items-center gap-0.5 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-[36px] items-center rounded-[8px] px-3 text-sm font-medium text-ink-secondary transition-[background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-recess hover:text-ink"
                  >
                    {UI_COPY.nav[item.key][locale]}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <div
                role="group"
                aria-label="Language switch"
                className="flex items-center rounded-[8px] border border-hairline bg-bench p-0.5"
              >
                {(["en", "id"] as const).map((code) => {
                  const active = locale === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLocaleChange(code)}
                      aria-pressed={active}
                      className={`min-h-[30px] min-w-[36px] cursor-pointer rounded-[6px] px-2.5 font-mono text-[11px] font-bold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] ${
                        active
                          ? "bg-accent text-bench"
                          : "bg-transparent text-ink-secondary hover:bg-recess hover:text-ink"
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-label={
                  menuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] border border-hairline bg-recess text-ink transition-[border-color,transform] duration-150 hover:border-accent active:scale-[0.96] md:hidden"
              >
                <span
                  className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                  }`}
                />
                <span
                  className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                  }`}
                />
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: "top center" }}
                className="mt-2 overflow-hidden rounded-[12px] border border-hairline bg-plate/96 p-2.5 backdrop-blur-md md:hidden"
              >
                <ul className="flex flex-col gap-0.5">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: idx * 0.03,
                        duration: 0.18,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-[44px] items-center justify-between rounded-[8px] px-3.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-recess hover:text-accent"
                      >
                        <span>{UI_COPY.nav[item.key][locale]}</span>
                        <span className="font-mono text-xs text-ink-muted">
                          #{item.id}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
