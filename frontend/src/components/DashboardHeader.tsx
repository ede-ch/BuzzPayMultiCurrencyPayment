"use client";

import Link from "next/link";
import { LogOut, Loader2 } from "lucide-react";
import { AuthUser } from "@/lib/api";

const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  finance: "Finance",
};

export default function DashboardHeader({
  user,
  onLogout,
  loggingOut,
}: {
  user: AuthUser;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return (
    <header className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 pt-7 sm:px-14">
      <Link
        href="/"
        className="text-lg font-bold uppercase tracking-[0.04em] text-buzz-red no-underline transition-colors hover:text-buzz-bright"
      >
        BuzzPay
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-[#f4f1f1]">{user.name}</p>
          <span className="inline-flex items-center rounded-full border border-buzz-red/40 bg-buzz-red/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-buzz-bright">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-full border border-[#363636] px-4 py-2.5 text-sm font-semibold text-[#f0eded] transition-colors duration-300 hover:border-buzz-red/50 hover:text-buzz-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Log out
        </button>
      </div>
    </header>
  );
}
