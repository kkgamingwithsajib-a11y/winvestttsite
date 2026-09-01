import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Share2, 
  DollarSign, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Award,
  TrendingUp,
  Layers
} from 'lucide-react';

interface AffiliateSectionProps {
  onOpenDashboard: () => void;
}

export const AffiliateSection: React.FC<AffiliateSectionProps> = ({ onOpenDashboard }) => {
  const [directReferrals, setDirectReferrals] = useState<number>(10);
  const [avgDeposit, setAvgDeposit] = useState<number>(1000);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleLink = 'https://winvest.com/?ref=WIN-89421';

  const affiliateCalculations = useMemo(() => {
    // Level 1: 5%
    const l1Count = directReferrals;
    const l1Earnings = l1Count * avgDeposit * 0.05;

    // Level 2: 2% (assuming each direct referral brings 2 people)
    const l2Count = l1Count * 2;
    const l2Earnings = l2Count * avgDeposit * 0.02;

    // Level 3: 1% (assuming each L2 brings 2 people)
    const l3Count = l2Count * 2;
    const l3Earnings = l3Count * avgDeposit * 0.01;

    const totalTeamSize = l1Count + l2Count + l3Count;
    const totalCommissions = l1Earnings + l2Earnings + l3Earnings;

    return {
      l1Earnings,
      l2Earnings,
      l3Earnings,
      totalCommissions,
      totalTeamSize,
    };
  }, [directReferrals, avgDeposit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="affiliate" className="py-20 md:py-28 relative bg-[#070b19] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>3-Tier Partnership Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            High-Yield 3-Tier <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Affiliate Program
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Earn instant multi-tier Bitcoin commissions by introducing partners to the Winvest ecosystem. No active deposit required to participate in our partner program.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Tier 1 */}
          <div className="bg-[#090f23] rounded-3xl border-2 border-emerald-500/40 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase font-mono">
              DIRECT LEVEL
            </div>
            <span className="text-xs font-mono text-emerald-400 block font-bold">LEVEL 1 REFERRALS</span>
            <div className="text-5xl font-extrabold font-display text-white mt-2 mb-1">
              5.0%
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Instant commission credited on every deposit made by your direct invited investors.
            </p>
            <div className="bg-[#050814] p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">EXAMPLE YIELD:</span>
              <span className="text-emerald-400 font-bold">$10,000 Deposit = $500.00 Instant</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 shadow-xl relative overflow-hidden">
            <span className="text-xs font-mono text-cyan-400 block font-bold">LEVEL 2 NETWORK</span>
            <div className="text-5xl font-extrabold font-display text-white mt-2 mb-1">
              2.0%
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Earn on all secondary deposits placed by people invited by your direct partners.
            </p>
            <div className="bg-[#050814] p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">EXAMPLE YIELD:</span>
              <span className="text-cyan-400 font-bold">$10,000 Deposit = $200.00 Instant</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 shadow-xl relative overflow-hidden">
            <span className="text-xs font-mono text-teal-400 block font-bold">LEVEL 3 EXTENDED</span>
            <div className="text-5xl font-extrabold font-display text-white mt-2 mb-1">
              1.0%
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Earn multi-level passive depth commissions as your extended organization expands globally.
            </p>
            <div className="bg-[#050814] p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block text-[10px]">EXAMPLE YIELD:</span>
              <span className="text-teal-300 font-bold">$10,000 Deposit = $100.00 Instant</span>
            </div>
          </div>

        </div>

        {/* Interactive Affiliate Commission Calculator */}
        <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-8 shadow-2xl max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Interactive Affiliate Commission Estimator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Direct Referrals (Level 1):</span>
                  <span className="text-emerald-400 font-bold">{directReferrals} Members</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={directReferrals}
                  onChange={(e) => setDirectReferrals(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Average Deposit per Member:</span>
                  <span className="text-cyan-400 font-bold">${avgDeposit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={avgDeposit}
                  onChange={(e) => setAvgDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Level 1 Commissions (5%):</span>
                  <span className="text-white font-bold">${affiliateCalculations.l1Earnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Level 2 Commissions (2%):</span>
                  <span className="text-white font-bold">${affiliateCalculations.l2Earnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Level 3 Commissions (1%):</span>
                  <span className="text-white font-bold">${affiliateCalculations.l3Earnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Total Estimated Outcome */}
            <div className="bg-gradient-to-b from-[#0c1630] to-[#080d1d] p-6 rounded-2xl border border-emerald-500/30 text-center space-y-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                ESTIMATED AFFILIATE PAYOUT
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold font-display text-white">
                ${affiliateCalculations.totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-400">
                Instant commissions based on an estimated network team of <strong className="text-slate-200">{affiliateCalculations.totalTeamSize} members</strong>.
              </p>

              <button
                onClick={onOpenDashboard}
                className="w-full py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all font-mono uppercase tracking-wider"
              >
                Access Partner Dashboard
              </button>
            </div>

          </div>
        </div>

        {/* Affiliate Link Preview Box */}
        <div className="max-w-3xl mx-auto bg-[#090f23] rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-slate-400 block">YOUR UNIQUE REFERRAL INVITATION LINK</span>
            <div className="text-sm font-mono text-emerald-400 font-bold mt-1 break-all">
              {sampleLink}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-5 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 flex items-center space-x-2 shrink-0 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Copied Link!' : 'Copy Referral Link'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
