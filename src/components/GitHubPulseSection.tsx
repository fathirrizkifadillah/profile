"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitBranch,
  Globe,
  Star,
  TerminalWindow,
} from "@phosphor-icons/react";
import type { Locale } from "@/data/profile";
import type { GitHubTelemetry } from "@/lib/github";
import type { FocusTrack, StackGroup } from "@/types/profile-content";
import { SignalWorkbench } from "./SignalWorkbench";
import { SocialIcon } from "./SocialIcons";
import { DecryptedText } from "./reactbits/DecryptedText";
import { SpotlightCard } from "./reactbits/SpotlightCard";

interface GitHubPulseSectionProps {
  locale: Locale;
  onLocaleChange: (next: Locale) => void;
  telemetry: GitHubTelemetry;
  currentFocus: FocusTrack[];
  stackGroups: StackGroup[];
  githubUrl: string;
  links: {
    github: string;
    linkedin: string;
    kaggle: string;
    instagram: string;
  };
  alias: string;
  showBanner: boolean;
  bannerUrl: string;
}

const HD_BANNER_URL =
  "https://raw.githubusercontent.com/fathirrizkifadillah/fathirrizkifadillah/main/img/vedora_struggle%20(2).gif";

function resolveBannerUrl(url: string): string {
  // Auto-upgrade legacy 360x157 GIF URL to the 1440x628 HD version
  if (url.endsWith("/img/vedora_struggle.gif")) {
    return HD_BANNER_URL;
  }
  return url;
}

function formatDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function GitHubPulseSection({
  locale,
  onLocaleChange,
  telemetry,
  currentFocus,
  stackGroups,
  githubUrl,
  links,
  alias,
  showBanner,
  bannerUrl,
}: GitHubPulseSectionProps) {
  const hdBannerSrc = resolveBannerUrl(bannerUrl);

  return (
    <section
      aria-label="GitHub engineering telemetry and interactive bench"
      className="relative z-10 rounded-t-[24px] border-t border-hairline bg-plate pt-20 pb-16 sm:pt-24 sm:pb-22"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Top Row: Large HD GitHub Banner + 4-Mode Interactive Engineering Sandbox */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {showBanner && hdBannerSrc ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col overflow-hidden rounded-[14px] border border-hairline bg-bench lg:col-span-6"
            >
              <div className="flex items-center justify-between border-b border-hairline px-5 py-3 font-mono text-xs">
                <span className="font-semibold text-ink">
                  <DecryptedText text={`${alias} // github-banner`} />
                </span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-link inline-flex items-center gap-1.5 text-accent transition-colors duration-150 hover:text-ink"
                >
                  <SocialIcon platform="github" size={14} />
                  <span>@{telemetry.username}</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
              </div>
              <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-bench">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hdBannerSrc}
                  alt={`${alias} High-Resolution GitHub Banner`}
                  className="h-full max-h-[370px] w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-5 py-3 font-mono text-[11px] text-ink-secondary">
                <span>1440×628 HD // {telemetry.publicRepos} public repos</span>
                <span className="text-ink-muted">
                  {telemetry.followers} followers
                </span>
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
            className={showBanner && hdBannerSrc ? "lg:col-span-6" : "lg:col-span-12"}
          >
            <SignalWorkbench
              locale={locale}
              onLocaleChange={onLocaleChange}
              publicRepos={telemetry.publicRepos}
              links={links}
            />
          </motion.div>
        </div>

        {/* GitHub Activity & Stack Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="mt-14 flex flex-col justify-between gap-4 border-t border-hairline pt-12 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
              {locale === "en"
                ? "GitHub activity & active stack"
                : "Aktivitas GitHub & stack aktif"}
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-secondary sm:text-base">
              {locale === "en"
                ? "Synced directly from public repositories, language footprint, and active research tracks."
                : "Disinkronkan langsung dari repositori publik, distribusi bahasa pemrograman, dan fokus riset aktif."}
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-link group inline-flex min-h-[38px] w-fit items-center gap-2 font-mono text-xs font-semibold text-ink-silver transition-colors duration-150 hover:text-accent"
          >
            <SocialIcon platform="github" size={16} />
            <span>@{telemetry.username}</span>
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 cols: Language Telemetry & Latest Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7"
          >
            <SpotlightCard className="h-full rounded-[14px] border border-hairline bg-bench p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                <div className="flex items-center gap-2.5">
                  <TerminalWindow
                    size={18}
                    weight="bold"
                    className="text-accent"
                  />
                  <span className="font-display text-sm font-semibold text-ink">
                    {locale === "en"
                      ? "Repository language distribution"
                      : "Distribusi bahasa repositori"}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-ink-secondary">
                  <span className="font-semibold text-ink">
                    {telemetry.publicRepos} repos
                  </span>
                  <span aria-hidden="true" className="text-ink-muted">
                    /
                  </span>
                  <span>{telemetry.followers} followers</span>
                </div>
              </div>

              {/* Segmented language bar */}
              <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-[4px] bg-recess">
                {telemetry.languages.map((lang) => (
                  <motion.div
                    key={lang.name}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      width: `${lang.percent}%`,
                      backgroundColor: lang.color,
                    }}
                    title={`${lang.name}: ${lang.count} repos (${lang.percent}%)`}
                    className="h-full origin-left"
                  />
                ))}
              </div>

              <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2">
                {telemetry.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-secondary"
                  >
                    <span
                      className="h-2 w-2 rounded-[2px]"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="font-medium text-ink-silver">
                      {lang.name}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                      {lang.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recent GitHub Repositories Grid */}
              <div className="mt-6 border-t border-hairline pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    {locale === "en"
                      ? "Latest pushed repositories"
                      : "Repositori terbaru yang di-push"}
                  </span>
                  <span className="font-mono text-[11px] text-accent">
                    {telemetry.source === "live"
                      ? "LIVE GITHUB API"
                      : "CACHED SNAPSHOT"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {telemetry.recentRepos.map((repo) => (
                    <div
                      key={repo.name}
                      className="group flex flex-col justify-between rounded-[11px] border border-hairline bg-plate p-3.5 transition-[border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-hairline-strong hover:bg-recess"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate font-mono text-xs font-semibold text-ink transition-colors duration-150 group-hover:text-accent"
                          >
                            {repo.name}
                          </a>
                          <div className="flex shrink-0 items-center gap-1">
                            {repo.homepage ? (
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Live demo for ${repo.name}`}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border border-hairline bg-bench text-accent transition-[background-color,border-color,color] duration-150 hover:border-accent hover:bg-accent hover:text-bench"
                              >
                                <Globe size={13} weight="bold" />
                              </a>
                            ) : null}
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${repo.name} on GitHub`}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] border border-hairline bg-bench text-ink-silver transition-[background-color,border-color,color] duration-150 hover:border-ink hover:bg-ink hover:text-bench"
                            >
                              <ArrowUpRight size={13} weight="bold" />
                            </a>
                          </div>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
                          {repo.description ||
                            (locale === "en"
                              ? "Public engineering repository."
                              : "Repositori rekayasa publik.")}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
                        <span className="truncate font-medium text-ink-silver">
                          {repo.language || "Repository"}
                        </span>
                        <div className="flex items-center gap-2.5 tabular-nums">
                          {repo.stars > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-accent">
                              <Star size={11} weight="fill" />
                              {repo.stars}
                            </span>
                          ) : null}
                          {repo.forks > 0 ? (
                            <span className="inline-flex items-center gap-0.5">
                              <GitBranch size={11} weight="regular" />
                              {repo.forks}
                            </span>
                          ) : null}
                          <span>{formatDateShort(repo.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right 5 cols: Current Focus + Editorial Stack Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.48, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <SpotlightCard className="rounded-[14px] border border-hairline bg-bench p-5 sm:p-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Current focus" : "Fokus saat ini"}
                </h3>
                <span className="font-mono text-[11px] text-accent">
                  README.md
                </span>
              </div>
              <ol className="mt-4 space-y-3">
                {currentFocus.map((track, idx) => (
                  <li
                    key={track.id}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-secondary"
                  >
                    <span className="mt-0.5 font-mono text-[11px] font-semibold tabular-nums text-accent">
                      0{idx + 1}
                    </span>
                    <span>{track.text[locale]}</span>
                  </li>
                ))}
              </ol>
            </SpotlightCard>

            <SpotlightCard className="flex-1 rounded-[14px] border border-hairline bg-bench p-5 sm:p-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Technical stack" : "Stack teknis"}
                </h3>
                <span className="font-mono text-[11px] text-accent">
                  AI + IoT
                </span>
              </div>

              <div className="mt-4 divide-y divide-hairline">
                {stackGroups.map((group) => (
                  <div key={group.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-xs font-semibold text-ink">
                      {group.label[locale]}
                    </div>
                    <p className="mt-1.5 font-mono text-xs leading-relaxed text-ink-secondary">
                      {group.items.map((item, idx) => (
                        <span key={item}>
                          <span className="text-ink-silver">{item}</span>
                          {idx < group.items.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="mx-1.5 text-ink-muted"
                            >
                              /
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
