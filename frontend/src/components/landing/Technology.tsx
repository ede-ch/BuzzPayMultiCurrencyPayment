import Image from "next/image";

const Sparkle = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
      fill="#f4f1f1"
    />
  </svg>
);

const techCards = [
  { src: "/tech/php.png", alt: "PHP", label: "PHP" },
  { src: "/tech/laravel.png", alt: "Laravel", label: "Laravel" },
  { src: "/tech/nextjs.webp", alt: "Next.js", label: "Next.js" },
  { src: "/tech/node.png", alt: "Node", label: "Node" },
  { src: "/tech/typescript.webp", alt: "TypeScript", label: "TypeScript" },
  { src: "/tech/tailwind.png", alt: "Tailwind", label: "Tailwind" },
];

export default function Technology() {
  return (
    <section id="technology" className="relative mx-auto max-w-[1280px] px-4 pb-[120px] pl-[100px]">
      <div className="inline-flex items-center rounded-full border border-buzz-red/60 px-[20px] py-[15px] text-[15px] tracking-[0.02em] text-[#f0eded]">
        Technology
      </div>

      <div className="relative mt-[30px]">
        <Sparkle className="absolute left-[430px] top-[1px] animate-twinkle" />
        <div className="text-[46px] leading-[1.08]">
          <span className="font-extralight">ENTERPRISE-GRADE API</span>
          <br />
          <span className="font-bold">ARCHITECTURE</span>
        </div>
      </div>

      {/* technology cards */}
      <div className="mt-[60px] grid grid-cols-2 gap-[24px] px-[120px] sm:grid-cols-3 md:grid-cols-6 pl-[3px]">
        {techCards.map((card) => (
          <div
            key={card.label}
            className="group flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[24px] border border-[#363636] transition-colors duration-300 hover:border-buzz-red/50"
          >
            <div
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ perspective: "400px" }}
            >
              <div className="[transform:rotateX(18deg)_rotateY(-20deg)] transition-transform duration-500 group-hover:[transform:rotateX(0deg)_rotateY(0deg)]">
                <div className="rounded-[16px] bg-[#f4f1f1] p-3 drop-shadow-[0_8px_10px_rgba(0,0,0,0.45)] grayscale opacity-40 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>
              </div>
            </div>
            <span className="text-[14px] tracking-[0.02em] text-muted-dark">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* description */}
      <div className="mt-[30px] flex justify-end max-w-[1055px]">
        <p className="max-w-[600px] text-left text-[16px] leading-[1.5] text-muted-dark pt-[20px]">
          Engineered with a powerful Next.js 14 frontend and a bulletproof
          Laravel 12 backend. Powered by secure authentication, automated
          background workers that expire idle requests within 48 hours,
          strict ISO 4217 validations, and a comprehensive unit test suite to
          guarantee flawless status transitions and data immutability.
        </p>
      </div>
    </section>
  );
}
