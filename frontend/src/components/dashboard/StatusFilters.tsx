import { PaymentRequestStatus } from '@/lib/api';

export const STATUSES: PaymentRequestStatus[] = ['pending', 'approved', 'rejected', 'expired'];

export default function StatusFilters({
  statusCounts,
  statusFilter,
  onSelect,
}: {
  statusCounts: Record<PaymentRequestStatus, number>;
  statusFilter: PaymentRequestStatus | 'all';
  onSelect: (status: PaymentRequestStatus | 'all') => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STATUSES.map((status) => {
        const count = statusCounts[status];
        const isActive = statusFilter === status;
        return (
          <button
            key={status}
            onClick={() => onSelect(status === statusFilter ? 'all' : status)}
            className={`text-left rounded-[24px] p-5 transition-all border ${
              isActive ? 'bg-[#1c1213] border-buzz-red/50 shadow-[0_0_15px_rgba(198,4,2,0.15)]' : 'bg-[#101010] border-[#262626] hover:bg-[#151515]'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2 capitalize">{status}</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-white">{count}</h3>
              <span className="text-[10px] text-muted">records</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
