"use client";

import { useState, FormEvent } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  ApiError,
  AuthUser,
  CreatePaymentRequestPayload,
  createPaymentRequest,
} from "@/lib/api";
import { ISO_4217_CURRENCIES, getCurrencySymbol } from "@/lib/currencies";

const inputClassName =
  "w-full rounded-[12px] border border-[#363636] bg-white/5 px-4 py-3 text-sm text-[#f4f1f1] placeholder:text-muted-default/60 outline-none transition-colors duration-200 focus:border-buzz-red focus:ring-2 focus:ring-buzz-red/20";
const labelClassName = "mb-2 block text-sm font-medium text-muted-default";

export default function PaymentRequestForm({
  token,
  currentUser,
  onCreated,
}: {
  token: string;
  currentUser: AuthUser;
  onCreated: () => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [currencyCode, setCurrencyCode] = useState(currentUser.currency_code);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const amountValue = Number(amount);
    if (!amount || Number.isNaN(amountValue) || amountValue < 0.01) {
      setError({ message: "Please enter a valid amount (minimum 0.01)." });
      return;
    }

    setLoading(true);

    try {
      const payload: CreatePaymentRequestPayload = {
        amount_local: amountValue,
        currency_code: currencyCode,
        description: description || undefined,
      };
      await createPaymentRequest(token, payload);
      setAmount("");
      setDescription("");
      await onCreated();
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-[#363636] bg-white/[0.02] p-6">
      <h2 className="font-manrope text-lg font-bold text-white">
        New payment request
      </h2>
      <p className="mt-1 text-sm text-muted-dark">
        The EUR exchange rate is fetched automatically at submission time.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="amount_local" className={labelClassName}>
              Amount
            </label>
            <input
              id="amount_local"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500.00"
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="currency_code" className={labelClassName}>
              Currency
            </label>
            <select
              id="currency_code"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className={inputClassName}
            >
              {ISO_4217_CURRENCIES.map((code) => {
                const symbol = getCurrencySymbol(code);
                return (
                  <option key={code} value={code} className="bg-ink">
                    {symbol ? `${code} (${symbol})` : code}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description (optional)
          </label>
          <input
            id="description"
            type="text"
            maxLength={255}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Office supplies"
            className={inputClassName}
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-[12px] border border-buzz-red/30 bg-buzz-red/10 px-4 py-3 text-sm text-[#f4f1f1]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-buzz-bright" />
            <div>
              <p>{error.message}</p>
              {error.errors && (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-dark">
                  {Object.values(error.errors)
                    .flat()
                    .map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-none px-[20px] py-[15px] text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          style={{
            background: "linear-gradient(5deg, #C60402, #C60402)",
            boxShadow: "0 1px 30px rgba(224,26,26,0.40)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit request"
          )}
        </button>
      </form>
    </div>
  );
}
