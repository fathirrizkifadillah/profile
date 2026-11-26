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

function StackSpecLine({ items }: { items: string[] }) {
  return (
    <p className="font-mono text-xs leading-relaxed text-ink-muted">
      {items.map((tech, idx) => (
        <span key={tech}>
          <span className="text-ink-secondary">{tech}</span>
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="py-7"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-accent">
              {UI_COPY.work.categories[project.category][locale]}
            </span>
            <span aria-hidden="true" className="text-ink-muted/60">
              /
            </span>
            <span className="tabular-nums text-ink-muted">{project.year}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-ink-secondary">
            {project.subtitle[locale]}
          </p>
          <div className="mt-3">
            <StackSpecLine items={project.stack} />
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-secondary">
            {project.summary[locale]}
          </p>

          {/* Distinct borderless button hierarchy — primary terracotta, secondary stone, tertiary disclosure */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-accent px-4 py-1.5 text-xs font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
              >
                <Globe size={14} weight="bold" />
                <span>{UI_COPY.work.liveDemo[locale]}</span>
                <ArrowUpRight
                  size={13}
                  weight="bold"
                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ) : null}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-recess px-4 py-1.5 text-xs font-semibold text-ink transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-plate active:scale-[0.97]"
            >
              <GithubLogo size={14} weight="bold" />
              <span>{UI_COPY.work.sourceCode[locale]}</span>
              <ArrowUpRight
                size={13}
                weight="bold"
                className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className={`inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 py-1.5 text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                expanded
                  ? "bg-accent-soft text-accent"
                  : "bg-plate text-ink-secondary hover:bg-recess/80 hover:text-ink"
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
                className={`transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
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
                transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 grid grid-cols-1 gap-5 rounded-[12px] border border-hairline bg-plate p-5 sm:grid-cols-3">
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-accent">
                      {UI_COPY.work.problemLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.problem[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-ink">
                      {UI_COPY.work.architectureLabel[locale]}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      {project.architecture[locale]}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-ink">
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
            className="inline-flex w-fit max-w-full flex-wrap items-center gap-1 rounded-[12px] bg-recess p-1"
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
                  className={`inline-flex min-h-[38px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-[9px] px-3.5 text-xs font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                    active
                      ? "bg-ink text-plate"
                      : "bg-transparent text-ink-secondary hover:bg-plate/65 hover:text-ink"
                  }`}
                >
                  <span>{UI_COPY.work.categories[cat][locale]}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? "text-plate/70" : "text-ink-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spotlight Editorial Feature */}
        <AnimatePresence mode="wait">
          {spotlight ? (
            <motion.div
              key={spotlight.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="mt-10 bezel-outer rounded-[18px] p-1.5 ring-1 ring-ink/[0.08]"
            >
              <div className="bezel-inner rounded-[13px] p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-accent">
                        {UI_COPY.work.spotlightLabel[locale]}
                      </span>
                      <span aria-hidden="true" className="text-ink-muted/60">
                        /
                      </span>
                      <span className="text-ink-secondary">
                        {UI_COPY.work.categories[spotlight.category][locale]}
                      </span>
                      <span aria-hidden="true" className="text-ink-muted/60">
                        /
                      </span>
                      <span className="tabular-nums text-ink-muted">
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

                    <div className="mt-5 border-t border-hairline pt-4">
                      <StackSpecLine items={spotlight.stack} />
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-2.5">
                      {spotlight.liveUrl ? (
                        <a
                          href={spotlight.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-accent px-5 text-sm font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover active:scale-[0.97]"
                        >
                          <span>{UI_COPY.work.liveDemo[locale]}</span>
                          <ArrowUpRight
                            size={16}
                            weight="bold"
                            className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </a>
                      ) : null}

                      <a
                        href={spotlight.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] bg-ink px-5 text-sm font-semibold text-plate transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink/85 active:scale-[0.97]"
                      >
                        <GithubLogo size={16} weight="bold" />
                        <span>{UI_COPY.work.sourceCode[locale]}</span>
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-[12px] bg-bench p-5 sm:p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="font-mono text-[11px] font-semibold text-accent">
                            {UI_COPY.work.architectureLabel[locale]}
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                            {spotlight.architecture[locale]}
                          </p>
                        </div>
                        <div className="border-t border-hairline pt-4">
                          <div className="font-mono text-[11px] font-semibold text-ink">
                            {UI_COPY.work.outcomeLabel[locale]}
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                            {spotlight.outcome[locale]}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-hairline pt-4 font-mono tabular-nums">
                        {spotlight.metrics.map((metric) => (
                          <div key={`${metric.value}-${metric.label.en}`}>
                            <div className="text-[10px] text-ink-muted">
                              {metric.label[locale]}
                            </div>
                            <div className="mt-1 text-xs font-bold text-ink sm:text-[13px]">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="mt-10 rounded-[14px] border border-hairline bg-plate p-10 text-center">
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
