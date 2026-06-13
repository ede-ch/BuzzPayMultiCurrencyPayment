"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type Props = {
  /** final numeric value */
  to: number;
  /** decimal places to display */
  decimals?: number;
  /** small superscript suffix, e.g. "+", "k", "/5.0" */
  suffix?: string;
  /** size of the suffix in px */
  suffixSize?: number;
  duration?: number;
  /** text label to display below the number */
  label?: string;
};

export default function StatCounter({
  to,
  decimals = 0,
  suffix,
  suffixSize = 30,
  duration = 1.8,
  label,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutCubic-ish
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <div className="flex flex-col">
      <div className="flex items-start">
        <span
          ref={ref}
          className="font-extrabold leading-none tracking-[-0.02em]"
          style={{ fontSize: 86 }}
        >
          {value.toFixed(decimals)}
        </span>
        {suffix && (
          <span
            className="font-bold"
            style={{
              fontSize: suffixSize,
              marginTop: suffixSize > 28 ? 6 : 8,
              marginLeft: 4,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      
      {label && (
        <span className="text-[14px] font-light text-muted-2 mt-2 tracking-wide pl-[18px] align-center">
          {label}
        </span>
      )}
    </div>
  );
}