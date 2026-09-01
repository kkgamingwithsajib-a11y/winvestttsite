import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Server, 
  Cpu, 
  FileCheck, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section id="security" className="py-20 md:py-28 relative bg-[#05070e] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional-Grade Custody & Defense</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Multi-Layered Security & <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Proof of Liquidity Reserves
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Your principal is safeguarded by institutional cold-storage protocols, automated stop-loss circuit breakers, and audited smart liquidity routing.
          </p>
        </div>

        {/* Security Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">BitGo Multi-Signature Cold Storage</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              98% of total client assets are segregated in geographically distributed, air-gapped deep cold storage vaults with 3-of-5 quorum multi-party computation.
            </p>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Multi-Party Key Ceremony Verification</span>
            </div>
          </div>

          <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Algorithmic Risk Circuit Breakers</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              If market variance spikes beyond 2.5% in any 60-second window, our neural bot triggers instantaneous delta-hedging to preserve USD notional capital.
            </p>
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Zero Liquidation Risk Exposure</span>
            </div>
          </div>

          <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Extended EV-SSL & Anti-DDoS</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Protected by Cloudflare Enterprise 10Tbps+ DDoS mitigation network with end-to-end TLS 1.3 encryption and bi-monthly third-party security audits.
            </p>
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>256-Bit Military Grade Encryption</span>
            </div>
          </div>

        </div>

        {/* Live Liquidity Health Indicator Banner */}
        <div className="rounded-3xl bg-[#090f23] border border-slate-800 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>100% SOLVENCY RESERVE AUDIT PASSED</span>
            </div>
            <h4 className="text-xl font-bold text-white">Daily Liquidity Buffer Guarantee</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              We maintain a continuous 15% instant hot-wallet liquidity reserve to service immediate, on-demand client withdrawals without delay.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="bg-[#050814] px-4 py-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">SOLVENCY RATIO</span>
              <span className="text-lg font-bold text-emerald-400">142.8%</span>
            </div>
            <div className="bg-[#050814] px-4 py-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">HOT LIQUIDITY</span>
              <span className="text-lg font-bold text-cyan-400">$18.4M</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
