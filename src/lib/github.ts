export interface GitHubRepoSummary {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
  homepage: string | null;
  htmlUrl: string;
  updatedAt: string;
}

export interface GitHubLanguageShare {
  name: string;
  count: number;
  percent: number;
  color: string;
}

export interface GitHubTelemetry {
  username: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  languages: GitHubLanguageShare[];
  recentRepos: GitHubRepoSummary[];
  source: "live" | "fallback";
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  "Jupyter Notebook": "#DA5B0B",
  TypeScript: "#3178C6",
  JavaScript: "#D4B106",
  "C++": "#C23B67",
  C: "#555555",
  HTML: "#E34C26",
  Shell: "#3D8B40",
};

const FALLBACK_TELEMETRY: GitHubTelemetry = {
  username: "fathirrizkifadillah",
  avatarUrl: "https://avatars.githubusercontent.com/u/182001014?v=4",
  publicRepos: 28,
  followers: 12,
  following: 15,
  languages: [
    { name: "Jupyter Notebook", count: 9, percent: 35, color: "#DA5B0B" },
    { name: "Python", count: 5, percent: 19, color: "#3572A5" },
    { name: "TypeScript", count: 5, percent: 19, color: "#3178C6" },
    { name: "JavaScript", count: 3, percent: 12, color: "#D4B106" },
    { name: "HTML", count: 2, percent: 8, color: "#E34C26" },
    { name: "C++", count: 1, percent: 4, color: "#C23B67" },
    { name: "Shell", count: 1, percent: 3, color: "#3D8B40" },
  ],
  recentRepos: [
    {
      name: "federated_learning",
      description: "FedSocial V2 decentralized recommendation engine with Flower & PyTorch",
      language: "Jupyter Notebook",
      stars: 0,
      forks: 0,
      fork: false,
      homepage: null,
      htmlUrl: "https://github.com/fathirrizkifadillah/federated_learning",
      updatedAt: "2026-11-24T17:09:35Z",
    },
    {
      name: "PhisGuard_Model_Training",
      description: "Dual-engine XGBoost + LinearSVC phishing threat detection models",
      language: "Jupyter Notebook",
      stars: 1,
      forks: 0,
      fork: false,
      homepage: null,
      htmlUrl: "https://github.com/fathirrizkifadillah/PhisGuard_Model_Training",
      updatedAt: "2026-11-16T04:57:37Z",
    },
    {
      name: "maunc_computer_vision_expression",
      description: "On-device AI expression scanner and 2-player battle for MAUNC",
      language: "JavaScript",
      stars: 0,
      forks: 0,
      fork: false,
      homepage: "https://maunccomputervisionexpression.vercel.app",
      htmlUrl: "https://github.com/fathirrizkifadillah/maunc_computer_vision_expression",
      updatedAt: "2026-11-08T02:08:28Z",
    },
    {
      name: "maunc_computer_vision_calculator",
      description: "Computer vision hand-gesture calculator using MediaPipe",
      language: "JavaScript",
      stars: 0,
      forks: 1,
      fork: false,
      homepage: "https://maunccalculatorcv.vercel.app",
      htmlUrl: "https://github.com/fathirrizkifadillah/maunc_computer_vision_calculator",
      updatedAt: "2026-11-03T16:32:20Z",
    },
    {
      name: "ARDUINO",
      description: "Embedded C++ hardware sketches: smart_trash, deteksi_benda, traffic_light",
      language: "C++",
      stars: 0,
      forks: 0,
      fork: false,
      homepage: null,
      htmlUrl: "https://github.com/fathirrizkifadillah/ARDUINO",
      updatedAt: "2026-11-01T12:28:21Z",
    },
    {
      name: "TaniAdapt",
      description: "Climate-aware precision agricultural decision-support platform",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      fork: false,
      homepage: "https://tani-adapt-xi.vercel.app",
      htmlUrl: "https://github.com/fathirrizkifadillah/TaniAdapt",
      updatedAt: "2026-10-16T14:09:30Z",
    },
  ],
  source: "fallback",
};

interface RawGitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface RawGitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  homepage: string | null;
  html_url: string;
  pushed_at: string;
  updated_at: string;
}

export async function getGitHubTelemetry(
  username: string,
  bypassCache = false
): Promise<GitHubTelemetry> {
  const cleanUser = username.trim() || "fathirrizkifadillah";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "vedora-profile-web",
  };
  if (process.env.GITHUB_TOKEN?.trim()) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }

  const fetchOpts = bypassCache
    ? { headers, cache: "no-store" as const }
    : { headers, next: { revalidate: 3600 } };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, fetchOpts),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&sort=pushed`,
        fetchOpts
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return { ...FALLBACK_TELEMETRY, username: cleanUser };
    }

    const user = (await userRes.json()) as RawGitHubUser;
    const repos = (await reposRes.json()) as RawGitHubRepo[];

    const langCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
      }
    }
    const totalLangRepos = Array.from(langCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const languages: GitHubLanguageShare[] = Array.from(langCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({
        name,
        count,
        percent:
          totalLangRepos > 0 ? Math.max(2, Math.round((count / totalLangRepos) * 100)) : 0,
        color: LANG_COLORS[name] ?? "#525E6B",
      }));

    const recentRepos: GitHubRepoSummary[] = repos
      .filter((repo) => repo.name.toLowerCase() !== cleanUser.toLowerCase())
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        fork: repo.fork,
        homepage: repo.homepage && repo.homepage.trim().length > 0 ? repo.homepage : null,
        htmlUrl: repo.html_url,
        updatedAt: repo.pushed_at || repo.updated_at,
      }));

    return {
      username: user.login,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      languages: languages.length > 0 ? languages : FALLBACK_TELEMETRY.languages,
      recentRepos: recentRepos.length > 0 ? recentRepos : FALLBACK_TELEMETRY.recentRepos,
      source: "live",
    };
  } catch {
    return { ...FALLBACK_TELEMETRY, username: cleanUser };
  }
}
