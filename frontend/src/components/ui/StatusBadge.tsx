import { PaymentRequestStatus } from "@/lib/api";

const STATUS_CONFIG: Record<
  PaymentRequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#3d2b00] text-[#f2a900] border-[#5c4000]",
  },
  approved: {
    label: "Approved",
    className: "bg-[#14321a] text-[#4ade80] border-[#1f5c2e]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#3a0a0a] text-[#ef2630] border-[#5c1010]",
  },
  expired: {
    label: "Expired",
    className: "bg-[#1a1a1a] text-muted border-[#333]",
  },
};

export default function StatusBadge({
  status,
}: {
  status: PaymentRequestStatus;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
