'use client';

import CurrencyIcon from '@/components/ui/CurrencyIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  AuthUser,
  PaginatedResponse,
  PaymentRequest,
  PaymentRequestStatus,
} from '@/lib/api';

export default function PaymentRequestsTable({
  result,
  loading,
  user,
  statusFilter,
  onReview,
  onPrevPage,
  onNextPage,
}: {
  result: PaginatedResponse<PaymentRequest> | null;
  loading: boolean;
  user: AuthUser;
  statusFilter: PaymentRequestStatus | 'all';
  onReview: (id: number, status: 'approved' | 'rejected') => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <div className="bg-[#101010] border border-[#262626] rounded-[24px] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg tracking-tight">Payment Requests</h3>
        <div className="text-xs text-muted bg-[#1a1a1a] px-3 py-1.5 rounded-[12px] border border-[#333]">
          Filter: <span className="text-white font-bold uppercase">{statusFilter}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-muted text-xs border-b border-[#262626] uppercase tracking-wider">
            <tr>
              <th className="pb-3 font-medium">Employee</th>
              <th className="pb-3 font-medium">Local Amount</th>
              <th className="pb-3 font-medium hidden md:table-cell">Rate (EUR)</th>
              <th className="pb-3 font-medium">Status</th>
              {user.role === 'finance' && <th className="pb-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : result && result.data.length > 0 ? (
              result.data.map((req) => (
                <tr key={req.id} className="hover:bg-[#151515] transition-colors group">
                  <td className="py-4 pr-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-bold text-xs text-muted group-hover:border-buzz-red/40 transition-colors">
                        {req.user.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{req.user.name}</p>
                        <p className="text-xs text-muted max-w-[180px] truncate">{req.description || 'No description provided'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-white flex items-center gap-2 h-[72px]">
                    <CurrencyIcon currencyCode={req.currency_code} className="w-[18px] opacity-90" />
                    {parseFloat(req.amount_local).toLocaleString('en-US', { style: 'currency', currency: req.currency_code })}
                  </td>
                  <td className="py-4 hidden md:table-cell text-muted">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <CurrencyIcon currencyCode="EUR" className="w-[14px]" />
                      € {parseFloat(req.amount_eur).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[10px] text-muted truncate max-w-[150px] mt-0.5">1 {req.currency_code} = {req.exchange_rate}</p>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  {user.role === 'finance' && (
                    <td className="py-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onReview(req.id, 'approved')}
                            className="p-2 rounded-[12px] bg-[#1a1a1a] border border-[#333] text-[#4ade80] hover:bg-[#14321a] hover:border-[#1f5c2e] transition-all"
                            title="Approve"
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                          </button>
                          <button
                            onClick={() => onReview(req.id, 'rejected')}
                            className="p-2 rounded-[12px] bg-[#1a1a1a] border border-[#333] text-[#ef2630] hover:bg-[#3a0a0a] hover:border-[#5c1010] transition-all"
                            title="Reject"
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted px-3">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted">
                  No payment requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result && result.meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={result.meta.current_page <= 1}
            className="rounded-[12px] bg-[#1a1a1a] border border-[#333] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-buzz-red/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-muted">
            Page {result.meta.current_page} of {result.meta.last_page}
          </span>
          <button
            type="button"
            onClick={onNextPage}
            disabled={result.meta.current_page >= result.meta.last_page}
            className="rounded-[12px] bg-[#1a1a1a] border border-[#333] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-buzz-red/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
