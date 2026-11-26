"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CaretDown,
  GithubLogo,
  Globe,
} from "@phosphor-icons/react";
import {
  UI_COPY,
  type Locale,
  type ProjectCategory,
  type ProjectItem,
} from "@/data/profile";

interface ProjectsShowcaseProps {
  locale: Locale;
  projects: ProjectItem[];
}

const CATEGORIES: ProjectCategory[] = [
  "all",
  "ai-llm",
  "vision",
  "iot-hardware",
  "data-systems",
];

function ProjectRow({
  project,
  locale,
  expanded,
  onToggle,
}: {
  project: ProjectItem;
  locale: Locale;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="py-7 transition-colors">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              {project.title}
            </h3>
            <span className="font-mono text-xs tabular-nums text-ink-muted">
              {project.year}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-ink-secondary">
            {project.subtitle[locale]}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-recess/90 px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-secondary">
            {project.summary[locale]}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-plate transition-transform duration-200 hover:bg-accent active:scale-[0.98]"
              >
                <Globe size={14} weight="regular" />
                <span>{UI_COPY.work.liveDemo[locale]}</span>
                <ArrowUpRight size={13} weight="bold" />
              </a>
            ) : null}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-hairline-strong bg-plate px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink active:scale-[0.98]"
            >
              <GithubLogo size={14} weight="regular" />
              <span>{UI_COPY.work.sourceCode[locale]}</span>
              <ArrowUpRight size={13} weight="regular" />
            </a>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              <span>
                {expanded
                  ? UI_COPY.work.hideNotes[locale]
                  : UI_COPY.work.technicalNotes[locale]}
              </span>
              <CaretDown
                size={13}
                weight="bold"
                className={`transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-hairline bg-plate p-5 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold text-ink">
                      {UI_COPY.work.problemLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.problem[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink">
                      {UI_COPY.work.architectureLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.architecture[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-ink">
                      {UI_COPY.work.outcomeLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.outcome[locale]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}

export function ProjectsShowcase({ locale, projects }: ProjectsShowcaseProps) {
  const [category, setCategory] = useState<ProjectCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    category === "all"
      ? projects
      : projects.filter((item) => item.category === category);

  const spotlight =
    filtered.find((item) => item.featured) ?? filtered[0] ?? null;
  const rest = spotlight
    ? filtered.filter((item) => item.id !== spotlight.id)
    : [];

  return (
    <section
      id="work"
      className="scroll-mt-28 border-t border-hairline py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="max-w-[60ch]">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
              {UI_COPY.work.heading[locale]}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-secondary">
              {UI_COPY.work.subtitle[locale]}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by domain"
            className="inline-flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-2xl bg-recess/85 p-1.5"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              const count =
                cat === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(cat);
                    setExpandedId(null);
                  }}
                  className={`inline-flex min-h-[38px] items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    active
                      ? "bg-plate text-ink shadow-[0_2px_8px_-2px_rgba(20,25,31,0.12)]"
                      : "bg-transparent text-ink-secondary hover:text-ink"
                  }`}
                >
                  <span>{UI_COPY.work.categories[cat][locale]}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? "text-accent" : "text-ink-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spotlight Double-Bezel Feature */}
        {spotlight ? (
          <div className="mt-10 bezel-outer rounded-[28px] p-1.5 ring-1 ring-ink/[0.08]">
            <div className="bezel-inner rounded-[22px] p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-accent">
                    <span>{UI_COPY.work.spotlightLabel[locale]}</span>
                    <span className="font-mono text-ink-muted">
                      {spotlight.year}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
                    {spotlight.title}
                  </h3>
                  <p className="mt-1.5 text-base font-medium text-ink-secondary">
                    {spotlight.subtitle[locale]}
                  </p>
                  <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-ink-secondary">
                    {spotlight.summary[locale]}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {spotlight.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-bench px-3 py-1 font-mono text-xs text-ink-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {spotlight.liveUrl ? (
                      <a
                        href={spotlight.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-ink pl-5 pr-2 text-sm font-medium text-plate transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent active:scale-[0.98]"
                      >
                        <span>{UI_COPY.work.liveDemo[locale]}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plate/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight size={15} weight="bold" />
                        </span>
                      </a>
                    ) : null}

                    <a
                      href={spotlight.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-[48px] items-center gap-3 rounded-full border border-hairline-strong bg-plate pl-5 pr-2 text-sm font-medium text-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-ink active:scale-[0.98]"
                    >
                      <span>{UI_COPY.work.sourceCode[locale]}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-recess transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <GithubLogo size={15} weight="regular" />
                      </span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-hairline bg-bench/80 p-5 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-ink">
                          {UI_COPY.work.architectureLabel[locale]}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                          {spotlight.architecture[locale]}
                        </p>
                      </div>
                      <div className="border-t border-hairline pt-4">
                        <div className="text-xs font-semibold text-ink">
                          {UI_COPY.work.outcomeLabel[locale]}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                          {spotlight.outcome[locale]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-hairline pt-4 font-mono tabular-nums">
                      {spotlight.metrics.map((metric) => (
                        <div
                          key={`${metric.value}-${metric.label.en}`}
                          className="rounded-xl bg-plate px-3 py-2.5"
                        >
                          <div className="text-[10px] text-ink-muted">
                            {metric.label[locale]}
                          </div>
                          <div className="mt-1 text-xs font-semibold text-ink sm:text-[13px]">
                            {metric.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-hairline bg-plate p-10 text-center">
            <p className="text-sm text-ink-secondary">
              {locale === "en"
                ? "No projects match this domain filter."
                : "Belum ada proyek pada filter kategori ini."}
            </p>
          </div>
        )}

        {/* Hairline Architectural Ledger for remaining builds */}
        {rest.length > 0 ? (
          <div className="mt-10 divide-y divide-hairline border-t border-b border-hairline">
            {rest.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                locale={locale}
                expanded={expandedId === project.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === project.id ? null : project.id))
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
