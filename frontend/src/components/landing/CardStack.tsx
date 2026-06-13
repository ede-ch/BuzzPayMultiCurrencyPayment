"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

const WireSignal = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="opacity-40 mt-1">
    <path d="M12 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#111"/>
    <path d="M8.5 11.5c1.9-1.9 5.1-1.9 7 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5.5 8.5c3.6-3.6 9.4-3.6 13 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 5.5c5.2-5.2 13.8-5.2 19 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MetallicSquare = () => (
  <div 
    className="w-[36px] h-[50px] rounded-[4px] shadow-sm relative overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #e0e0e0 0%, #9ca3af 50%, #6b7280 100%)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.2)"
    }}
  >
    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,rgba(0,0,0,0.05)_49%,rgba(0,0,0,0.05)_51%,transparent_52%)]" />
  </div>
);

type GlassBeamCardProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  top: number;
  left: number;
};

const GlassBeamCard = ({ x, y, rotate, top, left }: GlassBeamCardProps) => (
  <motion.div
    className="absolute will-change-transform flex flex-col items-center justify-between"
    style={{
      top,
      left,
      x,
      y,
      rotate,
      width: 250,
      height: 420,
      borderRadius: 8,
      backdropFilter: "blur(50px)",
      borderRight: "2px solid #D00000",
      background: "radial-gradient(ellipse at right, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
      boxShadow: "inset -4px 0px 12px -4px rgba(208, 0, 0, 0.3)"
    }}
  >
    <div className="flex flex-col items-center gap-2 pt-6">
      <MetallicSquare />
      <WireSignal />
    </div>

    <div className="relative w-full h-25 flex items-center justify-start pr-6 pb-6 pl-8">
      <div className="relative w-[36px] h-[70px] flex justify-center items-center">
        <div className="absolute w-[36px] h-[36px] top-0 rounded-full bg-[#eb1c24] translate-y-[8px]" />
        <div className="absolute w-[36px] h-[36px] bottom-0 rounded-full bg-[#f79e1b] translate-y-[-8px]" />
      </div>
    </div>
  </motion.div>
);

export default function CardStack() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const ease = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const drift = useTransform(ease, [0, 5], [0, -80]);

  const x0 = useTransform(ease, [0, 1], [0, -30]);
  const y0 = useTransform(ease, [0, 1], [0, 20]);
  
  const x1 = useTransform(ease, [0, 1], [0, 0]);
  
  const x2 = useTransform(ease, [0, 1], [0, 30]);
  const y2 = useTransform(ease, [0, 1], [0, -20]);

  const rParallel = useTransform(ease, [0, 1], [-4, -6]);

  const y0c = useTransform([y0, drift], ([a, b]: number[]) => a + b);
  const y1c = drift;
  const y2c = useTransform([y2, drift], ([a, b]: number[]) => a + b);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute right-[15px] top-[240px] z-[5]"
      style={{ width: 680, height: 850 }}
    >
      <GlassBeamCard
        x={x0}
        y={y0c}
        rotate={rParallel}
        top={160} 
        left={80}
      />

      <GlassBeamCard
        x={x1}
        y={y1c}
        rotate={rParallel}
        top={110} 
        left={260}
      />

      <GlassBeamCard
        x={x2}
        y={y2c}
        rotate={rParallel}
        top={60} 
        left={440}
      />
    </div>
  );
}