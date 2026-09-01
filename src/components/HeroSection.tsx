import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Zap, 
  Award, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  Activity, 
  DollarSign, 
  Lock,
  Sparkles,
  Layers
} from 'lucide-react';
import { TradeSignal, MarketPair } from '../types';
import { INITIAL_AI_SIGNALS } from '../data/mockData';

interface HeroSectionProps {
  onStartInvest?: () => void;
  onOpenDeposit?: () => void;
  onOpenCalculator?: () => void;
  onOpenCertificate?: () => void;
  onOpenWhitepaper?: () => void;
  signals?: TradeSignal[];
  marketPairs?: MarketPair[];
  dailyRatePercent?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvest,
  onOpenDeposit,
  onOpenCalculator,
  onOpenCertificate,
  onOpenWhitepaper,
  signals = INITIAL_AI_SIGNALS,
  marketPairs = [],
  dailyRatePercent = 3.0,
}) => {
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [liveBtcPrice, setLiveBtcPrice] = useState(92450.80);

  const signalList = (signals && signals.length > 0) ? signals : INITIAL_AI_SIGNALS;

  // Subtle live price fluctuation for dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 18;
      setLiveBtcPrice((prev) => Math.max(90000, Number((prev + delta).toFixed(2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!signalList || signalList.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSignalIndex((prev) => (prev + 1) % signalList.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [signalList.length]);

  const activeSignal = signalList[currentSignalIndex] || signalList[0] || {
    id: 'sig-fallback',
    pair: 'BTC/USDT',
    type: 'BUY' as const,
    entryPrice: 92450,
    exitPrice: 95220,
    profitPercent: 2.99,
    confidence: 96,
    timestamp: 'Just now',
    strategy: 'AI Deep RL Arbitrage',
    executionTimeMs: 0.38
  };

  const handleDepositAction = () => {
    if (onStartInvest) onStartInvest();
    else if (onOpenDeposit) onOpenDeposit();
  };

  const handleCalculateAction = () => {
    if (onOpenCalculator) {
      onOpenCalculator();
    } else {
      const el = document.getElementById('calculator');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCertAction = () => {
    if (onOpenCertificate) onOpenCertificate();
    else if (onOpenWhitepaper) onOpenWhitepaper();
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Glow gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            {/* Top pill badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Next-Gen Autonomous AI Trading Platform</span>
              <span className="text-slate-500">|</span>
              <span className="text-white font-mono font-bold">{dailyRatePercent.toFixed(2)}% Daily for 60 Days</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12]">
              Next-Generation AI-Driven <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Crypto Wealth Generation
              </span>
            </h1>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Winvest deploys high-frequency deep reinforcement learning and quantum order-book algorithms to deliver a fixed <strong className="text-white font-semibold">{dailyRatePercent.toFixed(2)}% daily return for 60 calendar days ({(dailyRatePercent * 60).toFixed(0)}% Total ROI)</strong>. Backed by Wealth Invest Corp in New York, with daily liquidity and zero withdrawal fees.
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{(dailyRatePercent * 60).toFixed(0)}% Gross Yield</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">Min Entry Only $10</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">24/7 Daily Withdrawals</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleDepositAction}
                className="px-7 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <span>Start Investing with $10</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCalculateAction}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Calculate Profit</span>
              </button>

              <button
                onClick={handleCertAction}
                className="px-5 py-3.5 text-sm font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 rounded-xl transition-all flex items-center space-x-1.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Corporate Share</span>
              </button>
            </div>

            {/* Security Micro-badges */}
            <div className="flex items-center space-x-6 text-xs text-slate-400 pt-3">
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>BitGo Multi-Sig Custody</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>NYS File #7291842</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live AI Trading Engine Terminal */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#090f23] border border-slate-800/90 shadow-2xl p-5 overflow-hidden">
              {/* Header of Terminal */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">winvest-ai-core // v3.4.1</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AUTONOMOUS EXECUTION</span>
                </div>
              </div>

              {/* Bot Core Status */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#050814] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block font-mono">EXECUTION LATENCY</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-lg font-bold font-mono text-emerald-400">0.38 ms</span>
                    <span className="text-[10px] text-slate-500">Ultra-fast</span>
                  </div>
                </div>
                <div className="bg-[#050814] p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block font-mono">OBSERVED WIN RATE</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-lg font-bold font-mono text-cyan-400">84.7%</span>
                    <span className="text-[10px] text-emerald-400">2,410 trades/24h</span>
                  </div>
                </div>
              </div>

              {/* Live Streaming Active Trade Signal */}
              <div className="bg-[#050814] rounded-xl p-4 border border-emerald-500/20 mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-bl-lg font-semibold">
                  LIVE ARBITRAGE SIGNAL
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white font-mono text-sm">{activeSignal.pair}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      activeSignal.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {activeSignal.type}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{activeSignal.timestamp}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono my-2.5 bg-[#090f24] p-2.5 rounded-lg">
                  <div>
                    <span className="text-[10px] text-slate-500 block">ENTRY</span>
                    <span className="text-slate-200 font-semibold">${activeSignal.entryPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">TARGET</span>
                    <span className="text-slate-200 font-semibold">${activeSignal.exitPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SPREAD GAIN</span>
                    <span className="text-emerald-400 font-bold">+{activeSignal.profitPercent}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="text-slate-400">Strategy: <strong className="text-slate-200">{activeSignal.strategy}</strong></span>
                  <span className="text-cyan-400 font-mono">Conf: {activeSignal.confidence}%</span>
                </div>
              </div>

              {/* Real-time Ticker / Contract Simulator Mini Banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Fixed 3.00% Daily Distribution</span>
                  <span className="text-[11px] text-slate-400">Auto-credited every 24 hours to your balance</span>
                </div>
                <button
                  onClick={handleDepositAction}
                  className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shrink-0 transition-colors font-mono cursor-pointer"
                >
                  Join Pool
                </button>
              </div>

              {/* Bot Activity Feed */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  Binance / Coinbase / OKX Liquidity
                </span>
                <span className="text-slate-300 font-semibold">BTC: ${liveBtcPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Platform Metrics Banner */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#090f23]/60 p-4 rounded-xl border border-slate-800/70">
            <span className="text-xs text-slate-400 font-medium block">Total Deposited</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">$148,920,400+</div>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 inline-block">↑ Verified on-chain</span>
          </div>

          <div className="bg-[#090f23]/60 p-4 rounded-xl border border-slate-800/70">
            <span className="text-xs text-slate-400 font-medium block">Total Paid Out</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400 mt-1">$72,450,180+</div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">100% Instant Liquidity</span>
          </div>

          <div className="bg-[#090f23]/60 p-4 rounded-xl border border-slate-800/70">
            <span className="text-xs text-slate-400 font-medium block">Active Global Investors</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-cyan-400 mt-1">54,320+</div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">Across 142 Countries</span>
          </div>

          <div className="bg-[#090f23]/60 p-4 rounded-xl border border-slate-800/70">
            <span className="text-xs text-slate-400 font-medium block">System Uptime & SLA</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400 mt-1">99.98%</div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">Zero Interruption</span>
          </div>
        </div>

      </div>
    </section>
  );
};
