import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert,
  Cpu, 
  Calculator, 
  Users, 
  FileText, 
  HelpCircle, 
  Menu, 
  X, 
  ArrowUpRight, 
  Wallet, 
  Activity,
  Globe,
  Lock,
  User,
  LogOut,
  LogIn,
  ChevronDown
} from 'lucide-react';
import { MarketPair } from '../types';
import { INITIAL_MARKET_PAIRS } from '../data/mockData';
import { CryptoIcon } from './CryptoIcon';

interface NavbarProps {
  marketPairs?: MarketPair[];
  onOpenDashboard?: () => void;
  onOpenDeposit?: () => void;
  onOpenCertificate?: () => void;
  userBalance?: number;
  walletBalance?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  marketPairs = INITIAL_MARKET_PAIRS,
  onOpenDashboard,
  onOpenDeposit,
  onOpenCertificate,
  userBalance,
  walletBalance,
  isLoggedIn = false,
  userName = 'Investor',
  onOpenLogin,
  onOpenRegister,
  onLogout,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onOpenAdminPanel,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  const displayBalance = userBalance !== undefined ? userBalance : (walletBalance !== undefined ? walletBalance : 0);
  const pairs = (marketPairs && marketPairs.length > 0) ? marketPairs : INITIAL_MARKET_PAIRS;

  const handleDeposit = () => {
    if (onOpenDeposit) onOpenDeposit();
    else if (onOpenDashboard) onOpenDashboard();
  };

  const handleAdminPanel = () => {
    if (onOpenAdminPanel) onOpenAdminPanel();
    else onOpenAdminLogin();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!pairs || pairs.length === 0) return;
    const interval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % pairs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pairs.length]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Live Ticker Bar */}
      <div className="bg-[#080d1e] border-b border-slate-800/80 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6 overflow-hidden">
            <div className="flex items-center text-emerald-400 font-mono text-[11px] shrink-0 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2 inline-block"></span>
              LIVE AI TRADING ENGINE ACTIVE
            </div>
            
            <div className="flex items-center space-x-6 text-slate-300 font-mono text-[11px] overflow-hidden whitespace-nowrap">
              {pairs.map((pair) => (
                <div key={pair.symbol} className="flex items-center space-x-1.5">
                  <CryptoIcon currency={pair.symbol} size={18} />
                  <span className="font-semibold text-slate-200">{pair.symbol}</span>
                  <span className="text-white">${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span className={pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-slate-400 text-[11px] shrink-0">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>NYS Reg: <strong className="text-slate-200">Wealth Invest Corp</strong></span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#060a17]/90 backdrop-blur-md border-b border-slate-800/90 shadow-2xl py-3' 
          : 'bg-[#060a17]/60 backdrop-blur-sm border-b border-slate-800/40 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-[#070c1a] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  W
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-2xl tracking-tight text-white">WINVEST</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AI 3.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">WEALTH INVEST CORP</p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a>
            <a href="#plan" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>3% Daily Plan</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono">180% ROI</span>
            </a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">Profit Calculator</a>
            <a href="#ai-engine" className="hover:text-emerald-400 transition-colors">AI Engine</a>
            <a href="#affiliate" className="hover:text-emerald-400 transition-colors">Affiliate</a>
            <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          {/* Action Buttons & Authentication */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Share Certificate Trigger */}
            <button
              onClick={() => onOpenCertificate && onOpenCertificate()}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificate</span>
            </button>

            {/* User Logged In vs Logged Out State */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#090f23] hover:bg-slate-800 border border-emerald-500/30 rounded-xl transition-all flex items-center space-x-2 shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-mono">${displayBalance.toFixed(2)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#090f23] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 text-slate-300">
                      <div className="font-bold text-white truncate">{userName}</div>
                      <div className="text-[10px] text-emerald-400">● Active Investor</div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenDashboard) onOpenDashboard();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 rounded-lg flex items-center gap-2 mt-1"
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Investor Portal</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleDeposit();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-800 text-cyan-300 rounded-lg flex items-center gap-2"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>New 3% Deposit</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-rose-950/40 text-rose-400 rounded-lg flex items-center gap-2 mt-1 border-t border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Login</span>
                </button>

                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-[#090f23] hover:bg-slate-800 border border-cyan-500/40 rounded-lg transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Investor Portal Trigger */}
            <button
              onClick={() => onOpenDashboard ? onOpenDashboard() : onOpenLogin()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal</span>
            </button>

            {/* Invest CTA */}
            <button
              onClick={handleDeposit}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center space-x-1.5 transform hover:-translate-y-0.5"
            >
              <span>Invest Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={isLoggedIn ? onOpenDashboard : onOpenLogin}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 rounded-lg font-mono"
            >
              {isLoggedIn ? 'Portal' : 'Login'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0f22] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              About Wealth Invest Corp
            </a>
            <a 
              href="#plan" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              3.00% Daily Plan (60 Days)
            </a>
            <a 
              href="#calculator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              Advanced Profit Calculator
            </a>
            <a 
              href="#ai-engine" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              AI Autonomous Trading Engine
            </a>
            <a 
              href="#affiliate" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              Affiliate Program (5% - 2% - 1%)
            </a>
            <a 
              href="#security" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              Security & Custody
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-300 hover:text-emerald-400 font-medium"
            >
              Frequently Asked Questions
            </a>

            {/* Mobile Auth Strip */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="py-2.5 px-3 font-semibold text-slate-200 bg-slate-800 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                    Investor Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="py-2.5 px-3 font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/40 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="col-span-2 py-2.5 px-3 font-semibold text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out ({userName.split(' ')[0]})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

