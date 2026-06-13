'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  ApiError,
  ExchangeRateResponse,
  PaginatedResponse,
  PaymentRequest,
  PaymentRequestStatus,
  createPaymentRequest,
  getExchangeRate,
  listPaymentRequests,
  logoutRequest,
  reviewPaymentRequest,
} from '@/lib/api';
import Footer from '@/components/landing/Footer';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusFilters, { STATUSES } from '@/components/dashboard/StatusFilters';
import PaymentRequestsTable from '@/components/dashboard/PaymentRequestsTable';
import CreateRequestForm from '@/components/dashboard/CreateRequestForm';

type Status = PaymentRequestStatus;

export default function DashboardPage() {
  const { user, token, isReady, clearSession } = useAuth();
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResponse<PaymentRequest> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<Status, number>>({
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
  });
  const [loggingOut, setLoggingOut] = useState(false);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<ApiError | null>(null);
  const [rates, setRates] = useState<Record<string, ExchangeRateResponse>>({});

  useEffect(() => {
    if (isReady && !token) {
      router.replace('/login');
    }
  }, [isReady, token, router]);

  const currencyInitialized = useRef(false);

  useEffect(() => {
    if (user && !currencyInitialized.current) {
      setCurrency(user.currency_code);
      currencyInitialized.current = true;
    }
  }, [user]);

  const fetchRequests = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listPaymentRequests(
        token,
        statusFilter === 'all' ? undefined : statusFilter,
        page
      );
      setResult(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, page]);

  const fetchStatusCounts = useCallback(async () => {
    if (!token) return;

    const entries = await Promise.all(
      STATUSES.map(async (status) => {
        try {
          const data = await listPaymentRequests(token, status, 1);
          return [status, data.meta.total] as const;
        } catch {
          return [status, 0] as const;
        }
      })
    );

    setStatusCounts(Object.fromEntries(entries) as Record<Status, number>);
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  useEffect(() => {
    if (!token || rates[currency]) return;

    getExchangeRate(token, currency)
      .then((data) => setRates((prev) => ({ ...prev, [currency]: data })))
      .catch(() => {});
  }, [token, currency, rates]);

  function handleStatusFilterSelect(status: Status | 'all') {
    setStatusFilter(status);
    setPage(1);
  }

  async function handleReview(id: number, status: 'approved' | 'rejected') {
    if (!token) return;

    try {
      await reviewPaymentRequest(token, id, status);
      await fetchRequests();
      await fetchStatusCounts();
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
      router.replace('/login');
    }
  }

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createPaymentRequest(token, {
        amount_local: parseFloat(amount),
        currency_code: currency,
        description: description || undefined,
      });
      setAmount('');
      setDescription('');
      setStatusFilter('all');
      setPage(1);
      await fetchRequests();
      await fetchStatusCounts();
    } catch (err) {
      setFormError(err as ApiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const rate = rates[currency];
  const estimatedEur = amount && rate ? (parseFloat(amount) / rate.rate).toFixed(2) : null;

  const totalEur = (result?.data ?? []).reduce(
    (sum, req) => sum + parseFloat(req.amount_eur),
    0
  );

  if (!isReady || !user || !token) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-buzz-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090909] text-white font-manrope selection:bg-buzz-red selection:text-white border-t-[3px] border-buzz-red">
      <DashboardNavbar user={user} onLogout={handleLogout} loggingOut={loggingOut} />

      <div className="px-4 sm:px-10 pb-10 max-w-[1600px] mx-auto flex-1 w-full">
        {error && (
          <div className="mb-6 rounded-[16px] border border-buzz-red/30 bg-buzz-red/10 px-4 py-3 text-sm text-white">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SummaryCard totalEur={totalEur} />

            <StatusFilters
              statusCounts={statusCounts}
              statusFilter={statusFilter}
              onSelect={handleStatusFilterSelect}
            />

            <PaymentRequestsTable
              result={result}
              loading={loading}
              user={user}
              statusFilter={statusFilter}
              onReview={handleReview}
              onPrevPage={() => setPage((prev) => Math.max(1, prev - 1))}
              onNextPage={() => setPage((prev) => Math.min(result?.meta.last_page ?? 1, prev + 1))}
            />
          </div>

          <div className="space-y-6">
            <CreateRequestForm
              amount={amount}
              currency={currency}
              description={description}
              onAmountChange={setAmount}
              onCurrencyChange={setCurrency}
              onDescriptionChange={setDescription}
              onSubmit={handleSubmitRequest}
              isSubmitting={isSubmitting}
              formError={formError}
              rate={rate}
              estimatedEur={estimatedEur}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
