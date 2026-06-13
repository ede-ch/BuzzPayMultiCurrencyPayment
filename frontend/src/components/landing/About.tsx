import StatCounter from "./StatCounter";

const Sparkle = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill="#f4f1f1"
    />
  </svg>
);

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1280px] px-14 pb-[100px] pt-[120px] pl-[100px]">
      <div className="grid grid-cols-1 items-start gap-[60px] md:grid-cols-2">
        <div className="relative">
          <div className="inline-flex items-center rounded-full border border-buzz-red/60 px-[20px] py-[15px] text-[15px] tracking-[0.02em] text-[#f0eded]">
            About
          </div>

          <div className="relative mt-[30px]">
            <Sparkle className="absolute left-[172px] top-[2px] animate-twinkle" />
            <div className="text-[46px] leading-[1.08]">
              <span className="font-extralight">BUILT FOR</span>
              <br />
              <span className="font-bold">GLOBAL TEAMS</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1.9 max-w-[470px]">
          <p className="m-0 max-w-[430px] text-right text-[16px] leading-[1,8]text-muted-2 px-[15px] pt-[40px] pl-[10px]">
            Our multi-currency solution seamlessly unifies cross-border
            corporate expenses. Authenticated employees can easily submit
            requests in local currencies, while finance teams gain a
            centralized, real-time interface to filter, audit, and approve
            payouts without friction
          </p>
        </div>
      </div>

      <div className="mt-[92px] flex items-center justify-center">
        <div className="pr-[48px]  ">
          <StatCounter 
            to={150} 
            suffix="+" 
            suffixSize={30} 
            duration={1.6} 
            label="Partners with us" 
          />
        </div>
        
        <div className="h-[66px] w-[2px] bg-divider-red" />
        
        <div className="px-[48px]">
          <StatCounter
            to={2.0}
            decimals={1}
            suffix="M+"
            suffixSize={30}
            duration={1.8}
            label="Total customers"
          />
        </div>

        <div className="h-[66px] w-[2px] bg-divider-red" />
        
        <div className="pl-[48px]">
          <StatCounter
            to={4.9}
            decimals={1}
            suffix="/5.0"
            suffixSize={26}
            duration={2}
            label="Customer reviews"
          />
        </div>
      </div>
    </section>
  );
}