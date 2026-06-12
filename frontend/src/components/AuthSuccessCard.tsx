"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Copy, Check } from "lucide-react";
import { LoginResponse } from "@/lib/api";

const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  finance: "Finance",
};

export default function AuthSuccessCard({
  title,
  subtitle,
  result,
}: {
  title: string;
  subtitle: string;
  result: LoginResponse;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopyToken() {
    await navigator.clipboard.writeText(result.access_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-[24px] border border-buzz-red/50 bg-white/[0.03] p-8 shadow-[0_0_30px_rgba(198,4,2,0.15)]">
      <div className="flex items-center gap-3">
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] border border-buzz-red/30 bg-buzz-red/10 text-buzz-red shadow-[0_0_20px_rgba(198,4,2,0.35)]">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-manrope text-lg font-semibold text-white">
            {title}
          </h2>
          <p className="text-sm text-muted-dark">{subtitle}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        {[
          ["Name", result.user.name],
          ["Email", result.user.email],
          ["Role", ROLE_LABELS[result.user.role] ?? result.user.role],
          ["Country", result.user.country],
          ["Currency", result.user.currency_code],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-[#363636] pb-2 last:border-b-0 last:pb-0"
          >
            <dt className="text-muted-default">{label}</dt>
            <dd className="font-medium text-[#f4f1f1]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <span className="text-xs uppercase tracking-[0.08em] text-muted-default">
          Access token
        </span>
        <div className="mt-2 flex items-center gap-2 rounded-[12px] border border-[#363636] bg-white/5 px-4 py-3">
          <code className="flex-1 overflow-hidden truncate text-xs text-muted-dark">
            {result.access_token}
          </code>
          <button
            type="button"
            onClick={handleCopyToken}
            aria-label="Copy token"
            className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-muted-default transition-colors duration-200 hover:text-buzz-bright"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="mt-6 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-none px-[20px] py-[15px] text-[15px] font-semibold text-white no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(5deg, #C60402, #C60402)",
          boxShadow: "0 1px 30px rgba(224,26,26,0.40)",
        }}
      >
        Go to Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
