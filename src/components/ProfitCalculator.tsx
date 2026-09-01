import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Coins, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';

interface ProfitCalculatorProps {
  onOpenDepositWithAmount?: (amount: number) => void;
  onInvestNow?: (amount: number) => void;
  btcPrice?: number;
  dailyYieldPercent?: number;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ 
  onOpenDepositWithAmount,
  onInvestNow,
  btcPrice = 92450.80,
  dailyYieldPercent = 3.0
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(1000);

  const presets = [50, 250, 1000, 2500, 5000, 10000, 25000, 50000];

  const handleInvest = (amt: number) => {
    if (onInvestNow) {
      onInvestNow(amt);
    } else if (onOpenDepositWithAmount) {
      onOpenDepositWithAmount(amt);
    }
  };

  const calculations = useMemo(() => {
    const dailyRate = dailyYieldPercent / 100;
    const dailyProfit = depositAmount * dailyRate;
    const weeklyProfit = depositAmount * dailyRate * 7;
    const monthlyProfit = depositAmount * dailyRate * 30;
    const totalReturn = depositAmount * (1 + dailyRate * 60 - 1) + depositAmount; // 60 days gross
    const grossReturn = depositAmount * (dailyRate * 60);
    const netProfit = Math.max(0, grossReturn - depositAmount);
    const btcAmount = btcPrice > 0 ? depositAmount / btcPrice : 0;
    const dailyBtc = btcPrice > 0 ? dailyProfit / btcPrice : 0;

    return {
      dailyProfit,
      weeklyProfit,
      monthlyProfit,
      totalReturn: grossReturn,
      netProfit,
      btcAmount,
      dailyBtc,
    };
  }, [depositAmount, btcPrice, dailyYieldPercent]);

  // Generate chart data for 60 days
  const chartData = useMemo(() => {
    const data = [];
    const dailyReturn = depositAmount * (dailyYieldPercent / 100);
    for (let day = 0; day <= 60; day += 5) {
      const cumulative = Number((dailyReturn * day).toFixed(2));
      data.push({
        day: `Day ${day}`,
        cumulativePayout: cumulative,
        principal: depositAmount,
        netProfit: Math.max(0, cumulative - depositAmount),
      });
    }
    return data;
  }, [depositAmount, dailyYieldPercent]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= 0) {
      setDepositAmount(val);
    }
  };

  return (
    <section id="calculator" className="py-20 md:py-28 relative bg-[#070b19] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Real-time Financial Modeling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
            Advanced 60-Day <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Profit Calculator
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Forecast your exact daily, weekly, and cumulative 60-day yields with our interactive algorithmic simulation engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls & Inputs */}
          <div className="lg:col-span-6 bg-[#090f23] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Deposit Amount (USD)
                </label>
                <span className="text-xs font-mono text-cyan-400">
                  ≈ {calculations.btcAmount.toFixed(5)} BTC
                </span>
              </div>

              {/* Input field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-bold text-xl">
                  $
                </div>
                <input
                  type="number"
                  min="10"
                  max="500000"
                  step="10"
                  value={depositAmount || ''}
                  onChange={handleAmountChange}
                  className="w-full pl-10 pr-4 py-3.5 bg-[#050814] border-2 border-slate-700 focus:border-emerald-500 rounded-2xl text-2xl font-bold font-mono text-white focus:outline-none transition-colors"
                  placeholder="1000"
                />
              </div>

              {/* Range slider */}
              <div className="mt-5">
                <input
                  type="range"
                  min="10"
                  max="25000"
                  step="10"
                  value={depositAmount > 25000 ? 25000 : depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>$10 Min</span>
                  <span>$5,000</span>
                  <span>$10,000</span>
                  <span>$25,000+</span>
                </div>
              </div>

              {/* Presets */}
              <div className="mt-4">
                <span className="text-[11px] text-slate-400 block mb-2 font-mono">QUICK SELECT PRESET:</span>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setDepositAmount(preset)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                        depositAmount === preset
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculations Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">DAILY PROFIT (3%)</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  ${calculations.dailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">≈ {calculations.dailyBtc.toFixed(6)} BTC/day</span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">WEEKLY YIELD (21%)</span>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  ${calculations.weeklyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Every 7 calendar days</span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block">30-DAY HALFWAY (90%)</span>
                <div className="text-xl font-bold font-mono text-teal-300 mt-1">
                  ${calculations.monthlyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">90% of principal back</span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[11px] font-mono text-emerald-400 block font-semibold">TOTAL 60-DAY ROI (180%)</span>
                <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                  ${calculations.totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">+${calculations.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Net</span>
              </div>
            </div>

            <button
              onClick={() => handleInvest(depositAmount)}
              className="w-full py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 font-mono uppercase tracking-wider"
            >
              <span>Invest ${depositAmount.toLocaleString()} Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Trajectory Visualization Chart */}
          <div className="lg:col-span-6 bg-[#090f23] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">60-Day Cumulative Capital Trajectory</h3>
                <p className="text-xs text-slate-400">Day 33.3 Breakeven Threshold → Pure Profit Acceleration</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                +80% Pure Profit
              </span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    fontSize={11} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={11} 
                    tickFormatter={(val) => `$${val}`}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090f24', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cumulative Payout']}
                  />
                  <ReferenceLine 
                    y={depositAmount} 
                    stroke="#f59e0b" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Principal Recovered ($' + depositAmount + ')', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativePayout" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#payoutGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Milestones Info */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
              <div className="bg-[#050814] p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">DAY 0</span>
                <span className="text-xs text-slate-300 font-bold">Deposit Started</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">$0.00 Paid</span>
              </div>

              <div className="bg-[#050814] p-3 rounded-lg border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block font-semibold">DAY 33.3</span>
                <span className="text-xs text-amber-300 font-bold">100% Breakeven</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Capital Back</span>
              </div>

              <div className="bg-[#050814] p-3 rounded-lg border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block font-semibold">DAY 60</span>
                <span className="text-xs text-emerald-300 font-bold">180% Total</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">80% Net Win</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
