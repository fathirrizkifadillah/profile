"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

interface CopyEmailButtonProps {
  email: string;
  label: string;
  copiedLabel: string;
  variant?: "secondary" | "inline";
}

export function CopyEmailButton({
  email,
  label,
  copiedLabel,
  variant = "secondary",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97] ${
          copied
            ? "border-data bg-data-soft text-data"
            : "border-ink/20 bg-plate text-ink hover:border-accent hover:bg-accent-soft/60 hover:text-accent"
        }`}
      >
        <span className="font-mono text-[13px] tracking-tight">
          {copied ? copiedLabel : email}
        </span>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
            copied ? "bg-data text-plate" : "bg-recess text-ink"
          }`}
        >
          {copied ? (
            <Check size={14} weight="bold" />
          ) : (
            <Copy size={14} weight="bold" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97] ${
        copied
          ? "border-data bg-data-soft text-data"
          : "border-ink/20 bg-plate text-ink hover:border-accent hover:bg-accent-soft/60 hover:text-accent"
      }`}
      aria-live="polite"
    >
      {copied ? (
        <Check size={16} weight="bold" className="text-data" />
      ) : (
        <Copy size={16} weight="bold" className="text-accent" />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
