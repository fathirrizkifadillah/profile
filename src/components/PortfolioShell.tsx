"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Certificate,
  EnvelopeSimple,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  LockSimple,
  MapPin,
  Notebook,
} from "@phosphor-icons/react";
import { UI_COPY, type Locale } from "@/data/profile";
import type { GitHubTelemetry } from "@/lib/github";
import type { ProfileContent } from "@/types/profile-content";
import { CopyEmailButton } from "./CopyEmailButton";
import { GitHubPulseSection } from "./GitHubPulseSection";
import { Navbar } from "./Navbar";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { SignalWorkbench } from "./SignalWorkbench";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { BlurText } from "./reactbits/BlurText";
import { CountUp } from "./reactbits/CountUp";
import { DecryptedText } from "./reactbits/DecryptedText";
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
          <span className="text-ink-secondary">{item}</span>
          {idx < items.length - 1 ? (
            <span aria-hidden="true" className="mx-1.5 text-ink-muted/55">
              /
            </span>
          ) : null}
        </span>
      ))}
    </p>
  );
}

export function PortfolioShell({ content, telemetry }: PortfolioShellProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const risingBodyRef = useRef<HTMLDivElement | null>(null);
  const contactSlabRef = useRef<HTMLDivElement | null>(null);

  const avatarSrc = content.meta.avatarUrl || telemetry.avatarUrl;
  const emailHref = `mailto:${content.meta.email}`;
  const numericGpa = Number.parseFloat(content.meta.gpa) || 3.7;

  const socialLinks = [
    { label: "GitHub", href: content.meta.links.github, icon: GithubLogo },
    { label: "LinkedIn", href: content.meta.links.linkedin, icon: LinkedinLogo },
    { label: "Kaggle", href: content.meta.links.kaggle, icon: Notebook },
    {
      label: "Instagram",
      href: content.meta.links.instagram,
      icon: InstagramLogo,
    },
  ];

  // GSAP ScrollTrigger choreography: Hero depth recession + Rising architectural sheets
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        isMobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { isDesktop } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        // 1. Desktop Curtain: as lower page rises up over Hero, Hero smoothly recedes
        if (isDesktop && heroInnerRef.current && risingBodyRef.current) {
          gsap.to(heroInnerRef.current, {
            y: -48,
            scale: 0.955,
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

        // 2. Rising architectural sections: lower sections physically lift up on scroll
        const riseSections = gsap.utils.toArray<HTMLElement>(
          "[data-rise-section]",
          root
        );
        riseSections.forEach((section) => {
          gsap.fromTo(
            section,
            {
              y: isDesktop ? 52 : 24,
            },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 48%",
                scrub: 0.55,
              },
            }
          );
        });

        // 3. Obsidian Contact Monolith: dramatic upward architectural lift at the end
        if (contactSlabRef.current) {
          gsap.fromTo(
            contactSlabRef.current,
            {
              y: isDesktop ? 76 : 32,
              scale: isDesktop ? 0.96 : 0.985,
            },
            {
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: contactSlabRef.current,
                start: "top bottom",
                end: "top 58%",
                scrub: 0.65,
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
      <div id="top" ref={rootRef} className="relative flex min-h-screen flex-col">
        {/* Subtle fixed warm-stone architectural drafting grid */}
        <div
          aria-hidden="true"
          className="bench-grid-bg pointer-events-none fixed inset-0 -z-10"
        />

        <Navbar locale={locale} onLocaleChange={setLocale} />

        <main className="relative flex-1">
          {/* HERO — Sticky on desktop so lower page sheets smoothly glide UP over it */}
          <section className="relative z-0 flex min-h-[calc(100dvh-5.5rem)] items-center py-10 sm:py-14 lg:sticky lg:top-16 lg:py-12">
            <div
              ref={heroInnerRef}
              className="mx-auto w-full max-w-[1280px] px-4 will-change-transform sm:px-6 lg:px-8"
            >
              <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="lg:col-span-7"
                >
                  {/* GitHub Avatar + Vedora Identity + Borderless Status Line */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-recess ring-1 ring-hairline">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarSrc}
                        alt={`${content.meta.fullName} (${content.meta.alias})`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-display font-semibold text-ink">
                          {content.meta.alias}
                        </span>
                        <span aria-hidden="true" className="text-ink-muted/60">
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
                      <div className="mt-1 flex items-center gap-2 text-xs text-ink-secondary">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-led opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-led" />
                        </span>
                        <span>{content.hero.status[locale]}</span>
                      </div>
                    </div>
                  </div>

                  {/* React Bits BlurText Headline */}
                  <BlurText
                    key={`headline-${locale}`}
                    text={content.hero.headline[locale]}
                    className="mt-7 max-w-[19ch] font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.45rem]"
                  />

                  <p className="mt-5 max-w-[60ch] text-base leading-[1.68] text-ink-secondary sm:text-[17px]">
                    {content.hero.intro[locale]}
                  </p>

                  {/* Primary CTA wrapped in React Bits Magnet + Borderless Secondary */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Magnet padding={40} magnetStrength={6}>
                      <a
                        href="#work"
                        className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-accent px-5 text-sm font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
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

                  {/* Editorial Architectural Metrics Ledger with React Bits CountUp */}
                  <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-4">
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
                      <dt className="truncate font-mono text-[11px] text-ink-muted">
                        {content.meta.major[locale]}
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-ink">
                        <CountUp to={numericGpa} decimals={2} />{" "}
                        <span className="font-mono text-xs font-normal text-ink-muted">
                          GPA
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        Oracle Cloud
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-ink">
                        GenAI{" "}
                        <span className="font-mono text-xs font-medium text-accent">
                          Pro
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="font-mono text-[11px] text-ink-muted">
                        MAUNC Unsil
                      </dt>
                      <dd className="mt-1 font-display text-xl font-semibold text-ink">
                        IoT{" "}
                        <span className="font-mono text-xs font-medium text-accent">
                          Lead
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* Borderless editorial social links */}
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-5">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-link group inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-ink-secondary transition-colors duration-150 hover:text-accent"
                        >
                          <Icon size={15} weight="bold" />
                          <span>{social.label}</span>
                          <ArrowUpRight
                            size={12}
                            weight="bold"
                            className="opacity-50 transition-[transform,opacity] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                          />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.52,
                    delay: 0.08,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="flex flex-col gap-4 lg:col-span-5"
                >
                  {/* VEDORA GitHub Banner Module */}
                  {content.meta.showBanner && content.meta.bannerUrl ? (
                    <div className="bezel-outer rounded-[18px] p-1.5 ring-1 ring-ink/[0.08]">
                      <div className="overflow-hidden rounded-[13px] bg-ink">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[11px] text-plate/70">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-led" />
                            <DecryptedText
                              text={`${content.meta.alias} // github-banner`}
                            />
                          </span>
                          <a
                            href={content.meta.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-plate/85 transition-colors duration-150 hover:text-plate"
                          >
                            @{content.meta.githubUsername}
                          </a>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={content.meta.bannerUrl}
                          alt={`${content.meta.alias} GitHub Banner`}
                          className="h-[144px] w-full object-cover sm:h-[164px]"
                        />
                      </div>
                    </div>
                  ) : null}

                  <SignalWorkbench locale={locale} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* RISING LOWER PAGE CONTAINER — glides smoothly UP over the receding Hero */}
          <div ref={risingBodyRef} className="relative z-10">
            {/* GITHUB PULSE, CURRENT FOCUS & STACK MATRIX */}
            {content.meta.showGitHubPulse ? (
              <GitHubPulseSection
                locale={locale}
                telemetry={telemetry}
                currentFocus={content.currentFocus}
                stackGroups={content.stackGroups}
                githubUrl={content.meta.links.github}
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
                          <CountUp to={numericGpa} decimals={2} />
                        </div>
                        <div className="mt-1 font-sans text-xs text-ink-muted">
                          {UI_COPY.systems.stats[1].label[locale]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-accent">
                          <CountUp to={content.certifications.length} />
                        </div>
                        <div className="mt-1 font-sans text-xs text-ink-muted">
                          {locale === "en" ? "Verified certs" : "Sertifikasi"}
                        </div>
                      </div>
                    </div>

                    <blockquote className="mt-8 border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-ink-secondary">
                      &ldquo;{content.meta.motto}&rdquo;
                    </blockquote>
                  </motion.div>

                  <div className="divide-y divide-hairline border-t border-b border-hairline lg:col-span-8">
                    {content.capabilities.map((band, idx) => (
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

            {/* TIMELINE — Chronological sequence */}
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
                      {content.experiences.map((item) => (
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
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-ink-secondary">
                            <span className="font-semibold text-ink">
                              {item.organization}
                            </span>
                            <span
                              aria-hidden="true"
                              className="text-ink-muted/60"
                            >
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
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-ink-secondary uppercase">
                      {UI_COPY.timeline.educationCol[locale]}
                    </h3>
                    <ol className="mt-4 divide-y divide-hairline border-t border-b border-hairline">
                      {content.education.map((item) => (
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
                          <div className="mt-1 text-sm font-semibold text-ink-secondary">
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

            {/* VERIFIED CREDENTIALS */}
            <section
              id="credentials"
              data-rise-section
              className="relative z-20 scroll-mt-28 border-t border-hairline bg-plate py-20 sm:py-24"
            >
              <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                      {UI_COPY.credentials.heading[locale]}
                    </h2>
                    <p className="mt-2.5 max-w-[54ch] text-base text-ink-secondary">
                      {UI_COPY.credentials.subtitle[locale]}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs text-ink-secondary">
                    <Certificate
                      size={16}
                      weight="bold"
                      className="text-accent"
                    />
                    <span>Oracle &amp; Dicoding Verified</span>
                  </div>
                </div>

                <div className="mt-10 divide-y divide-hairline border-t border-b border-hairline">
                  {content.certifications.map((cert) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
                      className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-center"
                    >
                      <div className="md:col-span-6">
                        <h3 className="font-display text-lg font-semibold text-ink">
                          {cert.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-ink-secondary">
                          <span className="font-semibold text-ink">
                            {cert.issuer}
                          </span>
                          <span aria-hidden="true" className="text-ink-muted/60">
                            /
                          </span>
                          <span className="font-mono text-xs text-ink-muted">
                            {cert.issued}
                          </span>
                          {cert.credentialId ? (
                            <>
                              <span
                                aria-hidden="true"
                                className="text-ink-muted/60"
                              >
                                /
                              </span>
                              <span className="font-mono text-xs text-ink-muted">
                                ID {cert.credentialId}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <InlineSpecList items={cert.focus} />
                      </div>

                      <div className="md:col-span-2 md:flex md:justify-end">
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-accent px-4 py-1.5 text-xs font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
                        >
                          <span>{UI_COPY.credentials.verifyAction[locale]}</span>
                          <ArrowUpRight
                            size={14}
                            weight="bold"
                            className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACT — Rising Deep Obsidian Architectural Monolith */}
            <section
              id="contact"
              className="relative z-20 scroll-mt-28 border-t border-hairline bg-bench py-20 sm:py-28"
            >
              <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
                <div
                  ref={contactSlabRef}
                  className="overflow-hidden rounded-[16px] bg-ink p-7 text-plate will-change-transform sm:p-10 lg:p-12"
                >
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                      <p className="font-mono text-xs text-plate/60">
                        {content.meta.alias} / {content.meta.domain}
                      </p>
                      <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-plate sm:text-4xl">
                        {content.contact.heading[locale]}
                      </h2>
                      <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-plate/72">
                        {content.contact.body[locale]}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Magnet padding={40} magnetStrength={6}>
                          <a
                            href={emailHref}
                            className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-accent px-5 text-sm font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
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

                    <div className="flex flex-col gap-4 border-t border-white/12 pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                      <div className="flex items-center gap-2 text-sm text-plate/75">
                        <MapPin
                          size={16}
                          weight="bold"
                          className="text-accent"
                        />
                        <span>{content.meta.location[locale]}</span>
                      </div>

                      <div className="divide-y divide-white/10 border-t border-b border-white/10 text-sm">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-h-[44px] items-center justify-between py-2 text-plate/85 transition-colors duration-150 hover:text-plate"
                          >
                            <span className="font-medium">{social.label}</span>
                            <ArrowUpRight
                              size={15}
                              weight="bold"
                              className="text-plate/50 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                            />
                          </a>
                        ))}
                      </div>

                      <p className="font-mono text-xs text-plate/55">
                        {content.meta.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="relative z-20 border-t border-hairline bg-plate py-8">
              <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink">
                    {content.meta.fullName}
                  </span>
                  <span aria-hidden="true" className="text-ink-muted/60">
                    /
                  </span>
                  <span className="font-mono">{content.meta.alias}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono">
                  <span>{content.meta.domain}</span>
                  <span>{content.meta.university}</span>
                  <Link
                    href="/admin"
                    aria-label="Owner studio login"
                    title="Owner studio"
                    className="editorial-link inline-flex items-center gap-1.5 text-ink-secondary transition-colors duration-150 hover:text-accent"
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
