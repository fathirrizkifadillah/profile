"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  EnvelopeSimple,
  LockSimple,
  MapPin,
} from "@phosphor-icons/react";
import { UI_COPY, type Locale } from "@/data/profile";
import type { GitHubTelemetry } from "@/lib/github";
import type { ProfileContent } from "@/types/profile-content";
import { CopyEmailButton } from "./CopyEmailButton";
import { GitHubPulseSection } from "./GitHubPulseSection";
import { Navbar } from "./Navbar";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { SocialIcon, type SocialPlatform } from "./SocialIcons";
import { BlurText } from "./reactbits/BlurText";
import { CountUp } from "./reactbits/CountUp";
import { DecryptedText } from "./reactbits/DecryptedText";
import { InteractiveGrid } from "./reactbits/InteractiveGrid";
import { Magnet } from "./reactbits/Magnet";

gsap.registerPlugin(ScrollTrigger);

interface PortfolioShellProps {
  content: ProfileContent;
  telemetry: GitHubTelemetry;
}

function InlineSpecList({ items }: { items: string[] }) {
  return (
    <p className="font-mono text-xs leading-relaxed text-ink-muted">
      {items.map((item, idx) => (
        <span key={item}>
          <span className="text-ink-silver">{item}</span>
          {idx < items.length - 1 ? (
            <span aria-hidden="true" className="mx-1.5 text-ink-muted">
              /
            </span>
          ) : null}
        </span>
      ))}
    </p>
  );
}

/**
 * Strips legacy university/GPA/certificate/n8n mentions if cached Redis JSON still contains them.
 */
function sanitizeLegacyCopy(text: string, fallback: string): string {
  if (/universitas siliwangi|gpa|ipk|oracle|dicoding|\bn8n\b/i.test(text)) {
    return fallback;
  }
  return text;
}

