"use client";

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
      className="border-t border-hairline bg-plate/60 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
            className="inline-flex min-h-[42px] w-fit items-center gap-2 rounded-full border border-hairline-strong bg-plate px-4 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink"
          >
            <GithubLogo size={16} weight="regular" />
            <span>@{telemetry.username}</span>
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7 cols: Language Telemetry & Latest Repositories */}
          <div className="bezel-outer rounded-[26px] p-1.5 ring-1 ring-ink/[0.08] lg:col-span-7">
            <div className="bezel-inner flex h-full flex-col justify-between rounded-[20px] p-5 sm:p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                  <div className="flex items-center gap-2.5">
                    <TerminalWindow size={18} weight="regular" className="text-accent" />
                    <span className="font-display text-sm font-semibold text-ink">
                      {locale === "en"
                        ? "Repository language distribution"
                        : "Distribusi bahasa repositori"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-ink-secondary">
                    <span>{telemetry.publicRepos} repos</span>
                    <span>{telemetry.followers} followers</span>
                  </div>
                </div>

                {/* Segmented language bar */}
                <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-recess">
                  {telemetry.languages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.count} repos (${lang.percent}%)`}
                      className="h-full border-r border-plate/70 last:border-r-0"
                    />
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
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
                    <span className="font-mono text-[11px] text-ink-muted">
                      {telemetry.source === "live" ? "Live GitHub API" : "Cached snapshot"}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {telemetry.recentRepos.map((repo) => (
                      <div
                        key={repo.name}
                        className="flex flex-col justify-between rounded-xl border border-hairline bg-bench/75 p-3.5 transition-colors hover:border-hairline-strong hover:bg-plate"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate font-mono text-xs font-semibold text-ink hover:text-accent"
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
                                  className="text-accent hover:opacity-80"
                                >
                                  <Globe size={14} weight="regular" />
                                </a>
                              ) : null}
                              <a
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${repo.name} on GitHub`}
                                className="text-ink-muted hover:text-ink"
                              >
                                <ArrowUpRight size={14} weight="regular" />
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
                          <span className="truncate">
                            {repo.language || "Repository"}
                          </span>
                          <div className="flex items-center gap-2.5 tabular-nums">
                            {repo.stars > 0 ? (
                              <span className="inline-flex items-center gap-0.5">
                                <Star size={11} weight="fill" className="text-accent" />
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
          </div>

          {/* Right 5 cols: Current Focus + Technical Stack Matrix (from GitHub README) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-[24px] border border-hairline bg-plate p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Current focus" : "Fokus saat ini"}
                </h3>
                <span className="font-mono text-[11px] text-accent">
                  README.md
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {currentFocus.map((track) => (
                  <li
                    key={track.id}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{track.text[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 rounded-[24px] border border-hairline bg-plate p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-3.5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {locale === "en" ? "Technical stack" : "Stack teknis"}
                </h3>
                <span className="font-mono text-[11px] text-ink-muted">
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
                          className="rounded-md border border-hairline bg-bench/80 px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
