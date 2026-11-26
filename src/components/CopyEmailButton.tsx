"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

interface CopyEmailButtonProps {
  email: string;
  label: string;
  copiedLabel: string;
  variant?: "secondary" | "inline-dark";
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

  if (variant === "inline-dark") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-live="polite"
        className={`inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
          copied
            ? "bg-accent text-plate"
            : "bg-white/10 text-plate hover:bg-white/18"
        }`}
      >
        <span className="font-mono text-[13px] tracking-tight">
          {copied ? copiedLabel : email}
        </span>
        {copied ? (
          <Check size={15} weight="bold" />
        ) : (
          <Copy size={15} weight="bold" className="opacity-75" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={`inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-[10px] px-5 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
        copied
          ? "bg-ink text-plate"
          : "bg-recess text-ink hover:bg-ink hover:text-plate"
      }`}
    >
      {copied ? (
        <Check size={16} weight="bold" />
      ) : (
        <Copy size={16} weight="bold" />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
