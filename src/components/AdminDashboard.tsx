"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ArrowsClockwise,
  Check,
  Database,
  DownloadSimple,
  FloppyDisk,
  FolderSimple,
  GithubLogo,
  IdentificationCard,
  Plus,
  SignOut,
  SlidersHorizontal,
  Star,
  Trash,
  UploadSimple,
  UserList,
} from "@phosphor-icons/react";
import type { ProjectItem } from "@/data/profile";
import type { GitHubRepoSummary, GitHubTelemetry } from "@/lib/github";
import type { StorageBackend } from "@/lib/profile-store";
import {
  DEFAULT_PROFILE_CONTENT,
  type ProfileContent,
} from "@/types/profile-content";

type AdminTab =
  | "identity"
  | "projects"
  | "github-sync"
  | "focus-stack"
  | "timeline-certs"
  | "storage";

interface AdminDashboardProps {
  initialContent: ProfileContent;
  storageBackend: StorageBackend;
}

const STORAGE_LABELS: Record<StorageBackend, string> = {
  "redis-url": "Redis Cloud (REDIS_URL Live)",
  "upstash-kv": "Upstash Redis (Cloud Live)",
  "github-repo": "GitHub Repo JSON (Cloud Live)",
  "local-fs": "Local JSON (data/profile.json)",
  "readonly-seed": "Read-only (Connect Redis)",
};

function splitTags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinTags(tags: string[]): string {
  return tags.join(", ");
}

function createEmptyProject(): ProjectItem {
  const id = `project-${Date.now()}`;
  return {
    id,
    title: "New AI / IoT Project",
    subtitle: { en: "Short technical subtitle", id: "Subjudul teknis singkat" },
    category: "ai-llm",
    year: "2026",
    featured: false,
    summary: {
      en: "Concise description of what this system builds and solves.",
      id: "Deskripsi singkat tentang apa yang dibangun dan diselesaikan sistem ini.",
    },
    problem: {
      en: "Core technical challenge addressed.",
      id: "Tantangan teknis utama yang diselesaikan.",
    },
    architecture: {
      en: "Key model, pipeline, or hardware architecture decisions.",
      id: "Keputusan arsitektur model, pipeline, atau perangkat keras.",
    },
    outcome: {
      en: "Measurable validation result or deployment outcome.",
      id: "Hasil validasi terukur atau status deployment.",
    },
    metrics: [
      { label: { en: "Status", id: "Status" }, value: "Active" },
      { label: { en: "Domain", id: "Domain" }, value: "AI / IoT" },
      { label: { en: "Stack", id: "Stack" }, value: "Python" },
    ],
    stack: ["Python", "TypeScript"],
    githubUrl: "https://github.com/fathirrizkifadillah",
    liveUrl: "",
  };
}

