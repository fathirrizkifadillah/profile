"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Certificate,
  Circuitry,
  EnvelopeSimple,
  GithubLogo,
  GraduationCap,
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

interface PortfolioShellProps {
  content: ProfileContent;
  telemetry: GitHubTelemetry;
}

const CAPABILITY_ACCENTS = [
  { badge: "bg-accent-soft text-accent border-accent/20", bar: "bg-accent" },
  { badge: "bg-data-soft text-data border-data/20", bar: "bg-data" },
  { badge: "bg-vision-soft text-vision border-vision/20", bar: "bg-vision" },
  { badge: "bg-iot-soft text-iot border-iot/25", bar: "bg-iot" },
];

export function PortfolioShell({ content, telemetry }: PortfolioShellProps) {
  const [locale, setLocale] = useState<Locale>("en");

  const avatarSrc = content.meta.avatarUrl || telemetry.avatarUrl;
  const emailHref = `mailto:${content.meta.email}`;

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      {/* Subtle fixed drafting-bench surface texture with calibrated atmospheric color */}
      <div
        aria-hidden="true"
        className="bench-grid-bg pointer-events-none fixed inset-0 -z-10"
      />

      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="flex-1">
        {/* HERO — Asymmetric 7/5 split with real GitHub identity, VEDORA banner, and interactive bench */}
        <section className="flex min-h-[calc(100dvh-5.5rem)] items-center py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                className="lg:col-span-7"
              >
                {/* GitHub Avatar + Vedora Identity + Status Strip */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-accent/30 bg-plate p-0.5 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarSrc}
                      alt={`${content.meta.fullName} (${content.meta.alias})`}
                      className="h-full w-full rounded-[12px] object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold text-ink">
                        {content.meta.alias}
                      </span>
                      <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                        @{content.meta.githubUsername}
                      </span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-data/25 bg-data-soft/80 px-3 py-1 text-xs font-medium text-data">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-led opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-led" />
                      </span>
                      <span>{content.hero.status[locale]}</span>
                    </div>
                  </div>
                </div>

                <h1 className="mt-6 max-w-[19ch] font-display text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.35rem]">
                  {content.hero.headline[locale]}
                </h1>

                <p className="mt-5 max-w-[60ch] text-base leading-[1.68] text-ink-secondary sm:text-[17px]">
                  {content.hero.intro[locale]}
                </p>

                {/* Unmistakable Primary (Cobalt) vs Secondary (Crisp Bordered) Button Hierarchy */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#work"
                    className="group inline-flex min-h-[50px] items-center gap-3 rounded-full bg-accent pl-6 pr-2 text-sm font-semibold text-plate shadow-[0_12px_28px_-8px_rgba(29,78,216,0.58)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
                  >
                    <span>{content.hero.primaryCta[locale]}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                      <ArrowDownRight size={17} weight="bold" />
                    </span>
                  </a>

                  <CopyEmailButton
                    email={content.meta.email}
                    label={UI_COPY.hero.copyEmail[locale]}
                    copiedLabel={UI_COPY.hero.copied[locale]}
                  />
                </div>

                {/* Color-coded factual engineering metrics strip */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="overflow-hidden rounded-2xl border border-hairline bg-plate shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="h-1 bg-accent" />
                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                        <GithubLogo size={13} weight="bold" className="text-accent" />
                        <span>GitHub</span>
                      </div>
                      <div className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                        {telemetry.publicRepos} repos
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.4 }}
                    className="overflow-hidden rounded-2xl border border-hairline bg-plate shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="h-1 bg-data" />
                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                        <GraduationCap size={13} weight="bold" className="text-data" />
                        <span className="truncate">{content.meta.major[locale]}</span>
                      </div>
                      <div className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                        GPA {content.meta.gpa}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.29, duration: 0.4 }}
                    className="overflow-hidden rounded-2xl border border-hairline bg-plate shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="h-1 bg-vision" />
                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                        <Certificate size={13} weight="bold" className="text-vision" />
                        <span>Oracle Cloud</span>
                      </div>
                      <div className="mt-1 font-mono text-lg font-bold text-vision">
                        GenAI Pro
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.4 }}
                    className="overflow-hidden rounded-2xl border border-hairline bg-plate shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="h-1 bg-iot" />
                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                        <Circuitry size={13} weight="bold" className="text-iot" />
                        <span>MAUNC Unsil</span>
                      </div>
                      <div className="mt-1 font-mono text-lg font-bold text-iot">
                        IoT Lead
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Tactile pill social buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-hairline pt-5 text-xs font-semibold">
                  <a
                    href={content.meta.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-hairline-strong bg-plate px-3.5 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-plate"
                  >
                    <GithubLogo size={15} weight="bold" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={content.meta.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-hairline-strong bg-plate px-3.5 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-plate"
                  >
                    <LinkedinLogo size={15} weight="bold" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={content.meta.links.kaggle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-hairline-strong bg-plate px-3.5 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-vision hover:bg-vision hover:text-plate"
                  >
                    <Notebook size={15} weight="bold" />
                    <span>Kaggle</span>
                  </a>
                  <a
                    href={content.meta.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-hairline-strong bg-plate px-3.5 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-iot hover:bg-iot hover:text-plate"
                  >
                    <InstagramLogo size={15} weight="bold" />
                    <span>Instagram</span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.12,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="flex flex-col gap-4 lg:col-span-5"
              >
                {/* VEDORA GitHub Banner Module */}
                {content.meta.showBanner && content.meta.bannerUrl ? (
                  <div className="bezel-outer rounded-[24px] p-1.5 ring-1 ring-ink/[0.09]">
                    <div className="overflow-hidden rounded-[18px] bg-ink">
                      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[11px] text-white/75">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-led" />
                          <span>{`${content.meta.alias} // github-banner`}</span>
                        </span>
                        <a
                          href={content.meta.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 transition-colors hover:text-white"
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

        {/* SYSTEMS & CAPABILITIES — Sticky 4/8 split with color-coded engineering bands */}
        <section
          id="systems"
          className="scroll-mt-28 border-t border-hairline bg-plate/70 py-20 sm:py-28"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
              >
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                  {UI_COPY.systems.heading[locale]}
                </h2>
                <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-secondary">
                  {UI_COPY.systems.lead[locale]}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-hairline pt-6 font-mono tabular-nums">
                  <div>
                    <div className="text-xl font-bold text-accent">
                      {telemetry.publicRepos}
                    </div>
                    <div className="mt-1 font-sans text-xs text-ink-muted">
                      {UI_COPY.systems.stats[0].label[locale]}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-data">
                      {content.meta.gpa}
                    </div>
                    <div className="mt-1 font-sans text-xs text-ink-muted">
                      {UI_COPY.systems.stats[1].label[locale]}
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-vision">
                      {content.certifications.length}
                    </div>
                    <div className="mt-1 font-sans text-xs text-ink-muted">
                      {locale === "en" ? "Verified certs" : "Sertifikasi"}
                    </div>
                  </div>
                </div>

                <p className="mt-8 rounded-xl border border-hairline bg-bench/80 p-3.5 font-mono text-xs text-ink-secondary">
                  &ldquo;{content.meta.motto}&rdquo;
                </p>
              </motion.div>

              <div className="divide-y divide-hairline border-t border-b border-hairline lg:col-span-8">
                {content.capabilities.map((band, idx) => {
                  const style = CAPABILITY_ACCENTS[idx % CAPABILITY_ACCENTS.length];
                  return (
                    <motion.div
                      key={band.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: idx * 0.05,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                      className="py-7 sm:py-8"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className={`h-6 w-1 rounded-full ${style.bar}`} />
                          <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                            {band.title[locale]}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-0.5 font-mono text-xs font-semibold ${style.badge}`}
                        >
                          {band.highlightMetric}
                        </span>
                      </div>
                      <p className="mt-2.5 max-w-[64ch] text-[15px] leading-relaxed text-ink-secondary">
                        {band.summary[locale]}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {band.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-md border border-hairline bg-plate px-2.5 py-1 font-mono text-xs font-medium text-ink-secondary"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE — Chronological sequence */}
        <section
          id="timeline"
          className="scroll-mt-28 border-t border-hairline py-20 sm:py-28"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
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
                <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full bg-iot" />
                  <span>{UI_COPY.timeline.experienceCol[locale]}</span>
                </h3>
                <ol className="mt-5 divide-y divide-hairline border-t border-b border-hairline">
                  {content.experiences.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      className="py-6"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold text-ink">
                          {item.role[locale]}
                        </h4>
                        <span className="rounded-md bg-iot-soft px-2.5 py-0.5 font-mono text-xs font-medium tabular-nums text-iot">
                          {item.period[locale]}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-secondary">
                        <span className="font-semibold text-ink">
                          {item.organization}
                        </span>
                        <span className="text-ink-muted">{item.location}</span>
                      </div>
                      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink-secondary">
                        {item.description[locale]}
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-hairline bg-plate px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-5">
                <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <span>{UI_COPY.timeline.educationCol[locale]}</span>
                </h3>
                <ol className="mt-5 divide-y divide-hairline border-t border-b border-hairline">
                  {content.education.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      className="py-6"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold text-ink">
                          {item.role[locale]}
                        </h4>
                        <span className="rounded-md bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-medium tabular-nums text-accent">
                          {item.period[locale]}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-ink-secondary">
                        {item.organization}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                        {item.description[locale]}
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-hairline bg-plate px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
                          >
                            {skill}
                          </span>
                        ))}
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
          className="scroll-mt-28 border-t border-hairline bg-plate/70 py-20 sm:py-24"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-vision/25 bg-vision-soft px-3.5 py-1.5 font-mono text-xs font-semibold text-vision">
                <Certificate size={16} weight="bold" />
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
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-6">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {cert.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-secondary">
                      <span className="font-semibold text-ink">{cert.issuer}</span>
                      <span className="font-mono text-xs text-ink-muted">
                        {cert.issued}
                      </span>
                      {cert.credentialId ? (
                        <span className="font-mono text-xs text-ink-muted">
                          ID {cert.credentialId}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 md:col-span-4">
                    {cert.focus.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-vision/20 bg-vision-soft/70 px-2.5 py-1 font-mono text-[11px] font-medium text-vision"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="md:col-span-2 md:flex md:justify-end">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-plate shadow-[0_8px_18px_-6px_rgba(29,78,216,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
                    >
                      <span>{UI_COPY.credentials.verifyAction[locale]}</span>
                      <ArrowUpRight size={14} weight="bold" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="scroll-mt-28 border-t border-hairline py-20 sm:py-28"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="bezel-outer rounded-[28px] p-1.5 ring-1 ring-ink/[0.09]"
            >
              <div className="bezel-inner overflow-hidden rounded-[22px]">
                <div className="h-1.5 w-full bg-gradient-to-r from-accent via-vision to-iot" />
                <div className="p-7 sm:p-10 lg:p-12">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                      <h2 className="max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                        {content.contact.heading[locale]}
                      </h2>
                      <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-ink-secondary">
                        {content.contact.body[locale]}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a
                          href={emailHref}
                          className="group inline-flex min-h-[50px] items-center gap-3 rounded-full bg-accent pl-6 pr-2 text-sm font-semibold text-plate shadow-[0_12px_28px_-8px_rgba(29,78,216,0.58)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
                        >
                          <span>{UI_COPY.contact.directEmail[locale]}</span>
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <EnvelopeSimple size={17} weight="bold" />
                          </span>
                        </a>

                        <CopyEmailButton
                          email={content.meta.email}
                          label={UI_COPY.hero.copyEmail[locale]}
                          copiedLabel={UI_COPY.hero.copied[locale]}
                          variant="inline"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-hairline pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                      <div className="flex items-center gap-2 text-sm font-medium text-ink-secondary">
                        <MapPin size={17} weight="bold" className="text-accent" />
                        <span>{content.meta.location[locale]}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 pt-1 text-sm">
                        <a
                          href={content.meta.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] items-center justify-between rounded-xl border border-ink/15 bg-plate px-3.5 font-semibold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-plate"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight size={15} weight="bold" />
                        </a>
                        <a
                          href={content.meta.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] items-center justify-between rounded-xl border border-accent/25 bg-accent-soft/50 px-3.5 font-semibold text-accent shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-plate"
                        >
                          <span>LinkedIn</span>
                          <ArrowUpRight size={15} weight="bold" />
                        </a>
                        <a
                          href={content.meta.links.kaggle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] items-center justify-between rounded-xl border border-vision/25 bg-vision-soft/60 px-3.5 font-semibold text-vision shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-vision hover:bg-vision hover:text-plate"
                        >
                          <span>Kaggle</span>
                          <ArrowUpRight size={15} weight="bold" />
                        </a>
                        <a
                          href={content.meta.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-[44px] items-center justify-between rounded-xl border border-iot/25 bg-iot-soft/60 px-3.5 font-semibold text-iot shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-iot hover:bg-iot hover:text-plate"
                        >
                          <span>Instagram</span>
                          <ArrowUpRight size={15} weight="bold" />
                        </a>
                      </div>
                      <p className="pt-1 font-mono text-xs text-ink-muted">
                        {content.meta.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline bg-plate/80 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-semibold text-ink">
              {content.meta.fullName}
            </span>
            <span className="font-mono">({content.meta.alias})</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span>{content.meta.domain}</span>
            <span>{content.meta.university}</span>
            <Link
              href="/admin"
              aria-label="Owner studio login"
              title="Owner studio"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-bench px-2.5 py-1 text-ink-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <LockSimple size={13} weight="bold" />
              <span>Studio</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
