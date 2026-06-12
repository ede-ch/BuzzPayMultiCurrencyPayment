'use client';

import React, { useState } from 'react';

// Definições de tipos estritas do contrato do backend
type Role = 'employee' | 'finance';
type Status = 'pending' | 'approved' | 'rejected' | 'expired';

interface PaymentRequest {
  id: string;
  status: Status;
  amount_local: number;
  currency_code: string;
  amount_eur: number;
  exchange_rate: number;
  rate_source: string;
  rate_fetched_at: string;
  description?: string;
  created_at: string;
  expires_at: string;
  user: {
    name: string;
    country: string;
  };
}

// Mapeamento das moedas para os códigos de país ISO 3166-1 alpha-2 (usados pelo FlagCDN)
const currencyToCountry: Record<string, string> = {
  BRL: 'br',
  USD: 'us',
  GBP: 'gb',
  EUR: 'eu'
};

// Componente limpo e reutilizável para renderizar a logo da bandeira
const FlagIcon = ({ currencyCode, className = "w-5" }: { currencyCode: string, className?: string }) => {
  const countryCode = currencyToCountry[currencyCode] || 'eu';
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={`${currencyCode} flag`}
      className={`rounded-[2px] object-cover shrink-0 ${className}`}
    />
  );
};

export default function DashboardPage() {
  const [role, setRole] = useState<Role>('finance'); 
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BRL');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockRequests: PaymentRequest[] = [
    {
      id: 'REQ-8821',
      status: 'pending',
      amount_local: 60000.00,
      currency_code: 'USD',
      amount_eur: 55240.50,
      exchange_rate: 0.92,
      rate_source: 'https://api.exchangerate-api.com',
      rate_fetched_at: '2026-06-12T14:00:00Z',
      description: 'Client Payment for Freelance Work',
      created_at: '2026-06-11T14:32:00Z',
      expires_at: '2026-06-13T14:32:00Z',
      user: { name: 'Mitchel Short', country: 'United States' }
    },
    {
      id: 'REQ-7432',
      status: 'approved',
      amount_local: 30000.00,
      currency_code: 'BRL',
      amount_eur: 5120.00,
      exchange_rate: 5.85,
      rate_source: 'https://api.exchangerate-api.com',
      rate_fetched_at: '2026-06-10T09:15:00Z',
      description: 'Desenvolvimento de Módulos Core',
      created_at: '2026-06-10T14:32:00Z',
      expires_at: '2026-06-12T14:32:00Z',
      user: { name: 'Daniel Vitory', country: 'Brazil' }
    },
    {
      id: 'REQ-1190',
      status: 'expired',
      amount_local: 8200.00,
      currency_code: 'GBP',
      amount_eur: 9750.00,
      exchange_rate: 0.84,
      rate_source: 'https://api.exchangerate-api.com',
      rate_fetched_at: '2026-06-05T17:48:00Z',
      description: 'Refund de infraestrutura Cloud',
      created_at: '2026-06-05T17:48:00Z',
      expires_at: '2026-06-07T17:48:00Z',
      user: { name: 'Liam Reyes', country: 'United Kingdom' }
    }
  ];

  const mockCurrentRates: Record<string, number> = { BRL: 5.85, USD: 0.92, GBP: 0.84 };
  const estimatedEur = amount ? (parseFloat(amount) / (mockCurrentRates[currency] || 1)).toFixed(2) : '0.00';

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAmount('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white font-manrope selection:bg-buzz-red selection:text-white border-t-[3px] border-buzz-red pb-10">
      
      {/* NAVBAR SUPERIOR */}
      <nav className="flex items-center justify-between px-6 sm:px-10 py-5 mb-6">
        <div className="text-buzz-red font-bold tracking-[0.35em] text-lg sm:text-xl">
          B U Z Z P A Y
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight">Edelin</p>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              className="text-[10px] uppercase tracking-wider text-muted bg-[#141414] border border-[#262626] px-2 py-0.5 rounded-full mt-1 focus:outline-none cursor-pointer"
            >
              <option value="finance">Role: Finance</option>
              <option value="employee">Role: Employee</option>
            </select>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-sm font-bold text-white">
            EC
          </div>
          <button className="text-muted hover:text-white transition-colors ml-2" title="Logout">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>
      </nav>

      <div className="px-4 sm:px-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card Principal */}
            <div className="bg-[#101010] rounded-[24px] p-8 border border-[#262626] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-buzz-red/5 rounded-full filter blur-3xl pointer-events-none"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <span className="text-muted text-xs uppercase tracking-wider font-semibold">Base Currency Balance (EUR Target Value)</span>
                  <div className="flex items-center gap-3 mt-2">
                    <FlagIcon currencyCode="EUR" className="w-10 shadow-sm" />
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">€ 60,360.50</h2>
                  </div>
                </div>
                <div className="text-xs text-muted bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-[12px]">
                  Real-time API Rates
                </div>
              </div>
              <div className="flex gap-3 relative z-10 mt-8 text-xs text-muted">
                <span>Automated 48h expiration task active</span>
              </div>
            </div>

            {/* Filtros de Estado */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['pending', 'approved', 'rejected', 'expired'] as Status[]).map((status) => {
                const count = mockRequests.filter(r => r.status === status).length;
                const isActive = statusFilter === status;
                return (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
                    className={`text-left rounded-[24px] p-5 transition-all border ${
                      isActive ? 'bg-[#1c1213] border-buzz-red/50 shadow-[0_0_15px_rgba(198,4,2,0.15)]' : 'bg-[#101010] border-[#262626] hover:bg-[#151515]'
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2 capitalize">{status}</span>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold text-white">{count}</h3>
                      <span className="text-[10px] text-muted">records</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tabela de Payment Requests */}
            <div className="bg-[#101010] border border-[#262626] rounded-[24px] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg tracking-tight">Payment Requests</h3>
                <div className="text-xs text-muted bg-[#1a1a1a] px-3 py-1.5 rounded-[12px] border border-[#333]">
                  Filter: <span className="text-white font-bold uppercase">{statusFilter}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-muted text-xs border-b border-[#262626] uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 font-medium">Employee</th>
                      <th className="pb-3 font-medium">Local Amount</th>
                      <th className="pb-3 font-medium hidden md:table-cell">Rate (EUR)</th>
                      <th className="pb-3 font-medium">Status</th>
                      {role === 'finance' && <th className="pb-3 font-medium text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {mockRequests
                      .filter(req => statusFilter === 'all' || req.status === statusFilter)
                      .map((req) => (
                      <tr key={req.id} className="hover:bg-[#151515] transition-colors group">
                        <td className="py-4 pr-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-bold text-xs text-muted group-hover:border-buzz-red/40 transition-colors">
                              {req.user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{req.user.name}</p>
                              <p className="text-xs text-muted max-w-[180px] truncate">{req.description || 'No description provided'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-white flex items-center gap-2 h-[72px]">
                          <FlagIcon currencyCode={req.currency_code} className="w-[18px] opacity-90" />
                          {req.amount_local.toLocaleString('en-US', { style: 'currency', currency: req.currency_code })}
                        </td>
                        <td className="py-4 hidden md:table-cell text-muted">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <FlagIcon currencyCode="EUR" className="w-[14px]" /> 
                            € {req.amount_eur.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <p className="text-[10px] text-muted truncate max-w-[150px] mt-0.5">1 {req.currency_code} = {req.exchange_rate}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border ${
                            req.status === 'approved' ? 'bg-[#14321a] text-[#4ade80] border-[#1f5c2e]' : 
                            req.status === 'pending' ? 'bg-[#3d2b00] text-[#f2a900] border-[#5c4000]' : 
                            req.status === 'expired' ? 'bg-[#1a1a1a] text-muted border-[#333]' :
                            'bg-[#3a0a0a] text-[#ef2630] border-[#5c1010]'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        {role === 'finance' && (
                          <td className="py-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex justify-end gap-1.5">
                                <button className="p-2 rounded-[12px] bg-[#1a1a1a] border border-[#333] text-[#4ade80] hover:bg-[#14321a] hover:border-[#1f5c2e] transition-all" title="Approve">
                                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                </button>
                                <button className="p-2 rounded-[12px] bg-[#1a1a1a] border border-[#333] text-[#ef2630] hover:bg-[#3a0a0a] hover:border-[#5c1010] transition-all" title="Reject">
                                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-muted px-3">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA (Formulário) */}
          <div className="space-y-6">
            
            <div className="bg-[#101010] border border-[#262626] rounded-[24px] p-6 sm:p-8 relative">
              <div className="mb-6">
                <h3 className="font-bold text-xl tracking-tight mb-1">Create Request</h3>
                <p className="text-sm text-muted">Submit values for validation.</p>
              </div>
              
              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div>
                  <label className="block text-sm text-white font-medium mb-2">Amount</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-white font-medium mb-2">Currency</label>
                  <div className="relative">
                    {/* Renderiza a bandeira dentro do select dinamicamente */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FlagIcon currencyCode={currency} className="w-5" />
                    </div>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-buzz-red transition-colors cursor-pointer appearance-none"
                    >
                      <option value="BRL">BRL - Brazilian Real</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="GBP">GBP - UK Pound</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white font-medium mb-2">Description</label>
                  <textarea 
                    maxLength={255}
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details..." 
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-[16px] py-3.5 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors resize-none"
                  />
                </div>

                <div className="bg-[#151515] border border-dashed border-[#333] rounded-[16px] p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] text-muted uppercase tracking-wider font-semibold">Estimated Value</span>
                  <div className="flex items-center gap-2 mt-1">
                    <FlagIcon currencyCode="EUR" className="w-[18px] opacity-90" />
                    <span className="text-2xl font-bold text-white">
                      € {parseFloat(estimatedEur).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted mt-2 flex items-center gap-1 justify-center">
                    1 <FlagIcon currencyCode={currency} className="w-3 mx-0.5" /> {currency} = {mockCurrentRates[currency]} EUR
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !amount}
                  className="w-full bg-[#c60402] hover:bg-[#ef2630] text-white font-medium py-3.5 rounded-[16px] transition-all shadow-[0_0_15px_rgba(198,4,2,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Request'}
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}