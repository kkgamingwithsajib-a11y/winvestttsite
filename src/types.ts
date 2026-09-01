export interface MarketPair {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  icon: string;
}

export interface LiveTransaction {
  id: string;
  type: 'deposit' | 'payout';
  username: string;
  amountUsd: number;
  amountBtc: number;
  txHash: string;
  timestamp: string;
  status: 'confirmed' | 'processing';
  timeAgo: string;
}

export interface TradeSignal {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  profitPercent: number;
  confidence: number;
  strategy: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  network: string; // e.g. 'Bitcoin Network', 'Ethereum (ERC-20)', 'TRON (TRC-20)', 'BNB Smart Chain (BEP-20)', 'Solana', 'Polygon'
  coin: string; // 'BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'BNB'
  symbol: string;
  walletAddress: string;
  qrCodeUrl?: string;
  minDepositUsd: number;
  isActive: boolean;
  instructions?: string;
  icon?: string;
  confirmationsRequired?: number;
  updatedAt?: string;
  lastUpdatedBy?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  badge?: string;
  dailyYieldPercent: number;
  minAmountUsd: number;
  maxAmountUsd: number;
  durationDays: number;
  profitType: 'daily_withdrawable' | 'compound' | 'term_end';
  returnPrincipal: boolean;
  isActive: boolean;
  description: string;
  features: string[];
}

export interface PlatformConfig {
  websiteName: string;
  logoText: string;
  logoBadge: string;
  favicon?: string;
  contactPhone: string;
  contactAddress: string;
  supportEmail: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  maintenanceMode: boolean;
  allowUserRegistration: boolean;
  dailyYieldRatePercent: number;
  contractDurationDays: number;
  minDepositUsd: number;
  minWithdrawalUsd: number;
  maxWithdrawalUsd: number;
  instantWithdrawalThresholdUsd: number;
  affiliateTier1Percent: number;
  affiliateTier2Percent: number;
  affiliateTier3Percent: number;
  tradingBotState: 'optimal' | 'turbo' | 'delta_hedged' | 'paused';
  hotWalletBalanceUsd: number;
  totalAumUsd: number;
  supportedCurrencies: string[];
}

export interface UserDeposit {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  amountUsd: number;
  amountCrypto?: number;
  currency?: string;
  network?: string;
  dailyYieldPercent: number;
  startDate: string;
  daysActive: number;
  totalDays: number;
  earnedSoFarUsd: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  txHash: string;
  paymentMethodId?: string;
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface UserWithdrawal {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  amountUsd: number;
  amountCrypto?: number;
  currency?: string;
  network?: string;
  destinationAddress: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'flagged' | 'rejected';
  txHash?: string;
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'user' | 'vip' | 'institutional' | 'admin';
  status: 'active' | 'suspended' | 'pending_kyc';
  walletBalanceUsd: number;
  totalInvestedUsd: number;
  totalEarnedUsd: number;
  totalWithdrawnUsd: number;
  referralCode: string;
  referralEarningsUsd: number;
  totalReferrals: number;
  joinedDate: string;
  lastLogin?: string;
  ipAddress?: string;
  twoFactorEnabled?: boolean;
  kycLevel?: string;
  isLoggedIn?: boolean;
  deposits: UserDeposit[];
  withdrawals: UserWithdrawal[];
}

export interface AdminUserRecord {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'user' | 'vip' | 'institutional' | 'admin';
  status: 'active' | 'suspended' | 'pending_kyc';
  walletBalanceUsd: number;
  totalInvestedUsd: number;
  totalWithdrawnUsd: number;
  totalEarnedUsd?: number;
  activeContractsCount: number;
  joinedDate: string;
  lastLogin?: string;
  ipAddress: string;
  twoFactorEnabled: boolean;
  kycLevel: string;
  referralCode?: string;
}

export interface AdminDepositItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amountUsd: number;
  amountCrypto?: number;
  currency: string;
  network?: string;
  dailyRate: number;
  txHash: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface AdminWithdrawalItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amountUsd: number;
  amountCrypto?: number;
  currency?: string;
  network?: string;
  destinationAddress: string;
  txHash?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'flagged' | 'rejected';
  adminNote?: string;
  processedAt?: string;
  processedBy?: string;
}

export interface AdminAuditLogItem {
  id: string;
  timestamp: string;
  adminId?: string;
  adminName: string;
  action: string;
  target: string;
  previousValue?: string;
  newValue?: string;
  severity: 'info' | 'warning' | 'critical';
  ipAddress: string;
  details?: string;
}

export interface FaqItem {
  id: string;
  category: 'general' | 'investment' | 'withdrawals' | 'affiliate' | 'security';
  question: string;
  answer: string;
}
