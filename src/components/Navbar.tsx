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
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-gradient-to-r from-accent via-vision to-iot"
      />

      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="mx-auto max-w-[1280px]">
          <nav
            aria-label="Primary navigation"
            className="mx-auto flex items-center justify-between gap-4 rounded-full border border-ink/[0.11] bg-plate/90 px-3 py-2 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl md:w-max md:gap-7 md:px-4"
          >
            <a
              href="#top"
              className="group flex min-h-[40px] items-center gap-2.5 rounded-full pl-1 pr-2 text-ink transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-plate shadow-[0_6px_14px_-4px_rgba(29,78,216,0.55)] transition-colors group-hover:bg-accent-hover">
                V
              </span>
              <span className="font-mono text-xs font-semibold tracking-tight text-ink">
                vedora.my.id
              </span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-flex min-h-[38px] items-center rounded-full px-3.5 text-sm font-medium text-ink-secondary transition-all duration-200 hover:bg-accent-soft hover:text-accent"
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
                className="flex items-center rounded-full border border-hairline bg-recess p-1"
              >
                {(["en", "id"] as const).map((code) => {
                  const active = locale === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLocaleChange(code)}
                      aria-pressed={active}
                      className={`min-h-[32px] min-w-[38px] cursor-pointer rounded-full px-2.5 font-mono text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        active
                          ? "bg-accent text-plate shadow-[0_4px_12px_-3px_rgba(29,78,216,0.55)]"
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
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-hairline bg-recess text-ink transition-colors hover:border-accent hover:bg-accent-soft md:hidden"
              >
                <span
                  className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                  }`}
                />
                <span
                  className={`absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                  }`}
                />
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                className="mt-2.5 overflow-hidden rounded-[22px] border border-ink/[0.1] bg-plate/95 p-3 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl md:hidden"
              >
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: idx * 0.04,
                        duration: 0.25,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-[46px] items-center justify-between rounded-xl px-4 text-base font-medium text-ink transition-colors hover:bg-accent-soft hover:text-accent"
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
