"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { AUTHOR_EMAIL } from "@/constants/seo";

interface CopyEmailButtonProps {
  label: string;
  copiedLabel: string;
  variant?: "secondary" | "inline";
}

export function CopyEmailButton({
  label,
  copiedLabel,
  variant = "secondary",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(AUTHOR_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = AUTHOR_EMAIL;
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
        className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-hairline-strong bg-plate px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-ink active:scale-[0.98]"
      >
        <span className="font-mono text-[13px] tracking-tight text-ink-secondary">
          {AUTHOR_EMAIL}
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-recess text-ink">
          {copied ? (
            <Check size={15} weight="bold" className="text-led" />
          ) : (
            <Copy size={15} weight="regular" />
          )}
        </span>
        <span className="sr-only">{copied ? copiedLabel : label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-hairline-strong bg-plate px-5 py-2.5 text-sm font-medium text-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-ink/60 hover:bg-white active:scale-[0.98]"
      aria-live="polite"
    >
      {copied ? (
        <Check size={16} weight="bold" className="text-led" />
      ) : (
        <Copy size={16} weight="regular" className="text-ink-secondary" />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
