"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GitBranch,
  GithubLogo,
  Globe,
  Star,
  TerminalWindow,
} from "@phosphor-icons/react";
import type { Locale } from "@/data/profile";
import type { GitHubTelemetry } from "@/lib/github";
import type { FocusTrack, StackGroup } from "@/types/profile-content";

interface GitHubPulseSectionProps {
  locale: Locale;
  telemetry: GitHubTelemetry;
  currentFocus: FocusTrack[];
  stackGroups: StackGroup[];
  githubUrl: string;
}

const STACK_GROUP_STYLES: Record<string, string> = {
  languages: "border-ink/15 bg-recess/80 text-ink",
  "ai-ml": "border-accent/20 bg-accent-soft text-accent",
  "backend-infra": "border-data/20 bg-data-soft text-data",
  "cv-hardware": "border-iot/25 bg-iot-soft text-iot",
};

function formatDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function GitHubPulseSection({
  locale,
  telemetry,
  currentFocus,
  stackGroups,
  githubUrl,
}: GitHubPulseSectionProps) {
  return (
    <section
      aria-label="GitHub engineering telemetry"
      className="border-t border-hairline bg-plate/70 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
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
            className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full border border-ink/20 bg-plate px-4 py-1.5 font-mono text-xs font-semibold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft hover:text-accent active:scale-[0.97]"
          >
            <GithubLogo size={16} weight="bold" />
            <span>@{telemetry.username}</span>
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 cols: Language Telemetry & Latest Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="bezel-outer rounded-[26px] p-1.5 ring-1 ring-ink/[0.08] lg:col-span-7"
          >
            <div className="bezel-inner flex h-full flex-col justify-between rounded-[20px] p-5 sm:p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <TerminalWindow size={17} weight="bold" />
                    </span>
                    <span className="font-display text-sm font-semibold text-ink">
                      {locale === "en"
                        ? "Repository language distribution"
                        : "Distribusi bahasa repositori"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                    <span className="rounded-md bg-accent-soft px-2.5 py-1 font-semibold text-accent">
                      {telemetry.publicRepos} repos
                    </span>
                    <span className="rounded-md bg-recess px-2.5 py-1 text-ink-secondary">
                      {telemetry.followers} followers
                    </span>
                  </div>
                </div>

                {/* Segmented language bar */}
                <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-recess p-0.5">
                  {telemetry.languages.map((lang) => (
                    <motion.div
                      key={lang.name}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.count} repos (${lang.percent}%)`}
                      className="h-full origin-left first:rounded-l-full last:rounded-r-full"
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
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="font-medium text-ink">{lang.name}</span>
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
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-data">
                      <span className="h-1.5 w-1.5 rounded-full bg-led" />
                      {telemetry.source === "live"
                        ? "Live GitHub API"
                        : "Cached snapshot"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {telemetry.recentRepos.map((repo) => (
                      <div
                        key={repo.name}
                        className="group flex flex-col justify-between rounded-xl border border-hairline bg-bench/70 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-plate hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate font-mono text-xs font-semibold text-ink transition-colors group-hover:text-accent"
                            >
                              {repo.name}
                            </a>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {repo.homepage ? (
                                <a
                                  href={repo.homepage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Live demo for ${repo.name}`}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent transition-colors hover:bg-accent hover:text-plate"
                                >
                                  <Globe size={13} weight="bold" />
                                </a>
                              ) : null}
                              <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${repo.name} on GitHub`}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-recess text-ink-secondary transition-colors hover:bg-ink hover:text-plate"
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
                          <span className="truncate font-medium text-ink-secondary">
                            {repo.language || "Repository"}
                          </span>
                          <div className="flex items-center gap-2.5 tabular-nums">
                            {repo.stars > 0 ? (
                              <span className="inline-flex items-center gap-0.5 text-iot">
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
              </div>
            </div>
          </motion.div>

          {/* Right 5 cols: Current Focus + Technical Stack Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="overflow-hidden rounded-[24px] border border-hairline bg-plate shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-accent via-vision to-iot" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-hairline pb-3.5">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {locale === "en" ? "Current focus" : "Fokus saat ini"}
                  </h3>
                  <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                    README.md
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {currentFocus.map((track) => (
                    <li
                      key={track.id}
                      className="flex items-start gap-3 text-sm leading-relaxed text-ink-secondary"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <span>{track.text[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1 rounded-[24px] border border-hairline bg-plate p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Technical stack" : "Stack teknis"}
                </h3>
                <span className="rounded-md bg-iot-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-iot">
                  AI + IoT
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {stackGroups.map((group) => (
                  <div key={group.id}>
                    <div className="text-xs font-semibold text-ink">
                      {group.label[locale]}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium ${
                            STACK_GROUP_STYLES[group.id] ??
                            "border-hairline bg-bench text-ink-secondary"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
