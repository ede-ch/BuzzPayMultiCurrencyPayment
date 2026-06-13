import Link from "next/link";

const Sparkle = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill="#f4f1f1"
    />
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up and verify your company in minutes with secure, role-based authentication.",
  },
  {
    number: "02",
    title: "Submit a Request",
    description:
      "Employees submit payout requests in their local currency, instantly converted at live rates.",
  },
  {
    number: "03",
    title: "Get Approved & Paid",
    description:
      "Finance teams review and approve in seconds, releasing funds with full audit tracking end to end.",
  },
];

export default function GetStarted() {
  return (
    <section id="get-started" className="mt-[40px] relative mx-auto max-w-[1280px] px-4 pb-[120px] pl-[100px] pt-[60px]">
      <div className="inline-flex items-center rounded-full border border-buzz-red/60 px-[20px] py-[15px] text-[15px] tracking-[0.02em] text-[#f0eded]">
        Get Started
      </div>

      <div className="relative mt-[30px]">
        <div className="text-[46px] leading-[1.08]">
          <span className="font-extralight">READY TO STREAMLINE</span>
        </div>
        <div className="relative text-[46px] leading-[1.08]">
          <Sparkle className="absolute left-[230px] top-[10px] animate-twinkle" />
          <span className="font-bold">YOUR PAYOUTS?</span>
        </div>
      </div>

      <div className="mt-[60px] grid grid-cols-1 gap-[24px] px-[120px] md:grid-cols-2 pl-[3px]">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`group relative flex items-center overflow-hidden rounded-[24px] border border-[#363636] py-[24px] px-[36px] transition-colors duration-300 hover:border-buzz-red/50 ${
              index === 2 ? "md:col-span-2" : ""
            }`}
          >
            <div
              className={`max-w-[400px] ${
                index === 2 ? "" : "pl-[100px]"
              }`}
            >
              <h3 className="text-[20px] font-bold tracking-[0.01em] text-[#f0eded]">
                {step.title}
              </h3>
              <p className="mt-[12px] text-[15px] leading-[1.7] text-muted-dark">
                {step.description}
              </p>
            </div>
            <span
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[90px] font-bold leading-none text-[#4d4d4d] transition-colors duration-300 group-hover:text-buzz-red/30 ${
                index === 2 ? "right-[10px]" : "-left-[14px]"
              }`}
            >
              {step.number}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[60px] flex justify-center px-[120px] pl-[3px]">
        <Link
          href="/register"
          className="rounded-full bg-buzz-red px-[28px] py-[14px] text-[15px] font-medium tracking-[0.02em] text-[#f4f1f1] no-underline transition-colors duration-300 hover:bg-buzz-bright"
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
