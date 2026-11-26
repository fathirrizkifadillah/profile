export interface PhishingSignal {
  id: string;
  label: string;
  detail: string;
  weight: number;
  triggered: boolean;
}

export interface PhishingReport {
  normalizedUrl: string;
  score: number;
  verdict: "LOW RISK" | "SUSPICIOUS" | "HIGH RISK";
  entropy: number;
  signals: PhishingSignal[];
}

const SUSPICIOUS_TLDS = new Set([
  "xyz",
  "top",
  "click",
  "zip",
  "tk",
  "gq",
  "ml",
  "cf",
  "work",
  "buzz",
  "rest",
  "monster",
]);

const LURE_TOKENS = [
  "login",
  "verify",
  "update",
  "secure",
  "account",
  "suspend",
  "urgent",
  "confirm",
  "wallet",
  "signin",
  "unlock",
  "banking",
  "paypa1",
  "g00gle",
  "micros0ft",
  "app1e",
];

function shannonEntropy(input: string): number {
  if (!input.length) return 0;
  const counts = new Map<string, number>();
  for (const ch of input) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  let entropy = 0;
  const len = input.length;
  for (const count of counts.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

export function analyzeUrlPhishing(rawInput: string): PhishingReport {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      normalizedUrl: "",
      score: 0,
      verdict: "LOW RISK",
      entropy: 0,
      signals: [],
    };
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL | null = null;
  try {
    parsed = new URL(candidate);
  } catch {
    parsed = null;
  }

  const lower = candidate.toLowerCase();
  const host = parsed?.hostname.toLowerCase() ?? trimmed.toLowerCase();
  const pathAndQuery = parsed ? `${parsed.pathname}${parsed.search}` : trimmed;

  const isInsecureHttp = lower.startsWith("http://");
  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  const hostParts = host.split(".").filter(Boolean);
  const tld = hostParts[hostParts.length - 1] ?? "";
  const hasSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  const hasExcessiveSubdomains = hostParts.length >= 4;
  const hasAtSymbol = trimmed.includes("@");
  const matchedLures = LURE_TOKENS.filter((token) => lower.includes(token));
  const entropy = shannonEntropy(pathAndQuery.replace(/^\/+/, "") || host);
  const isHighEntropy = entropy >= 4.15 || candidate.length > 68;

  const signals: PhishingSignal[] = [
    {
      id: "transport",
      label: "Transport & Host",
      detail: isIpHost
        ? `Raw IP host (${host})`
        : isInsecureHttp
          ? "Unencrypted HTTP transport"
          : "TLS HTTPS standard host",
      weight: isIpHost ? 32 : isInsecureHttp ? 18 : 0,
      triggered: isIpHost || isInsecureHttp,
    },
    {
      id: "domain",
      label: "TLD & Structure",
      detail: hasAtSymbol
        ? "Contains '@' credential redirect"
        : hasSuspiciousTld
          ? `High-abuse TLD (.${tld})`
          : hasExcessiveSubdomains
            ? `Deep subdomain chain (${hostParts.length} levels)`
            : `Clean domain (.${tld || "local"})`,
      weight: hasAtSymbol ? 28 : hasSuspiciousTld ? 24 : hasExcessiveSubdomains ? 14 : 0,
      triggered: hasAtSymbol || hasSuspiciousTld || hasExcessiveSubdomains,
    },
    {
      id: "lures",
      label: "Brand & Lure Tokens",
      detail:
        matchedLures.length > 0
          ? `Matched: ${matchedLures.slice(0, 3).join(", ")}`
          : "No credential lure patterns",
      weight: Math.min(34, matchedLures.length * 14),
      triggered: matchedLures.length > 0,
    },
    {
      id: "entropy",
      label: "Lexical Entropy",
      detail: isHighEntropy
        ? `High randomness (${entropy} bits / ${candidate.length} chars)`
        : `Normal entropy (${entropy} bits)`,
      weight: isHighEntropy ? 16 : 0,
      triggered: isHighEntropy,
    },
  ];

  const score = Math.min(
    100,
    signals.reduce((acc, item) => acc + item.weight, 0)
  );
  const verdict: PhishingReport["verdict"] =
    score >= 60 ? "HIGH RISK" : score >= 25 ? "SUSPICIOUS" : "LOW RISK";

  return {
    normalizedUrl: candidate,
    score,
    verdict,
    entropy,
    signals,
  };
}