export function AdminDashboard({
  initialContent,
  storageBackend,
}: AdminDashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("identity");
  const [content, setContent] = useState<ProfileContent>(initialContent);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [syncingGithub, setSyncingGithub] = useState(false);
  const [githubData, setGithubData] = useState<GitHubTelemetry | null>(null);

  function updateContent(updater: (prev: ProfileContent) => ProfileContent) {
    setContent((prev) => updater(prev));
    setDirty(true);
    setNotice(null);
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        storage?: StorageBackend;
      };
      if (!res.ok) {
        setNotice({
          type: "error",
          text: body.error ?? "Gagal menyimpan perubahan.",
        });
        setSaving(false);
        return;
      }

      setDirty(false);
      setNotice({
        type: "success",
        text: `Perubahan tersimpan ke ${STORAGE_LABELS[body.storage ?? storageBackend]} dan langsung live di vedora.my.id.`,
      });
    } catch {
      setNotice({
        type: "error",
        text: "Koneksi gagal saat menyimpan perubahan.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function handleFetchGitHub() {
    setSyncingGithub(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/github-sync");
      const body = (await res.json()) as {
        telemetry?: GitHubTelemetry;
        error?: string;
      };
      if (!res.ok || !body.telemetry) {
        setNotice({
          type: "error",
          text: body.error ?? "Gagal mengambil data GitHub.",
        });
        return;
      }
      setGithubData(body.telemetry);
    } catch {
      setNotice({
        type: "error",
        text: "Gagal terhubung ke endpoint GitHub Sync.",
      });
    } finally {
      setSyncingGithub(false);
    }
  }

  function handleImportRepo(repo: GitHubRepoSummary) {
    const exists = content.projects.some(
      (p) => p.githubUrl.toLowerCase() === repo.htmlUrl.toLowerCase()
    );
    if (exists) {
      setNotice({
        type: "error",
        text: `Repo ${repo.name} sudah ada di daftar proyek kamu.`,
      });
      return;
    }

    const inferredCategory: ProjectItem["category"] =
      repo.language === "C++"
        ? "iot-hardware"
        : repo.name.toLowerCase().includes("vision")
          ? "vision"
          : repo.language === "Jupyter Notebook"
            ? "data-systems"
            : "ai-llm";

    const imported: ProjectItem = {
      id: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: repo.name.replace(/[-_]+/g, " "),
      subtitle: {
        en: repo.description || "GitHub Engineering Repository",
        id: repo.description || "Repositori Rekayasa GitHub",
      },
      category: inferredCategory,
      year: repo.updatedAt.slice(0, 4) || "2026",
      featured: false,
      summary: {
        en: repo.description || "Public repository imported from GitHub.",
        id: repo.description || "Repositori publik diimpor dari GitHub.",
      },
      problem: {
        en: "Edit problem statement in Projects tab.",
        id: "Edit tantangan proyek di tab Projects.",
      },
      architecture: {
        en: `Built with ${repo.language || "modern engineering tools"}.`,
        id: `Dibangun menggunakan ${repo.language || "stack rekayasa modern"}.`,
      },
      outcome: {
        en: repo.homepage ? "Deployed live and open-sourced." : "Published open-source on GitHub.",
        id: repo.homepage ? "Dirilis live dan open-source." : "Dipublikasikan open-source di GitHub.",
      },
      metrics: [
        { label: { en: "Language", id: "Bahasa" }, value: repo.language || "Multi" },
        { label: { en: "Stars", id: "Stars" }, value: String(repo.stars) },
        { label: { en: "Updated", id: "Update" }, value: repo.updatedAt.slice(0, 10) },
      ],
      stack: repo.language ? [repo.language] : ["GitHub"],
      githubUrl: repo.htmlUrl,
      liveUrl: repo.homepage || undefined,
    };

    updateContent((prev) => ({
      ...prev,
      projects: [imported, ...prev.projects],
    }));
    setNotice({
      type: "success",
      text: `Repo ${repo.name} ditambahkan ke daftar Projects. Klik Save Changes untuk menyimpan.`,
    });
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vedora-profile-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ProfileContent;
        if (!parsed.meta || !parsed.hero || !Array.isArray(parsed.projects)) {
          setNotice({ type: "error", text: "Format JSON backup tidak valid." });
          return;
        }
        updateContent(() => parsed);
        setNotice({
          type: "success",
          text: "Backup JSON berhasil dimuat. Klik Save Changes untuk menerapkan.",
        });
      } catch {
        setNotice({ type: "error", text: "File bukan JSON yang valid." });
      }
    };
    reader.readAsText(file);
  }

  function moveProject(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= content.projects.length) return;
    updateContent((prev) => {
      const next = [...prev.projects];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...prev, projects: next };
    });
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof IdentificationCard }> = [
    { id: "identity", label: "Identity & Hero", icon: IdentificationCard },
    { id: "projects", label: `Projects (${content.projects.length})`, icon: FolderSimple },
    { id: "github-sync", label: "GitHub Sync", icon: GithubLogo },
    { id: "focus-stack", label: "Focus & Stack", icon: SlidersHorizontal },
    { id: "timeline-certs", label: "Timeline & Certs", icon: UserList },
    { id: "storage", label: "Storage & Backup", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-bench text-ink">
      {/* Sticky Top Control Bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-plate/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-sm font-semibold text-plate">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Vedora Studio
                </span>
                <span className="rounded-full bg-recess px-2.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                  {STORAGE_LABELS[storageBackend]}
                </span>
                {dirty ? (
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                    Unsaved
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-ink-muted">
                Kelola konten vedora.my.id tanpa edit hardcode
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-hairline-strong bg-plate px-4 text-xs font-medium text-ink hover:border-ink"
            >
              <span>Lihat web</span>
              <ArrowUpRight size={14} weight="bold" />
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-ink px-5 text-xs font-medium text-plate transition-colors hover:bg-accent active:scale-[0.98] disabled:opacity-60"
            >
              <FloppyDisk size={15} weight="bold" />
              <span>{saving ? "Menyimpan..." : "Save Changes"}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-hairline bg-recess px-3.5 text-xs font-medium text-ink-secondary hover:text-ink"
            >
              <SignOut size={15} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6">
        {storageBackend === "readonly-seed" ? (
          <div className="mb-5 rounded-2xl border border-accent/30 bg-accent-soft/70 p-4 text-xs leading-relaxed text-ink">
            <strong>Mode Cloud Storage belum terhubung:</strong> Karena Vercel
            bersifat serverless (filesystem read-only), sambungkan database{" "}
            <strong>Upstash Redis (Gratis)</strong> lewat menu{" "}
            <code className="rounded bg-plate px-1.5 py-0.5 font-mono">
              Vercel Project → Storage → Create Database → Upstash Redis
            </code>{" "}
            supaya tombol <strong>Save Changes</strong> menyimpan permanen
            secara instan. Kamu tetap bisa edit &amp; download backup JSON di
            tab <strong>Storage &amp; Backup</strong>.
          </div>
        ) : null}

        {notice ? (
          <div
            role="status"
            className={`mb-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-medium ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-900/70 bg-red-950/50 text-red-300"
            }`}
          >
            {notice.type === "success" ? <Check size={16} weight="bold" /> : null}
            <span>{notice.text}</span>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5 rounded-2xl bg-recess p-1.5">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-plate text-ink shadow-sm"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                <Icon size={15} className={active ? "text-accent" : ""} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: IDENTITY & HERO */}
        {tab === "identity" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 rounded-2xl border border-hairline bg-plate p-6 lg:col-span-7">
              <h2 className="font-display text-lg font-semibold text-ink">
                Identitas, Media GitHub &amp; Hero Copy
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Full Name
                  <input
                    type="text"
                    value={content.meta.fullName}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, fullName: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Alias / Brand
                  <input
                    type="text"
                    value={content.meta.alias}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, alias: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  GitHub Username
                  <input
                    type="text"
                    value={content.meta.githubUsername}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, githubUsername: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 font-mono text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Public Email
                  <input
                    type="email"
                    value={content.meta.email}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, email: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 font-mono text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  University
                  <input
                    type="text"
                    value={content.meta.university}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, university: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  GPA / IPK
                  <input
                    type="text"
                    value={content.meta.gpa}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, gpa: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 font-mono text-sm font-normal"
                  />
                </label>
              </div>

              <div className="space-y-4 border-t border-hairline pt-5">
                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Hero Status Badge (EN)
                  <input
                    type="text"
                    value={content.hero.status.en}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          status: { ...p.hero.status, en: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Hero Status Badge (ID)
                  <input
                    type="text"
                    value={content.hero.status.id}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          status: { ...p.hero.status, id: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Headline (EN)
                  <input
                    type="text"
                    value={content.hero.headline.en}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          headline: { ...p.hero.headline, en: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Headline (ID)
                  <input
                    type="text"
                    value={content.hero.headline.id}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          headline: { ...p.hero.headline, id: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Intro Bio (EN)
                  <textarea
                    rows={3}
                    value={content.hero.intro.en}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          intro: { ...p.hero.intro, en: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Intro Bio (ID)
                  <textarea
                    rows={3}
                    value={content.hero.intro.id}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          intro: { ...p.hero.intro, id: e.target.value },
                        },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 text-sm font-normal"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Motto
                  <input
                    type="text"
                    value={content.meta.motto}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, motto: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2.5 font-mono text-sm font-normal"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-5">
              {/* Visual Media Preview & Toggles */}
              <div className="space-y-4 rounded-2xl border border-hairline bg-plate p-6">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Avatar, Banner GitHub &amp; Toggles
                </h2>

                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.meta.avatarUrl}
                    alt="Avatar preview"
                    className="h-16 w-16 rounded-2xl border border-hairline object-cover"
                  />
                  <label className="flex flex-1 flex-col gap-1.5 text-xs font-medium text-ink">
                    Avatar URL
                    <input
                      type="url"
                      value={content.meta.avatarUrl}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          meta: { ...p.meta, avatarUrl: e.target.value },
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
                  Banner Image / GIF URL (dari GitHub README)
                  <input
                    type="url"
                    value={content.meta.bannerUrl}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        meta: { ...p.meta, bannerUrl: e.target.value },
                      }))
                    }
                    className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                  />
                </label>

                {content.meta.bannerUrl ? (
                  <div className="overflow-hidden rounded-xl border border-hairline bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.meta.bannerUrl}
                      alt="Banner preview"
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="space-y-2.5 border-t border-hairline pt-4">
                  <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-ink">
                    <span>Tampilkan Banner GitHub di Hero</span>
                    <input
                      type="checkbox"
                      checked={content.meta.showBanner}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          meta: { ...p.meta, showBanner: e.target.checked },
                        }))
                      }
                      className="h-4 w-4 accent-accent"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-ink">
                    <span>Tampilkan Section Live GitHub Pulse</span>
                    <input
                      type="checkbox"
                      checked={content.meta.showGitHubPulse}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          meta: { ...p.meta, showGitHubPulse: e.target.checked },
                        }))
                      }
                      className="h-4 w-4 accent-accent"
                    />
                  </label>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3.5 rounded-2xl border border-hairline bg-plate p-6">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Social &amp; Profile Links
                </h2>
                {(["github", "linkedin", "kaggle", "instagram"] as const).map(
                  (key) => (
                    <label
                      key={key}
                      className="flex flex-col gap-1 text-xs font-medium capitalize text-ink"
                    >
                      {key}
                      <input
                        type="url"
                        value={content.meta.links[key]}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            meta: {
                              ...p.meta,
                              links: { ...p.meta.links, [key]: e.target.value },
                            },
                          }))
                        }
                        className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                      />
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* TAB 2: PROJECTS CRUD */}
        {tab === "projects" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Daftar Proyek ({content.projects.length})
                </h2>
                <p className="text-xs text-ink-muted">
                  Tambah, ubah urutan, set Featured spotlight, atau hapus proyek.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateContent((p) => ({
                    ...p,
                    projects: [createEmptyProject(), ...p.projects],
                  }))
                }
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-medium text-plate hover:bg-accent"
              >
                <Plus size={15} weight="bold" />
                <span>Tambah Proyek</span>
              </button>
            </div>

            {content.projects.map((project, index) => (
              <div
                key={project.id}
                className="rounded-2xl border border-hairline bg-plate p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-muted">
                      #{index + 1}
                    </span>
                    <span className="font-display text-base font-semibold text-ink">
                      {project.title}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent">
                        Spotlight
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, idx) => ({
                            ...item,
                            featured: idx === index ? !item.featured : false,
                          })),
                        }))
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-hairline px-2.5 text-xs text-ink-secondary hover:border-accent hover:text-accent"
                    >
                      <Star
                        size={13}
                        weight={project.featured ? "fill" : "regular"}
                      />
                      <span>Spotlight</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProject(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-ink-secondary hover:text-ink disabled:opacity-40"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProject(index, 1)}
                      disabled={index === content.projects.length - 1}
                      aria-label="Move down"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-ink-secondary hover:text-ink disabled:opacity-40"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.filter((_, i) => i !== index),
                        }))
                      }
                      aria-label="Delete project"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/70 text-red-400 hover:bg-red-950/50"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                    Title
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index ? { ...item, title: e.target.value } : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 text-sm font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium">
                    Category
                    <select
                      value={project.category}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  category: e.target.value as ProjectItem["category"],
                                }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 text-sm font-normal"
                    >
                      <option value="ai-llm">Applied AI &amp; LLM</option>
                      <option value="vision">Edge Vision</option>
                      <option value="iot-hardware">IoT &amp; Hardware</option>
                      <option value="data-systems">Data &amp; Analytics</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium">
                    Year
                    <input
                      type="text"
                      value={project.year}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index ? { ...item, year: e.target.value } : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-sm font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                    GitHub URL
                    <input
                      type="url"
                      value={project.githubUrl}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? { ...item, githubUrl: e.target.value }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                    Live Demo URL (opsional)
                    <input
                      type="url"
                      value={project.liveUrl ?? ""}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  liveUrl: e.target.value.trim() || undefined,
                                }
                              : item
                          ),
                        }))
                      }
                      placeholder="https://..."
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-4">
                    Tech Stack (pisahkan dengan koma)
                    <input
                      type="text"
                      value={joinTags(project.stack)}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? { ...item, stack: splitTags(e.target.value) }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 font-mono text-xs font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                    Summary (EN)
                    <textarea
                      rows={2}
                      value={project.summary.en}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  summary: { ...item.summary, en: e.target.value },
                                }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 text-xs font-normal"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                    Summary (ID)
                    <textarea
                      rows={2}
                      value={project.summary.id}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          projects: p.projects.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  summary: { ...item.summary, id: e.target.value },
                                }
                              : item
                          ),
                        }))
                      }
                      className="rounded-xl border border-hairline-strong bg-bench/50 px-3 py-2 text-xs font-normal"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* TAB 3: GITHUB SYNC */}
        {tab === "github-sync" ? (
          <div className="rounded-2xl border border-hairline bg-plate p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Sinkronisasi Repositori dari GitHub
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Tarik daftar repo terbaru dari{" "}
                  <code className="font-mono">@{content.meta.githubUsername}</code>{" "}
                  lalu impor ke daftar Projects dengan 1 klik.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFetchGitHub}
                disabled={syncingGithub}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-ink px-5 text-xs font-medium text-plate hover:bg-accent disabled:opacity-60"
              >
                <ArrowsClockwise
                  size={15}
                  className={syncingGithub ? "animate-spin" : ""}
                />
                <span>
                  {syncingGithub ? "Mengambil data..." : "Fetch Latest Repos"}
                </span>
              </button>
            </div>

            {githubData ? (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-3 font-mono text-xs text-ink-secondary">
                  <span className="rounded-lg bg-bench px-3 py-1.5">
                    {githubData.publicRepos} public repos
                  </span>
                  <span className="rounded-lg bg-bench px-3 py-1.5">
                    {githubData.followers} followers
                  </span>
                  <span className="rounded-lg bg-bench px-3 py-1.5">
                    Source: {githubData.source}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {githubData.recentRepos.map((repo) => {
                    const alreadyAdded = content.projects.some(
                      (p) =>
                        p.githubUrl.toLowerCase() === repo.htmlUrl.toLowerCase()
                    );
                    return (
                      <div
                        key={repo.name}
                        className="flex items-start justify-between gap-3 rounded-xl border border-hairline bg-bench/60 p-4"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-sm font-semibold text-ink">
                            {repo.name}
                          </div>
                          <p className="mt-1 text-xs text-ink-secondary">
                            {repo.description || "No description"}
                          </p>
                          <div className="mt-2 font-mono text-[11px] text-ink-muted">
                            {repo.language || "Multi"} / {repo.updatedAt.slice(0, 10)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImportRepo(repo)}
                          disabled={alreadyAdded}
                          className="shrink-0 rounded-full border border-hairline-strong bg-plate px-3.5 py-1.5 text-xs font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          {alreadyAdded ? "Sudah ada" : "Impor"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-ink-secondary">
                Klik <strong>Fetch Latest Repos</strong> untuk memuat daftar
                repositori terbaru dari GitHub.
              </p>
            )}
          </div>
        ) : null}

        {/* TAB 4: FOCUS & STACK */}
        {tab === "focus-stack" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-hairline bg-plate p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Current Focus (GitHub README)
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((p) => ({
                      ...p,
                      currentFocus: [
                        ...p.currentFocus,
                        {
                          id: `focus-${Date.now()}`,
                          text: { en: "New focus track", id: "Fokus baru" },
                        },
                      ],
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-full bg-recess px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink hover:text-plate"
                >
                  <Plus size={13} />
                  <span>Tambah</span>
                </button>
              </div>

              {content.currentFocus.map((track, idx) => (
                <div
                  key={track.id}
                  className="space-y-2 rounded-xl border border-hairline bg-bench/60 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-ink-muted">
                      Item #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((p) => ({
                          ...p,
                          currentFocus: p.currentFocus.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-600 hover:opacity-75"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={track.text.en}
                    placeholder="English"
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        currentFocus: p.currentFocus.map((t, i) =>
                          i === idx
                            ? { ...t, text: { ...t.text, en: e.target.value } }
                            : t
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={track.text.id}
                    placeholder="Indonesia"
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        currentFocus: p.currentFocus.map((t, i) =>
                          i === idx
                            ? { ...t, text: { ...t.text, id: e.target.value } }
                            : t
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-2xl border border-hairline bg-plate p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Technical Stack Groups
              </h2>
              {content.stackGroups.map((group, idx) => (
                <div
                  key={group.id}
                  className="space-y-2 rounded-xl border border-hairline bg-bench/60 p-3.5"
                >
                  <div className="text-xs font-semibold text-ink">
                    {group.label.en}
                  </div>
                  <input
                    type="text"
                    value={joinTags(group.items)}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        stackGroups: p.stackGroups.map((g, i) =>
                          i === idx
                            ? { ...g, items: splitTags(e.target.value) }
                            : g
                        ),
                      }))
                    }
                    className="w-full rounded-lg border border-hairline-strong bg-plate px-3 py-2 font-mono text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* TAB 5: TIMELINE & CERTIFICATIONS */}
        {tab === "timeline-certs" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-hairline bg-plate p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Verified Certifications ({content.certifications.length})
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((p) => ({
                      ...p,
                      certifications: [
                        ...p.certifications,
                        {
                          id: `cert-${Date.now()}`,
                          title: "New Certification",
                          issuer: "Issuer",
                          issued: "2026",
                          credentialUrl: "https://",
                          focus: ["AI"],
                        },
                      ],
                    }))
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-plate hover:bg-accent"
                >
                  <Plus size={14} />
                  <span>Tambah Sertifikasi</span>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {content.certifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-bench/60 p-4 sm:grid-cols-4"
                  >
                    <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                      Title
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.map((c, i) =>
                              i === idx ? { ...c, title: e.target.value } : c
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Issuer
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.map((c, i) =>
                              i === idx ? { ...c, issuer: e.target.value } : c
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Issued Date
                      <input
                        type="text"
                        value={cert.issued}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.map((c, i) =>
                              i === idx ? { ...c, issued: e.target.value } : c
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 font-mono text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                      Credential URL
                      <input
                        type="url"
                        value={cert.credentialUrl}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.map((c, i) =>
                              i === idx
                                ? { ...c, credentialUrl: e.target.value }
                                : c
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 font-mono text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Topics (koma)
                      <input
                        type="text"
                        value={joinTags(cert.focus)}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.map((c, i) =>
                              i === idx
                                ? { ...c, focus: splitTags(e.target.value) }
                                : c
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 font-mono text-xs font-normal"
                      />
                    </label>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((p) => ({
                            ...p,
                            certifications: p.certifications.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-red-900/70 px-3 text-xs text-red-400 hover:bg-red-950/50"
                      >
                        <Trash size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-hairline bg-plate p-6">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Experience &amp; Leadership ({content.experiences.length})
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((p) => ({
                      ...p,
                      experiences: [
                        {
                          id: `exp-${Date.now()}`,
                          role: { en: "New Role", id: "Peran Baru" },
                          organization: "Organization",
                          period: { en: "2026 — Present", id: "2026 — Sekarang" },
                          location: "Indonesia",
                          type: "engineering",
                          description: { en: "Role summary.", id: "Ringkasan peran." },
                          skills: ["AI", "IoT"],
                        },
                        ...p.experiences,
                      ],
                    }))
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-plate hover:bg-accent"
                >
                  <Plus size={14} />
                  <span>Tambah Pengalaman</span>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {content.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-hairline bg-bench/60 p-4 sm:grid-cols-3"
                  >
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Role (EN)
                      <input
                        type="text"
                        value={exp.role.en}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx
                                ? { ...item, role: { ...item.role, en: e.target.value } }
                                : item
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Role (ID)
                      <input
                        type="text"
                        value={exp.role.id}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx
                                ? { ...item, role: { ...item.role, id: e.target.value } }
                                : item
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium">
                      Organization
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx
                                ? { ...item, organization: e.target.value }
                                : item
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium sm:col-span-2">
                      Description (EN)
                      <textarea
                        rows={2}
                        value={exp.description.en}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    description: {
                                      ...item.description,
                                      en: e.target.value,
                                    },
                                  }
                                : item
                            ),
                          }))
                        }
                        className="rounded-lg border border-hairline-strong bg-plate px-3 py-2 text-xs font-normal"
                      />
                    </label>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((p) => ({
                            ...p,
                            experiences: p.experiences.filter((_, i) => i !== idx),
                          }))
                        }
                        className="inline-flex h-9 items-center gap-1 rounded-lg border border-red-900/70 px-3 text-xs text-red-400 hover:bg-red-950/50"
                      >
                        <Trash size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* TAB 6: STORAGE & BACKUP */}
        {tab === "storage" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-hairline bg-plate p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Status Penyimpanan Cloud (Tanpa VPS)
              </h2>
              <div className="rounded-xl bg-bench p-4 font-mono text-xs">
                Active backend:{" "}
                <strong className="text-accent">
                  {STORAGE_LABELS[storageBackend]}
                </strong>
              </div>
              <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-ink-secondary">
                <li>
                  Di dashboard Vercel proyek <code>profile</code>, buka{" "}
                  <strong>Settings → Environment Variables</strong> lalu
                  tambahkan <code>ADMIN_PASSWORD</code> berisi password rahasia
                  kamu.
                </li>
                <li>
                  Untuk simpan edit permanen di production tanpa VPS, buka tab{" "}
                  <strong>Storage</strong> di Vercel → klik{" "}
                  <strong>Create Database → Upstash Redis (Free)</strong> →
                  hubungkan ke proyek <code>profile</code>.
                </li>
                <li>
                  Vercel otomatis menambahkan{" "}
                  <code>UPSTASH_REDIS_REST_URL</code> dan{" "}
                  <code>UPSTASH_REDIS_REST_TOKEN</code>. Setelah redeploy 1x,
                  semua edit dari <code>vedora.my.id/admin</code> langsung live
                  dalam &lt; 1 detik!
                </li>
              </ol>
            </div>

            <div className="space-y-4 rounded-2xl border border-hairline bg-plate p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Backup &amp; Restore JSON
              </h2>
              <p className="text-xs leading-relaxed text-ink-secondary">
                Ekspor seluruh isi profil kamu ke file JSON kapan saja, impor
                dari backup, atau kembalikan ke konten default.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-hairline-strong bg-plate px-4 text-xs font-medium text-ink hover:border-ink"
                >
                  <DownloadSimple size={15} />
                  <span>Export JSON</span>
                </button>

                <label className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full border border-hairline-strong bg-plate px-4 text-xs font-medium text-ink hover:border-ink">
                  <UploadSimple size={15} />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    updateContent(() => DEFAULT_PROFILE_CONTENT);
                    setNotice({
                      type: "success",
                      text: "Konten dikembalikan ke default. Klik Save Changes untuk menyimpan.",
                    });
                  }}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-[10px] border border-red-900/70 px-4 text-xs font-medium text-red-400 hover:bg-red-950/50"
                >
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
