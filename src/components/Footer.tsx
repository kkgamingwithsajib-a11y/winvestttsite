import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  FileText, 
  ExternalLink, 
  Lock, 
  Award,
  Globe,
  Phone,
  KeyRound,
  Send
} from 'lucide-react';
import { PlatformConfig } from '../types';

interface FooterProps {
  onOpenCertificate: () => void;
  onOpenDashboard?: () => void;
  onOpenAdminLogin?: () => void;
  platformConfig?: PlatformConfig | null;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenCertificate, 
  onOpenDashboard, 
  onOpenAdminLogin,
  platformConfig 
}) => {
  return (
    <footer className="bg-[#04060d] text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#060a18] rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-black text-lg text-emerald-400">W</span>
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white tracking-tight">
                  {platformConfig?.websiteName || 'WINVEST'}
                </span>
                <span className="text-[10px] font-mono block text-slate-500">WEALTH INVEST CORP</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Institutional-grade autonomous AI algorithmic wealth platform. Delivering systematic {platformConfig?.dailyYieldRatePercent || 3.0}% daily yields for 60 calendar days through real-time multi-exchange crypto arbitrage and deep reinforcement learning.
            </p>

            <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{platformConfig?.contactAddress || 'One Vanderbilt Ave, 45th Floor, New York, NY 10017'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>NYS Entity File ID: #7291842 • Authorized Capital $100M</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{platformConfig?.supportEmail || 'support@winvest.com'}</span>
              </div>
              <a
                href="https://t.me/winvestsupportcentre"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#29b6f6] hover:underline"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Telegram Support: @winvestsupportcentre</span>
              </a>
              {platformConfig?.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{platformConfig.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#plan" className="hover:text-emerald-400 transition-colors">Investment Plans</a></li>
              <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Profit Calculator</a></li>
              <li><a href="#ai-engine" className="hover:text-emerald-400 transition-colors">AI Trading Engine</a></li>
              <li><a href="#affiliate" className="hover:text-emerald-400 transition-colors">3-Tier Affiliate Model</a></li>
            </ul>
          </div>

          {/* Col 3: Resources & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Governance & Trust</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={onOpenCertificate} 
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1 text-amber-300"
                >
                  <Award className="w-3 h-3" />
                  <span>Shareholder Certificate</span>
                </button>
              </li>
              {onOpenDashboard && (
                <li>
                  <button 
                    onClick={onOpenDashboard} 
                    className="hover:text-emerald-400 transition-colors text-left"
                  >
                    Investor Portal
                  </button>
                </li>
              )}
              <li><a href="#security" className="hover:text-emerald-400 transition-colors">BitGo Cold Custody</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ & Support</a></li>
              {onOpenAdminLogin && (
                <li>
                  <button
                    onClick={onOpenAdminLogin}
                    className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs group"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                    <span>Admin Access</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">AML / KYC Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Risk Disclosure Notice</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Security Architecture</a></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Risk Disclaimer Box */}
        <div className="bg-[#080d1e] rounded-2xl border border-slate-800/80 p-6 text-[11px] leading-relaxed text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">
            <strong>Risk Disclosure & Regulatory Notice:</strong> Cryptocurrency investments and high-frequency automated algorithmic trading are subject to market volatility. Past algorithmic performance does not guarantee future financial returns. Returns are distributed from proprietary quantitative market liquidity engines. Wealth Invest Corp encourages all participants to assess their individual risk tolerance before participating.
          </p>
          <p className="text-slate-500">
            Winvest (Wealth Invest Corp) is registered under the laws of the State of New York, USA. All share participation units are subject to digital shareholder covenant stipulations.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Wealth Invest Corp ({platformConfig?.websiteName || 'Winvest.com'}). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>TLS 1.3 256-bit Encrypted</span>
            </span>
            <span>•</span>
            <span>Server Time: UTC-5 (EST)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
