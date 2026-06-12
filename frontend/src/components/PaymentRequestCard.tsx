"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { AuthUser, PaymentRequest } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function formatNumber(value: string, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(Number(value));
}

export default function PaymentRequestCard({
  paymentRequest,
  currentUser,
  onReview,
}: {
  paymentRequest: PaymentRequest;
  currentUser: AuthUser;
  onReview: (id: number, status: "approved" | "rejected") => Promise<void>;
}) {
  const [reviewing, setReviewing] = useState<"approved" | "rejected" | null>(
    null
  );

  const canReview =
    currentUser.role === "finance" && paymentRequest.status === "pending";

  async function handleReview(status: "approved" | "rejected") {
    setReviewing(status);
    try {
      await onReview(paymentRequest.id, status);
    } finally {
      setReviewing(null);
    }
  }

  return (
    <div className="rounded-[24px] border border-[#363636] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-buzz-red/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {formatNumber(paymentRequest.amount_local)}
            </span>
            <span className="text-sm font-semibold text-muted-default">
              {paymentRequest.currency_code}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-dark">
            ≈ {formatNumber(paymentRequest.amount_eur)} EUR
          </p>
        </div>
        <StatusBadge status={paymentRequest.status} />
      </div>

      {paymentRequest.description && (
        <p className="mt-4 text-sm text-[#f0eded]">
          {paymentRequest.description}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-y-2 border-t border-[#363636] pt-4 text-xs text-muted-dark sm:grid-cols-4">
        {currentUser.role === "finance" && (
          <div>
            <dt className="text-muted-default">Submitted by</dt>
            <dd className="mt-0.5 text-[#f0eded]">{paymentRequest.user.name}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted-default">Exchange rate</dt>
          <dd className="mt-0.5 text-[#f0eded]">
            {formatNumber(paymentRequest.exchange_rate, 6)} ({paymentRequest.rate_source})
          </dd>
        </div>
        <div>
          <dt className="text-muted-default">Created at</dt>
          <dd className="mt-0.5 text-[#f0eded]">
            {formatDate(paymentRequest.created_at)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-default">Expires at</dt>
          <dd className="mt-0.5 text-[#f0eded]">
            {formatDate(paymentRequest.expires_at)}
          </dd>
        </div>
        {paymentRequest.reviewer && (
          <div>
            <dt className="text-muted-default">Reviewed by</dt>
            <dd className="mt-0.5 text-[#f0eded]">
              {paymentRequest.reviewer.name}
            </dd>
          </div>
        )}
      </dl>

      {canReview && (
        <div className="mt-5 flex gap-3 border-t border-[#363636] pt-5">
          <button
            type="button"
            onClick={() => handleReview("approved")}
            disabled={reviewing !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#3ecf8e]/40 bg-[#3ecf8e]/10 px-4 py-2.5 text-sm font-semibold text-[#3ecf8e] transition-all duration-300 hover:bg-[#3ecf8e]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewing === "approved" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleReview("rejected")}
            disabled={reviewing !== null}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-buzz-red/40 bg-buzz-red/10 px-4 py-2.5 text-sm font-semibold text-buzz-bright transition-all duration-300 hover:bg-buzz-red/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewing === "rejected" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
