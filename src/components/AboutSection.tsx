import React from 'react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  TrendingUp, 
  CheckCircle, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';

interface AboutSectionProps {
  onOpenCertificate: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCertificate }) => {
  return (
    <section id="about" className="py-20 md:py-28 relative bg-[#070b19] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Heritage & Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Pioneering Algorithmic Wealth at <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Wealth Invest Corp
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Founded in 2018 by leading quantitative analysts, deep reinforcement learning researchers, and veteran crypto traders, Winvest was created to democratize institutional-grade algorithmic yield for individual investors worldwide.
          </p>
        </div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1 */}
          <div className="bg-glass-card rounded-2xl p-7 relative group transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Autonomous Neural Trading</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Our neural network continuously digests millions of order book events per second across Tier-1 global exchanges, isolating sub-second statistical arbitrage opportunities with high statistical confidence.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deep Reinforcement Learning (DRL)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sub-millisecond API execution layer</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-glass-card rounded-2xl p-7 relative group transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">US Corporate Standing</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Headquartered at One Vanderbilt in Manhattan, New York, Wealth Invest Corp operates with formalized corporate governance, verifiable share participation units, and strict fiduciary risk controls.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>NYS Entity File #7291842</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>One Vanderbilt Ave, New York, NY</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-glass-card rounded-2xl p-7 relative group transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Guaranteed Liquidity & Safety</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Daily yields of 3.00% are credited automatically and ready for withdrawal 24 hours a day with zero platform fees, backed by institutional multi-signature BitGo reserve vaults.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>180% Gross return in 60 days</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>$1 Minimum automated withdrawal</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Corporate Trust & Certificate Action Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0c142b] via-[#0e1936] to-[#0c142b] border border-emerald-500/30 p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4" />
              <span>Official Shareholder Participation</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white">
              Every deposit issues an authenticated Share Certificate
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl">
              All active investors in the 60-day pool receive a serialized digital Share Certificate under Wealth Invest Corp, verifying your allocated liquidity share, start date, and yield schedule.
            </p>
          </div>

          <button
            onClick={onOpenCertificate}
            className="px-6 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2 shrink-0"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Generate / View Certificate</span>
          </button>
        </div>

      </div>
    </section>
  );
};
