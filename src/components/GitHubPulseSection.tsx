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
      className="border-t border-hairline bg-plate/65 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
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
            className="editorial-link group inline-flex min-h-[38px] w-fit items-center gap-2 font-mono text-xs font-semibold text-ink transition-colors duration-150 hover:text-accent"
          >
            <GithubLogo size={16} weight="bold" />
            <span>@{telemetry.username}</span>
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
            className="rounded-[14px] border border-hairline bg-plate p-5 sm:p-6 lg:col-span-7"
          >
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
                    className="h-2 w-2 rounded-full"
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
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
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
                    className="group flex flex-col justify-between rounded-[11px] bg-bench/75 p-3.5 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-recess/70"
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
                              className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] bg-plate text-accent transition-[background-color,color] duration-150 hover:bg-accent hover:text-plate"
                            >
                              <Globe size={13} weight="bold" />
                            </a>
                          ) : null}
                          <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${repo.name} on GitHub`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] bg-plate text-ink-secondary transition-[background-color,color] duration-150 hover:bg-ink hover:text-plate"
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
                          <span className="inline-flex items-center gap-0.5 text-ink">
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
          </motion.div>

          {/* Right 5 cols: Current Focus + Editorial Stack Matrix (ZERO outlined badges) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.48, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-6 lg:col-span-5"
          >
            <div className="rounded-[14px] border border-hairline bg-plate p-5 sm:p-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Current focus" : "Fokus saat ini"}
                </h3>
                <span className="font-mono text-[11px] text-ink-muted">
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
            </div>

            <div className="flex-1 rounded-[14px] border border-hairline bg-plate p-5 sm:p-6">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Technical stack" : "Stack teknis"}
                </h3>
                <span className="font-mono text-[11px] text-ink-muted">
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
                          <span className="text-ink-secondary">{item}</span>
                          {idx < group.items.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="mx-1.5 text-ink-muted/60"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
