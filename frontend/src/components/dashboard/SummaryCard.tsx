import CurrencyIcon from '@/components/ui/CurrencyIcon';

export default function SummaryCard({ totalEur }: { totalEur: number }) {
  return (
    <div className="bg-[#101010] rounded-[24px] p-8 border border-[#262626] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-buzz-red/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="text-muted text-xs uppercase tracking-wider font-semibold">Total (EUR) — Current View</span>
          <div className="flex items-center gap-3 mt-2">
            <CurrencyIcon currencyCode="EUR" className="w-10 shadow-sm" />
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              € {totalEur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>
        <div className="text-xs text-muted bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-[12px]">
          Real-time API Rates
        </div>
      </div>
      <div className="flex gap-3 relative z-10 mt-8 text-xs text-muted">
        <span>Automated 48h expiration task active</span>
      </div>
    </div>
  );
}
