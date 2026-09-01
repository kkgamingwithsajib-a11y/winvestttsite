import React from 'react';
import { 
  Percent, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Coins, 
  TrendingUp,
  Award,
  Zap,
  Repeat
} from 'lucide-react';
import { InvestmentPlan } from '../types';
import { INITIAL_PLANS } from '../data/mockData';

interface PlanSectionProps {
  onSelectPlan?: (amount?: number) => void;
  onOpenDeposit?: () => void;
  onOpenCalculator?: () => void;
  plans?: InvestmentPlan[];
}

export const PlanSection: React.FC<PlanSectionProps> = ({ 
  onSelectPlan, 
  onOpenDeposit, 
  onOpenCalculator,
  plans = [] 
}) => {
  const safePlans = (Array.isArray(plans) && plans.length > 0) ? plans : INITIAL_PLANS;
  const activePlans = safePlans.filter(p => p && p.isActive);

  const handleAction = (amount?: number) => {
    if (onSelectPlan) {
      onSelectPlan(amount);
    } else if (onOpenDeposit) {
      onOpenDeposit();
    }
  };

  return (
    <section id="plan" className="py-20 md:py-28 relative bg-[#05070e] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Percent className="w-3.5 h-3.5" />
            <span>Guaranteed Algorithmic Distribution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Flagship 60-Day <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              AI Quantum Investment Plan
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Institutional investment tiers designed to maximize capital efficiency through autonomous high-frequency digital asset arbitrage.
          </p>
        </div>

        {/* Dynamic / Flagship Plans Grid */}
        {activePlans.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {activePlans.map((plan) => (
              <div 
                key={plan.id}
                className="relative rounded-3xl bg-gradient-to-b from-[#0e1732] via-[#090f23] to-[#070b1a] border border-emerald-500/30 p-6 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-xl"
              >
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {plan.badge || 'FLAGSHIP TIER'}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                  <div className="text-3xl font-display font-bold text-emerald-400 mt-2">
                    {plan.dailyYieldPercent.toFixed(2)}% <span className="text-sm font-normal text-slate-400">Daily Return</span>
                  </div>

                  <div className="my-5 p-4 rounded-xl bg-[#050814]/80 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Duration:</span>
                      <strong className="text-white">{plan.durationDays} Days</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Min Allocation:</span>
                      <strong className="text-white">${plan.minAmountUsd.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Net ROI:</span>
                      <strong className="text-cyan-400">{(plan.dailyYieldPercent * plan.durationDays).toFixed(0)}% ROI</strong>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {(plan.features || [
                      `${plan.dailyYieldPercent}% daily distributions`,
                      'Instant 24/7 withdrawals',
                      '100% Principal returned',
                      'Shareholder digital certificate'
                    ]).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleAction(plan.minAmountUsd)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Invest in {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single Featured Main Plan Card */
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1732] via-[#090f23] to-[#070b1a] border-2 border-emerald-500/40 p-8 sm:p-12 shadow-2xl shadow-emerald-500/10 overflow-hidden">
              
              {/* Top Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-400 text-slate-950 text-xs font-black px-6 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
                Most Popular • Instant Daily Liquidity
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Plan Metric Highlights */}
                <div className="md:col-span-6 space-y-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">PRIMARY FIXED TIER</span>
                    <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
                      {activePlans[0]?.dailyYieldPercent || 3.0}% <span className="text-xl font-normal text-slate-300">Daily Return</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 font-mono">Credited every 24 hours for {activePlans[0]?.durationDays || 60} calendar days</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="bg-[#050814]/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-mono">TOTAL GROSS ROI</span>
                      <span className="text-2xl font-bold font-display text-emerald-400">
                        {((activePlans[0]?.dailyYieldPercent || 3.0) * (activePlans[0]?.durationDays || 60)).toFixed(0)}%
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">80% Pure Net Profit</span>
                    </div>

                    <div className="bg-[#050814]/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 block font-mono">CONTRACT DURATION</span>
                      <span className="text-2xl font-bold font-display text-cyan-400">{activePlans[0]?.durationDays || 60} Days</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Capital in payouts</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Minimum Deposit</span>
                      <span className="text-white font-mono font-bold">${activePlans[0]?.minAmountUsd || 10}.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Maximum Deposit</span>
                      <span className="text-white font-mono font-bold">${(activePlans[0]?.maxAmountUsd || 500000).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                      <span className="text-slate-400">Breakeven Period</span>
                      <span className="text-emerald-400 font-mono font-bold">Day 33.3</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2">
                      <span className="text-slate-400">Withdrawal Availability</span>
                      <span className="text-emerald-400 font-mono font-bold">24/7 Daily Instant</span>
                    </div>
                  </div>
                </div>

                {/* Plan Benefits & Action */}
                <div className="md:col-span-6 bg-[#060a17]/90 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Included in this plan
                    </h4>

                    <ul className="space-y-3 text-xs text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Automated Yield Accrual:</strong> Exact {activePlans[0]?.dailyYieldPercent || 3.0}% daily payout added directly to withdrawable wallet balance every 24h.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Zero Platform Withdrawal Fees:</strong> We never charge fees to access your earnings (standard network fee only).</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Shareholder Digital Certificate:</strong> Authenticated corporate share certificate under Wealth Invest Corp.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Compound Reinvestment:</strong> Option to spin up parallel contracts with earned returns.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => handleAction(1000)}
                      className="w-full py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 font-mono uppercase tracking-wider"
                    >
                      <span>Deposit & Activate Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {onOpenCalculator && (
                      <button
                        onClick={onOpenCalculator}
                        className="w-full py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center space-x-2"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open Interactive ROI Calculator</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Comparison Matrix with Other Asset Classes */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white">How Winvest Compares</h3>
            <p className="text-xs text-slate-400">Comparing traditional asset classes to Winvest Autonomous AI yields</p>
          </div>

          <div className="bg-[#090f23] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#050814] text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Investment Vehicle</th>
                    <th className="p-4">Daily Yield</th>
                    <th className="p-4">60-Day Return</th>
                    <th className="p-4">Payout Frequency</th>
                    <th className="p-4">Minimum Entry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr className="bg-emerald-950/20 text-white font-semibold">
                    <td className="p-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <strong className="text-emerald-400">Winvest AI Quantum</strong>
                    </td>
                    <td className="p-4 text-emerald-400 font-bold">3.00% Daily</td>
                    <td className="p-4 text-emerald-400 font-bold">180.00% (80% Net)</td>
                    <td className="p-4 text-slate-200">Daily 24/7</td>
                    <td className="p-4 text-slate-200">$10</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="p-4">Traditional High Yield Savings</td>
                    <td className="p-4 text-slate-400">~0.012%</td>
                    <td className="p-4 text-slate-400">~0.72%</td>
                    <td className="p-4 text-slate-400">Monthly</td>
                    <td className="p-4 text-slate-400">$100 - $1,000</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="p-4">S&P 500 Index (Historical avg)</td>
                    <td className="p-4 text-slate-400">~0.027%</td>
                    <td className="p-4 text-slate-400">~1.64%</td>
                    <td className="p-4 text-slate-400">Quarterly Dividends</td>
                    <td className="p-4 text-slate-400">Share Price ($500+)</td>
                  </tr>
                  <tr className="text-slate-300">
                    <td className="p-4">Traditional Crypto Hedge Fund</td>
                    <td className="p-4 text-slate-400">Variable</td>
                    <td className="p-4 text-slate-400">~3.5% - 8%</td>
                    <td className="p-4 text-slate-400">Annual Lockup</td>
                    <td className="p-4 text-slate-400">$100,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
