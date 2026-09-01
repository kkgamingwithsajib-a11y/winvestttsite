import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Radio, 
  Workflow, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { TradeSignal } from '../types';
import { INITIAL_AI_SIGNALS } from '../data/mockData';

interface AiEngineShowcaseProps {
  signals?: TradeSignal[];
  onOpenDeposit?: () => void;
}

export const AiEngineShowcase: React.FC<AiEngineShowcaseProps> = ({ signals = INITIAL_AI_SIGNALS, onOpenDeposit }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');

  const strategies = [
    { id: 'all', label: 'All AI Signals' },
    { id: 'arbitrage', label: 'Orderbook Arbitrage' },
    { id: 'momentum', label: 'Deep RL Momentum' },
    { id: 'scalp', label: 'Volatility Scalp' },
  ];

  const signalList = (Array.isArray(signals) && signals.length > 0) ? signals : INITIAL_AI_SIGNALS;

  const filteredSignals = selectedStrategy === 'all' 
    ? signalList 
    : signalList.filter(s => s && s.strategy && s.strategy.toLowerCase().includes(selectedStrategy));

  return (
    <section id="ai-engine" className="py-20 md:py-28 relative bg-[#05070e] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Proprietary High-Frequency Core</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            How The Autonomous <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              AI Engine Generates Yield
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Our multi-layered neural algorithmic architecture scans over 40 Tier-1 cryptocurrency liquidity pools simultaneously, capturing microsecond inefficiencies with zero human emotion.
          </p>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="bg-[#090f23] rounded-2xl border border-slate-800/90 p-6 hover:border-emerald-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">Deep Reinforcement Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Neural agents trained on 7+ years of tick-by-tick orderbook data continuously self-optimize for changing market volatility and liquidity shocks.
            </p>
          </div>

          <div className="bg-[#090f23] rounded-2xl border border-slate-800/90 p-6 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">Quantum Order-Book Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sub-millisecond scanning of Depth-of-Market (DOM) across Binance, Coinbase, Kraken, and OKX to detect institutional liquidity sweeps.
            </p>
          </div>

          <div className="bg-[#090f23] rounded-2xl border border-slate-800/90 p-6 hover:border-teal-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Sub-0.4ms Latency Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Co-located optical fiber connections directly adjacent to major exchange matching engines in New York (Equinix NY4) and Tokyo.
            </p>
          </div>

          <div className="bg-[#090f23] rounded-2xl border border-slate-800/90 p-6 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-mono font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2">Automated Circuit Breakers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time delta-neutral hedging automatically freezes risk exposure and switches to stablecoin liquidity if market anomalies spike.
            </p>
          </div>

        </div>

        {/* Live Signal Telemetry Terminal */}
        <div className="bg-[#090f23] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-lg font-bold text-white">Live AI Execution & Signal Stream</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Real-time trade telemetry parsed by the Winvest neural execution layer</p>
            </div>

            <div className="flex items-center gap-2">
              {strategies.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStrategy(st.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                    selectedStrategy === st.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#050814] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050814] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Asset Pair</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Strategy</th>
                  <th className="p-3.5">Entry / Exit Target</th>
                  <th className="p-3.5">Spread Profit</th>
                  <th className="p-3.5">AI Confidence</th>
                  <th className="p-3.5">Latency</th>
                  <th className="p-3.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredSignals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white">{signal.pair}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        signal.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {signal.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{signal.strategy}</td>
                    <td className="p-3.5 text-slate-300">
                      ${signal.entryPrice.toLocaleString()} → ${signal.exitPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold">+{signal.profitPercent}%</td>
                    <td className="p-3.5 text-cyan-400">{signal.confidence}%</td>
                    <td className="p-3.5 text-slate-400">{signal.executionTimeMs} ms</td>
                    <td className="p-3.5 text-slate-500">{signal.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">● 100% Autonomous Bot Swarm Active</span>
              <span>• Avg Daily Win Ratio: 84.7%</span>
            </div>
            <button
              onClick={onOpenDeposit}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 underline underline-offset-4"
            >
              Participate in this liquidity pool →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
