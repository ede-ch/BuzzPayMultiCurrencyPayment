import React from 'react';
import { ChevronDown } from 'lucide-react';

const NAV_ITEMS = ["About", "Solutions", "Technology", "Get Started"];

export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-[1280px] items-center justify-center gap-11 px-14 pt-7">
      {NAV_ITEMS.map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase().replace(" ", "-")}`}
          className="group flex items-center gap-1.5 font-manrope text-sm font-medium tracking-[0.01em] text-[#e7e3e3] no-underline transition-colors hover:text-white"
        >
          {item}
          <ChevronDown 
            className="w-3 h-3 text-[#e7e3e3] opacity-70 transition-transform duration-200 group-hover:opacity-100 group-hover:translate-y-0.5" 
            strokeWidth={2.5}
          />
        </a>
      ))}
    </nav>
  );
}