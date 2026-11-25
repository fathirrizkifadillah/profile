"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Certificate,
  EnvelopeSimple,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Notebook,
} from "@phosphor-icons/react";
import { AUTHOR_EMAIL, AUTHOR_LINKS } from "@/constants/seo";
import {
  CAPABILITIES,
  CERTIFICATIONS,
  EDUCATION_AND_ROOTS,
  EXPERIENCES,
  PROFILE_META,
  UI_COPY,
  type Locale,
} from "@/data/profile";
import { CopyEmailButton } from "./CopyEmailButton";
import { Navbar } from "./Navbar";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { SignalWorkbench } from "./SignalWorkbench";

export function PortfolioShell() {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      {/* Subtle fixed drafting-bench surface texture */}
      <div
        aria-hidden="true"
        className="bench-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-70"
      />

      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="flex-1">
        {/* HERO — Asymmetric 7/5 split, left-aligned editorial intro + right interactive hardware workbench */}
        <section className="flex min-h-[calc(100dvh-5.5rem)] items-center py-14 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-plate px-3.5 py-1.5 text-xs font-medium text-ink-secondary">
                  <span className="h-2 w-2 rounded-full bg-led" />
                  <span>{UI_COPY.hero.status[locale]}</span>
                </div>

                <h1 className="mt-6 max-w-[18ch] font-display text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[3.5rem]">
                  {UI_COPY.hero.headline[locale]}
                </h1>

                <p className="mt-6 max-w-[60ch] text-base leading-[1.68] text-ink-secondary sm:text-lg">
                  {UI_COPY.hero.intro[locale]}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#work"
                    className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-ink pl-6 pr-2 text-sm font-medium text-plate transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent active:scale-[0.98]"
                  >
                    <span>{UI_COPY.hero.primaryCta[locale]}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plate/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                      <ArrowDownRight size={16} weight="bold" />
                    </span>
                  </a>

                  <CopyEmailButton
                    label={UI_COPY.hero.copyEmail[locale]}
                    copiedLabel={UI_COPY.hero.copied[locale]}
                  />
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-6 text-sm text-ink-secondary">
                  <a
                    href={AUTHOR_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-ink"
                  >
                    <GithubLogo size={18} weight="regular" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={AUTHOR_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-ink"
                  >
                    <LinkedinLogo size={18} weight="regular" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={AUTHOR_LINKS.kaggle}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-ink"
                  >
                    <Notebook size={18} weight="regular" />
                    <span>Kaggle</span>
                  </a>
                  <a
                    href={AUTHOR_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-ink"
                  >
                    <InstagramLogo size={18} weight="regular" />
                    <span>Instagram</span>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="lg:col-span-5"
              >
                <SignalWorkbench locale={locale} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <ProjectsShowcase locale={locale} />

        {/* SYSTEMS & CAPABILITIES — Sticky 4/8 split with clean hairline bands */}
        <section
          id="systems"
          className="scroll-mt-28 border-t border-hairline bg-plate/65 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                  {UI_COPY.systems.heading[locale]}
                </h2>
                <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-ink-secondary">
                  {UI_COPY.systems.lead[locale]}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3 border-t border-hairline pt-6 font-mono tabular-nums">
                  {UI_COPY.systems.stats.map((stat) => (
                    <div key={stat.value}>
                      <div className="text-xl font-semibold text-ink">
                        {stat.value}
                      </div>
                      <div className="mt-1 font-sans text-xs text-ink-muted">
                        {stat.label[locale]}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-8 font-mono text-xs text-ink-muted">
                  &ldquo;{PROFILE_META.motto}&rdquo;
                </p>
              </div>

              <div className="divide-y divide-hairline border-t border-b border-hairline lg:col-span-8">
                {CAPABILITIES.map((band) => (
                  <div key={band.id} className="py-7 sm:py-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                        {band.title[locale]}
                      </h3>
                      <span className="font-mono text-xs font-medium text-accent">
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
                          className="rounded-md border border-hairline bg-plate px-2.5 py-1 font-mono text-xs text-ink-secondary"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE — Real chronological sequence across leadership, projects, and education */}
        <section
          id="timeline"
          className="scroll-mt-28 border-t border-hairline py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-[60ch]">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                {UI_COPY.timeline.heading[locale]}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-secondary">
                {UI_COPY.timeline.subtitle[locale]}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h3 className="font-display text-base font-semibold text-ink">
                  {UI_COPY.timeline.experienceCol[locale]}
                </h3>
                <ol className="mt-5 divide-y divide-hairline border-t border-b border-hairline">
                  {EXPERIENCES.map((item) => (
                    <li key={item.id} className="py-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold text-ink">
                          {item.role[locale]}
                        </h4>
                        <span className="font-mono text-xs tabular-nums text-ink-muted">
                          {item.period[locale]}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-secondary">
                        <span className="font-medium text-ink">
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
                            className="rounded-md bg-recess/90 px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {UI_COPY.timeline.educationCol[locale]}
                </h3>
                <ol className="mt-5 divide-y divide-hairline border-t border-b border-hairline">
                  {EDUCATION_AND_ROOTS.map((item) => (
                    <li key={item.id} className="py-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold text-ink">
                          {item.role[locale]}
                        </h4>
                        <span className="font-mono text-xs tabular-nums text-ink-muted">
                          {item.period[locale]}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-medium text-ink-secondary">
                        {item.organization}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                        {item.description[locale]}
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-recess/90 px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* VERIFIED CREDENTIALS */}
        <section
          id="credentials"
          className="scroll-mt-28 border-t border-hairline bg-plate/65 py-24 sm:py-28"
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
              <div className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted">
                <Certificate size={17} weight="regular" className="text-accent" />
                <span>Oracle & Dicoding Verified</span>
              </div>
            </div>

            <div className="mt-10 divide-y divide-hairline border-t border-b border-hairline">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-center"
                >
                  <div className="md:col-span-6">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {cert.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-secondary">
                      <span>{cert.issuer}</span>
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
                        className="rounded-md bg-bench px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
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
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-hairline-strong bg-plate px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
                    >
                      <span>{UI_COPY.credentials.verifyAction[locale]}</span>
                      <ArrowUpRight size={14} weight="bold" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="scroll-mt-28 border-t border-hairline py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="bezel-outer rounded-[28px] p-1.5 ring-1 ring-ink/[0.08]">
              <div className="bezel-inner rounded-[22px] p-7 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <h2 className="max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                      {UI_COPY.contact.heading[locale]}
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-ink-secondary">
                      {UI_COPY.contact.body[locale]}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <a
                        href={AUTHOR_LINKS.email}
                        className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-ink pl-6 pr-2 text-sm font-medium text-plate transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent active:scale-[0.98]"
                      >
                        <span>{UI_COPY.contact.directEmail[locale]}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plate/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <EnvelopeSimple size={16} weight="bold" />
                        </span>
                      </a>

                      <CopyEmailButton
                        label={UI_COPY.hero.copyEmail[locale]}
                        copiedLabel={UI_COPY.hero.copied[locale]}
                        variant="inline"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-hairline pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                    <div className="flex items-center gap-2 text-sm text-ink-secondary">
                      <MapPin size={16} weight="regular" className="text-accent" />
                      <span>{PROFILE_META.location[locale]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
                      <a
                        href={AUTHOR_LINKS.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center justify-between rounded-xl border border-hairline bg-bench/70 px-3.5 font-medium text-ink transition-colors hover:border-ink/40"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight size={14} weight="regular" />
                      </a>
                      <a
                        href={AUTHOR_LINKS.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center justify-between rounded-xl border border-hairline bg-bench/70 px-3.5 font-medium text-ink transition-colors hover:border-ink/40"
                      >
                        <span>LinkedIn</span>
                        <ArrowUpRight size={14} weight="regular" />
                      </a>
                      <a
                        href={AUTHOR_LINKS.kaggle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center justify-between rounded-xl border border-hairline bg-bench/70 px-3.5 font-medium text-ink transition-colors hover:border-ink/40"
                      >
                        <span>Kaggle</span>
                        <ArrowUpRight size={14} weight="regular" />
                      </a>
                      <a
                        href={AUTHOR_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center justify-between rounded-xl border border-hairline bg-bench/70 px-3.5 font-medium text-ink transition-colors hover:border-ink/40"
                      >
                        <span>Instagram</span>
                        <ArrowUpRight size={14} weight="regular" />
                      </a>
                    </div>
                    <p className="pt-1 font-mono text-xs text-ink-muted">
                      {AUTHOR_EMAIL}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-semibold text-ink">
              {PROFILE_META.fullName}
            </span>
            <span className="font-mono">({PROFILE_META.alias})</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span>{PROFILE_META.domain}</span>
            <span>Universitas Siliwangi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
