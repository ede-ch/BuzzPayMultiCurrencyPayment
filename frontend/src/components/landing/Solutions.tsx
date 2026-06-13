const Sparkle = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill="#f4f1f1"
    />
  </svg>
);

/* Conversão multi-moeda: moedas com setas de câmbio orbitando */
const CurrencyExchangeIcon = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" fill="none" className="drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]">
    <defs>
      <linearGradient id="coinGradRed" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C60402" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#C60402" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="coinGradLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f4f1f1" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#f4f1f1" stopOpacity="0.04" />
      </linearGradient>
    </defs>
    {/* camadas de espessura (efeito 3D) */}
    <circle cx="19.5" cy="20" r="13" fill="#000" opacity="0.35" />
    <circle cx="33.5" cy="34" r="13" fill="#000" opacity="0.25" />
    <circle cx="17" cy="17" r="13" fill="url(#coinGradRed)" stroke="#C60402" strokeWidth="2" />
    <circle cx="31" cy="31" r="13" fill="url(#coinGradLight)" stroke="#f4f1f1" strokeWidth="2" opacity="0.6" />
    <text x="17" y="22" textAnchor="middle" fill="#f4f1f1" fontSize="13" fontWeight="700">$</text>
    <text x="31" y="36" textAnchor="middle" fill="#f4f1f1" fontSize="13" fontWeight="700" opacity="0.8">€</text>
    <g className="group-hover:animate-spin-slow" style={{ transformOrigin: "24px 24px" }}>
      <path d="M19 11 A9 9 0 0 1 28 6" stroke="#f4f1f1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M29 37 A9 9 0 0 1 20 42" stroke="#C60402" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

/* Rastreamento do ciclo de pagamento: relógio com ponteiro girando e pulso central */
const PaymentLifecycleIcon = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" fill="none" className="drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]">
    {/* camada de espessura (efeito 3D) */}
    <circle cx="26.5" cy="27" r="18" fill="#000" opacity="0.35" />
    <circle cx="24" cy="24" r="18" stroke="#f4f1f1" strokeWidth="1.5" opacity="0.15" />
    <circle
      cx="24"
      cy="24"
      r="18"
      stroke="#C60402"
      strokeWidth="2"
      fill="none"
      strokeDasharray="4 7"
      strokeLinecap="round"
      opacity="0.7"
    />
    <g className="group-hover:animate-spin-slow" style={{ transformOrigin: "24px 24px" }}>
      <path d="M24 24 L24 12" stroke="#f4f1f1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="12" r="2" fill="#f4f1f1" />
    </g>
    <path d="M24 24 L30 28" stroke="#f4f1f1" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <circle cx="24" cy="24" r="2.5" fill="#C60402" style={{ transformOrigin: "24px 24px" }} className="group-hover:animate-pulse-ring" />
    <circle cx="24" cy="24" r="2.5" fill="#C60402" />
  </svg>
);

/* Aprovações/auditoria: escudo com gradiente e check sendo desenhado */
const ApprovalShieldIcon = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" fill="none" className="drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)]">
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C60402" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#C60402" stopOpacity="0.04" />
      </linearGradient>
    </defs>
    {/* camada de espessura (efeito 3D) */}
    <path
      d="M24 5 L40 11 V22 C40 32 33 39 24 43 C15 39 8 32 8 22 V11 Z"
      transform="translate(2.5, 3)"
      fill="#000"
      opacity="0.35"
    />
    <path
      d="M24 5 L40 11 V22 C40 32 33 39 24 43 C15 39 8 32 8 22 V11 Z"
      stroke="#C60402"
      strokeWidth="2"
      fill="url(#shieldGrad)"
      strokeLinejoin="round"
    />
    <path
      d="M16 23 L22 29 L33 17"
      stroke="#f4f1f1"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray="26"
      className="group-hover:animate-dash-flow"
    />
  </svg>
);

const solutionCards = [
  {
    icon: <CurrencyExchangeIcon />,
    label: "Currency Conversion",
  },
  {
    icon: <PaymentLifecycleIcon />,
    label: "Payment Tracking",
  },
  {
    icon: <ApprovalShieldIcon />,
    label: "Approval Workflow",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative mx-auto max-w-[1280px] px-4 pb-[120px] pl-[100px] pt-[60px]">
      <div className="inline-flex items-center rounded-full border border-buzz-red/60 px-[20px] py-[15px] text-[15px] tracking-[0.02em] text-[#f0eded]">
        Solutions
      </div>

      <div className="relative mt-[30px]">
        <Sparkle className="absolute left-[90px]  top-[1px] animate-twinkle" />
        <div className="text-[46px] leading-[1.08]">
          <span className="font-extralight">THE MULTI-CURRENCY</span>
          <br />
          <span className="font-bold">ROUTING ENGINE</span>
        </div>
      </div>

      {/* solution cards */}
      <div className="mt-[60px] grid grid-cols-1 gap-[24px] px-[120px] md:grid-cols-3 pl-[3px]">
        {solutionCards.map((card) => (
          <div
            key={card.label}
            className="group flex aspect-[90/85] w-full flex-col items-center justify-center gap-4 rounded-[24px] border border-[#363636] transition-colors duration-300 hover:border-buzz-red/50"
          >
            <div
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ perspective: "400px" }}
            >
              <div className="[transform:rotateX(18deg)_rotateY(-20deg)] transition-transform duration-500 group-hover:[transform:rotateX(0deg)_rotateY(0deg)]">
                {card.icon}
              </div>
            </div>
            <span className="text-[14px] tracking-[0.02em] text-muted-dark">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* description */}
      <p className="mx-auto mt-[20px] text-left text-[16px] leading-[1.8] text-muted-dark px-[90px] pt-[20px] pl-[1px]">
        A streamlined financial ecosystem engineered to connect international
        employees and financial auditors. Our platform automates currency
        conversion, tracks payment lifecycles, and secures internal approvals
        in seconds.
      </p>
    </section>
  );
}