export function PortfolioShell({ content, telemetry }: PortfolioShellProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const risingBodyRef = useRef<HTMLDivElement | null>(null);
  const contactSlabRef = useRef<HTMLDivElement | null>(null);

  const emailHref = `mailto:${content.meta.email}`;

  const heroStatus = sanitizeLegacyCopy(
    content.hero.status[locale],
    UI_COPY.hero.status[locale]
  );
  const heroIntro = sanitizeLegacyCopy(
    content.hero.intro[locale],
    UI_COPY.hero.intro[locale]
  );

  // Sanitize legacy n8n / campus items from cached Redis JSON
  const cleanedFocus = content.currentFocus.map((track) => ({
    ...track,
    text: {
      en: /\bn8n\b/i.test(track.text.en)
        ? "Shipping practical AI applications backed by clean APIs and reproducible infrastructure."
        : track.text.en,
      id: /\bn8n\b/i.test(track.text.id)
        ? "Merilis aplikasi AI praktis yang didukung API bersih dan infrastruktur yang rapi."
        : track.text.id,
    },
  }));

  const cleanedStackGroups = content.stackGroups.map((group) => ({
    ...group,
    label: {
      en: group.label.en.replace(/,?\s*Automation/i, ""),
      id: group.label.id.replace(/,?\s*Otomasi/i, ""),
    },
    items: group.items.filter((item) => !/\bn8n\b/i.test(item)),
  }));

  const cleanedCapabilities = content.capabilities.map((band) => ({
    ...band,
    summary: {
      en: band.summary.en.replace(/and API-driven n8n automation/gi, "and real-time device telemetry"),
      id: band.summary.id.replace(/dan otomasi API n8n/gi, "dan telemetri perangkat real-time"),
    },
    tools: band.tools.filter((tool) => !/\bn8n\b/i.test(tool)),
  }));

  const filteredExperiences = content.experiences.map((item) => ({
    ...item,
    organization: /universitas siliwangi/i.test(item.organization)
      ? item.id === "maunc-lead"
        ? "MAUNC IoT Community"
        : "Applied Systems Team"
      : item.organization,
    description: {
      en: item.description.en.replace(/\s*at Universitas Siliwangi/gi, ""),
      id: item.description.id.replace(/\s*Universitas Siliwangi/gi, ""),
    },
  }));

  const filteredFoundations = content.education
    .filter(
      (item) =>
        !/unsil-informatics/i.test(item.id) &&
        !/gpa|ipk|universitas siliwangi/i.test(
          `${item.role.en} ${item.organization}`
        )
    )
    .map((item) => ({
      ...item,
      description: {
        en: item.description.en.replace(/,?\s*n8n workflow automation/gi, ""),
        id: item.description.id.replace(/,?\s*otomasi n8n/gi, ""),
      },
      skills: item.skills.filter((s) => !/\bn8n\b/i.test(s)),
    }));

  const socialLinks: Array<{
    platform: SocialPlatform;
    label: string;
    href: string;
  }> = [
    { platform: "github", label: "GitHub", href: content.meta.links.github },
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: content.meta.links.linkedin,
    },
    { platform: "kaggle", label: "Kaggle", href: content.meta.links.kaggle },
    {
      platform: "instagram",
      label: "Instagram",
      href: content.meta.links.instagram,
    },
  ];

  // GSAP ScrollTrigger choreography: smooth Hero depth recession + Rising lower sheets
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop:
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        isMobile:
          "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { isDesktop } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        // 1. Desktop Curtain: as lower Obsidian sheet rises up, compact Hero gently recedes
        if (isDesktop && heroInnerRef.current && risingBodyRef.current) {
          gsap.to(heroInnerRef.current, {
            y: -36,
            scale: 0.96,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: {
              trigger: risingBodyRef.current,
              start: "top bottom",
              end: "top 18%",
              scrub: true,
            },
          });
        }

        // 2. Rising architectural sections: lower sections smoothly lift upward on scroll
        const riseSections = gsap.utils.toArray<HTMLElement>(
          "[data-rise-section]",
          root
        );
        riseSections.forEach((section) => {
          gsap.fromTo(
            section,
            { y: isDesktop ? 48 : 22 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 52%",
                scrub: 0.5,
              },
            }
          );
        });

        // 3. Contact architectural slab upward lift
        if (contactSlabRef.current) {
          gsap.fromTo(
            contactSlabRef.current,
            {
              y: isDesktop ? 64 : 28,
              scale: isDesktop ? 0.97 : 0.99,
            },
            {
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: contactSlabRef.current,
                start: "top bottom",
                end: "top 60%",
                scrub: 0.6,
              },
            }
          );
        }
      },
      root
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <SmoothScrollProvider>
      <div
        id="top"
        ref={rootRef}
        className="relative isolate flex min-h-screen flex-col bg-bench text-ink"
      >
        {/* Full-viewport Interactive Reactive Grid (responds on hover & click/tap) */}
        <InteractiveGrid />

        <Navbar locale={locale} onLocaleChange={setLocale} />

        <main className="relative z-10 flex-1">
          {/* HERO — Compact above-the-fold composition so 100% fits on 1366x768 & 1440x900 */}
          <section className="relative z-0 flex min-h-[calc(100dvh-5.25rem)] items-center py-8 sm:py-10 lg:sticky lg:top-16 lg:py-8">
            <div
              ref={heroInnerRef}
              className="mx-auto w-full max-w-[1280px] px-4 will-change-transform sm:px-6 lg:px-8"
            >
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="lg:col-span-7"
                >
                  {/* Brand Identity with new Vedora Logo (ZERO green dots) */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-plate p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/elements/vedora_logo_light.png"
                        alt={`${content.meta.alias} brand logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-display font-semibold text-ink">
                          {content.meta.alias}
                        </span>
                        <span aria-hidden="true" className="text-ink-muted">
                          /
                        </span>
                        <a
                          href={content.meta.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-link font-mono text-xs text-ink-secondary transition-colors duration-150 hover:text-accent"
                        >
                          <DecryptedText
                            text={`@${content.meta.githubUsername}`}
                          />
                        </a>
                      </div>
                      <p className="mt-0.5 font-mono text-xs font-medium text-accent">
                        {heroStatus}
                      </p>
                    </div>
                  </div>

                  {/* React Bits BlurText Headline */}
                  <BlurText
                    key={`headline-${locale}`}
                    text={content.hero.headline[locale]}
                    className="mt-6 max-w-[19ch] font-display text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.3rem]"
                  />

                  <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.68] text-ink-secondary sm:text-base">
                    {heroIntro}
                  </p>

                  {/* Distinct High-Contrast CTA Hierarchy: Champagne Gold Primary + Graphite Secondary */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Magnet padding={38} magnetStrength={6}>
                      <a
                        href="#work"
                        className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-accent px-5 text-sm font-bold text-bench transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
                      >
                        <span>{content.hero.primaryCta[locale]}</span>
                        <ArrowDownRight
                          size={16}
                          weight="bold"
                          className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                        />
                      </a>
                    </Magnet>

                    <CopyEmailButton
                      email={content.meta.email}
                      label={UI_COPY.hero.copyEmail[locale]}
                      copiedLabel={UI_COPY.hero.copied[locale]}
                    />
                  </div>

                  {/* Clean 4-column Engineering Metrics Strip (NO University / NO GPA) */}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-5 sm:grid-cols-4">
                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        GitHub
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
                        <CountUp to={telemetry.publicRepos} />{" "}
                        <span className="font-mono text-xs font-normal text-ink-muted">
                          repos
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        {locale === "en" ? "Shipped" : "Dirilis"}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
                        <CountUp to={content.projects.length} />{" "}
                        <span className="font-mono text-xs font-normal text-ink-muted">
                          {locale === "en" ? "systems" : "sistem"}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        {locale === "en" ? "Focus" : "Fokus"}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-ink">
                        AI{" "}
                        <span className="font-mono text-xs font-semibold text-accent">
                          + IoT
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        MAUNC Community
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-ink">
                        IoT{" "}
                        <span className="font-mono text-xs font-semibold text-accent">
                          Lead
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* Social Links WITH Platform Logos */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link group inline-flex min-h-[36px] items-center gap-2 text-xs font-semibold text-ink-silver transition-colors duration-150 hover:text-accent"
                      >
                        <SocialIcon platform={social.platform} size={15} />
                        <span>{social.label}</span>
                        <ArrowUpRight
                          size={12}
                          weight="bold"
                          className="text-ink-muted transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                        />
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Hero Right: Bespoke Fedora Cat Showcase (vedora_cat.png) */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.52,
                    delay: 0.08,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="lg:col-span-5"
                >
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="relative overflow-hidden rounded-[14px] border border-hairline bg-plate"
                  >
                    {/* Architectural Champagne Gold Corner Registration Marks */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-accent/60"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-accent/60"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/60"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-accent/60"
                    />

                    <div className="flex items-center justify-between border-b border-hairline px-5 py-3 font-mono text-[11px]">
                      <span className="text-ink-silver">
                        <DecryptedText text="VEDORA // IDENTITY" />
                      </span>
                      <span className="text-accent">01</span>
                    </div>

                    <div className="flex aspect-[5/4] items-center justify-center bg-bench p-6 sm:p-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/elements/vedora_cat_clean.png"
                        alt="Vedora Fedora Cat Mascot"
                        className="max-h-[300px] w-auto object-contain select-none"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline px-5 py-3 font-mono text-[11px] text-ink-muted">
                      <span>AI / EDGE VISION / IOT</span>
                      <span className="text-ink-silver">
                        {locale === "en" ? "Click grid to pulse" : "Klik grid untuk efek"}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* RISING LOWER PAGE CONTAINER — glides smoothly UP over the compact Hero */}
          <div ref={risingBodyRef} className="relative z-10">
            {/* GITHUB BANNER (HD), INTERACTIVE BENCH, PULSE & STACK */}
            {content.meta.showGitHubPulse ? (
              <GitHubPulseSection
                locale={locale}
                telemetry={telemetry}
                currentFocus={cleanedFocus}
                stackGroups={cleanedStackGroups}
                githubUrl={content.meta.links.github}
                alias={content.meta.alias}
                showBanner={content.meta.showBanner}
                bannerUrl={content.meta.bannerUrl}
              />
            ) : null}

            {/* SELECTED WORK */}
            <ProjectsShowcase locale={locale} projects={content.projects} />

            {/* SYSTEMS & CAPABILITIES — Sticky 4/8 split */}
            <section
              id="systems"
              data-rise-section
              className="relative z-20 scroll-mt-28 border-t border-hairline bg-plate py-20 sm:py-28"
            >
              <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
                  >
                    <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                      {UI_COPY.systems.heading[locale]}
                    </h2>
                    <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-secondary">
                      {UI_COPY.systems.lead[locale]}
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4 border-t border-hairline pt-6 font-mono tabular-nums">
                      <div>
                        <div className="text-xl font-bold text-ink">
                          <CountUp to={telemetry.publicRepos} />
                        </div>
                        <div className="mt-1 font-sans text-xs text-ink-muted">
                          {UI_COPY.systems.stats[0].label[locale]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-ink">
                          <CountUp to={content.projects.length} />
                        </div>
                        <div className="mt-1 font-sans text-xs text-ink-muted">
                          {UI_COPY.systems.stats[1].label[locale]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-accent">
                          <CountUp to={telemetry.languages.length} />
                        </div>
                        <div className="mt-1 font-sans text-xs text-ink-muted">
                          {UI_COPY.systems.stats[2].label[locale]}
                        </div>
                      </div>
                    </div>

                    <blockquote className="mt-8 border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-ink-silver">
                      &ldquo;{content.meta.motto}&rdquo;
                    </blockquote>
                  </motion.div>

                  <div className="divide-y divide-hairline border-t border-b border-hairline lg:col-span-8">
                    {cleanedCapabilities.map((band, idx) => (
                      <motion.div
                        key={band.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.38,
                          delay: idx * 0.04,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="py-7 sm:py-8"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-xs font-semibold tabular-nums text-accent">
                              0{idx + 1}
                            </span>
                            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                              {band.title[locale]}
                            </h3>
                          </div>
                          <span className="font-mono text-xs text-ink-muted">
                            {band.highlightMetric}
                          </span>
                        </div>
                        <p className="mt-2.5 max-w-[64ch] text-[15px] leading-relaxed text-ink-secondary">
                          {band.summary[locale]}
                        </p>
                        <div className="mt-4">
                          <InlineSpecList items={band.tools} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* TIMELINE — Leadership & Engineering (NO University / GPA clutter) */}
            <section
              id="timeline"
              data-rise-section
              className="relative z-20 scroll-mt-28 border-t border-hairline bg-bench py-20 sm:py-28"
            >
              <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-[60ch]"
                >
                  <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                    {UI_COPY.timeline.heading[locale]}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink-secondary">
                    {UI_COPY.timeline.subtitle[locale]}
                  </p>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-accent uppercase">
                      {UI_COPY.timeline.experienceCol[locale]}
                    </h3>
                    <ol className="mt-4 divide-y divide-hairline border-t border-b border-hairline">
                      {filteredExperiences.map((item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.36,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                          className="py-6"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="font-display text-lg font-semibold text-ink">
                              {item.role[locale]}
                            </h4>
                            <span className="font-mono text-xs tabular-nums text-accent">
                              {item.period[locale]}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-ink-secondary">
                            <span className="font-semibold text-ink-silver">
                              {item.organization}
                            </span>
                            <span aria-hidden="true" className="text-ink-muted">
                              /
                            </span>
                            <span className="text-ink-muted">
                              {item.location}
                            </span>
                          </div>
                          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-secondary">
                            {item.description[locale]}
                          </p>
                          <div className="mt-3.5">
                            <InlineSpecList items={item.skills} />
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-ink-silver uppercase">
                      {UI_COPY.timeline.educationCol[locale]}
                    </h3>
                    <ol className="mt-4 divide-y divide-hairline border-t border-b border-hairline">
                      {filteredFoundations.map((item) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.36,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                          className="py-6"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h4 className="font-display text-lg font-semibold text-ink">
                              {item.role[locale]}
                            </h4>
                            <span className="font-mono text-xs tabular-nums text-ink-muted">
                              {item.period[locale]}
                            </span>
                          </div>
                          <div className="mt-1 text-sm font-semibold text-ink-silver">
                            {item.organization}
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                            {item.description[locale]}
                          </p>
                          <div className="mt-3.5">
                            <InlineSpecList items={item.skills} />
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACT — Rising Architectural Obsidian Slab with Platform Logos */}
            <section
              id="contact"
              className="relative z-20 scroll-mt-28 border-t border-hairline bg-bench py-20 sm:py-28"
            >
              <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div
                  ref={contactSlabRef}
                  className="overflow-hidden rounded-[16px] border border-hairline bg-plate will-change-transform"
                >
                  {/* Crisp flat Champagne Gold top rule (zero gradient) */}
                  <div className="h-[2px] w-full bg-accent" />

                  <div className="p-7 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                      <div className="lg:col-span-7">
                        <p className="font-mono text-xs text-accent">
                          {content.meta.alias} / {content.meta.domain}
                        </p>
                        <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                          {content.contact.heading[locale]}
                        </h2>
                        <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-ink-secondary">
                          {content.contact.body[locale]}
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <Magnet padding={38} magnetStrength={6}>
                            <a
                              href={emailHref}
                              className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-accent px-5 text-sm font-bold text-bench transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
                            >
                              <EnvelopeSimple size={17} weight="bold" />
                              <span>{UI_COPY.contact.directEmail[locale]}</span>
                            </a>
                          </Magnet>

                          <CopyEmailButton
                            email={content.meta.email}
                            label={UI_COPY.hero.copyEmail[locale]}
                            copiedLabel={UI_COPY.hero.copied[locale]}
                            variant="inline-dark"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-hairline pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                        <div className="flex items-center gap-2 text-sm text-ink-silver">
                          <MapPin
                            size={16}
                            weight="bold"
                            className="text-accent"
                          />
                          <span>{content.meta.location[locale]}</span>
                        </div>

                        <div className="divide-y divide-hairline border-t border-b border-hairline text-sm">
                          {socialLinks.map((social) => (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex min-h-[46px] items-center justify-between py-2 text-ink-silver transition-colors duration-150 hover:text-ink"
                            >
                              <span className="inline-flex items-center gap-3 font-medium">
                                <span className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-hairline bg-bench text-ink-silver transition-[border-color,color] duration-150 group-hover:border-accent group-hover:text-accent">
                                  <SocialIcon
                                    platform={social.platform}
                                    size={15}
                                  />
                                </span>
                                <span>{social.label}</span>
                              </span>
                              <ArrowUpRight
                                size={15}
                                weight="bold"
                                className="text-ink-muted transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                              />
                            </a>
                          ))}
                        </div>

                        <p className="font-mono text-xs text-ink-muted">
                          {content.meta.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="relative z-20 border-t border-hairline bg-bench py-8">
              <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/elements/vedora_logo_gold.png"
                    alt="Vedora"
                    className="h-5 w-5 object-contain"
                  />
                  <span className="font-display font-semibold text-ink">
                    {content.meta.fullName}
                  </span>
                  <span aria-hidden="true" className="text-ink-muted">
                    /
                  </span>
                  <span className="font-mono text-ink-silver">
                    {content.meta.alias}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono">
                  <span>{content.meta.domain}</span>
                  <span className="text-accent">MAUNC IoT Lead</span>
                  <Link
                    href="/admin"
                    aria-label="Owner studio login"
                    title="Owner studio"
                    className="editorial-link inline-flex items-center gap-1.5 text-ink-silver transition-colors duration-150 hover:text-accent"
                  >
                    <LockSimple size={13} weight="bold" />
                    <span>Studio</span>
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </SmoothScrollProvider>
  );
}
