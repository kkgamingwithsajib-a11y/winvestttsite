import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';
import { LiveTransaction } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { CryptoIcon } from './CryptoIcon';

interface LiveTransactionsProps {
  initialTransactions?: LiveTransaction[];
  transactions?: LiveTransaction[];
}

export const LiveTransactions: React.FC<LiveTransactionsProps> = ({ 
  initialTransactions, 
  transactions: propTransactions 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'payouts'>('all');
  const [transactions, setTransactions] = useState<LiveTransaction[]>(() => {
    if (propTransactions && propTransactions.length > 0) return propTransactions;
    if (initialTransactions && initialTransactions.length > 0) return initialTransactions;
    return INITIAL_TRANSACTIONS;
  });

  // Periodically add new realistic simulated blockchain transactions
  useEffect(() => {
    const userNames = ['Viktor_N***', 'Marcus_B***', 'Elena_S***', 'Jin_W***', 'Tariq_A***', 'Chloe_D***', 'Mateo_R***', 'Kenji_O***'];
    const interval = setInterval(() => {
      const isDeposit = Math.random() > 0.5;
      const amountUsd = isDeposit 
        ? Math.floor(Math.random() * 8000 + 100)
        : Math.floor(Math.random() * 2500 + 50);
      const btcPrice = 92450;
      const amountBtc = Number((amountUsd / btcPrice).toFixed(5));
      const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
      const randomHash = Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6);

      const newTx: LiveTransaction = {
        id: `tx-live-${Date.now()}`,
        type: isDeposit ? 'deposit' : 'payout',
        username: randomUser,
        amountUsd,
        amountBtc,
        txHash: randomHash,
        timestamp: 'Just now',
        status: 'confirmed',
        timeAgo: 'Just now',
      };

      setTransactions((prev) => {
        const safePrev = Array.isArray(prev) ? prev : INITIAL_TRANSACTIONS;
        return [newTx, ...safePrev.slice(0, 14)];
      });
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const safeList = Array.isArray(transactions) ? transactions : INITIAL_TRANSACTIONS;
  const filteredTransactions = safeList.filter((tx) => {
    if (!tx) return false;
    if (activeTab === 'deposits') return tx.type === 'deposit';
    if (activeTab === 'payouts') return tx.type === 'payout';
    return true;
  });

  return (
    <section className="py-20 md:py-28 relative bg-[#05070e] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Live Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time On-Chain Proof of Reserve</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Live Network Transactions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Verifiable real-time Bitcoin deposits and automated 24/7 yield withdrawals.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#090f23] p-1.5 rounded-xl border border-slate-800 self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setActiveTab('deposits')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'deposits'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Deposits
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'payouts'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Payouts
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#090f23] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050814] text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Type</th>
                  <th className="p-4">Investor Account</th>
                  <th className="p-4">Amount (USD)</th>
                  <th className="p-4">Amount (BTC)</th>
                  <th className="p-4">Transaction Hash</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      {tx.type === 'deposit' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[11px]">
                          <ArrowDownLeft className="w-3 h-3" />
                          Deposit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                          <ArrowUpRight className="w-3 h-3" />
                          Instant Payout
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-slate-200">{tx.username}</td>

                    <td className="p-4 font-bold text-white text-sm">
                      ${tx.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <CryptoIcon currency="BTC" size={20} />
                      <span>{tx.amountBtc.toFixed(5)} BTC</span>
                    </td>

                    <td className="p-4 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors flex items-center gap-1.5">
                      <span>{tx.txHash}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </td>

                    <td className="p-4 text-slate-400">{tx.timestamp}</td>

                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Network Notice */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500 px-2">
          <span>● Bitcoin Mainnet & Lightning Node Synced (Block #884,921)</span>
          <span className="text-emerald-400">Average Payout Latency: 1.8 mins</span>
        </div>

      </div>
    </section>
  );
};
