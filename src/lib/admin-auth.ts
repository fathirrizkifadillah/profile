import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "vedora_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export function getAdminPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured && configured.length >= 4) {
    return configured;
  }
  return null;
}

function getSigningSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit && explicit.length >= 16) return explicit;
  const pwd = getAdminPassword() ?? "vedora-dev-fallback-secret";
  return createHash("sha256").update(`vedora-session:${pwd}`).digest("hex");
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp })).toString(
    "base64url"
  );
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !getAdminPassword()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = signPayload(payload);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expBuf)) return false;

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { role?: string; exp?: number };
    if (decoded.role !== "admin") return false;
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const configured = getAdminPassword();
  if (!configured) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(configured).digest();
  return timingSafeEqual(a, b);
}

export function checkRateLimit(clientKey: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = failedAttempts.get(clientKey);
  if (!entry || entry.resetAt <= now) {
    return { allowed: true };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true };
}

export function recordFailedAttempt(clientKey: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(clientKey);
  if (!entry || entry.resetAt <= now) {
    failedAttempts.set(clientKey, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(clientKey: string): void {
  failedAttempts.delete(clientKey);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
