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

const CATEGORY_ACTIVE_STYLES: Record<ProjectCategory, string> = {
  all: "bg-accent text-plate shadow-[0_6px_16px_-4px_rgba(29,78,216,0.5)]",
  "ai-llm": "bg-accent text-plate shadow-[0_6px_16px_-4px_rgba(29,78,216,0.5)]",
  vision: "bg-vision text-plate shadow-[0_6px_16px_-4px_rgba(15,118,110,0.5)]",
  "iot-hardware": "bg-iot text-plate shadow-[0_6px_16px_-4px_rgba(194,94,0,0.5)]",
  "data-systems": "bg-data text-plate shadow-[0_6px_16px_-4px_rgba(4,120,87,0.5)]",
};

const CATEGORY_BADGE_STYLES: Record<
  Exclude<ProjectCategory, "all">,
  string
> = {
  "ai-llm": "bg-accent-soft text-accent border-accent/20",
  vision: "bg-vision-soft text-vision border-vision/20",
  "iot-hardware": "bg-iot-soft text-iot border-iot/25",
  "data-systems": "bg-data-soft text-data border-data/20",
};

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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="py-7"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                CATEGORY_BADGE_STYLES[project.category]
              }`}
            >
              {UI_COPY.work.categories[project.category][locale]}
            </span>
            <span className="font-mono text-xs tabular-nums text-ink-muted">
              {project.year}
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-ink-secondary">
            {project.subtitle[locale]}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-hairline bg-plate px-2.5 py-1 font-mono text-[11px] text-ink-secondary"
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

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-plate shadow-[0_8px_18px_-6px_rgba(29,78,216,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
              >
                <Globe size={14} weight="bold" />
                <span>{UI_COPY.work.liveDemo[locale]}</span>
                <ArrowUpRight size={13} weight="bold" />
              </a>
            ) : null}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-ink/20 bg-plate px-4 py-1.5 text-xs font-semibold text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-plate active:scale-[0.97]"
            >
              <GithubLogo size={14} weight="bold" />
              <span>{UI_COPY.work.sourceCode[locale]}</span>
              <ArrowUpRight size={13} weight="bold" />
            </a>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className={`inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-[0.97] ${
                expanded
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-accent/25 bg-accent-soft/60 text-accent hover:border-accent hover:bg-accent-soft"
              }`}
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
                <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-accent/20 bg-plate p-5 shadow-sm sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold text-accent">
                      {UI_COPY.work.problemLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.problem[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-vision">
                      {UI_COPY.work.architectureLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.architecture[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-data">
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
    </motion.article>
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
            className="inline-flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-2xl border border-hairline bg-recess p-1.5"
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
                  className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                    active
                      ? CATEGORY_ACTIVE_STYLES[cat]
                      : "bg-plate/70 text-ink-secondary hover:bg-plate hover:text-ink"
                  }`}
                >
                  <span>{UI_COPY.work.categories[cat][locale]}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums ${
                      active
                        ? "bg-white/20 text-plate"
                        : "bg-recess text-ink-muted"
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
        <AnimatePresence mode="wait">
          {spotlight ? (
            <motion.div
              key={spotlight.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="mt-10 bezel-outer rounded-[28px] p-1.5 ring-1 ring-ink/[0.09]"
            >
              <div className="bezel-inner overflow-hidden rounded-[22px]">
                <div className="h-1.5 w-full bg-gradient-to-r from-accent via-vision to-iot" />
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-7">
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                        <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">
                          {UI_COPY.work.spotlightLabel[locale]}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
                            CATEGORY_BADGE_STYLES[spotlight.category]
                          }`}
                        >
                          {UI_COPY.work.categories[spotlight.category][locale]}
                        </span>
                        <span className="font-mono text-ink-muted">
                          {spotlight.year}
                        </span>
                      </div>

                      <h3 className="mt-3.5 font-display text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
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
                            className="rounded-lg border border-hairline bg-bench px-3 py-1 font-mono text-xs font-medium text-ink-secondary"
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
                            className="group inline-flex min-h-[48px] items-center gap-3 rounded-full bg-accent pl-5 pr-2 text-sm font-semibold text-plate shadow-[0_10px_24px_-8px_rgba(29,78,216,0.55)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.98]"
                          >
                            <span>{UI_COPY.work.liveDemo[locale]}</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              <ArrowUpRight size={15} weight="bold" />
                            </span>
                          </a>
                        ) : null}

                        <a
                          href={spotlight.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex min-h-[48px] items-center gap-3 rounded-full border border-ink/20 bg-plate pl-5 pr-2 text-sm font-semibold text-ink shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-plate active:scale-[0.98]"
                        >
                          <span>{UI_COPY.work.sourceCode[locale]}</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-recess text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/15 group-hover:text-plate">
                            <GithubLogo size={15} weight="bold" />
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-2xl border border-hairline bg-bench/85 p-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs font-semibold text-vision">
                              {UI_COPY.work.architectureLabel[locale]}
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                              {spotlight.architecture[locale]}
                            </p>
                          </div>
                          <div className="border-t border-hairline pt-4">
                            <div className="text-xs font-semibold text-data">
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
                              className="rounded-xl border border-hairline bg-plate px-3 py-2.5"
                            >
                              <div className="text-[10px] text-ink-muted">
                                {metric.label[locale]}
                              </div>
                              <div className="mt-1 text-xs font-bold text-accent sm:text-[13px]">
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
            </motion.div>
          ) : (
            <div className="mt-10 rounded-2xl border border-hairline bg-plate p-10 text-center">
              <p className="text-sm text-ink-secondary">
                {locale === "en"
                  ? "No projects match this domain filter."
                  : "Belum ada proyek pada filter kategori ini."}
              </p>
            </div>
          )}
        </AnimatePresence>

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
                  setExpandedId((prev) =>
                    prev === project.id ? null : project.id
                  )
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
