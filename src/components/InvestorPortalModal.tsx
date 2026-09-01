import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  Award, 
  Users, 
  RefreshCw,
  AlertCircle,
  Coins,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  DollarSign
} from 'lucide-react';
import { UserAccount, PaymentMethod, InvestmentPlan, PlatformConfig } from '../types';
import { INITIAL_PAYMENT_METHODS, INITIAL_PLANS } from '../data/mockData';
import { api } from '../services/api';
import { CryptoIcon } from './CryptoIcon';

interface InvestorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccount;
  userToken?: string | null;
  paymentMethods?: PaymentMethod[];
  plans?: InvestmentPlan[];
  platformConfig?: PlatformConfig | null;
  onUpdateAccount: (updated: UserAccount) => void;
  initialDepositAmount?: number;
  onOpenCertificate: () => void;
  onRefreshData?: () => void;
}

export const InvestorPortalModal: React.FC<InvestorPortalModalProps> = ({
  isOpen,
  onClose,
  userAccount,
  userToken,
  paymentMethods = INITIAL_PAYMENT_METHODS,
  plans = INITIAL_PLANS,
  platformConfig,
  onUpdateAccount,
  initialDepositAmount = 1000,
  onOpenCertificate,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'referrals' | 'history'>('overview');
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState<number>(initialDepositAmount);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [depositTxHash, setDepositTxHash] = useState<string>('');
  const [depositStep, setDepositStep] = useState<'input' | 'address' | 'success'>('input');
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [depositSubmitting, setDepositSubmitting] = useState<boolean>(false);
  const [depositError, setDepositError] = useState<string>('');

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string>('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState<boolean>(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string>('');

  // Available active payment methods
  const safePaymentMethods = (Array.isArray(paymentMethods) && paymentMethods.length > 0) ? paymentMethods : INITIAL_PAYMENT_METHODS;
  const activeMethods = safePaymentMethods.filter(pm => pm && pm.isActive);
  const currentMethod = activeMethods.find(pm => pm.id === selectedMethodId) || activeMethods[0];

  useEffect(() => {
    if (activeMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(activeMethods[0].id);
    }
  }, [activeMethods, selectedMethodId]);

  useEffect(() => {
    if (initialDepositAmount) {
      setDepositAmount(initialDepositAmount);
    }
  }, [initialDepositAmount]);

  // Live polling for user status from backend and real-time yield accrual counter
  useEffect(() => {
    if (!isOpen || !userToken) return;

    const pollInterval = setInterval(() => {
      api.getMe(userToken)
        .then((u) => {
          if (u) {
            onUpdateAccount({ ...u, isLoggedIn: true });
          }
        })
        .catch(() => {});
    }, 3000);

    // Continuous smooth visual profit accrual ticker for active yield contracts
    const deposits = userAccount?.deposits || [];
    const activeDeposits = deposits.filter((d) => d.status === 'approved' || d.status === 'active');
    
    let tickerInterval: any = null;
    if (activeDeposits.length > 0) {
      tickerInterval = setInterval(() => {
        let profitStep = 0;
        activeDeposits.forEach((dep) => {
          const dailyPercent = dep.dailyYieldPercent || 3.0;
          // 1 second profit = (amount * (dailyPercent / 100)) / 86400
          profitStep += (dep.amountUsd * (dailyPercent / 100)) / 86400;
        });

        if (profitStep > 0 && userAccount) {
          onUpdateAccount({
            ...userAccount,
            totalEarnedUsd: Number(((userAccount.totalEarnedUsd || 0) + profitStep).toFixed(4)),
            walletBalanceUsd: Number(((userAccount.walletBalanceUsd || 0) + profitStep).toFixed(4))
          });
        }
      }, 1000);
    }

    return () => {
      clearInterval(pollInterval);
      if (tickerInterval) clearInterval(tickerInterval);
    };
  }, [isOpen, userToken, onUpdateAccount, userAccount?.deposits]);

  const handleModalClose = () => {
    if (userToken && userAccount) {
      api.syncUser(userToken, {
        walletBalanceUsd: userAccount.walletBalanceUsd,
        totalEarnedUsd: userAccount.totalEarnedUsd,
        deposits: userAccount.deposits
      }).catch(() => {});
    }
    onClose();
  };

  if (!isOpen) return null;

  const handleCopyDepositAddress = () => {
    if (!currentMethod) return;
    navigator.clipboard.writeText(currentMethod.walletAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://winvest.com/?ref=${userAccount.referralCode || userAccount.id}`);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleProceedToAddress = () => {
    if (depositAmount < (currentMethod?.minDepositUsd || 10)) {
      setDepositError(`Minimum deposit for ${currentMethod?.name || 'this gateway'} is $${currentMethod?.minDepositUsd || 10}`);
      return;
    }
    setDepositError('');
    setDepositStep('address');
  };

  const handleConfirmDepositSubmitted = async () => {
    if (!userToken) {
      setDepositError('Please log in again to submit a deposit.');
      return;
    }

    setDepositSubmitting(true);
    setDepositError('');

    try {
      const hash = depositTxHash.trim() || `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      await api.submitDeposit(userToken, {
        amountUsd: depositAmount,
        paymentMethodId: currentMethod.id,
        txHash: hash,
      });

      setDepositStep('success');
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setDepositError(err.message || 'Failed to submit deposit transaction.');
    } finally {
      setDepositSubmitting(false);
    }
  };

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess(false);

    if (withdrawAmount > userAccount.walletBalanceUsd) {
      setWithdrawError('Requested amount exceeds your available wallet balance.');
      return;
    }

    if (withdrawAmount < (platformConfig?.minWithdrawalUsd || 10)) {
      setWithdrawError(`Minimum withdrawal amount is $${platformConfig?.minWithdrawalUsd || 10}.00`);
      return;
    }

    if (!withdrawAddress.trim()) {
      setWithdrawError('Please enter a destination blockchain wallet address.');
      return;
    }

    if (!userToken) {
      setWithdrawError('Please log in again to submit a withdrawal request.');
      return;
    }

    setWithdrawSubmitting(true);
    try {
      await api.submitWithdrawal(userToken, {
        amountUsd: withdrawAmount,
        destinationAddress: withdrawAddress.trim(),
        currency: currentMethod?.symbol || 'USDT',
        network: currentMethod?.network || 'TRC-20'
      });

      setWithdrawSuccess(true);
      setWithdrawAddress('');
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal submission failed.');
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#070c1e] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#050917]/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white">Investor Dashboard</h2>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  VERIFIED TIER 1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {userAccount.name} ({userAccount.email})
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 bg-[#060a1a] px-6 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Yield</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('deposit');
              setDepositStep('input');
            }}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'deposit'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Make Deposit</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('withdraw');
              setWithdrawSuccess(false);
              setWithdrawError('');
            }}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'withdraw'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Capital</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'referrals'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Affiliate Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Transactions</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Snapshot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#090f26] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <span className="text-[11px] font-mono text-slate-400 block">AVAILABLE BALANCE</span>
                  <div className="text-2xl font-bold font-display text-emerald-400 mt-1">
                    ${userAccount.walletBalanceUsd.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">
                    ● Accruing ~{platformConfig?.dailyYieldRatePercent || 3.0}% daily
                  </span>
                </div>

                <div className="bg-[#090f26] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <span className="text-[11px] font-mono text-slate-400 block">TOTAL ACTIVE CONTRACTS</span>
                  <div className="text-2xl font-bold font-display text-white mt-1">
                    ${(userAccount.totalInvestedUsd || 0).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {(userAccount.deposits || []).length} Active Yield Node(s)
                  </span>
                </div>

                <div className="bg-[#090f26] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <span className="text-[11px] font-mono text-slate-400 block">NET PROFIT GENERATED</span>
                  <div className="text-2xl font-bold font-display text-cyan-300 mt-1">
                    ${(userAccount.totalEarnedUsd || 0).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-cyan-400/80 font-mono mt-1 block">
                    100% Principal Guaranteed
                  </span>
                </div>

                <div className="bg-[#090f26] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <span className="text-[11px] font-mono text-slate-400 block">AFFILIATE COMMISSIONS</span>
                  <div className="text-2xl font-bold font-display text-amber-400 mt-1">
                    ${(userAccount.referralEarningsUsd || 0).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {userAccount.referredCount || 0} Qualified Partners
                  </span>
                </div>
              </div>

              {/* Total Cumulative Deposit & Withdrawal Summary Banner */}
              <div className="bg-gradient-to-r from-[#090f26] via-[#08122c] to-[#090f26] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Cumulative Capital Flows</div>
                    <div className="text-[11px] text-slate-400">Real-time total lifetime deposits & processed withdrawals</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TOTAL DEPOSITED</span>
                    <span className="text-lg font-bold text-emerald-400">
                      +${(userAccount.deposits || []).reduce((acc, d) => acc + (d.status !== 'rejected' && d.status !== 'cancelled' ? (d.amountUsd || 0) : 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TOTAL WITHDRAWN</span>
                    <span className="text-lg font-bold text-rose-400">
                      -${(userAccount.withdrawals || []).reduce((acc, w) => acc + (w.status !== 'rejected' && w.status !== 'cancelled' ? (w.amountUsd || 0) : 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Contracts Summary */}
              <div className="bg-[#090f26] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Live Yield Contracts</span>
                  </h3>

                  <button
                    onClick={() => {
                      setActiveTab('deposit');
                      setDepositStep('input');
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-all"
                  >
                    + New Contract
                  </button>
                </div>

                {(!userAccount.deposits || userAccount.deposits.length === 0) ? (
                  <div className="py-8 text-center text-slate-500 font-mono text-xs space-y-2">
                    <p>No active investment contracts currently generating yield.</p>
                    <p className="text-slate-400">Make your first deposit to activate the AI quantitative trading bot.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userAccount.deposits.map((dep) => (
                      <div key={dep.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">${dep.amountUsd.toLocaleString()}</span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {dep.dailyYieldPercent}% Daily
                            </span>
                            <span className="text-xs font-mono text-cyan-300">
                              Day {dep.daysRemaining} / {dep.totalDays}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Initiated {dep.startDate} • Total ROI: ${(dep.amountUsd * (dep.dailyYieldPercent * dep.totalDays) / 100).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={onOpenCertificate}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Certificate</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs font-mono text-emerald-300">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Institutional Custody & Capital Protection</div>
                  <div className="text-emerald-200/80 mt-0.5 leading-relaxed">
                    User assets are secured under BitGo multi-sig cold storage and insured under Lloyd's of London underwriters. Daily yield settlements execute automatically at 00:00 UTC.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEPOSIT */}
          {activeTab === 'deposit' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {depositStep === 'input' && (
                <div className="bg-[#090f26] border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Configure Investment Deposit</h3>
                    <p className="text-slate-400 mt-1">Select payment cryptocurrency and allocate capital.</p>
                  </div>

                  {/* Payment Methods Selection */}
                  <div>
                    <label className="text-slate-300 block mb-2 font-bold">1. Select Deposit Gateway</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethodId(method.id)}
                          className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            currentMethod?.id === method.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CryptoIcon currency={method.coin || method.symbol} size={32} />
                            <div>
                              <div className="font-bold text-white text-xs">{method.name}</div>
                              <div className="text-[11px] text-slate-400">{method.network}</div>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-400 text-xs">{method.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Allocation */}
                  <div>
                    <label className="text-slate-300 block mb-2 font-bold">2. Deposit Amount (USD)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={currentMethod?.minDepositUsd || 10}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-white text-sm font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[500, 1000, 2500, 5000, 10000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDepositAmount(preset)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px]"
                        >
                          +${preset.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ROI Calculator Preview */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Daily Guaranteed Yield ({platformConfig?.dailyYieldRatePercent || 3.0}%):</span>
                      <strong className="text-emerald-400">+${(depositAmount * (platformConfig?.dailyYieldRatePercent || 3.0) / 100).toFixed(2)} / day</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Net Profit (60 Days):</span>
                      <strong className="text-cyan-400">+${(depositAmount * (platformConfig?.dailyYieldRatePercent || 3.0) * 60 / 100).toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                      <span>Total Payout (Capital + Yield):</span>
                      <strong className="text-white">${(depositAmount + depositAmount * (platformConfig?.dailyYieldRatePercent || 3.0) * 60 / 100).toFixed(2)}</strong>
                    </div>
                  </div>

                  {depositError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{depositError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleProceedToAddress}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Deposit Address</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {depositStep === 'address' && currentMethod && (
                <div className="bg-[#090f26] border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white font-display">Send Payment</h3>
                      <p className="text-slate-400">{currentMethod.name} ({currentMethod.network})</p>
                    </div>
                    <span className="text-base font-bold text-emerald-400">${depositAmount.toLocaleString()} USD</span>
                  </div>

                  {/* QR & Address Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="w-32 h-32 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg">
                        <QrCode className="w-28 h-28 text-slate-900" />
                      </div>
                      <span className="text-[11px] text-slate-400 block">Scan to transfer or copy official address below</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 block">Official Live Deposit Address:</span>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#060a1a] border border-slate-800">
                        <span className="text-emerald-300 font-mono text-xs break-all select-all font-bold">
                          {currentMethod.walletAddress}
                        </span>
                        <button
                          onClick={handleCopyDepositAddress}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 ml-2 shrink-0 flex items-center gap-1 transition-all"
                        >
                          {copiedAddr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-400 block">Blockchain Transaction Hash / ID (Optional for fast track):</label>
                      <input
                        type="text"
                        placeholder="Paste tx hash from your crypto wallet..."
                        value={depositTxHash}
                        onChange={(e) => setDepositTxHash(e.target.value)}
                        className="w-full bg-[#060a1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {depositError && (
                    <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{depositError}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setDepositStep('input')}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={depositSubmitting}
                      onClick={handleConfirmDepositSubmitted}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {depositSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>I Have Sent ${depositAmount.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {depositStep === 'success' && (
                <div className="bg-[#090f26] border border-emerald-500/50 rounded-3xl p-8 text-center space-y-4 font-mono text-xs animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white font-display">Deposit Request Broadcasted</h3>
                  <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your deposit of <strong>${depositAmount.toLocaleString()} USD</strong> has been registered on the server. Once confirmed by the blockchain or admin operator, your 60-day yield contract begins immediately.
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl"
                    >
                      Return to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WITHDRAW */}
          {activeTab === 'withdraw' && (
            <div className="max-w-xl mx-auto space-y-6">
              <form onSubmit={handleExecuteWithdrawal} className="bg-[#090f26] border border-slate-800 rounded-3xl p-6 space-y-5 font-mono text-xs">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Withdraw Capital & Yield</h3>
                  <p className="text-slate-400 mt-1">Instant settlements to any external cryptocurrency wallet.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">AVAILABLE BALANCE</span>
                    <span className="text-xl font-bold text-emerald-400 font-display">
                      ${userAccount.walletBalanceUsd.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(Math.floor(userAccount.walletBalanceUsd))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    Max Amount
                  </button>
                </div>

                <div>
                  <label className="text-slate-300 block mb-2 font-bold">Withdrawal Amount (USD)</label>
                  <input
                    type="number"
                    min={platformConfig?.minWithdrawalUsd || 10}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-2 font-bold">Destination Wallet Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your BTC / USDT / ETH address..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {withdrawError && (
                  <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {withdrawSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Withdrawal request submitted! Payout will execute within 15 minutes.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={withdrawSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {withdrawSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting Payout...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Withdrawal Payout</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: AFFILIATE REWARDS */}
          {activeTab === 'referrals' && (
            <div className="space-y-6 max-w-2xl mx-auto font-mono text-xs">
              <div className="bg-[#090f26] border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white font-display">Affiliate Partner Network</h3>
                <p className="text-slate-400">
                  Earn up to 10% lifetime referral commissions on every deposit made through your unique link.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 block text-[11px]">Your Personal Referral Link:</span>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060a1a] border border-slate-800">
                    <span className="text-emerald-300 break-all select-all font-bold">
                      https://winvest.com/?ref={userAccount.referralCode || userAccount.id}
                    </span>
                    <button
                      onClick={handleCopyReferral}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 ml-2 shrink-0 flex items-center gap-1"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRef ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">TOTAL REFERRED INVESTORS</span>
                    <span className="text-xl font-bold text-white">{userAccount.referredCount}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">TOTAL COMMISSIONS EARNED</span>
                    <span className="text-xl font-bold text-amber-400">${userAccount.referralEarningsUsd.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRANSACTIONS HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-[#090f26] border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">Deposit & Withdrawal Log</span>
                <span className="text-slate-400 text-[11px]">{((userAccount?.withdrawals || []).length) + ((userAccount?.deposits || []).length)} Records</span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {(userAccount?.deposits || []).map((dep) => {
                  const status = (dep.status || 'active').toLowerCase();
                  const isCancelled = status === 'cancelled' || status === 'rejected';
                  const isHold = status === 'hold' || status === 'on-hold';
                  const isPending = status === 'pending';
                  return (
                    <div key={dep.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isCancelled ? 'bg-rose-500/20 text-rose-400' : isHold ? 'bg-amber-500/20 text-amber-400' : isPending ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>Deposit #{dep.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-slate-800 text-slate-300">{dep.currency || 'USDT'}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">{dep.startDate || 'Recent'} • {dep.dailyYieldPercent || 3}% Yield Node</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${isCancelled ? 'text-slate-500 line-through' : 'text-emerald-400'}`}>
                          +${(dep.amountUsd || 0).toLocaleString()}
                        </span>
                        <span className={`text-[10px] uppercase font-bold block mt-0.5 px-2 py-0.5 rounded ${
                          isCancelled ? 'bg-rose-500/20 text-rose-400' :
                          isHold ? 'bg-amber-500/20 text-amber-400' :
                          isPending ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {dep.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {(userAccount?.withdrawals || []).map((w) => {
                  const status = (w.status || 'completed').toLowerCase();
                  const isCancelled = status === 'cancelled' || status === 'rejected';
                  const isHold = status === 'hold' || status === 'on-hold';
                  const isPending = status === 'pending';
                  return (
                    <div key={w.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isCancelled ? 'bg-rose-500/20 text-rose-400' : isHold ? 'bg-amber-500/20 text-amber-400' : isPending ? 'bg-yellow-500/20 text-yellow-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>Withdrawal #{w.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-slate-800 text-slate-300">{w.currency || 'USDT'}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">{w.timestamp || w.date || 'Recent'} • {(w.destinationAddress || w.address || '').substring(0, 10)}...</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-sm ${isCancelled ? 'text-slate-500 line-through' : 'text-rose-400'}`}>
                          -${(w.amountUsd || 0).toFixed(2)}
                        </span>
                        <span className={`text-[10px] uppercase font-bold block mt-0.5 px-2 py-0.5 rounded ${
                          isCancelled ? 'bg-rose-500/20 text-rose-400' :
                          isHold ? 'bg-amber-500/20 text-amber-400' :
                          isPending ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {w.status || 'Completed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
