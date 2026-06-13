import { svg } from 'framer-motion/m';
import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative mx-auto min-h-screen max-w-[1280px] px-14 font-manrope">

      {/* headline container */}
      <div className="pt-[90px] select-none">
        <div className="w-fit mx-auto flex flex-col">

          {/* TITLE BUZZPAY */}
          <div
            className="flex font-bold leading-none text-buzz-red uppercase whitespace-nowrap drop-shadow-[0_8px_8px_rgba(0,0,0,0.70)]"
            style={{ fontSize: "clamp(10px, 10vw, 500px)" }}
          >
            {["B", "U", "Z", "Z", "P", "A", "Y"].map((letter, index) => (
              <span
                key={index}
                style={{
                  paddingRight: index === 6 ? "0px" : "66px"
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          {/* UNIFY PAYMENTS — 75% da largura do título, espaçados nas pontas */}
          <div
            className="w-[52%] mt-[1.2vw] flex justify-between items-baseline leading-[1] whitespace-nowrap text-white drop-shadow-[0_5px_6px_rgba(0,0,0,0.31)] font-manrope"
            style={{ fontSize: "clamp(36px, 4.5vw, 96px)" }}
          >
            {/* Trocamos pr por pl-[40px] -> Agora o UNIFY desencosta da esquerda e vai para a direita */}
            <span className="font-extralight tracking-[20px] pl-[6px]">UNIFY</span>
            <strong className="font-bold tracking-[-1px]">PAYMENTS</strong>
          </div>

          {/* EMPOWER TEAMS — alinhado à borda direita do título */}
          <div
            className="w-[52%] self-end leading-[1.04] whitespace-nowrap text-white drop-shadow-[0_5px_6px_rgba(0,0,0,0.31)] font-manrope"
            style={{ fontSize: "clamp(36px, 4.5vw, 96px)" }}
          >
            <span className="font-light tracking-[-1px]">EMPOWER </span>
            <strong className="font-bold tracking-[-1px]">TEAMS</strong>
          </div>

        </div>
      </div>

      {/* lower-left block */}
      <div className="relative mt-3 max-w-[500px]"> {/* Aumentado aqui para a div pai dar espaço */}

        <p className="m-0 max-w-[600px] text-[15px] leading-[1.8] text-muted-dark font-medium tracking-wide text-left pl-[50px]">
          Manage global team expenses and payouts in real time. Convert currencies instantly and unify your business finances in a single platform
        </p>

        {/* CTAs */}
        <div className="mt-[50px] flex gap-[2px] pl-[50px]">
          <Link
            href="/register"
            className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full border-none px-[20px] py-[15px] text-[15px] font-semibold text-white no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(5deg, #C60402, #C60402)",
              boxShadow: "0 1px 30px rgba(224,26,26,0.40)",
            }}
          >
            Get started
          </Link>

          <button className="group flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-none bg-[#f4f1f1] text-[#111] transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 shadow-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="9 7 17 7 17 15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}