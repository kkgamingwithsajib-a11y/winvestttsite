import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Zap, X } from 'lucide-react';

interface ActivityItem {
  id: number;
  name: string;
  country: string;
  action: 'invested' | 'withdrew' | 'earned';
  amount: number;
  plan: string;
  time: string;
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: 1, name: 'Alex M.', country: '🇬🇧 UK', action: 'invested', amount: 2500, plan: 'Advanced Growth', time: 'Just now' },
  { id: 2, name: 'Heinrich K.', country: '🇩🇪 Germany', action: 'withdrew', amount: 1420, plan: 'Daily Yield Payout', time: '1m ago' },
  { id: 3, name: 'Satoshi T.', country: '🇯🇵 Japan', action: 'invested', amount: 10000, plan: 'Institutional Vault', time: '2m ago' },
  { id: 4, name: 'Elena R.', country: '🇫🇷 France', action: 'earned', amount: 480, plan: 'Arbitrage Pool', time: '3m ago' },
  { id: 5, name: 'Marcus V.', country: '🇧🇷 Brazil', action: 'invested', amount: 750, plan: 'Starter Yield', time: '4m ago' },
  { id: 6, name: 'Liam C.', country: '🇨🇦 Canada', action: 'withdrew', amount: 3200, plan: 'VIP Quant Fund', time: '5m ago' },
];

export const LiveActivityToast: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % SAMPLE_ACTIVITIES.length);
        setIsVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const activity = SAMPLE_ACTIVITIES[currentIdx];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-xs w-full hidden sm:block pointer-events-none">
      <div 
        className={`transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
        }`}
      >
        <div className="bg-[#0b1329]/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/50 flex items-start gap-3 pointer-events-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 animate-pulse"></div>
          
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            {activity.action === 'invested' ? <Zap className="w-5 h-5 text-cyan-400" /> : 
             activity.action === 'withdrew' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : 
             <ShieldCheck className="w-5 h-5 text-indigo-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white truncate">{activity.name} <span className="font-normal text-slate-400 font-sans">{activity.country}</span></span>
              <span className="text-[10px] text-slate-500">{activity.time}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {activity.action === 'invested' && <span className="text-cyan-400 font-medium">Invested ${activity.amount.toLocaleString()}</span>}
              {activity.action === 'withdrew' && <span className="text-emerald-400 font-medium">Withdrew ${activity.amount.toLocaleString()}</span>}
              {activity.action === 'earned' && <span className="text-indigo-400 font-medium">Earned +${activity.amount.toLocaleString()}</span>}
              {' '}in {activity.plan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
