import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { PlanSection } from './components/PlanSection';
import { ProfitCalculator } from './components/ProfitCalculator';
import { AiEngineShowcase } from './components/AiEngineShowcase';
import { AffiliateSection } from './components/AffiliateSection';
import { LiveTransactions } from './components/LiveTransactions';
import { CorporateAndCertificate } from './components/CorporateAndCertificate';
import { SecuritySection } from './components/SecuritySection';
import { FaqSection } from './components/FaqSection';
import { InvestorPortalModal } from './components/InvestorPortalModal';
import { SupportChatDrawer } from './components/SupportChatDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AdLeaderboard728x90, AdBanner320x50 } from './components/AdBanner';
import { LiveActivityToast } from './components/LiveActivityToast';

import { 
  INITIAL_MARKET_PAIRS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_AI_SIGNALS, 
  INITIAL_USER_ACCOUNT 
} from './data/mockData';

import { 
  UserAccount, 
  TradeSignal,
  PaymentMethod,
  InvestmentPlan,
  PlatformConfig
} from './types';
import { api } from './services/api';
import { ShieldAlert, User, ShieldCheck, AlertTriangle, KeyRound } from 'lucide-react';

export default function App() {
  const [marketPairs, setMarketPairs] = useState(INITIAL_MARKET_PAIRS);
  const [aiSignals, setAiSignals] = useState<TradeSignal[]>(INITIAL_AI_SIGNALS);

  // Platform dynamic database states
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);

  // User Auth State
  const [userToken, setUserToken] = useState<string | null>(() => localStorage.getItem('winvest_user_token'));
  const [userAccount, setUserAccount] = useState<UserAccount>({
    ...INITIAL_USER_ACCOUNT,
    isLoggedIn: false,
  });

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('winvest_admin_token'));
  const [adminInfo, setAdminInfo] = useState<{ id: string; name: string; role: string } | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // User Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  // Modals state
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [selectedDepositAmount, setSelectedDepositAmount] = useState<number>(1000);

  // Fetch initial public platform data from Express backend
  const fetchPublicData = async () => {
    try {
      const [settings, methods, loadedPlans] = await Promise.all([
        api.getSettings(),
        api.getPaymentMethods(),
        api.getPlans(),
      ]);
      setPlatformConfig(settings);
      setPaymentMethods(methods);
      setPlans(loadedPlans);
    } catch (err) {
      console.warn('Backend loading warning:', err);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  // Restore user session if token exists
  useEffect(() => {
    if (userToken) {
      api.getMe(userToken)
        .then((user) => {
          setUserAccount({ ...user, isLoggedIn: true });
        })
        .catch(() => {
          localStorage.removeItem('winvest_user_token');
          setUserToken(null);
          setUserAccount((prev) => ({ ...prev, isLoggedIn: false }));
        });
    }
  }, [userToken]);

  // Restore admin session if token exists
  useEffect(() => {
    if (adminToken) {
      api.adminCheckToken(adminToken)
        .then((admin) => {
          setAdminInfo(admin);
          setIsAdminLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('winvest_admin_token');
          setAdminToken(null);
          setIsAdminLoggedIn(false);
        });
    }
  }, [adminToken]);

  // Live market price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPairs((prev) =>
        prev.map((pair) => {
          const delta = (Math.random() - 0.48) * (pair.price * 0.001);
          return {
            ...pair,
            price: Number((pair.price + delta).toFixed(2)),
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleUserLoginSuccess = (user: UserAccount, token: string) => {
    setUserToken(token);
    localStorage.setItem('winvest_user_token', token);
    setUserAccount({
      ...user,
      isLoggedIn: true,
    });
    setIsDashboardOpen(true);
  };

  const handleLogout = async () => {
    if (userToken) {
      await api.logout(userToken);
    }
    localStorage.removeItem('winvest_user_token');
    setUserToken(null);
    setUserAccount((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const handleAdminLoginSuccess = (token: string, admin: any) => {
    setAdminToken(token);
    localStorage.setItem('winvest_admin_token', token);
    setAdminInfo(admin);
    setIsAdminLoggedIn(true);
    setIsAdminPanelOpen(true);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await api.adminLogout(adminToken);
    }
    localStorage.removeItem('winvest_admin_token');
    setAdminToken(null);
    setAdminInfo(null);
    setIsAdminLoggedIn(false);
    setIsAdminPanelOpen(false);
  };

  const handleStartInvest = (amount?: number) => {
    if (amount) {
      setSelectedDepositAmount(amount);
    }
    if (userAccount.isLoggedIn) {
      setIsDashboardOpen(true);
    } else {
      handleOpenLogin();
    }
  };

  const handleUpdateAccount = (updated: UserAccount) => {
    setUserAccount(updated);
  };

  return (
    <div className="min-h-screen bg-[#040714] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Global Announcement Banner if enabled by Admin */}
      {platformConfig?.isAnnouncementActive && platformConfig?.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 text-white text-xs font-mono py-2 px-4 text-center flex items-center justify-center space-x-2 shadow-md">
          <span className="font-bold bg-black/30 px-2 py-0.5 rounded text-[10px]">NOTICE</span>
          <span>{platformConfig.announcementText}</span>
        </div>
      )}

      {/* Maintenance Mode Warning for Public View */}
      {platformConfig?.maintenanceMode && (
        <div className="bg-rose-900/80 border-b border-rose-500/50 text-rose-200 text-xs font-mono py-2 px-4 text-center flex items-center justify-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>System Maintenance is currently ACTIVE. New transactions are paused for database indexing.</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        isLoggedIn={userAccount.isLoggedIn}
        userName={userAccount.name}
        walletBalance={userAccount.walletBalanceUsd}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        marketPairs={marketPairs}
        onStartInvest={() => handleStartInvest(1000)}
        onOpenDeposit={() => handleStartInvest(1000)}
        onOpenCalculator={() => {
          const el = document.getElementById('calculator');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenWhitepaper={() => setIsCertificateOpen(true)}
        dailyRatePercent={platformConfig?.dailyYieldRatePercent || 3.0}
      />

      {/* Ad Placement 1: Below Stats & Above Investment Plans (Screenshot 1) */}
      <section className="py-4 px-4 bg-[#040816] border-y border-slate-800/40">
        <div className="max-w-6xl mx-auto flex justify-center">
          <AdLeaderboard728x90 />
        </div>
      </section>

      {/* Investment Plans */}
      <PlanSection 
        onSelectPlan={(amount) => handleStartInvest(amount)} 
        plans={plans}
      />

      {/* Ad Placement 2: Below Comparison Table & Above Profit Calculator (Screenshot 2) */}
      <section className="py-4 px-4 bg-[#05091a] border-y border-slate-800/40">
        <div className="max-w-6xl mx-auto flex justify-center">
          <AdLeaderboard728x90 />
        </div>
      </section>

      {/* Interactive Profit Calculator */}
      <ProfitCalculator 
        onInvestNow={(amount) => handleStartInvest(amount)} 
        dailyYieldPercent={platformConfig?.dailyYieldRatePercent || 3.0}
      />

      {/* AI Bot Live Engine Showcase */}
      <AiEngineShowcase signals={aiSignals} />

      {/* Ad Placement 3: Above Corporate Heritage & About Section (Screenshot 3) */}
      <section className="py-4 px-4 bg-[#040714] border-y border-slate-800/40">
        <div className="max-w-md mx-auto flex justify-center">
          <AdBanner320x50 />
        </div>
      </section>

      {/* About Wealth Invest Corp */}
      <AboutSection onOpenCertificate={() => setIsCertificateOpen(true)} />

      {/* Live Blockchain Transactions */}
      <LiveTransactions transactions={INITIAL_TRANSACTIONS} />

      {/* Sponsor / Leaderboard Ad (728x90) */}
      <section className="py-6 px-4 bg-[#050917]/90 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto flex justify-center">
          <AdLeaderboard728x90 />
        </div>
      </section>

      {/* Affiliate Partner Program */}
      <AffiliateSection onJoinPartner={handleOpenRegister} />

      {/* Corporate Registration & Certificate */}
      <CorporateAndCertificate
        isOpenModal={isCertificateOpen}
        onCloseModal={() => setIsCertificateOpen(false)}
      />

      {/* Security & Cold Storage Proof */}
      <SecuritySection />

      {/* Sponsor / Mobile-Compact Ad (320x50) */}
      <section className="py-6 px-4 bg-[#050816]/90 border-y border-slate-800/60">
        <div className="max-w-md mx-auto flex justify-center">
          <AdBanner320x50 />
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Footer */}
      <Footer 
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)} 
        onOpenCertificate={() => setIsCertificateOpen(true)}
        platformConfig={platformConfig}
      />

      {/* Live AI Investor Support Chat */}
      <SupportChatDrawer />

      {/* Investor Portal Dashboard Modal */}
      <InvestorPortalModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userAccount={userAccount}
        userToken={userToken}
        paymentMethods={paymentMethods}
        plans={plans}
        platformConfig={platformConfig}
        onUpdateAccount={handleUpdateAccount}
        initialDepositAmount={selectedDepositAmount}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onRefreshData={() => {
          fetchPublicData();
          if (userToken) {
            api.getMe(userToken).then((u) => setUserAccount({ ...u, isLoggedIn: true })).catch(() => {});
          }
        }}
      />

      {/* User Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleUserLoginSuccess}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
      />

      {/* Protected Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onOpenUserLogin={handleOpenLogin}
      />

      {/* Full Admin Control Panel System */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        adminToken={adminToken || ''}
        adminInfo={adminInfo}
        onAdminLogout={handleAdminLogout}
        onRefreshPublicData={fetchPublicData}
      />

      {/* Real-time Live Activity Notification Toaster */}
      <LiveActivityToast />

    </div>
  );
}
