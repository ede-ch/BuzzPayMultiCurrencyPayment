'use client';

import React, { useState } from 'react';

// Tipagens exatas do contrato do backend
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
  description?: string;
  created_at: string;
  expires_at: string;
  user: { name: string };
}

export default function DashboardPage() {
  const [role] = useState<Role>('finance'); // Mude para 'employee' para ver a diferença
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock de dados baseado APENAS no que o sistema real retorna
  const mockRequests: PaymentRequest[] = [
    {
      id: 'REQ-001',
      status: 'pending',
      amount_local: 5400.00,
      currency_code: 'BRL',
      amount_eur: 1000.00,
      exchange_rate: 5.40,
      rate_source: 'Fixer.io',
      description: 'Licença anual de software IDE',
      created_at: '2024-11-11T14:32:00Z',
      expires_at: '2024-11-12T14:32:00Z',
      user: { name: 'Mitchel Short' }
    },
    {
      id: 'REQ-002',
      status: 'approved',
      amount_local: 250.00,
      currency_code: 'GBP',
      amount_eur: 290.50,
      exchange_rate: 0.86,
      rate_source: 'OpenExchange',
      created_at: '2024-11-10T09:14:00Z',
      expires_at: '2024-11-11T09:14:00Z',
      user: { name: 'Aria Khan' }
    }
  ];

  const handleNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="min-h-screen bg-ink text-white font-manrope p-4 sm:p-6">
      {/* Navbar Superior (Apenas o que existe no projeto) */}
      <nav className="flex items-center justify-between mb-8 bg-[#141112] border border-border-sec rounded-full px-6 py-3">
        <div className="text-buzz-bright font-bold tracking-widest text-xl">
          BUZZPAY
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight">Edelin</p>
            <span className="text-[10px] uppercase tracking-wider text-muted-light bg-[#2a1a1a] px-2 py-0.5 rounded-full inline-block mt-0.5 border border-border-sec">
              {role}
            </span>
          </div>
          <button className="w-10 h-10 rounded-full border border-border-sec flex items-center justify-center hover:bg-buzz-red/20 hover:text-buzz-bright transition-colors" title="Logout">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA/CENTRAL (Listagem e Filtros) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Principal: Overview real do sistema (Total de Requisições) */}
          <div className="bg-gradient-to-br from-[#2a1a1a] to-[#141112] rounded-24px p-8 border border-border-sec relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-muted text-sm uppercase tracking-wider">Total Pending Requests (EUR)</span>
                <h2 className="text-5xl font-bold mt-2 tracking-tight">€ 1,000.00</h2>
              </div>
            </div>
            <div className="mt-8 relative z-10 flex gap-4">
              <span className="text-sm text-muted-light bg-ink border border-border-sec px-4 py-2 rounded-full">
                Based on active requests
              </span>
            </div>
          </div>

          {/* Cards Secundários viraram os Filtros de Status (Substitui Business Account, etc) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['pending', 'approved', 'rejected', 'expired'].map((status) => (
              <button 
                key={status}
                onClick={() => setActiveFilter(status as Status)}
                className={`text-left rounded-24px p-5 transition-all border ${
                  activeFilter === status 
                    ? 'bg-[#2a1a1a] border-buzz-red shadow-glow-red' 
                    : 'bg-[#141112] border-border-sec hover:bg-[#1a1617]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted capitalize">{status}</span>
                </div>
                {/* Contadores fictícios apenas para ilustrar o layout, devem vir da API */}
                <h3 className="text-xl font-bold mb-2">{status === 'pending' ? '1' : status === 'approved' ? '12' : '0'}</h3>
              </button>
            ))}
          </div>

          {/* Lista de Requisições (Substitui a "Recent Activity") */}
          <div className="bg-[#141112] border border-border-sec rounded-24px p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Payment Requests</h3>
              {activeFilter !== 'all' && (
                <button onClick={() => setActiveFilter('all')} className="text-xs text-buzz-bright hover:underline">
                  Clear Filter
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-muted text-xs border-b border-border-sec uppercase tracking-wider">
                  <tr>
                    <th className="pb-3 font-normal">Requester / Desc</th>
                    <th className="pb-3 font-normal">Amount (Local)</th>
                    <th className="pb-3 font-normal hidden sm:table-cell">Conversion (EUR)</th>
                    <th className="pb-3 font-normal">Status</th>
                    {role === 'finance' && <th className="pb-3 font-normal text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-sec/50">
                  {mockRequests
                    .filter(req => activeFilter === 'all' || req.status === activeFilter)
                    .map((req) => (
                    <tr key={req.id} className="hover:bg-[#1a1617] transition-colors">
                      <td className="py-4">
                        <p className="font-bold">{req.user.name}</p>
                        <p className="text-xs text-muted truncate max-w-[150px]">{req.description || 'No description'}</p>
                      </td>
                      <td className="py-4 font-bold text-white">
                        {req.amount_local.toLocaleString('en-US', { style: 'currency', currency: req.currency_code })}
                      </td>
                      <td className="py-4 hidden sm:table-cell">
                        <p className="font-medium text-muted-light">€ {req.amount_eur.toFixed(2)}</p>
                        <p className="text-[10px] text-muted mt-0.5">Rate: {req.exchange_rate}</p>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          req.status === 'success' || req.status === 'approved' ? 'bg-[#1a4028] text-[#4ade80] border-[#225c38]' : 
                          req.status === 'pending' ? 'bg-coin-yellow/10 text-coin-yellow border-coin-yellow/20' : 
                          'bg-buzz-red/10 text-buzz-bright border-buzz-red/20'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      {role === 'finance' && (
                        <td className="py-4 text-right">
                          {req.status === 'pending' ? (
                             <div className="flex justify-end gap-2">
                               <button className="text-[#4ade80] hover:bg-[#1a4028] p-1.5 rounded-lg border border-transparent hover:border-[#225c38] transition-colors" title="Approve">
                                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                               </button>
                               <button className="text-buzz-bright hover:bg-buzz-red/10 p-1.5 rounded-lg border border-transparent hover:border-buzz-red/20 transition-colors" title="Reject">
                                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                               </button>
                             </div>
                          ) : (
                            <span className="text-xs text-muted">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação Real do Sistema */}
            <div className="flex items-center justify-between border-t border-border-sec pt-4 mt-2">
              <button className="text-xs font-medium text-muted hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50" disabled>
                Previous
              </button>
              <span className="text-xs text-muted-light">Page <strong className="text-white">1</strong> of 1</span>
              <button className="text-xs font-medium text-white hover:text-buzz-bright transition-colors flex items-center gap-1 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (Formulário e Detalhes) */}
        <div className="space-y-6">
          
          {/* Formulário de Nova Requisição ocupando o lugar do "Top Spending" */}
          <div className="bg-[#141112] border border-border-sec rounded-24px p-6">
            <div className="mb-6 pb-4 border-b border-border-sec">
              <h3 className="font-bold text-lg">New Payment Request</h3>
              <p className="text-xs text-muted mt-1">Submit a new request for approval.</p>
            </div>
            
            <form onSubmit={handleNewRequest} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-light mb-1 ml-1">Amount</label>
                <div className="relative">
                  <input 
                    type="number" step="0.01" min="0.01" placeholder="0.00" required
                    className="w-full bg-ink border border-border-sec rounded-12px py-3 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-muted-light mb-1 ml-1">Currency</label>
                <select className="w-full bg-ink border border-border-sec rounded-12px py-3 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors appearance-none">
                  {/* Moeda local do usuário definida no cadastro */}
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-light mb-1 ml-1">Description (Max 255)</label>
                <textarea 
                  maxLength={255} rows={3} placeholder="What is this for?"
                  className="w-full bg-ink border border-border-sec rounded-12px py-3 px-4 text-white focus:outline-none focus:border-buzz-red transition-colors resize-none"
                />
              </div>

              {/* Box de Preview da Conversão (Requisito do PDF) */}
              <div className="bg-ink border border-dashed border-border-sec rounded-12px p-4 flex flex-col gap-1 items-center justify-center text-center">
                <span className="text-xs text-muted">Estimated EUR Value</span>
                <span className="text-lg font-bold text-muted-light">--</span>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-buzz-red hover:bg-buzz-bright text-white font-bold py-3 rounded-12px transition-all shadow-glow-red disabled:opacity-70 mt-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}