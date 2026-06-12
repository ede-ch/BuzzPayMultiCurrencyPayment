import { PaymentRequestStatus } from "@/lib/api";

const STATUS_CONFIG: Record<
  PaymentRequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "text-coin-yellow border-coin-yellow/40 bg-coin-yellow/10",
  },
  approved: {
    label: "Approved",
    className: "text-[#3ecf8e] border-[#3ecf8e]/40 bg-[#3ecf8e]/10",
  },
  rejected: {
    label: "Rejected",
    className: "text-buzz-bright border-buzz-bright/40 bg-buzz-bright/10",
  },
  expired: {
    label: "Expired",
    className: "text-muted-default border-muted-default/40 bg-muted-default/10",
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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.04em] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
