"use client";

import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { UI_COPY, type Locale } from "@/data/profile";

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
}

const NAV_ITEMS = [
  { id: "work", key: "work" },
  { id: "systems", key: "systems" },
  { id: "timeline", key: "timeline" },
  { id: "credentials", key: "credentials" },
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
      {/* Single calibrated accent hairline scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 right-0 left-0 z-50 h-[2px] origin-left bg-accent"
      />

      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto max-w-[1280px]">
          <nav
            aria-label="Primary navigation"
            className="mx-auto flex items-center justify-between gap-4 rounded-[14px] border border-hairline bg-plate/90 px-3 py-2 shadow-[0_8px_24px_-16px_rgba(26,25,23,0.16)] backdrop-blur-md md:w-max md:gap-6 md:px-3.5"
          >
            <a
              href="#top"
              className="group flex min-h-[38px] items-center gap-2.5 rounded-[8px] px-1.5 text-ink transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-ink font-display text-xs font-bold text-plate transition-colors duration-200 group-hover:bg-accent">
                V
              </span>
              <span className="font-mono text-xs font-semibold tracking-tight text-ink">
                vedora.my.id
              </span>
            </a>

            <ul className="hidden items-center gap-0.5 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-[36px] items-center rounded-[8px] px-3 text-sm font-medium text-ink-secondary transition-[background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-recess/70 hover:text-ink"
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
                className="flex items-center rounded-[9px] bg-recess p-1"
              >
                {(["en", "id"] as const).map((code) => {
                  const active = locale === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLocaleChange(code)}
                      aria-pressed={active}
                      className={`min-h-[30px] min-w-[36px] cursor-pointer rounded-[7px] px-2.5 font-mono text-[11px] font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] ${
                        active
                          ? "bg-ink text-plate"
                          : "bg-transparent text-ink-secondary hover:text-ink"
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
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] bg-recess text-ink transition-[background-color,transform] duration-150 hover:bg-recess/80 active:scale-[0.96] md:hidden"
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
                className="mt-2 overflow-hidden rounded-[14px] border border-hairline bg-plate/95 p-2.5 shadow-[0_16px_36px_-20px_rgba(26,25,23,0.2)] backdrop-blur-md md:hidden"
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
                        className="flex min-h-[44px] items-center justify-between rounded-[9px] px-3.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-recess/80"
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
