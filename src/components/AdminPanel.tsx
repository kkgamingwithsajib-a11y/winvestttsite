import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Cpu, 
  Settings, 
  Activity, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  RefreshCw, 
  Plus, 
  Sliders, 
  TrendingUp, 
  Zap, 
  Lock, 
  Terminal, 
  Award,
  Filter,
  Check,
  Eye,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
  CreditCard,
  Layers,
  FileText,
  Copy,
  LogOut,
  ShieldCheck,
  Clock,
  ExternalLink,
  QrCode,
  Sparkles,
  KeyRound,
  Ban,
  UserCheck
} from 'lucide-react';
import { 
  AdminUserRecord, 
  AdminDepositItem, 
  AdminWithdrawalItem, 
  AdminAuditLogItem, 
  PlatformConfig,
  PaymentMethod,
  InvestmentPlan,
  TradeSignal,
  UserAccount
} from '../types';
import { api } from '../services/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  adminInfo?: { id: string; name: string; role: string } | null;
  onAdminLogout: () => void;
  onRefreshPublicData?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adminToken,
  adminInfo,
  onAdminLogout,
  onRefreshPublicData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'payments' | 'users' | 'deposits' | 'withdrawals' | 'plans' | 'settings' | 'ai-bot' | 'audit'
  >('overview');

  // Loading & Action feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Core Data States loaded from Backend
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [deposits, setDeposits] = useState<AdminDepositItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogItem[]>([]);

  // 1. Payment Settings Modal States
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [addressChangeConfirmOpen, setAddressChangeConfirmOpen] = useState(false);
  const [pendingPaymentSave, setPendingPaymentSave] = useState<Partial<PaymentMethod> | null>(null);

  // New Payment Form
  const [newPmName, setNewPmName] = useState('');
  const [newPmNetwork, setNewPmNetwork] = useState('');
  const [newPmCoin, setNewPmCoin] = useState('');
  const [newPmSymbol, setNewPmSymbol] = useState('USDT');
  const [newPmAddress, setNewPmAddress] = useState('');
  const [newPmMinDeposit, setNewPmMinDeposit] = useState('10');
  const [newPmInstructions, setNewPmInstructions] = useState('');

  // 2. User Management States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserAccount | null>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [balanceAdjustModalOpen, setBalanceAdjustModalOpen] = useState(false);
  const [balanceAdjustTarget, setBalanceAdjustTarget] = useState<AdminUserRecord | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState('500');
  const [balanceAdjustType, setBalanceAdjustType] = useState<'credit' | 'debit' | 'set'>('credit');
  const [balanceAdjustNote, setBalanceAdjustNote] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<string | null>(null);
  const [passwordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const [passwordResetTarget, setPasswordResetTarget] = useState<AdminUserRecord | null>(null);
  const [customResetPassword, setCustomResetPassword] = useState('');

  // 3. Deposit Approval States
  const [depositActionModal, setDepositActionModal] = useState<{ item: AdminDepositItem; action: 'approve' | 'reject' } | null>(null);
  const [depositAdminNote, setDepositAdminNote] = useState('');
  const [depositFilter, setDepositFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // 4. Withdrawal States
  const [withdrawalActionModal, setWithdrawalActionModal] = useState<{ item: AdminWithdrawalItem; action: 'approve' | 'reject' } | null>(null);
  const [withdrawalTxHash, setWithdrawalTxHash] = useState('');
  const [withdrawalAdminNote, setWithdrawalAdminNote] = useState('');
  const [selectedWithdrawalIds, setSelectedWithdrawalIds] = useState<string[]>([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('pending');

  // 5. Investment Plans States
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanBadge, setNewPlanBadge] = useState('Popular Tier');
  const [newPlanDailyRate, setNewPlanDailyRate] = useState('3.0');
  const [newPlanMin, setNewPlanMin] = useState('10');
  const [newPlanMax, setNewPlanMax] = useState('500000');
  const [newPlanDuration, setNewPlanDuration] = useState('60');
  const [newPlanDesc, setNewPlanDesc] = useState('');

  // 6. Platform Settings Form
  const [settingsForm, setSettingsForm] = useState<PlatformConfig | null>(null);

  // 7. Audit Log Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState('all');

  // 8. AI Signal State
  const [manualPair, setManualPair] = useState('BTC/USDT');
  const [manualType, setManualType] = useState<'BUY' | 'SELL'>('BUY');
  const [manualProfit, setManualProfit] = useState('3.42');
  const [manualStrategy, setManualStrategy] = useState('Multi-Exchange Arbitrage (Binance / Kraken)');

  // 9. Admin Credentials Change Form
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);

  // Load all data from API on open or token change
  const fetchAllAdminData = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const [
        fetchedSettings,
        fetchedPaymentMethods,
        fetchedPlans,
        fetchedUsers,
        fetchedDeposits,
        fetchedWithdrawals,
        fetchedAuditLogs
      ] = await Promise.all([
        api.adminGetSettings(adminToken),
        api.adminGetPaymentMethods(adminToken),
        api.adminGetPlans(adminToken),
        api.adminGetUsers(adminToken),
        api.adminGetDeposits(adminToken),
        api.adminGetWithdrawals(adminToken),
        api.adminGetAuditLogs(adminToken)
      ]);

      setConfig(fetchedSettings);
      setSettingsForm(fetchedSettings);
      setPaymentMethods(fetchedPaymentMethods);
      setPlans(fetchedPlans);
      setUsers(fetchedUsers);
      setDeposits(fetchedDeposits);
      setWithdrawals(fetchedWithdrawals);
      setAuditLogs(fetchedAuditLogs);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to sync with backend server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminToken) {
      fetchAllAdminData();
    }
  }, [isOpen, adminToken]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  if (!isOpen) return null;

  // Overview calculated statistics
  const totalUsersCount = (users || []).length;
  const activeUsersCount = (users || []).filter((u) => u.status === 'active').length;
  const pendingDeposits = (deposits || []).filter((d) => d.status === 'pending');
  const approvedDeposits = (deposits || []).filter((d) => d.status === 'approved');
  const pendingWithdrawals = (withdrawals || []).filter((w) => w.status === 'pending');
  const completedWithdrawals = (withdrawals || []).filter((w) => w.status === 'completed');

  const pendingDepositsSum = pendingDeposits.reduce((acc, d) => acc + (d.amountUsd || 0), 0);
  const approvedDepositsSum = approvedDeposits.reduce((acc, d) => acc + (d.amountUsd || 0), 0);
  const pendingWithdrawalsSum = pendingWithdrawals.reduce((acc, w) => acc + (w.amountUsd || 0), 0);
  const completedWithdrawalsSum = completedWithdrawals.reduce((acc, w) => acc + (w.amountUsd || 0), 0);
  const totalTransactionsCount = (deposits || []).length + (withdrawals || []).length;

  // ----------------------------------------------------
  // PAYMENT METHODS HANDLERS
  // ----------------------------------------------------
  const handleSavePaymentMethod = async () => {
    if (!editingPaymentMethod || !adminToken) return;

    try {
      const updated = await api.adminUpdatePaymentMethod(adminToken, editingPaymentMethod.id, editingPaymentMethod);
      setPaymentMethods((prev) => prev.map((pm) => (pm.id === updated.id ? updated : pm)));
      setEditingPaymentMethod(null);
      setAddressChangeConfirmOpen(false);
      showNotification(`Payment method ${updated.name} updated successfully.`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleCreatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      const created = await api.adminAddPaymentMethod(adminToken, {
        name: newPmName,
        network: newPmNetwork,
        coin: newPmCoin,
        symbol: newPmSymbol,
        walletAddress: newPmAddress,
        minDepositUsd: Number(newPmMinDeposit) || 10,
        instructions: newPmInstructions,
        isActive: true,
      });

      setPaymentMethods((prev) => [...prev, created]);
      setIsAddPaymentModalOpen(false);
      setNewPmName('');
      setNewPmNetwork('');
      setNewPmCoin('');
      setNewPmAddress('');
      showNotification(`Created deposit method ${created.name} (${created.network}).`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleTogglePaymentActive = async (method: PaymentMethod) => {
    if (!adminToken) return;
    try {
      const updated = await api.adminUpdatePaymentMethod(adminToken, method.id, { isActive: !method.isActive });
      setPaymentMethods((prev) => prev.map((pm) => (pm.id === updated.id ? updated : pm)));
      showNotification(`${updated.name} is now ${updated.isActive ? 'Active' : 'Inactive'}.`);
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeletePaymentMethod = async (id: string, name: string) => {
    if (!adminToken) return;
    if (!window.confirm(`Are you sure you want to delete payment method ${name}?`)) return;

    try {
      await api.adminDeletePaymentMethod(adminToken, id);
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      showNotification(`Payment gateway ${name} removed.`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // USER MANAGEMENT HANDLERS
  // ----------------------------------------------------
  const handleViewUserDetail = async (userId: string) => {
    if (!adminToken) return;
    try {
      const fullUser = await api.adminGetUser(adminToken, userId);
      setSelectedUserDetail(fullUser);
      setIsUserDetailModalOpen(true);
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleUserStatus = async (user: AdminUserRecord) => {
    if (!adminToken) return;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const updated = await api.adminUpdateUserStatus(adminToken, user.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: updated.status } : u)));
      showNotification(`User ${user.name} marked as ${updated.status}.`);
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleExecuteBalanceAdjustment = async () => {
    if (!balanceAdjustTarget || !adminToken) return;
    try {
      const numAmt = Number(balanceAdjustAmount);
      const newBal = await api.adminAdjustBalance(
        adminToken,
        balanceAdjustTarget.id,
        numAmt,
        balanceAdjustType,
        balanceAdjustNote
      );

      setUsers((prev) => prev.map((u) => (u.id === balanceAdjustTarget.id ? { ...u, walletBalanceUsd: newBal } : u)));
      setBalanceAdjustModalOpen(false);
      setBalanceAdjustTarget(null);
      showNotification(`Balance updated to $${newBal.toFixed(2)}.`);
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleOpenResetPasswordModal = (user: AdminUserRecord) => {
    setPasswordResetTarget(user);
    setCustomResetPassword('');
    setPasswordResetModalOpen(true);
  };

  const handleExecutePasswordReset = async () => {
    if (!passwordResetTarget) return;
    const token = adminToken || localStorage.getItem('admin_token') || 'admin_token_fallback';
    try {
      const tempPass = await api.adminResetPassword(
        token,
        passwordResetTarget.id,
        customResetPassword.trim() || undefined
      );
      setPasswordResetModalOpen(false);
      setPasswordResetTarget(null);
      setPasswordResetSuccess(tempPass);
      showNotification(`Password successfully reset for ${passwordResetTarget.name}.`);
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // DEPOSIT APPROVAL / REJECT
  // ----------------------------------------------------
  const handleExecuteDepositAction = async () => {
    if (!depositActionModal || !adminToken) return;
    const { item, action } = depositActionModal;

    try {
      if (action === 'approve') {
        const approved = await api.adminApproveDeposit(adminToken, item.id, depositAdminNote);
        setDeposits((prev) => prev.map((d) => (d.id === approved.id ? approved : d)));
        showNotification(`Deposit #${item.id} ($${item.amountUsd}) APPROVED and contract credited to user.`);
      } else {
        const rejected = await api.adminRejectDeposit(adminToken, item.id, depositAdminNote);
        setDeposits((prev) => prev.map((d) => (d.id === rejected.id ? rejected : d)));
        showNotification(`Deposit #${item.id} rejected.`);
      }
      setDepositActionModal(null);
      setDepositAdminNote('');
      fetchAllAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // WITHDRAWAL APPROVAL / REJECT
  // ----------------------------------------------------
  const handleExecuteWithdrawalAction = async () => {
    if (!withdrawalActionModal || !adminToken) return;
    const { item, action } = withdrawalActionModal;

    try {
      if (action === 'approve') {
        const approved = await api.adminApproveWithdrawal(adminToken, item.id, withdrawalTxHash, withdrawalAdminNote);
        setWithdrawals((prev) => prev.map((w) => (w.id === approved.id ? approved : w)));
        showNotification(`Withdrawal #${item.id} ($${item.amountUsd}) approved and payout broadcasted.`);
      } else {
        const rejected = await api.adminRejectWithdrawal(adminToken, item.id, withdrawalAdminNote);
        setWithdrawals((prev) => prev.map((w) => (w.id === rejected.id ? rejected : w)));
        showNotification(`Withdrawal #${item.id} rejected and balance refunded to user.`);
      }
      setWithdrawalActionModal(null);
      setWithdrawalTxHash('');
      setWithdrawalAdminNote('');
      fetchAllAdminData();
      if (onRefreshPublicData) onRefreshPublicData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleBatchApproveWithdrawals = async () => {
    if (!adminToken || selectedWithdrawalIds.length === 0) return;
    try {
      const msg = await api.adminBatchApproveWithdrawals(adminToken, selectedWithdrawalIds);
      setSelectedWithdrawalIds([]);
      showNotification(msg);
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // INVESTMENT PLANS HANDLERS
  // ----------------------------------------------------
  const handleSavePlan = async () => {
    if (!editingPlan || !adminToken) return;
    try {
      const updated = await api.adminUpdatePlan(adminToken, editingPlan.id, editingPlan);
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPlan(null);
      showNotification(`Investment plan ${updated.name} updated.`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      const created = await api.adminAddPlan(adminToken, {
        name: newPlanName,
        badge: newPlanBadge,
        dailyYieldPercent: Number(newPlanDailyRate) || 3.0,
        minAmountUsd: Number(newPlanMin) || 10,
        maxAmountUsd: Number(newPlanMax) || 100000,
        durationDays: Number(newPlanDuration) || 60,
        description: newPlanDesc,
        isActive: true,
        features: [
          `${newPlanDailyRate}% Daily Returns`,
          `${newPlanDuration} Days Contract Duration`,
          'Instant daily withdrawals',
          'Principal capital returned'
        ]
      });

      setPlans((prev) => [...prev, created]);
      setIsAddPlanModalOpen(false);
      setNewPlanName('');
      setNewPlanDesc('');
      showNotification(`Plan ${created.name} published.`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!adminToken) return;
    if (!window.confirm(`Delete investment plan ${name}?`)) return;
    try {
      await api.adminDeletePlan(adminToken, id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      showNotification(`Plan ${name} deleted.`);
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // ----------------------------------------------------
  // PLATFORM SETTINGS HANDLER
  // ----------------------------------------------------
  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm || !adminToken) return;

    try {
      const updated = await api.adminUpdateSettings(adminToken, settingsForm);
      setConfig(updated);
      showNotification('Platform settings successfully saved to database.');
      if (onRefreshPublicData) onRefreshPublicData();
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    if (newAdminPassword && newAdminPassword !== confirmAdminPassword) {
      showNotification('New password and confirm password do not match.', 'error');
      return;
    }

    if (newAdminPassword && newAdminPassword.length < 6) {
      showNotification('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsUpdatingCredentials(true);
    try {
      const res = await api.changeAdminCredentials(adminToken, {
        currentPassword: currentAdminPassword.trim() || undefined,
        newEmail: newAdminEmail.trim() || undefined,
        newUsername: newAdminUsername.trim() || undefined,
        newPassword: newAdminPassword.trim() || undefined,
      });

      showNotification('Admin credentials updated successfully! Changes saved.', 'success');
      setCurrentAdminPassword('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      fetchAllAdminData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update admin credentials.', 'error');
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#070b19] border-r border-slate-800 flex flex-col justify-between shrink-0 h-full">
        <div>
          {/* Admin Header / Brand */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-white tracking-wide block">ROOT CONTROL</span>
                <span className="text-[10px] font-mono text-emerald-400">● TLS 1.3 SECURE</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>1. Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'payments'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>2. Payment Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'users'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <div className="flex items-center justify-between flex-1">
                <span>3. Users</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">{users.length}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('deposits')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'deposits'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <div className="flex items-center justify-between flex-1">
                <span>4. Deposits</span>
                {pendingDeposits.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                    {pendingDeposits.length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'withdrawals'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              <div className="flex items-center justify-between flex-1">
                <span>5. Withdrawals</span>
                {pendingWithdrawals.length > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'plans'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>6. Investment Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>7. Platform Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-bot')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'ai-bot'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>8. AI Trading Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>9. Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Footer Admin Bar */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400">
            <div>Operator: <span className="text-white font-bold">{adminInfo?.name || 'Administrator'}</span></div>
            <div className="text-[10px] text-slate-500 truncate">Token: {adminToken.substring(0, 14)}...</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchAllAdminData();
                showNotification('Synced with database.');
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              title="Refresh all records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={onAdminLogout}
              className="px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#040714]">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-[#060a18]/60 shrink-0">
          <div className="flex items-center space-x-3">
            <h1 className="font-display font-bold text-lg text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
              Winvest Core v3.4
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {feedbackMsg && (
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 animate-in fade-in ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>TOTAL USERS</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-display mt-2">{totalUsersCount}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">● {activeUsersCount} Active Accounts</div>
                </div>

                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>PENDING DEPOSITS</span>
                    <ArrowDownLeft className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-400 font-display mt-2">
                    ${pendingDepositsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">{pendingDeposits.length} awaiting approval</div>
                </div>

                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>PENDING WITHDRAWALS</span>
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold text-rose-400 font-display mt-2">
                    ${pendingWithdrawalsSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">{pendingWithdrawals.length} pending payouts</div>
                </div>

                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                    <span>TOTAL AUM VOLUME</span>
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-300 font-display mt-2">
                    ${config?.totalAumUsd.toLocaleString() || '148,920,400'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">Solvency Ratio: 100% (BitGo)</div>
                </div>
              </div>

              {/* Platform-wide Lifetime Capital Flows (Admin Only) */}
              <div className="bg-gradient-to-r from-[#090e23] via-[#070b1d] to-[#090e23] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-inner">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Platform Lifetime Capital Flows</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Admin Only</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Aggregate total of all approved deposits and completed payouts across all users</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">TOTAL PLATFORM DEPOSITS</span>
                    <span className="text-xl font-bold font-display text-emerald-400">
                      +${approvedDepositsSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-10 w-px bg-slate-800"></div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">TOTAL PLATFORM WITHDRAWALS</span>
                    <span className="text-xl font-bold font-display text-rose-400">
                      -${completedWithdrawalsSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#090e23] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Real-time Operational Queue</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                      <div className="text-xs text-slate-400 font-mono">Pending User Deposits</div>
                      <div className="text-xl font-bold text-white">{pendingDeposits.length} Requests</div>
                      <button
                        onClick={() => setActiveTab('deposits')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
                      >
                        <span>Review deposit queue</span>
                        <ArrowDownLeft className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                      <div className="text-xs text-slate-400 font-mono">Pending User Withdrawals</div>
                      <div className="text-xl font-bold text-white">{pendingWithdrawals.length} Requests</div>
                      <button
                        onClick={() => setActiveTab('withdrawals')}
                        className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1"
                      >
                        <span>Execute settlement queue</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* System Alerts */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-white">Live Platform Security Status</div>
                      <p className="text-amber-200/80 leading-relaxed">
                        Database synchronization active at <code className="text-white">/data/db.json</code>. All deposit address updates and plan rate modifications immediately reflect across the public investor portal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hot Wallet Liquidity Monitor */}
                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Hot Liquidity Reserve</span>
                  </h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">HOT WALLET BALANCE</span>
                      <span className="text-xl font-bold text-white font-display">
                        ${config?.hotWalletBalanceUsd.toLocaleString() || '18,450,000.00'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">ACTIVE DEPOSIT METHODS</span>
                      <span className="text-base font-bold text-emerald-400 font-display">
                        {(paymentMethods || []).filter((pm) => pm && pm.isActive).length} / {(paymentMethods || []).length} Gateways Online
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">MAINTENANCE MODE</span>
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${config?.maintenanceMode ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {config?.maintenanceMode ? 'ACTIVE (SITE PAUSED)' : 'OFF (OPERATIONAL)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT & DEPOSIT SETTINGS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Supported Deposit Gateways & Wallet Addresses</h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Manage active crypto deposit networks, change destination wallet addresses, and set minimum deposits. Changes reflect immediately on user deposit pages.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Deposit Method</span>
                </button>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(paymentMethods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      method.isActive
                        ? 'bg-[#090e23] border-slate-800 hover:border-slate-700'
                        : 'bg-[#060914] border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white font-mono">
                          {method.symbol}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{method.name}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              method.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {method.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono block mt-0.5">{method.network}</span>
                        </div>
                      </div>

                      {/* Toggle & Actions */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleTogglePaymentActive(method)}
                          className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
                            method.isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                          title={method.isActive ? 'Disable Gateway' : 'Enable Gateway'}
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPaymentMethod({ ...method });
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Edit Gateway & Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id, method.name)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                          title="Remove Gateway"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Address & Parameters */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2.5 font-mono text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Live Deposit Wallet Address:</span>
                        <div className="mt-1 flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-emerald-300 font-mono text-[11px] truncate select-all">{method.walletAddress}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(method.walletAddress);
                              showNotification('Wallet address copied.');
                            }}
                            className="text-slate-400 hover:text-white ml-2 shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Minimum Deposit: <strong className="text-white">${method.minDepositUsd.toFixed(2)}</strong></span>
                        <span>Confirmations: <strong className="text-cyan-400">{method.confirmationsRequired || 2}</strong></span>
                      </div>

                      {method.lastUpdatedBy && (
                        <div className="text-[10px] text-slate-500 pt-1">
                          Last modified by {method.lastUpdatedBy}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Investor & Account Directory</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    View registered accounts, monitor wallet balances, adjust balances, and issue secure password resets. Plaintext passwords are never stored.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, email, ID..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-[#080d1e] border border-slate-800 rounded-lg text-white text-xs w-48 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-[#080d1e] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#090e23] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#060a18] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Role / Status</th>
                        <th className="p-3.5">Balance</th>
                        <th className="p-3.5">Total Invested</th>
                        <th className="p-3.5">Total Withdrawn</th>
                        <th className="p-3.5">Joined</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(users || [])
                        .filter((u) => {
                          const matchesSearch = 
                            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.id.toLowerCase().includes(userSearch.toLowerCase());
                          const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-white">{user.name}</div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                              <div className="text-[10px] text-slate-500">{user.id}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center space-x-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {user.role}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {user.status}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 text-emerald-400 font-bold">
                              ${user.walletBalanceUsd.toFixed(2)}
                            </td>
                            <td className="p-3.5 text-white font-bold">
                              ${user.totalInvestedUsd.toLocaleString()}
                            </td>
                            <td className="p-3.5 text-slate-300">
                              ${user.totalWithdrawnUsd.toLocaleString()}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {user.joinedDate}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center space-x-1">
                                <button
                                  onClick={() => handleViewUserDetail(user.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                                  title="View Account Profile & History"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setBalanceAdjustTarget(user);
                                    setBalanceAdjustAmount(user.walletBalanceUsd.toString());
                                    setBalanceAdjustModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 transition-colors"
                                  title="Adjust Wallet Balance"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenResetPasswordModal(user)}
                                  className="p-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900 text-amber-400 transition-colors"
                                  title="Admin Password Reset"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    user.status === 'active'
                                      ? 'bg-rose-950/40 hover:bg-rose-900 text-rose-400'
                                      : 'bg-emerald-950/40 hover:bg-emerald-900 text-emerald-400'
                                  }`}
                                  title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                                >
                                  {user.status === 'active' ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPOSIT MANAGEMENT */}
          {activeTab === 'deposits' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Deposit Verification Queue</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Review pending crypto transactions. Approving a deposit automatically credits user balance and initializes their 60-day investment yield contract.
                  </p>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <button
                    onClick={() => setDepositFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg ${depositFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Pending ({pendingDeposits.length})
                  </button>
                  <button
                    onClick={() => setDepositFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg ${depositFilter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setDepositFilter('all')}
                    className={`px-3 py-1.5 rounded-lg ${depositFilter === 'all' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    All Deposits
                  </button>
                </div>
              </div>

              {/* Deposit List Table */}
              <div className="bg-[#090e23] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#060a18] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">ID / User</th>
                        <th className="p-3.5">Amount (USD)</th>
                        <th className="p-3.5">Gateway / Coin</th>
                        <th className="p-3.5">Tx Hash</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(deposits || [])
                        .filter((d) => depositFilter === 'all' || d.status === depositFilter)
                        .map((deposit) => (
                          <tr key={deposit.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5">
                              <span className="font-bold text-white block">{deposit.id}</span>
                              <span className="text-slate-300 block text-[11px]">{deposit.userName}</span>
                              <span className="text-[10px] text-slate-500">{deposit.userEmail}</span>
                            </td>
                            <td className="p-3.5 text-emerald-400 font-bold text-sm">
                              ${deposit.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-white">{deposit.currency}</span>
                              <span className="text-slate-400 text-[10px] block">{deposit.network || 'Mainnet'}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="text-cyan-300 font-mono text-[11px] select-all bg-slate-950 px-2 py-1 rounded border border-slate-800 block max-w-xs truncate">
                                {deposit.txHash}
                              </span>
                              {deposit.adminNote && (
                                <span className="text-[10px] text-slate-400 block mt-1">Note: {deposit.adminNote}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {deposit.timestamp}
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                deposit.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : deposit.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {deposit.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              {deposit.status === 'pending' ? (
                                <div className="inline-flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setDepositActionModal({ item: deposit, action: 'approve' });
                                      setDepositAdminNote('Verified on blockchain explorer');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDepositActionModal({ item: deposit, action: 'reject' });
                                      setDepositAdminNote('Transaction hash unconfirmed');
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs flex items-center gap-1 transition-all"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-500">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WITHDRAWAL MANAGEMENT */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Withdrawal Settlement Center</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Review investor payout requests, check destination crypto addresses, and execute blockchain broadcasts.
                  </p>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  {selectedWithdrawalIds.length > 0 && (
                    <button
                      onClick={handleBatchApproveWithdrawals}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-400 text-slate-950 font-bold rounded-lg shadow-md flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Batch Multi-Sig ({selectedWithdrawalIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setWithdrawalFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg ${withdrawalFilter === 'pending' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Pending ({pendingWithdrawals.length})
                  </button>
                  <button
                    onClick={() => setWithdrawalFilter('all')}
                    className={`px-3 py-1.5 rounded-lg ${withdrawalFilter === 'all' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    All
                  </button>
                </div>
              </div>

              {/* Withdrawals Table */}
              <div className="bg-[#090e23] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#060a18] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWithdrawalIds(pendingWithdrawals.map((w) => w.id));
                              } else {
                                setSelectedWithdrawalIds([]);
                              }
                            }}
                            className="rounded bg-slate-900 border-slate-700"
                          />
                        </th>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Amount (USD)</th>
                        <th className="p-3.5">Destination Address</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(withdrawals || [])
                        .filter((w) => withdrawalFilter === 'all' || w.status === withdrawalFilter)
                        .map((withdrawal) => (
                          <tr key={withdrawal.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5">
                              {withdrawal.status === 'pending' && (
                                <input
                                  type="checkbox"
                                  checked={selectedWithdrawalIds.includes(withdrawal.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedWithdrawalIds([...selectedWithdrawalIds, withdrawal.id]);
                                    } else {
                                      setSelectedWithdrawalIds(selectedWithdrawalIds.filter((id) => id !== withdrawal.id));
                                    }
                                  }}
                                  className="rounded bg-slate-900 border-slate-700"
                                />
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-white block">{withdrawal.userName}</span>
                              <span className="text-[10px] text-slate-400">{withdrawal.userEmail}</span>
                            </td>
                            <td className="p-3.5 text-rose-400 font-bold text-sm">
                              ${withdrawal.amountUsd.toFixed(2)}
                            </td>
                            <td className="p-3.5">
                              <span className="text-slate-300 font-mono text-[11px] select-all bg-slate-950 px-2 py-1 rounded border border-slate-800 block max-w-xs truncate">
                                {withdrawal.destinationAddress}
                              </span>
                              {withdrawal.txHash && (
                                <span className="text-[10px] text-emerald-400 block mt-0.5">Tx: {withdrawal.txHash}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {withdrawal.timestamp}
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                withdrawal.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : withdrawal.status === 'pending'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {withdrawal.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              {withdrawal.status === 'pending' ? (
                                <div className="inline-flex items-center space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setWithdrawalActionModal({ item: withdrawal, action: 'approve' });
                                      setWithdrawalTxHash(`tx-${Date.now().toString(36)}-payout`);
                                      setWithdrawalAdminNote('Broadcast via BitGo custody API');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Payout</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setWithdrawalActionModal({ item: withdrawal, action: 'reject' });
                                      setWithdrawalAdminNote('Address verification failed');
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs flex items-center gap-1 transition-all"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-emerald-400">Settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INVESTMENT PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Investment Packages & Yield Tiers</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Configure daily percentage returns, contract durations, minimum/maximum deposit limits, and active status.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddPlanModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs font-mono rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Plan</span>
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(plans || []).map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                      plan.isActive
                        ? 'bg-[#090e23] border-slate-800 hover:border-slate-700'
                        : 'bg-[#060914] border-slate-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400 uppercase">{plan.badge || 'TIER'}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          plan.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {plan.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-1">{plan.name}</h3>
                      <div className="text-2xl font-bold font-display text-emerald-400 mt-2">
                        {plan.dailyYieldPercent.toFixed(2)}% <span className="text-xs font-normal text-slate-400">Daily Return</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 font-mono text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Duration:</span>
                          <span className="text-white font-bold">{plan.durationDays} Days</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Min Deposit:</span>
                          <span className="text-white font-bold">${plan.minAmountUsd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Max Deposit:</span>
                          <span className="text-white font-bold">${plan.maxAmountUsd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total ROI:</span>
                          <span className="text-cyan-400 font-bold">{(plan.dailyYieldPercent * plan.durationDays).toFixed(0)}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-3 leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingPlan({ ...plan })}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 text-xs font-mono flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PLATFORM SETTINGS */}
          {activeTab === 'settings' && settingsForm && (
            <form onSubmit={handleSavePlatformSettings} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-white font-display">Central Platform Configuration</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Update corporate brand details, customer support contacts, global limits, and maintenance modes.
                </p>
              </div>

              <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Website Brand Name</label>
                    <input
                      type="text"
                      value={settingsForm.websiteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Corporate Address</label>
                    <input
                      type="text"
                      value={settingsForm.contactAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Announcement Banner */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-400">Global Announcement Banner</label>
                    <label className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={settingsForm.isAnnouncementActive}
                        onChange={(e) => setSettingsForm({ ...settingsForm, isAnnouncementActive: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700"
                      />
                      <span>Active Banner</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Limits & Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Min Deposit (USD)</label>
                    <input
                      type="number"
                      value={settingsForm.minDepositUsd}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minDepositUsd: Number(e.target.value) })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Min Withdrawal (USD)</label>
                    <input
                      type="number"
                      value={settingsForm.minWithdrawalUsd}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minWithdrawalUsd: Number(e.target.value) })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">Max Withdrawal (USD)</label>
                    <input
                      type="number"
                      value={settingsForm.maxWithdrawalUsd}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxWithdrawalUsd: Number(e.target.value) })}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs font-mono">Maintenance Mode</div>
                      <div className="text-[11px] text-slate-400 font-mono">Pause user deposits/withdrawals</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.maintenanceMode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-950 border-slate-700"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs font-mono">Allow User Registration</div>
                      <div className="text-[11px] text-slate-400 font-mono">Permit new user sign-ups</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.allowUserRegistration}
                      onChange={(e) => setSettingsForm({ ...settingsForm, allowUserRegistration: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-950 border-slate-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs font-mono rounded-xl shadow-lg transition-all"
                  >
                    Save Platform Settings
                  </button>
                </div>
              </div>

              {/* ADMIN ACCOUNT & CREDENTIALS SECURITY CARD */}
              <div className="bg-[#090e23] border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-xl shadow-amber-500/5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                        <span>Admin Master Security & Credentials</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                          Root Access
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Change the SuperAdmin login email, display name, and master access password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      New Admin Email / ইউজারনেম
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. admin@apexquant.io"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Leave blank to keep your current email
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      Admin Display Name / নাম
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Executive Admin"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Display name shown on admin audit logs
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      Current Password / বর্তমান পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password (if set)"
                      value={currentAdminPassword}
                      onChange={(e) => setCurrentAdminPassword(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Default demo key: <code className="text-amber-400">AdminMaster2026!#</code>
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      New Password / নতুন পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-slate-400 block mb-1">
                      Confirm New Password / নতুন পাসওয়ার্ড নিশ্চিত করুন
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter your new password"
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Always save your new credentials in a safe place.</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleUpdateAdminCredentials}
                    disabled={isUpdatingCredentials}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono rounded-xl shadow-lg transition-all flex items-center gap-2"
                  >
                    {isUpdatingCredentials ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Update Admin Password & Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 8: AI TRADING ENGINE */}
          {activeTab === 'ai-bot' && config && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-white font-display">AI High-Frequency Trading Core</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Configure live yield rates, manage reinforcement algorithm aggression, and inject manual trade signals to the public dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-400" />
                    <span>Daily Yield Rate Controller</span>
                  </h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Daily Distribution:</span>
                        <strong className="text-emerald-400">{config.dailyYieldRatePercent.toFixed(2)}%</strong>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.1"
                        value={config.dailyYieldRatePercent}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          const updated = await api.adminUpdateSettings(adminToken, { dailyYieldRatePercent: val });
                          setConfig(updated);
                          if (onRefreshPublicData) onRefreshPublicData();
                        }}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div className="pt-2">
                      <span className="text-slate-400 block mb-2">Bot Strategy Mode:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['optimal', 'turbo', 'delta_hedged', 'paused'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={async () => {
                              const updated = await api.adminUpdateSettings(adminToken, { tradingBotState: mode });
                              setConfig(updated);
                              showNotification(`AI Engine mode set to ${mode.toUpperCase()}.`);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
                              config.tradingBotState === mode
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {mode.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Signal Broadcast */}
                <div className="bg-[#090e23] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Broadcast Live Trade Signal</span>
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Asset Pair</label>
                      <input
                        type="text"
                        value={manualPair}
                        onChange={(e) => setManualPair(e.target.value)}
                        className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">Side</label>
                        <select
                          value={manualType}
                          onChange={(e) => setManualType(e.target.value as any)}
                          className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="BUY">BUY</option>
                          <option value="SELL">SELL</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Net Arbitrage Profit %</label>
                        <input
                          type="text"
                          value={manualProfit}
                          onChange={(e) => setManualProfit(e.target.value)}
                          className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        showNotification(`Trade signal ${manualPair} broadcasted to live ticker.`);
                      }}
                      className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all"
                    >
                      Broadcast Live Signal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Immutable System Audit Trail</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Real-time chronological recording of all administrative actions, wallet address updates, balance adjustments, and approvals.
                  </p>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search action, target..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-[#080d1e] border border-slate-800 rounded-lg text-white text-xs w-48 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Audit Table */}
              <div className="bg-[#090e23] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#060a18] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Operator</th>
                        <th className="p-3.5">Action</th>
                        <th className="p-3.5">Target</th>
                        <th className="p-3.5">Previous Value</th>
                        <th className="p-3.5">New Value</th>
                        <th className="p-3.5">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {(auditLogs || [])
                        .filter((log) => {
                          const matches = 
                            log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.adminName.toLowerCase().includes(auditSearch.toLowerCase());
                          return matches;
                        })
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                              {log.timestamp}
                            </td>
                            <td className="p-3.5 text-white font-bold">
                              {log.adminName}
                            </td>
                            <td className="p-3.5 text-amber-300 font-semibold">
                              {log.action}
                            </td>
                            <td className="p-3.5 text-slate-300">
                              {log.target}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                              {log.previousValue || '-'}
                            </td>
                            <td className="p-3.5 text-emerald-300 text-[11px] max-w-xs truncate font-bold">
                              {log.newValue || '-'}
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                log.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : log.severity === 'warning'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {log.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & DIALOGS */}
      {/* ========================================================================= */}

      {/* 1. Edit / Add Payment Method Modal */}
      {editingPaymentMethod && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Edit Deposit Gateway & Wallet Address</h3>
              <button onClick={() => setEditingPaymentMethod(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Gateway Name</label>
                <input
                  type="text"
                  value={editingPaymentMethod.name}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, name: e.target.value })}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Blockchain / Network</label>
                <input
                  type="text"
                  value={editingPaymentMethod.network}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, network: e.target.value })}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">Deposit Wallet Address (Destination)</label>
                <input
                  type="text"
                  value={editingPaymentMethod.walletAddress}
                  onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, walletAddress: e.target.value })}
                  className="w-full bg-[#050814] border border-amber-500/50 rounded-xl px-3 py-2 text-emerald-300 font-mono text-xs select-all"
                />
                <span className="text-[10px] text-amber-300 block mt-1">
                  ⚠️ Changing this wallet address will update the user deposit page immediately.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Min Deposit ($)</label>
                  <input
                    type="number"
                    value={editingPaymentMethod.minDepositUsd}
                    onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, minDepositUsd: Number(e.target.value) })}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Status</label>
                  <select
                    value={editingPaymentMethod.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, isActive: e.target.value === 'active' })}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPaymentMethod(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddressChangeConfirmOpen(true);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Step for Address Change */}
      {addressChangeConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1229] border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-white text-base">Confirm Address Modification</h3>
            </div>

            <p className="text-slate-300 leading-relaxed">
              You are updating the active deposit wallet address for <strong>{editingPaymentMethod?.name}</strong>.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
              <div className="text-slate-400">New Live Wallet Address:</div>
              <div className="text-emerald-300 font-mono break-all">{editingPaymentMethod?.walletAddress}</div>
            </div>

            <p className="text-[11px] text-slate-400">
              This action will be logged in the immutable audit trail with your operator ID.
            </p>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                onClick={() => setAddressChangeConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePaymentMethod}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Confirm & Broadcast Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Payment Method Modal */}
      {isAddPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreatePaymentMethod} className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Add New Deposit Gateway</h3>
              <button type="button" onClick={() => setIsAddPaymentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Gateway Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Polygon USDT"
                    value={newPmName}
                    onChange={(e) => setNewPmName(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Blockchain / Network</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Polygon (POS)"
                    value={newPmNetwork}
                    onChange={(e) => setNewPmNetwork(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Coin / Asset</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. USD Coin"
                    value={newPmCoin}
                    onChange={(e) => setNewPmCoin(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. USDT"
                    value={newPmSymbol}
                    onChange={(e) => setNewPmSymbol(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Wallet Address</label>
                <input
                  type="text"
                  required
                  placeholder="0x... or bc1q..."
                  value={newPmAddress}
                  onChange={(e) => setNewPmAddress(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-emerald-300"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Min Deposit (USD)</label>
                <input
                  type="number"
                  value={newPmMinDeposit}
                  onChange={(e) => setNewPmMinDeposit(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
              >
                Create Gateway
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. User Detail Modal */}
      {isUserDetailModalOpen && selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{selectedUserDetail.name}</h3>
                <span className="text-slate-400 text-[11px]">{selectedUserDetail.email} • ID: {selectedUserDetail.id}</span>
              </div>
              <button onClick={() => setIsUserDetailModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">WALLET BALANCE</span>
                <span className="text-base font-bold text-emerald-400">${selectedUserDetail.walletBalanceUsd.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TOTAL INVESTED</span>
                <span className="text-base font-bold text-white">${selectedUserDetail.totalInvestedUsd.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">TOTAL EARNED</span>
                <span className="text-base font-bold text-cyan-400">${selectedUserDetail.totalEarnedUsd.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">REFERRAL EARNINGS</span>
                <span className="text-base font-bold text-amber-400">${selectedUserDetail.referralEarningsUsd.toFixed(2)}</span>
              </div>
            </div>

            {/* Deposits Contracts */}
            <div>
              <h4 className="font-bold text-white text-xs mb-2">Active Deposit Contracts ({(selectedUserDetail?.deposits || []).length})</h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {(!selectedUserDetail?.deposits || selectedUserDetail.deposits.length === 0) ? (
                  <div className="p-3 bg-slate-900/50 rounded-xl text-slate-500 text-center">No deposits made yet.</div>
                ) : (
                  selectedUserDetail.deposits.map((dep) => (
                    <div key={dep.id} className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-white">${dep.amountUsd}</span>
                        <span className="text-slate-400 ml-2">({dep.dailyYieldPercent}% daily for {dep.totalDays}d)</span>
                      </div>
                      <span className="text-emerald-400 font-bold uppercase text-[10px]">{dep.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsUserDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Balance Adjust Modal */}
      {balanceAdjustModalOpen && balanceAdjustTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Adjust Investor Balance</h3>
              <button onClick={() => setBalanceAdjustModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-slate-300">
                User: <strong className="text-white">{balanceAdjustTarget.name}</strong>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['credit', 'debit', 'set'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBalanceAdjustType(type)}
                      className={`py-2 rounded-xl text-xs uppercase font-bold transition-all ${
                        balanceAdjustType === type
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Amount (USD)</label>
                <input
                  type="number"
                  value={balanceAdjustAmount}
                  onChange={(e) => setBalanceAdjustAmount(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Audit Log Note</label>
                <input
                  type="text"
                  placeholder="e.g. VIP promotional allocation"
                  value={balanceAdjustNote}
                  onChange={(e) => setBalanceAdjustNote(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBalanceAdjustModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBalanceAdjustment}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Deposit Action Modal (Approve / Reject) */}
      {depositActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {depositActionModal.action === 'approve' ? 'Approve Deposit Transaction' : 'Reject Deposit Transaction'}
              </h3>
              <button onClick={() => setDepositActionModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div>User: <strong className="text-white">{depositActionModal.item.userName}</strong></div>
                <div>Amount: <strong className="text-emerald-400">${depositActionModal.item.amountUsd}</strong> ({depositActionModal.item.currency})</div>
                <div className="text-[10px] text-slate-400 truncate">Tx: {depositActionModal.item.txHash}</div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Admin Verification Note</label>
                <input
                  type="text"
                  value={depositAdminNote}
                  onChange={(e) => setDepositAdminNote(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDepositActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDepositAction}
                className={`px-5 py-2 font-bold rounded-xl ${
                  depositActionModal.action === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                {depositActionModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Withdrawal Action Modal */}
      {withdrawalActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {withdrawalActionModal.action === 'approve' ? 'Execute Payout Broadcast' : 'Reject Withdrawal Request'}
              </h3>
              <button onClick={() => setWithdrawalActionModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div>User: <strong className="text-white">{withdrawalActionModal.item.userName}</strong></div>
                <div>Amount: <strong className="text-rose-400">${withdrawalActionModal.item.amountUsd}</strong></div>
                <div className="text-[10px] text-cyan-300 break-all">Destination: {withdrawalActionModal.item.destinationAddress}</div>
              </div>

              {withdrawalActionModal.action === 'approve' && (
                <div>
                  <label className="text-slate-400 block mb-1">Blockchain Transaction Hash</label>
                  <input
                    type="text"
                    value={withdrawalTxHash}
                    onChange={(e) => setWithdrawalTxHash(e.target.value)}
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-emerald-300"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 block mb-1">Admin Reference / Note</label>
                <input
                  type="text"
                  value={withdrawalAdminNote}
                  onChange={(e) => setWithdrawalAdminNote(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setWithdrawalActionModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWithdrawalAction}
                className={`px-5 py-2 font-bold rounded-xl ${
                  withdrawalActionModal.action === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                {withdrawalActionModal.action === 'approve' ? 'Execute Broadcast' : 'Reject & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Password Reset Success Pop-up */}
      {passwordResetSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-emerald-500/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-mono text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-white text-base">Temporary Password Generated</h3>
            <p className="text-slate-300 text-xs">
              Provide this temporary password to the investor securely:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/40 text-emerald-300 font-bold text-sm select-all">
              {passwordResetSuccess}
            </div>

            <button
              onClick={() => setPasswordResetSuccess(null)}
              className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 8. Password Reset Modal */}
      {passwordResetModalOpen && passwordResetTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090f23] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Reset User Password</span>
              </h3>
              <button onClick={() => setPasswordResetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-slate-300">
                Target User: <strong className="text-white">{passwordResetTarget.name}</strong> ({passwordResetTarget.email})
              </div>

              <div>
                <label className="text-slate-400 block mb-1">New Password (Leave blank to auto-generate secure temporary password)</label>
                <input
                  type="text"
                  placeholder="e.g. SecretPass123! or leave blank"
                  value={customResetPassword}
                  onChange={(e) => setCustomResetPassword(e.target.value)}
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPasswordResetModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecutePasswordReset}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
