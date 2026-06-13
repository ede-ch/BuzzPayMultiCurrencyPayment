'use client';

import { FormEvent } from 'react';
import CurrencyIcon from '@/components/ui/CurrencyIcon';
import CurrencySelect from '@/components/ui/CurrencySelect';
import { ApiError, ExchangeRateResponse } from '@/lib/api';

export default function CreateRequestForm({
  amount,
  currency,
  description,
  onAmountChange,
  onCurrencyChange,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
  formError,
  rate,
  estimatedEur,
}: {
  amount: string;
  currency: string;
  description: string;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  formError: ApiError | null;
  rate: ExchangeRateResponse | undefined;
  estimatedEur: string | null;
}) {
  return (
    <div className="bg-[#101010] border border-[#262626] rounded-[24px] p-6 sm:p-8 relative">
      <div className="mb-6">
        <h3 className="font-bold text-xl tracking-tight mb-1">Create Request</h3>
        <p className="text-sm text-muted">Submit values for validation.</p>
      </div>

      {formError && (
        <div className="mb-5 rounded-[16px] border border-buzz-red/30 bg-buzz-red/10 px-4 py-3 text-sm text-white">
          {formError.message}
          {formError.errors && (
            <ul className="mt-1 list-disc pl-4 text-xs text-muted">
              {Object.values(formError.errors).flat().map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-white font-medium mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-white font-medium mb-2">Currency</label>
          <CurrencySelect value={currency} onChange={onCurrencyChange} />
        </div>

        <div>
          <label className="block text-sm text-white font-medium mb-2">Description</label>
          <textarea
            maxLength={255}
            rows={2}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Details..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors resize-none"
          />
        </div>

        <div className="bg-[#151515] border border-dashed border-[#333] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-muted uppercase tracking-wider font-semibold">Estimated Value</span>
          <div className="flex items-center gap-2 mt-1">
            <CurrencyIcon currencyCode="EUR" className="w-[18px] opacity-90" />
            <span className="text-2xl font-bold text-white">
              {estimatedEur ? `€ ${parseFloat(estimatedEur).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </span>
          </div>
          <span className="text-[10px] text-muted mt-2 flex items-center gap-1 justify-center">
            1 <CurrencyIcon currencyCode="EUR" className="w-3 mx-0.5" /> EUR = {rate ? rate.rate : '...'} <CurrencyIcon currencyCode={currency} className="w-3 mx-0.5" /> {currency}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !amount}
          className="w-full bg-[#c60402] hover:bg-[#ef2630] text-white font-medium py-3.5 rounded-[16px] transition-all shadow-[0_0_15px_rgba(198,4,2,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Processing...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
