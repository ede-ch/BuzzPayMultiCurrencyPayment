'use client';

import { useEffect, useRef, useState } from 'react';
import CurrencyIcon from './CurrencyIcon';
import { ISO_4217_CURRENCIES } from '@/lib/currencies';

export default function CurrencySelect({
  value,
  onChange,
  buttonClassName = 'bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 px-4 text-white focus:border-buzz-red',
}: {
  value: string;
  onChange: (code: string) => void;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = ISO_4217_CURRENCIES.filter((code) =>
    code.includes(search.toUpperCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-3 outline-none transition-colors cursor-pointer ${buttonClassName}`}
      >
        <CurrencyIcon currencyCode={value} className="w-5" />
        <span className="flex-1 text-left">{value}</span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          className={`text-muted-default transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] shadow-xl overflow-hidden">
          <div className="p-2 border-b border-[#333]">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full bg-[#101010] border border-[#333] rounded-[10px] py-2 px-3 text-sm text-white focus:outline-none focus:border-buzz-red transition-colors"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors hover:bg-[#262626] ${
                    code === value ? 'bg-[#1c1213] text-buzz-red' : 'text-white'
                  }`}
                >
                  <CurrencyIcon currencyCode={code} className="w-5" />
                  <span>{code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-center text-sm text-muted">No currency found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
