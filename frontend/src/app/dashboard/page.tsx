"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  ApiError,
  PaginatedResponse,
  PaymentRequest,
  PaymentRequestStatus,
  listPaymentRequests,
  logoutRequest,
  reviewPaymentRequest,
} from "@/lib/api";
import DashboardHeader from "@/components/DashboardHeader";
import PaymentRequestCard from "@/components/PaymentRequestCard";
import PaymentRequestForm from "@/components/PaymentRequestForm";

type StatusFilter = "all" | PaymentRequestStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export default function DashboardPage() {
  const { user, token, isReady, clearSession } = useAuth();
  const router = useRouter();

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<PaymentRequest> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isReady && !token) {
      router.replace("/login");
    }
  }, [isReady, token, router]);

  const fetchRequests = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listPaymentRequests(
        token,
        filter === "all" ? undefined : filter,
        page
      );
      setResult(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [token, filter, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleReview(id: number, status: "approved" | "rejected") {
    if (!token) return;

    try {
      await reviewPaymentRequest(token, id, status);
      await fetchRequests();
    } catch (err) {
      setError(err as ApiError);
    }
  }

  async function handleLogout() {
    if (!token) return;

    setLoggingOut(true);
    try {
      await logoutRequest(token);
    } catch {
      // ignore — clear the local session regardless
    } finally {
      clearSession();
      router.replace("/login");
    }
  }

  if (!isReady || !user || !token) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-ink">
        <Loader2 className="h-6 w-6 animate-spin text-buzz-red" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-ink font-manrope text-[#f4f1f1]">
      {/* ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        
      />
      {/* top hairline */}
      <div
        className="absolute left-0 right-0 top-0 z-30 h-[3px]"
        style={{
          background: "linear-gradient(90deg, #c4151b, #ef2630 50%, #f45b60)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col pb-16">
        <DashboardHeader
          user={user}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <div className="mx-auto mt-10 w-full max-w-[1280px] px-6 sm:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setFilter(item.value);
                    setPage(1);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    filter === item.value
                      ? "border-buzz-red bg-buzz-red text-white"
                      : "border-buzz-red/40 text-[#f0eded] hover:border-buzz-red/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border-none px-[20px] py-[12px] text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(5deg, #C60402, #C60402)",
                boxShadow: "0 1px 30px rgba(224,26,26,0.40)",
              }}
            >
              <Plus className="h-4 w-4" />
              New request
            </button>
          </div>

          {showForm && (
            <div className="mt-6">
              <PaymentRequestForm
                token={token}
                currentUser={user}
                onCreated={async () => {
                  setShowForm(false);
                  setFilter("all");
                  setPage(1);
                  await fetchRequests();
                }}
              />
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-[12px] border border-buzz-red/30 bg-buzz-red/10 px-4 py-3 text-sm text-[#f4f1f1]">
              {error.message}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-buzz-red" />
              </div>
            ) : result && result.data.length > 0 ? (
              result.data.map((paymentRequest) => (
                <PaymentRequestCard
                  key={paymentRequest.id}
                  paymentRequest={paymentRequest}
                  currentUser={user}
                  onReview={handleReview}
                />
              ))
            ) : (
              <div className="rounded-[24px] border border-[#363636] bg-white/[0.02] p-10 text-center text-sm text-muted-dark">
                No payment requests found.
              </div>
            )}
          </div>

          {result && result.meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={result.meta.current_page <= 1}
                className="flex items-center gap-1 rounded-full border border-[#363636] px-4 py-2 text-sm font-medium text-[#f0eded] transition-colors duration-300 hover:border-buzz-red/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-muted-dark">
                Page {result.meta.current_page} of {result.meta.last_page}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(result.meta.last_page, prev + 1))
                }
                disabled={result.meta.current_page >= result.meta.last_page}
                className="flex items-center gap-1 rounded-full border border-[#363636] px-4 py-2 text-sm font-medium text-[#f0eded] transition-colors duration-300 hover:border-buzz-red/50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
