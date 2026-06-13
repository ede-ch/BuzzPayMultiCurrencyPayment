'use client';

import CurrencyIcon from '@/components/ui/CurrencyIcon';
import { AuthUser } from '@/lib/api';

export default function DashboardNavbar({
  user,
  onLogout,
  loggingOut,
}: {
  user: AuthUser;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav className="flex items-center justify-between px-6 sm:px-10 py-5 mb-6">
      <div className="text-buzz-red font-bold tracking-[0.35em] text-lg sm:text-xl">
        B U Z Z P A Y
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold leading-tight">{user.name}</p>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <span className="text-[10px] uppercase tracking-wider text-muted bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full inline-block">
              Role: {user.role}
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full">
              <CurrencyIcon currencyCode={user.currency_code} className="w-3 rounded-[1px]" />
              {user.currency_code}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-sm font-bold text-white">
          {initials}
        </div>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="text-muted hover:text-white transition-colors ml-2 disabled:opacity-50"
          title="Logout"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </nav>
  );
}
