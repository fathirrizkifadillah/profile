"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeSlash, LockKey } from "@phosphor-icons/react";

interface AdminLoginFormProps {
  isPasswordConfigured: boolean;
}

export function AdminLoginForm({ isPasswordConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Login gagal. Periksa password kamu.");
        setSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Gagal terhubung ke server.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bench-grid-bg flex min-h-[100dvh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <Link
          href="/"
          className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-ink-secondary transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Kembali ke vedora.my.id</span>
        </Link>

        <div className="mt-4 bezel-outer rounded-[26px] p-1.5 ring-1 ring-ink/[0.08]">
          <div className="bezel-inner rounded-[20px] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-plate">
                <LockKey size={20} weight="regular" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold tracking-tight text-ink">
                  Vedora Studio
                </h1>
                <p className="text-xs text-ink-muted">
                  Private profile dashboard (owner only)
                </p>
              </div>
            </div>

            {!isPasswordConfigured ? (
              <div className="mt-5 rounded-xl border border-hairline-strong bg-bench p-4 text-xs leading-relaxed text-ink-secondary">
                <p className="font-semibold text-ink">
                  ADMIN_PASSWORD belum diatur
                </p>
                <p className="mt-1.5">
                  Tambahkan environment variable{" "}
                  <code className="rounded bg-plate px-1.5 py-0.5 font-mono text-ink">
                    ADMIN_PASSWORD
                  </code>{" "}
                  di Vercel Settings → Environment Variables (atau di{" "}
                  <code className="rounded bg-plate px-1.5 py-0.5 font-mono text-ink">
                    .env.local
                  </code>{" "}
                  untuk lokal), lalu redeploy.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-medium text-ink"
                >
                  Admin password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password pribadi..."
                    autoComplete="current-password"
                    required
                    disabled={!isPasswordConfigured || submitting}
                    className="min-h-[46px] w-full rounded-xl border border-hairline-strong bg-plate pl-3.5 pr-11 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted hover:bg-recess hover:text-ink"
                  >
                    {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!isPasswordConfigured || submitting}
                className="min-h-[46px] w-full rounded-full bg-ink px-5 text-sm font-medium text-plate transition-all duration-200 hover:bg-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
