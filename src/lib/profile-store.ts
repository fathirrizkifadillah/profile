import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_PROFILE_CONTENT,
  type ProfileContent,
} from "@/types/profile-content";

const KV_KEY = "vedora:profile:v1";
const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "profile.json");

export type StorageBackend = "upstash-kv" | "github-repo" | "local-fs" | "readonly-seed";

function getKvConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

function getGitHubStoreConfig(): {
  token: string;
  repo: string;
  branch: string;
  filePath: string;
} | null {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_DATA_REPO?.trim();
  if (!token || !repo) return null;
  return {
    token,
    repo,
    branch: process.env.GITHUB_DATA_BRANCH?.trim() || "main",
    filePath: process.env.GITHUB_DATA_PATH?.trim() || "data/profile.json",
  };
}

export function detectStorageBackend(): StorageBackend {
  if (getKvConfig()) return "upstash-kv";
  if (getGitHubStoreConfig()) return "github-repo";
  if (process.env.VERCEL) return "readonly-seed";
  return "local-fs";
}

function mergeWithDefaults(partial: Partial<ProfileContent>): ProfileContent {
  return {
    ...DEFAULT_PROFILE_CONTENT,
    ...partial,
    meta: {
      ...DEFAULT_PROFILE_CONTENT.meta,
      ...(partial.meta ?? {}),
      links: {
        ...DEFAULT_PROFILE_CONTENT.meta.links,
        ...(partial.meta?.links ?? {}),
      },
      major: {
        ...DEFAULT_PROFILE_CONTENT.meta.major,
        ...(partial.meta?.major ?? {}),
      },
      location: {
        ...DEFAULT_PROFILE_CONTENT.meta.location,
        ...(partial.meta?.location ?? {}),
      },
    },
    hero: {
      ...DEFAULT_PROFILE_CONTENT.hero,
      ...(partial.hero ?? {}),
    },
    contact: {
      ...DEFAULT_PROFILE_CONTENT.contact,
      ...(partial.contact ?? {}),
    },
    projects: Array.isArray(partial.projects)
      ? partial.projects
      : DEFAULT_PROFILE_CONTENT.projects,
    capabilities: Array.isArray(partial.capabilities)
      ? partial.capabilities
      : DEFAULT_PROFILE_CONTENT.capabilities,
    experiences: Array.isArray(partial.experiences)
      ? partial.experiences
      : DEFAULT_PROFILE_CONTENT.experiences,
    education: Array.isArray(partial.education)
      ? partial.education
      : DEFAULT_PROFILE_CONTENT.education,
    certifications: Array.isArray(partial.certifications)
      ? partial.certifications
      : DEFAULT_PROFILE_CONTENT.certifications,
    currentFocus: Array.isArray(partial.currentFocus)
      ? partial.currentFocus
      : DEFAULT_PROFILE_CONTENT.currentFocus,
    stackGroups: Array.isArray(partial.stackGroups)
      ? partial.stackGroups
      : DEFAULT_PROFILE_CONTENT.stackGroups,
  };
}

export async function getProfileContent(): Promise<ProfileContent> {
  const kv = getKvConfig();
  if (kv) {
    try {
      const res = await fetch(`${kv.url}/get/${encodeURIComponent(KV_KEY)}`, {
        headers: { Authorization: `Bearer ${kv.token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const body = (await res.json()) as { result?: string | null };
        if (body.result) {
          const parsed = JSON.parse(body.result) as Partial<ProfileContent>;
          return mergeWithDefaults(parsed);
        }
      }
    } catch {
      // Fallback safely to local or default content
    }
  }

  const gh = getGitHubStoreConfig();
  if (gh) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${gh.repo}/contents/${gh.filePath}?ref=${encodeURIComponent(gh.branch)}`,
        {
          headers: {
            Authorization: `Bearer ${gh.token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "vedora-profile-cms",
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const body = (await res.json()) as { content?: string };
        if (body.content) {
          const decoded = Buffer.from(body.content, "base64").toString("utf8");
          const parsed = JSON.parse(decoded) as Partial<ProfileContent>;
          return mergeWithDefaults(parsed);
        }
      }
    } catch {
      // Fallback to local file
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ProfileContent>;
    return mergeWithDefaults(parsed);
  } catch {
    return DEFAULT_PROFILE_CONTENT;
  }
}

export async function saveProfileContent(
  input: ProfileContent
): Promise<{ ok: true; backend: StorageBackend } | { ok: false; error: string; backend: StorageBackend }> {
  const normalized: ProfileContent = {
    ...mergeWithDefaults(input),
    updatedAt: new Date().toISOString(),
  };
  const serialized = JSON.stringify(normalized, null, 2);

  const kv = getKvConfig();
  if (kv) {
    const res = await fetch(`${kv.url}/set/${encodeURIComponent(KV_KEY)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kv.token}`,
        "Content-Type": "text/plain",
      },
      body: serialized,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        backend: "upstash-kv",
        error: `Failed to save to Upstash Redis (${res.status}): ${detail}`,
      };
    }
    return { ok: true, backend: "upstash-kv" };
  }

  const gh = getGitHubStoreConfig();
  if (gh) {
    let sha: string | undefined;
    const existing = await fetch(
      `https://api.github.com/repos/${gh.repo}/contents/${gh.filePath}?ref=${encodeURIComponent(gh.branch)}`,
      {
        headers: {
          Authorization: `Bearer ${gh.token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "vedora-profile-cms",
        },
        cache: "no-store",
      }
    );
    if (existing.ok) {
      const body = (await existing.json()) as { sha?: string };
      sha = body.sha;
    }

    const saveRes = await fetch(
      `https://api.github.com/repos/${gh.repo}/contents/${gh.filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${gh.token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "vedora-profile-cms",
        },
        body: JSON.stringify({
          message: `chore(cms): update profile content via /admin`,
          content: Buffer.from(serialized, "utf8").toString("base64"),
          branch: gh.branch,
          ...(sha ? { sha } : {}),
        }),
      }
    );

    if (!saveRes.ok) {
      const detail = await saveRes.text().catch(() => "");
      return {
        ok: false,
        backend: "github-repo",
        error: `Failed to save to GitHub (${saveRes.status}): ${detail}`,
      };
    }
    return { ok: true, backend: "github-repo" };
  }

  if (process.env.VERCEL) {
    return {
      ok: false,
      backend: "readonly-seed",
      error:
        "Cloud storage is not connected yet. Connect free Upstash Redis in Vercel Storage (auto-adds UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN) to persist edits online, or use Export JSON.",
    };
  }

  await fs.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DATA_PATH, serialized, "utf8");
  return { ok: true, backend: "local-fs" };
}
