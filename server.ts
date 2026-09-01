import express from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// Types
import { 
  PaymentMethod, 
  InvestmentPlan, 
  PlatformConfig, 
  UserAccount, 
  AdminAuditLogItem, 
  AdminDepositItem, 
  AdminWithdrawalItem,
  UserDeposit,
  UserWithdrawal
} from './src/types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Database file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join('/tmp', 'db.json');

// Interface for DB schema
interface DatabaseSchema {
  settings: PlatformConfig;
  paymentMethods: PaymentMethod[];
  investmentPlans: InvestmentPlan[];
  users: (UserAccount & { passwordHash: string })[];
  adminTokens: { token: string; adminId: string; adminName: string; createdAt: string }[];
  userSessions: { token: string; userId: string; createdAt: string }[];
  deposits: AdminDepositItem[];
  withdrawals: AdminWithdrawalItem[];
  auditLogs: AdminAuditLogItem[];
}

// Default initial state
const DEFAULT_SETTINGS: PlatformConfig = {
  websiteName: 'Winvest - Wealth Invest Corp',
  logoText: 'WINVEST',
  logoBadge: 'AI 3.0',
  favicon: '',
  contactPhone: '+1 (212) 894-3900',
  contactAddress: 'One Vanderbilt Ave, 45th Floor, New York, NY 10017',
  supportEmail: 'support@winvest.com',
  announcementText: '⚡ Quantum AI Engine v3.4 deployed: Multilateral cross-DEX latency reduced to 8.2ms. Global payouts active.',
  isAnnouncementActive: true,
  maintenanceMode: false,
  allowUserRegistration: true,
  dailyYieldRatePercent: 3.0,
  contractDurationDays: 60,
  minDepositUsd: 10,
  minWithdrawalUsd: 1,
  maxWithdrawalUsd: 100000,
  instantWithdrawalThresholdUsd: 5000,
  affiliateTier1Percent: 5.0,
  affiliateTier2Percent: 2.0,
  affiliateTier3Percent: 1.0,
  tradingBotState: 'optimal',
  hotWalletBalanceUsd: 18450000,
  totalAumUsd: 148920400,
  supportedCurrencies: ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'BNB'],
};

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-btc-1',
    name: 'Bitcoin',
    network: 'Bitcoin Native (SegWit)',
    coin: 'Bitcoin',
    symbol: 'BTC',
    walletAddress: 'bc1q9v8t7s34802wexv4032mzpwe280nla8c23m80a',
    minDepositUsd: 10,
    isActive: true,
    instructions: 'Send only native Bitcoin (BTC) to this address. Requires 2 blockchain confirmations before automatic activation.',
    icon: 'btc',
    confirmationsRequired: 2,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  },
  {
    id: 'pm-usdt-trc20',
    name: 'Tether TRC-20',
    network: 'TRON (TRC-20)',
    coin: 'Tether USD',
    symbol: 'USDT',
    walletAddress: 'TX4891ZqPX99a8bVcx7mKnQw7y90a12x9a',
    minDepositUsd: 10,
    isActive: true,
    instructions: 'Send USDT via TRON TRC-20 network only. Lowest fee and 1-minute confirmation.',
    icon: 'usdt',
    confirmationsRequired: 1,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  },
  {
    id: 'pm-eth-erc20',
    name: 'Ethereum',
    network: 'Ethereum (ERC-20)',
    coin: 'Ethereum',
    symbol: 'ETH',
    walletAddress: '0x71C83642372e604f8eA0d8fa7924F0e01768800a',
    minDepositUsd: 10,
    isActive: true,
    instructions: 'Send ETH via Ethereum Mainnet. Smart contracts and standard transactions accepted.',
    icon: 'eth',
    confirmationsRequired: 12,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  },
  {
    id: 'pm-usdt-erc20',
    name: 'Tether ERC-20',
    network: 'Ethereum (ERC-20)',
    coin: 'Tether USD',
    symbol: 'USDT',
    walletAddress: '0x71C83642372e604f8eA0d8fa7924F0e01768800a',
    minDepositUsd: 25,
    isActive: true,
    instructions: 'Send USDT via Ethereum ERC-20 token standard.',
    icon: 'usdt',
    confirmationsRequired: 12,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  },
  {
    id: 'pm-solana',
    name: 'Solana USDC',
    network: 'Solana Network',
    coin: 'USD Coin',
    symbol: 'USDC',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    minDepositUsd: 10,
    isActive: true,
    instructions: 'Fast Solana network transfers with sub-cent gas fees.',
    icon: 'sol',
    confirmationsRequired: 32,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  },
  {
    id: 'pm-bnb-bep20',
    name: 'BNB Smart Chain',
    network: 'BNB Smart Chain (BEP-20)',
    coin: 'BNB Token',
    symbol: 'BNB',
    walletAddress: '0x71C83642372e604f8eA0d8fa7924F0e01768800a',
    minDepositUsd: 10,
    isActive: true,
    instructions: 'Send BNB or BEP-20 assets via BSC network.',
    icon: 'bnb',
    confirmationsRequired: 15,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: 'System Admin'
  }
];

const DEFAULT_PLANS: InvestmentPlan[] = [
  {
    id: 'plan-flagship-60d',
    name: 'Flagship 60-Day Quantum Plan',
    badge: 'Most Popular • 3.00% Daily',
    dailyYieldPercent: 3.0,
    minAmountUsd: 10,
    maxAmountUsd: 500000,
    durationDays: 60,
    profitType: 'daily_withdrawable',
    returnPrincipal: true,
    isActive: true,
    description: 'Systematic daily return generated by high-frequency cross-exchange arbitrage algorithms.',
    features: [
      '3.00% guaranteed daily yield paid every 24 hours',
      '180% Total Gross Return (80% Pure Profit)',
      '60 Calendar Days Contract Duration',
      '24/7 Instant Withdrawal ($1.00 minimum)',
      'Principal Capital included in daily returns + bonus reserve',
      'Automated Reinvestment & Compounding options'
    ]
  },
  {
    id: 'plan-starter-30d',
    name: 'Starter Quantum Node',
    badge: 'Low Entry • 2.20% Daily',
    dailyYieldPercent: 2.2,
    minAmountUsd: 50,
    maxAmountUsd: 2500,
    durationDays: 30,
    profitType: 'daily_withdrawable',
    returnPrincipal: true,
    isActive: true,
    description: 'Ideal entry tier for retail investors exploring autonomous AI algorithmic wealth generation.',
    features: [
      '2.20% daily return credited automatically',
      '66% Total Net Profit over 30 days',
      'Full Principal returned upon contract completion',
      'Zero management or maintenance fees',
      'Instant daily withdrawals'
    ]
  },
  {
    id: 'plan-vip-90d',
    name: 'VIP Institutional Arbitrage',
    badge: 'High Yield • 3.80% Daily',
    dailyYieldPercent: 3.8,
    minAmountUsd: 10000,
    maxAmountUsd: 2000000,
    durationDays: 90,
    profitType: 'daily_withdrawable',
    returnPrincipal: true,
    isActive: true,
    description: 'Dedicated high-liquidity sub-accounts paired with zero-slippage market maker execution nodes.',
    features: [
      '3.80% daily yield with priority liquidation queue',
      '342% Total Gross Return over 90 calendar days',
      'Dedicated Account Officer & custom API reporting',
      'Custom Multi-Sig cold storage segregation (BitGo)',
      'Priority instant withdrawals without batch limits'
    ]
  }
];

// Helper to safely load DB
function loadDatabase(): DatabaseSchema {
  try {
    let rawData: string | null = null;
    if (fs.existsSync(TMP_DB_FILE)) {
      try { rawData = fs.readFileSync(TMP_DB_FILE, 'utf-8'); } catch {}
    }
    if (!rawData && fs.existsSync(DB_FILE)) {
      try { rawData = fs.readFileSync(DB_FILE, 'utf-8'); } catch {}
    }

    let parsed: any = null;
    if (rawData) {
      try { parsed = JSON.parse(rawData); } catch (e) { console.error('Error parsing JSON:', e); }
    }

    if (!parsed) {
      parsed = createInitialDatabase();
    }

    // Ensure all required arrays exist
    if (!parsed.paymentMethods) parsed.paymentMethods = DEFAULT_PAYMENT_METHODS;
    if (!parsed.investmentPlans) parsed.investmentPlans = DEFAULT_PLANS;
    if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
    if (!parsed.users) parsed.users = [];
    if (!parsed.adminTokens) parsed.adminTokens = [];
    if (!parsed.userSessions) parsed.userSessions = [];
    if (!parsed.deposits) parsed.deposits = [];
    if (!parsed.withdrawals) parsed.withdrawals = [];
    if (!parsed.auditLogs) parsed.auditLogs = [];

    // Ensure Admin user exists with the requested credentials
    let adminUser = parsed.users.find((u: any) => u.role === 'admin' || u.id === 'usr-admin-root');
    const adminPasswordHash = bcrypt.hashSync('01991234', 10);
    if (!adminUser) {
      adminUser = {
        id: 'usr-admin-root',
        name: 'Administrator',
        username: 'anikachina1',
        email: 'anikachina1@gmail.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        status: 'active',
        walletBalanceUsd: 0,
        totalInvestedUsd: 0,
        totalEarnedUsd: 0,
        totalWithdrawnUsd: 0,
        referralCode: 'ADMIN-ROOT',
        referralEarningsUsd: 0,
        totalReferrals: 0,
        joinedDate: '2024-01-01',
        lastLogin: new Date().toISOString(),
        ipAddress: '127.0.0.1 (Localhost)',
        twoFactorEnabled: false,
        kycLevel: 'Institutional Master Key',
        deposits: [],
        withdrawals: []
      };
      parsed.users.push(adminUser);
    } else {
      adminUser.name = 'Administrator';
      adminUser.username = 'anikachina1';
      adminUser.email = 'anikachina1@gmail.com';
      adminUser.passwordHash = adminPasswordHash;
    }

    return parsed;
  } catch (err) {
    console.error('Error loading database, resetting to fallback:', err);
    return createInitialDatabase();
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } catch (tmpErr) {
      console.error('Error saving database to /tmp:', tmpErr);
    }
  }
}

function createInitialDatabase(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('01991234', salt);
  const demoInvestorHash = bcrypt.hashSync('investor2026', salt);

  const initialUsers: (UserAccount & { passwordHash: string })[] = [
    {
      id: 'usr-1001',
      name: 'Alexander Vance',
      username: 'alexvance',
      email: 'alex.vance@investor.com',
      passwordHash: demoInvestorHash,
      role: 'vip',
      status: 'active',
      walletBalanceUsd: 1450.00,
      totalInvestedUsd: 25000.00,
      totalEarnedUsd: 4890.00,
      totalWithdrawnUsd: 8400.00,
      referralCode: 'WIN-7792-AV',
      referralEarningsUsd: 850.00,
      totalReferrals: 14,
      joinedDate: '2024-11-12',
      lastLogin: new Date().toISOString(),
      ipAddress: '198.51.100.42 (US)',
      twoFactorEnabled: true,
      kycLevel: 'Level 2 Verified',
      deposits: [
        {
          id: 'dep-901',
          amountUsd: 15000,
          amountCrypto: 0.162,
          currency: 'BTC',
          network: 'Bitcoin Native',
          dailyYieldPercent: 3.0,
          startDate: '2025-01-10',
          daysActive: 45,
          totalDays: 60,
          earnedSoFarUsd: 20250,
          status: 'active',
          txHash: '9f8b...21a0',
        },
        {
          id: 'dep-902',
          amountUsd: 10000,
          amountCrypto: 3.45,
          currency: 'ETH',
          network: 'Ethereum ERC-20',
          dailyYieldPercent: 3.0,
          startDate: '2025-02-01',
          daysActive: 28,
          totalDays: 60,
          earnedSoFarUsd: 8400,
          status: 'active',
          txHash: 'e3a1...99bc',
        }
      ],
      withdrawals: [
        {
          id: 'wd-801',
          amountUsd: 4200,
          amountCrypto: 0.045,
          currency: 'BTC',
          network: 'Bitcoin Native',
          destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          timestamp: '2025-02-20 14:22:01',
          status: 'completed',
          txHash: '7c8a...12dd',
        },
        {
          id: 'wd-802',
          amountUsd: 4200,
          amountCrypto: 4200,
          currency: 'USDT',
          network: 'TRON TRC-20',
          destinationAddress: 'TX4891ZqPX99a8bVcx7mKnQw7y90a12x9a',
          timestamp: '2025-02-27 09:15:30',
          status: 'completed',
          txHash: '0x99a...67ef',
        }
      ]
    },
    {
      id: 'usr-admin-root',
      name: 'Administrator',
      username: 'anikachina1',
      email: 'anikachina1@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      walletBalanceUsd: 0,
      totalInvestedUsd: 0,
      totalEarnedUsd: 0,
      totalWithdrawnUsd: 0,
      referralCode: 'ADMIN-ROOT',
      referralEarningsUsd: 0,
      totalReferrals: 0,
      joinedDate: '2024-01-01',
      lastLogin: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Localhost)',
      twoFactorEnabled: false,
      kycLevel: 'Institutional Master Key',
      deposits: [],
      withdrawals: []
    }
  ];

  const initialDeposits: AdminDepositItem[] = [
    {
      id: 'dep-901',
      userId: 'usr-1001',
      userName: 'Alexander Vance',
      userEmail: 'alex.vance@investor.com',
      amountUsd: 15000,
      amountCrypto: 0.162,
      currency: 'BTC',
      network: 'Bitcoin Native',
      dailyRate: 3.0,
      txHash: '9f8b...21a0',
      timestamp: '2025-01-10 11:32:00',
      status: 'approved',
      adminNote: 'Verified on mempool block #882910'
    },
    {
      id: 'dep-902',
      userId: 'usr-1001',
      userName: 'Alexander Vance',
      userEmail: 'alex.vance@investor.com',
      amountUsd: 10000,
      amountCrypto: 3.45,
      currency: 'ETH',
      network: 'Ethereum ERC-20',
      dailyRate: 3.0,
      txHash: 'e3a1...99bc',
      timestamp: '2025-02-01 16:45:12',
      status: 'approved',
      adminNote: 'Smart contract deposit validated'
    },
    {
      id: 'dep-903',
      userId: 'usr-1003',
      userName: 'Marcus Sterling',
      userEmail: 'm.sterling@capitalgroup.co.uk',
      amountUsd: 5000,
      amountCrypto: 5000,
      currency: 'USDT',
      network: 'TRON TRC-20',
      dailyRate: 3.0,
      txHash: '8b22...fe71',
      timestamp: '2026-08-31 02:10:44',
      status: 'pending',
      adminNote: 'Awaiting admin verification'
    }
  ];

  const initialWithdrawals: AdminWithdrawalItem[] = [
    {
      id: 'wd-801',
      userId: 'usr-1001',
      userName: 'Alexander Vance',
      userEmail: 'alex.vance@investor.com',
      amountUsd: 4200,
      amountCrypto: 0.045,
      currency: 'BTC',
      network: 'Bitcoin Native',
      destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      txHash: '7c8a...12dd',
      timestamp: '2025-02-20 14:22:01',
      status: 'completed',
      adminNote: 'Broadcast via BitGo custody API'
    },
    {
      id: 'wd-803',
      userId: 'usr-1002',
      userName: 'Elena Rostova',
      userEmail: 'elena.rostova@wealthfund.ch',
      amountUsd: 2500,
      amountCrypto: 2500,
      currency: 'USDT',
      network: 'TRON TRC-20',
      destinationAddress: 'TX4891ZqPX99a8bVcx7mKnQw7y90a12x9a',
      timestamp: '2026-08-31 03:45:10',
      status: 'pending',
      adminNote: 'Pending multi-sig confirmation'
    }
  ];

  const initialAuditLogs: AdminAuditLogItem[] = [
    {
      id: 'log-001',
      timestamp: '2026-08-31 04:00:12',
      adminName: 'Root Administrator',
      action: 'INITIALIZE_SYSTEM',
      target: 'PLATFORM_BOOTSTRAP',
      previousValue: 'None',
      newValue: 'Production TLS 1.3 Active',
      severity: 'info',
      ipAddress: '127.0.0.1 (Local Node)'
    },
    {
      id: 'log-002',
      timestamp: '2026-08-31 04:15:30',
      adminName: 'Root Administrator',
      action: 'PAYMENT_METHODS_LOADED',
      target: 'DEPOSIT_GATEWAYS',
      previousValue: '0 gateways',
      newValue: '6 active crypto gateways',
      severity: 'info',
      ipAddress: '127.0.0.1 (Local Node)'
    }
  ];

  return {
    settings: DEFAULT_SETTINGS,
    paymentMethods: DEFAULT_PAYMENT_METHODS,
    investmentPlans: DEFAULT_PLANS,
    users: initialUsers,
    adminTokens: [],
    userSessions: [],
    deposits: initialDeposits,
    withdrawals: initialWithdrawals,
    auditLogs: initialAuditLogs,
  };
}

// In-memory / Sync database instance
let db = loadDatabase();

// Middleware: Authenticate User
function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const session = db.userSessions.find((s) => s.token === token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account has been suspended by compliance officer.' });
  }
  (req as any).user = user;
  (req as any).sessionToken = token;
  next();
}

// Middleware: Authenticate Admin
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const adminTokenRecord = db.adminTokens.find((t) => t.token === token);
  if (!adminTokenRecord) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin credentials.' });
  }
  (req as any).admin = adminTokenRecord;
  next();
}

// Helper: Log Admin Action
function logAdminAction(
  adminName: string,
  action: string,
  target: string,
  previousValue?: string,
  newValue?: string,
  severity: 'info' | 'warning' | 'critical' = 'info',
  ip: string = '127.0.0.1'
) {
  const logItem: AdminAuditLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    adminName: adminName || 'System Admin',
    action,
    target,
    previousValue: previousValue || '-',
    newValue: newValue || '-',
    severity,
    ipAddress: ip
  };
  db.auditLogs.unshift(logItem);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
}

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// Get public platform settings
app.get('/api/settings', (req, res) => {
  res.json({
    settings: {
      websiteName: db.settings.websiteName,
      logoText: db.settings.logoText,
      logoBadge: db.settings.logoBadge,
      favicon: db.settings.favicon,
      contactPhone: db.settings.contactPhone,
      contactAddress: db.settings.contactAddress,
      supportEmail: db.settings.supportEmail,
      announcementText: db.settings.announcementText,
      isAnnouncementActive: db.settings.isAnnouncementActive,
      maintenanceMode: db.settings.maintenanceMode,
      allowUserRegistration: db.settings.allowUserRegistration,
      dailyYieldRatePercent: db.settings.dailyYieldRatePercent,
      contractDurationDays: db.settings.contractDurationDays,
      minDepositUsd: db.settings.minDepositUsd,
      minWithdrawalUsd: db.settings.minWithdrawalUsd,
      tradingBotState: db.settings.tradingBotState,
      totalAumUsd: db.settings.totalAumUsd,
      hotWalletBalanceUsd: db.settings.hotWalletBalanceUsd,
      supportedCurrencies: db.settings.supportedCurrencies,
    }
  });
});

// Get active payment methods for deposit page (No secret keys, live updated wallet addresses)
app.get('/api/payment-methods', (req, res) => {
  const activeMethods = db.paymentMethods.filter((pm) => pm.isActive);
  res.json({ paymentMethods: activeMethods });
});

// Get active investment plans
app.get('/api/plans', (req, res) => {
  const activePlans = db.investmentPlans.filter((p) => p.isActive);
  res.json({ plans: activePlans });
});

// ==========================================
// 2. USER AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, referralCode } = req.body || {};

    if (!db.settings.allowUserRegistration) {
      return res.status(403).json({ error: 'New user registrations are currently paused by administrator.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existingEmail = db.users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    let baseUsername = (username || cleanEmail.split('@')[0] || 'investor').toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!baseUsername) baseUsername = 'investor';
    
    let cleanUsername = baseUsername;
    let counter = 1;
    while (db.users.some((u) => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      cleanUsername = `${baseUsername}${counter}`;
      counter++;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUserId = `usr-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)}`;
    const userRefCode = `WIN-${Math.floor(1000 + Math.random() * 9000)}-${cleanUsername.substring(0, 2).toUpperCase()}`;

    // STRICT SECURITY: Role is ALWAYS 'user' for public registration. Normal users cannot select 'admin'.
    const newUser: UserAccount & { passwordHash: string } = {
      id: newUserId,
      name: String(name).trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      role: 'user', // Forced to user
      status: 'active',
      walletBalanceUsd: 0.00,
      totalInvestedUsd: 0.00,
      totalEarnedUsd: 0.00,
      totalWithdrawnUsd: 0.00,
      referralCode: userRefCode,
      referralEarningsUsd: 0.00,
      totalReferrals: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      ipAddress: req.ip || 'Remote Client',
      twoFactorEnabled: false,
      kycLevel: 'Level 1 Registered',
      deposits: [],
      withdrawals: [],
    };

    db.users.push(newUser);
    ensureUserTransactions(newUser);

    // Generate session token
    const token = `usr_tok_${crypto.randomBytes(32).toString('hex')}`;
    db.userSessions.push({
      token,
      userId: newUserId,
      createdAt: new Date().toISOString()
    });

    saveDatabase(db);

    // Safe response without passwordHash
    const { passwordHash: _, ...safeProfile } = newUser;
    return res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: safeProfile
    });
  } catch (err: any) {
    console.error('Error in /api/auth/register:', err);
    return res.status(500).json({ error: err?.message || 'Server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, email, username, password } = req.body || {};
    const loginKey = (identifier || email || username || '').trim().toLowerCase();

    if (!loginKey || !password) {
      return res.status(400).json({ error: 'Please enter your email/username and password.' });
    }

    const user = db.users.find((u) => 
      (u.email && u.email.toLowerCase() === loginKey) || 
      (u.username && u.username.toLowerCase() === loginKey)
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Please contact institutional support.' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    user.ipAddress = req.ip || 'Remote Client';
    ensureUserTransactions(user);

    // Generate user session token
    const token = `usr_tok_${crypto.randomBytes(32).toString('hex')}`;
    db.userSessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString()
    });

    saveDatabase(db);

    const { passwordHash: _, ...safeProfile } = user;
    return res.json({
      message: 'Login successful.',
      token,
      user: safeProfile
    });
  } catch (err: any) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).json({ error: err?.message || 'Server error during login.' });
  }
});

function ensureUserTransactions(user: UserAccount) {
  if (!user.deposits) user.deposits = [];
  if (!user.withdrawals) user.withdrawals = [];
}

// Helper to calculate continuous real-time yield accrual
function recalculateUserYield(user: any) {
  if (!user || !user.deposits || !Array.isArray(user.deposits)) return;
  const now = Date.now();

  let totalNewYield = 0;
  user.deposits.forEach((dep: any) => {
    if (dep.status === 'approved' || dep.status === 'active') {
      const startTime = dep._lastYieldCalcTime || (dep.processedAt ? new Date(dep.processedAt).getTime() : now);
      const elapsedSeconds = Math.max(0, (now - startTime) / 1000);

      if (elapsedSeconds > 0) {
        const dailyPercent = dep.dailyYieldPercent || 3.0;
        const profitGained = (dep.amountUsd * (dailyPercent / 100) / 86400) * elapsedSeconds;

        if (profitGained > 0) {
          dep.earnedSoFarUsd = Number(((dep.earnedSoFarUsd || 0) + profitGained).toFixed(6));
          totalNewYield += profitGained;
        }
      }
      dep._lastYieldCalcTime = now;

      const initTime = new Date(dep.processedAt || dep.startDate || user.joinedDate || now).getTime();
      dep.daysActive = Math.min(dep.totalDays || 60, Math.floor((now - initTime) / (1000 * 60 * 60 * 24)));
    }
  });

  if (totalNewYield > 0) {
    user.totalEarnedUsd = Number(((user.totalEarnedUsd || 0) + totalNewYield).toFixed(4));
    user.walletBalanceUsd = Number(((user.walletBalanceUsd || 0) + totalNewYield).toFixed(4));
  }
}

// Get current logged-in user profile
app.get('/api/auth/me', authenticateUser, (req, res) => {
  const user = (req as any).user;
  ensureUserTransactions(user);
  recalculateUserYield(user);
  saveDatabase(db);

  const { passwordHash: _, ...safeProfile } = user;
  res.json({ user: safeProfile });
});

// User sync earnings / state
app.put('/api/user/sync', authenticateUser, (req, res) => {
  const user = (req as any).user;
  ensureUserTransactions(user);
  recalculateUserYield(user);
  saveDatabase(db);

  const { passwordHash: _, ...safeProfile } = user;
  res.json({ message: 'Synced successfully', user: safeProfile });
});

// User Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    db.userSessions = db.userSessions.filter((s) => s.token !== token);
    saveDatabase(db);
  }
  res.json({ message: 'Logged out successfully.' });
});

// User Forgot Password (Safe recovery flow without revealing email existence)
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  // Always return generic success message to prevent user enumeration
  res.json({
    message: 'If an account exists with this email address, password reset instructions have been dispatched.'
  });
});

// User Change Password
app.post('/api/auth/change-password', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Please provide both current and new password.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(newPassword, salt);
  saveDatabase(db);

  res.json({ message: 'Password updated successfully.' });
});

// User Submit Deposit
app.post('/api/user/deposits', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const { amountUsd, paymentMethodId, txHash } = req.body;

  if (!amountUsd || amountUsd < db.settings.minDepositUsd) {
    return res.status(400).json({ error: `Minimum deposit is $${db.settings.minDepositUsd.toFixed(2)}.` });
  }

  const paymentMethod = db.paymentMethods.find((pm) => pm.id === paymentMethodId && pm.isActive);
  if (!paymentMethod) {
    return res.status(400).json({ error: 'Selected payment method is currently inactive or not found.' });
  }

  const depositId = `dep-${Date.now().toString().slice(-6)}`;
  const cleanTx = (txHash || '').trim() || `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 8)}`;

  const newAdminDeposit: AdminDepositItem = {
    id: depositId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    amountUsd: Number(amountUsd),
    amountCrypto: Number((amountUsd / 92450).toFixed(6)),
    currency: paymentMethod.symbol,
    network: paymentMethod.network,
    dailyRate: db.settings.dailyYieldRatePercent,
    txHash: cleanTx,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'pending',
    adminNote: 'Submitted by user for blockchain verification'
  };

  db.deposits.unshift(newAdminDeposit);

  // Add to user's personal deposits
  const newUserDeposit: UserDeposit = {
    id: depositId,
    amountUsd: Number(amountUsd),
    amountCrypto: Number((amountUsd / 92450).toFixed(6)),
    currency: paymentMethod.symbol,
    network: paymentMethod.network,
    dailyYieldPercent: db.settings.dailyYieldRatePercent,
    startDate: new Date().toISOString().split('T')[0],
    daysActive: 0,
    totalDays: db.settings.contractDurationDays,
    earnedSoFarUsd: 0,
    status: 'pending',
    txHash: cleanTx,
    paymentMethodId: paymentMethod.id,
    adminNote: 'Pending admin validation'
  };

  user.deposits.unshift(newUserDeposit);
  saveDatabase(db);

  res.status(201).json({
    message: 'Deposit transaction submitted successfully. Awaiting blockchain confirmation.',
    deposit: newUserDeposit
  });
});

// User Request Withdrawal
app.post('/api/user/withdrawals', authenticateUser, (req, res) => {
  const user = (req as any).user;
  const { amountUsd, destinationAddress, currency, network } = req.body;

  if (!amountUsd || amountUsd < db.settings.minWithdrawalUsd) {
    return res.status(400).json({ error: `Minimum withdrawal is $${db.settings.minWithdrawalUsd.toFixed(2)}.` });
  }

  if (amountUsd > db.settings.maxWithdrawalUsd) {
    return res.status(400).json({ error: `Maximum withdrawal per request is $${db.settings.maxWithdrawalUsd.toLocaleString()}.` });
  }

  if (!destinationAddress || destinationAddress.trim().length < 10) {
    return res.status(400).json({ error: 'Please enter a valid crypto destination address.' });
  }

  if (user.walletBalanceUsd < amountUsd) {
    return res.status(400).json({ error: `Insufficient wallet balance. Available: $${user.walletBalanceUsd.toFixed(2)}` });
  }

  // Deduct from wallet balance
  user.walletBalanceUsd -= Number(amountUsd);

  const withdrawalId = `wd-${Date.now().toString().slice(-6)}`;
  const newAdminWithdrawal: AdminWithdrawalItem = {
    id: withdrawalId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    amountUsd: Number(amountUsd),
    amountCrypto: Number((amountUsd / 92450).toFixed(6)),
    currency: currency || 'BTC',
    network: network || 'Native',
    destinationAddress: destinationAddress.trim(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'pending',
    adminNote: 'Queued for compliance review'
  };

  db.withdrawals.unshift(newAdminWithdrawal);

  const newUserWithdrawal: UserWithdrawal = {
    id: withdrawalId,
    amountUsd: Number(amountUsd),
    amountCrypto: Number((amountUsd / 92450).toFixed(6)),
    currency: currency || 'BTC',
    network: network || 'Native',
    destinationAddress: destinationAddress.trim(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'pending'
  };

  user.withdrawals.unshift(newUserWithdrawal);
  saveDatabase(db);

  res.status(201).json({
    message: 'Withdrawal request submitted successfully.',
    withdrawal: newUserWithdrawal,
    remainingBalance: user.walletBalanceUsd
  });
});

// ==========================================
// 3. ADMIN AUTHENTICATION & MASTER GATEWAY
// ==========================================

// Admin Login (Requires Master Key or Password)
app.post('/api/admin/login', (req, res) => {
  const { username, email, password, passkey } = req.body;
  const adminKey = (passkey || password || '').trim();
  const inputId = (email || username || '').trim().toLowerCase();

  // Find admin record
  let adminUser = db.users.find((u) => u.role === 'admin');
  if (!adminUser) {
    const salt = bcrypt.genSaltSync(10);
    adminUser = {
      id: 'usr-admin-root',
      name: 'Administrator',
      username: 'anikachina1',
      email: 'anikachina1@gmail.com',
      passwordHash: bcrypt.hashSync('01991234', salt),
      role: 'admin',
      status: 'active',
      walletBalanceUsd: 0,
      totalInvestedUsd: 0,
      totalEarnedUsd: 0,
      totalWithdrawnUsd: 0,
      referralCode: 'ADMIN-ROOT',
      referralEarningsUsd: 0,
      totalReferrals: 0,
      joinedDate: '2024-01-01',
      lastLogin: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Localhost)',
      twoFactorEnabled: false,
      kycLevel: 'Institutional Master Key',
      deposits: [],
      withdrawals: []
    };
    db.users.push(adminUser);
    saveDatabase(db);
  }

  // Validate Admin Operator ID strictly
  if (!inputId || (inputId !== 'anikachina1@gmail.com' && inputId !== 'anikachina1')) {
    logAdminAction('UNAUTHORIZED_ATTEMPT', 'LOGIN_FAILED', 'ADMIN_GATEWAY', `Unauthorized Operator ID attempt: ${inputId || 'BLANK'}`, '-', 'warning', req.ip || '127.0.0.1');
    return res.status(401).json({ error: 'Access Denied: Invalid Admin Operator ID.' });
  }

  if (!adminKey) {
    return res.status(401).json({ error: 'Access Denied: Master Security Passkey is required.' });
  }

  // Verify with admin password hash or direct master passkey
  let isValid = false;
  if (adminUser && adminUser.passwordHash) {
    isValid = bcrypt.compareSync(adminKey, adminUser.passwordHash) || adminKey === '01991234';
  } else {
    isValid = adminKey === '01991234';
  }

  if (!isValid) {
    logAdminAction('UNAUTHORIZED_ATTEMPT', 'LOGIN_FAILED', 'ADMIN_GATEWAY', 'Failed passkey attempt for anikachina1@gmail.com', '-', 'warning', req.ip || '127.0.0.1');
    return res.status(401).json({ error: 'Access Denied: Invalid Master Security Passkey.' });
  }

  // Generate Admin Session Token
  const token = `adm_sec_${crypto.randomBytes(40).toString('hex')}`;
  const adminId = adminUser ? adminUser.id : 'usr-admin-root';
  const adminName = adminUser ? adminUser.name : 'Administrator';
  const adminEmail = adminUser ? adminUser.email : 'anikachina1@gmail.com';

  db.adminTokens.push({
    token,
    adminId,
    adminName,
    createdAt: new Date().toISOString()
  });

  logAdminAction(adminName, 'ADMIN_LOGIN', 'ADMIN_DASHBOARD', 'Session Started', 'Authorized TLS 1.3', 'info', req.ip || '127.0.0.1');
  saveDatabase(db);

  res.json({
    message: 'Institutional Admin Session Established.',
    token,
    admin: {
      id: adminId,
      name: adminName,
      email: adminEmail,
      role: 'admin'
    }
  });
});

// Check Admin Token Validity
app.get('/api/admin/me', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const adminUser = db.users.find((u) => u.role === 'admin');
  res.json({
    admin: {
      id: admin.adminId,
      name: adminUser ? adminUser.name : admin.adminName,
      email: adminUser ? adminUser.email : 'anikachina1@gmail.com',
      role: 'admin'
    }
  });
});

// Update Admin Security Credentials (Email, Username, Master Password)
app.post('/api/admin/change-credentials', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { currentPassword, newEmail, newUsername, newPassword } = req.body;

  let adminUser = db.users.find((u) => u.role === 'admin');
  if (!adminUser) {
    adminUser = {
      id: 'usr-admin-root',
      name: 'Administrator',
      username: 'anikachina1',
      email: 'anikachina1@gmail.com',
      passwordHash: bcrypt.hashSync('01991234', 10),
      role: 'admin',
      status: 'active',
      walletBalanceUsd: 0,
      totalInvestedUsd: 0,
      totalEarnedUsd: 0,
      totalWithdrawnUsd: 0,
      referralCode: 'ADMIN-ROOT',
      referralEarningsUsd: 0,
      totalReferrals: 0,
      joinedDate: '2024-01-01',
      lastLogin: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Localhost)',
      twoFactorEnabled: false,
      kycLevel: 'Institutional Master Key',
      deposits: [],
      withdrawals: []
    };
    db.users.push(adminUser);
  }

  // Verify current password if provided
  if (currentPassword && currentPassword.trim()) {
    const isCurrentValid = bcrypt.compareSync(currentPassword.trim(), adminUser.passwordHash) || currentPassword.trim() === '01991234';
    if (!isCurrentValid) {
      logAdminAction(admin.adminName, 'ADMIN_CREDENTIAL_CHANGE_FAILED', 'SECURITY_SETTINGS', 'Invalid Current Password entered', '-', 'warning', req.ip || '127.0.0.1');
      return res.status(400).json({ error: 'Current password verification failed. Please enter your valid current password.' });
    }
  }

  if (newEmail && newEmail.trim()) {
    adminUser.email = newEmail.trim().toLowerCase();
  }

  if (newUsername && newUsername.trim()) {
    adminUser.name = newUsername.trim();
    adminUser.username = newUsername.trim().toLowerCase().replace(/\s+/g, '_');
  }

  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }
    adminUser.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
  }

  adminUser.lastLogin = new Date().toISOString();
  saveDatabase(db);

  logAdminAction(
    admin.adminName,
    'ADMIN_CREDENTIALS_UPDATED',
    'SECURITY_SETTINGS',
    `Admin updated credentials: Email=${adminUser.email}, Name=${adminUser.name}`,
    `Password Updated: ${Boolean(newPassword)}`,
    'info',
    req.ip || '127.0.0.1'
  );

  res.json({
    message: 'Admin credentials updated successfully.',
    admin: {
      id: adminUser.id,
      name: adminUser.name,
      username: adminUser.username,
      email: adminUser.email,
      role: 'admin'
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    db.adminTokens = db.adminTokens.filter((t) => t.token !== token);
    saveDatabase(db);
  }
  res.json({ message: 'Admin session terminated.' });
});

// ==========================================
// 4. ADMIN PAYMENT SETTINGS (CRUD)
// ==========================================

// Get all payment methods (Admin view)
app.get('/api/admin/payment-methods', authenticateAdmin, (req, res) => {
  res.json({ paymentMethods: db.paymentMethods });
});

// Add new payment method
app.post('/api/admin/payment-methods', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { name, network, coin, symbol, walletAddress, qrCodeUrl, minDepositUsd, isActive, instructions, icon } = req.body;

  if (!name || !network || !coin || !walletAddress) {
    return res.status(400).json({ error: 'Name, network, coin and wallet address are required.' });
  }

  const newMethod: PaymentMethod = {
    id: `pm-${symbol.toLowerCase()}-${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    network: network.trim(),
    coin: coin.trim(),
    symbol: (symbol || 'USDT').toUpperCase().trim(),
    walletAddress: walletAddress.trim(),
    qrCodeUrl: qrCodeUrl || '',
    minDepositUsd: Number(minDepositUsd) || 10,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    instructions: instructions || 'Send crypto to this wallet address.',
    icon: icon || 'crypto',
    confirmationsRequired: 2,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: admin.adminName
  };

  db.paymentMethods.push(newMethod);
  logAdminAction(
    admin.adminName, 
    'ADD_PAYMENT_METHOD', 
    `${newMethod.name} (${newMethod.network})`, 
    'None', 
    `Address: ${newMethod.walletAddress} | Min: $${newMethod.minDepositUsd}`, 
    'info', 
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.status(201).json({ message: 'Payment method created successfully.', paymentMethod: newMethod });
});

// Update payment method (e.g. Change Wallet Address, Min Deposit, Toggle Active)
app.put('/api/admin/payment-methods/:id', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const methodId = req.params.id;
  const existing = db.paymentMethods.find((pm) => pm.id === methodId);

  if (!existing) {
    return res.status(404).json({ error: 'Payment method not found.' });
  }

  const prevSnapshot = `Address: ${existing.walletAddress} | Min: $${existing.minDepositUsd} | Active: ${existing.isActive}`;

  const { name, network, coin, symbol, walletAddress, qrCodeUrl, minDepositUsd, isActive, instructions } = req.body;

  if (name !== undefined) existing.name = name.trim();
  if (network !== undefined) existing.network = network.trim();
  if (coin !== undefined) existing.coin = coin.trim();
  if (symbol !== undefined) existing.symbol = symbol.toUpperCase().trim();
  if (walletAddress !== undefined && walletAddress.trim()) existing.walletAddress = walletAddress.trim();
  if (qrCodeUrl !== undefined) existing.qrCodeUrl = qrCodeUrl;
  if (minDepositUsd !== undefined) existing.minDepositUsd = Number(minDepositUsd);
  if (isActive !== undefined) existing.isActive = Boolean(isActive);
  if (instructions !== undefined) existing.instructions = instructions;

  existing.updatedAt = new Date().toISOString();
  existing.lastUpdatedBy = admin.adminName;

  const newSnapshot = `Address: ${existing.walletAddress} | Min: $${existing.minDepositUsd} | Active: ${existing.isActive}`;

  logAdminAction(
    admin.adminName,
    'UPDATE_PAYMENT_METHOD',
    `${existing.name} (${existing.network})`,
    prevSnapshot,
    newSnapshot,
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Payment method updated successfully.', paymentMethod: existing });
});

// Delete payment method
app.delete('/api/admin/payment-methods/:id', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const methodId = req.params.id;
  const existing = db.paymentMethods.find((pm) => pm.id === methodId);

  if (!existing) {
    return res.status(404).json({ error: 'Payment method not found.' });
  }

  db.paymentMethods = db.paymentMethods.filter((pm) => pm.id !== methodId);
  logAdminAction(
    admin.adminName,
    'DELETE_PAYMENT_METHOD',
    `${existing.name} (${existing.network})`,
    `Address: ${existing.walletAddress}`,
    'DELETED',
    'critical',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Payment method deleted successfully.' });
});

// ==========================================
// 5. ADMIN INVESTMENT PLANS (CRUD)
// ==========================================

// Get all plans (Admin)
app.get('/api/admin/plans', authenticateAdmin, (req, res) => {
  res.json({ plans: db.investmentPlans });
});

// Add new plan
app.post('/api/admin/plans', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { name, badge, dailyYieldPercent, minAmountUsd, maxAmountUsd, durationDays, profitType, returnPrincipal, isActive, description, features } = req.body;

  if (!name || !dailyYieldPercent || !durationDays) {
    return res.status(400).json({ error: 'Plan name, daily yield %, and duration days are required.' });
  }

  const newPlan: InvestmentPlan = {
    id: `plan-${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    badge: badge || '',
    dailyYieldPercent: Number(dailyYieldPercent),
    minAmountUsd: Number(minAmountUsd) || 10,
    maxAmountUsd: Number(maxAmountUsd) || 100000,
    durationDays: Number(durationDays),
    profitType: profitType || 'daily_withdrawable',
    returnPrincipal: returnPrincipal !== undefined ? Boolean(returnPrincipal) : true,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    description: description || '',
    features: Array.isArray(features) ? features : [features || '24/7 Daily Returns']
  };

  db.investmentPlans.push(newPlan);
  logAdminAction(
    admin.adminName,
    'ADD_INVESTMENT_PLAN',
    newPlan.name,
    'None',
    `Daily: ${newPlan.dailyYieldPercent}% | Duration: ${newPlan.durationDays}d | Min: $${newPlan.minAmountUsd}`,
    'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.status(201).json({ message: 'Investment plan added successfully.', plan: newPlan });
});

// Update plan
app.put('/api/admin/plans/:id', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const planId = req.params.id;
  const existing = db.investmentPlans.find((p) => p.id === planId);

  if (!existing) {
    return res.status(404).json({ error: 'Investment plan not found.' });
  }

  const prevSnapshot = `${existing.dailyYieldPercent}% daily for ${existing.durationDays}d (Active: ${existing.isActive})`;

  const { name, badge, dailyYieldPercent, minAmountUsd, maxAmountUsd, durationDays, profitType, returnPrincipal, isActive, description, features } = req.body;

  if (name !== undefined) existing.name = name;
  if (badge !== undefined) existing.badge = badge;
  if (dailyYieldPercent !== undefined) existing.dailyYieldPercent = Number(dailyYieldPercent);
  if (minAmountUsd !== undefined) existing.minAmountUsd = Number(minAmountUsd);
  if (maxAmountUsd !== undefined) existing.maxAmountUsd = Number(maxAmountUsd);
  if (durationDays !== undefined) existing.durationDays = Number(durationDays);
  if (profitType !== undefined) existing.profitType = profitType;
  if (returnPrincipal !== undefined) existing.returnPrincipal = Boolean(returnPrincipal);
  if (isActive !== undefined) existing.isActive = Boolean(isActive);
  if (description !== undefined) existing.description = description;
  if (features !== undefined) existing.features = features;

  const newSnapshot = `${existing.dailyYieldPercent}% daily for ${existing.durationDays}d (Active: ${existing.isActive})`;

  logAdminAction(
    admin.adminName,
    'UPDATE_INVESTMENT_PLAN',
    existing.name,
    prevSnapshot,
    newSnapshot,
    'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Investment plan updated successfully.', plan: existing });
});

// Delete plan
app.delete('/api/admin/plans/:id', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const planId = req.params.id;
  const existing = db.investmentPlans.find((p) => p.id === planId);

  if (!existing) {
    return res.status(404).json({ error: 'Investment plan not found.' });
  }

  db.investmentPlans = db.investmentPlans.filter((p) => p.id !== planId);
  logAdminAction(
    admin.adminName,
    'DELETE_INVESTMENT_PLAN',
    existing.name,
    `${existing.dailyYieldPercent}% daily`,
    'DELETED',
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Investment plan deleted.' });
});

// ==========================================
// 6. ADMIN PLATFORM SETTINGS
// ==========================================

// Get full platform settings (Admin)
app.get('/api/admin/settings', authenticateAdmin, (req, res) => {
  res.json({ settings: db.settings });
});

// Update platform settings
app.put('/api/admin/settings', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const updates = req.body;

  const prevSettings = JSON.stringify(db.settings);
  db.settings = {
    ...db.settings,
    ...updates
  };

  logAdminAction(
    admin.adminName,
    'UPDATE_PLATFORM_SETTINGS',
    'GLOBAL_CONFIG',
    'Modified platform parameters',
    `Maintenance: ${db.settings.maintenanceMode} | Yield: ${db.settings.dailyYieldRatePercent}% | Bot: ${db.settings.tradingBotState}`,
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Platform settings updated successfully.', settings: db.settings });
});

// ==========================================
// 7. ADMIN USER MANAGEMENT
// ==========================================

// List users with search & filters
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  const { search, role, status } = req.query;
  
  let list = db.users.map((u) => {
    recalculateUserYield(u);
    const { passwordHash: _, ...safeUser } = u;
    return {
      ...safeUser,
      activeContractsCount: u.deposits.filter((d) => d.status === 'active' || d.status === 'approved').length
    };
  });

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter((u) => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) || 
      u.id.toLowerCase().includes(q)
    );
  }

  if (role && role !== 'all') {
    list = list.filter((u) => u.role === role);
  }

  if (status && status !== 'all') {
    list = list.filter((u) => u.status === status);
  }

  res.json({ users: list });
});

// Get individual user profile with transactions
app.get('/api/admin/users/:id', authenticateAdmin, (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update user status (Activate / Suspend)
app.put('/api/admin/users/:id/status', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { status, role } = req.body;
  const prevStatus = user.status;

  if (status) user.status = status;
  if (role) user.role = role;

  logAdminAction(
    admin.adminName,
    'USER_STATUS_CHANGE',
    `${user.name} (${user.email})`,
    `Status: ${prevStatus}`,
    `Status: ${user.status} | Role: ${user.role}`,
    user.status === 'suspended' ? 'critical' : 'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  const { passwordHash: _, ...safeUser } = user;
  res.json({ message: 'User status updated successfully.', user: safeUser });
});

// Adjust user balance (Credit / Debit)
app.put('/api/admin/users/:id/balance', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { amount, actionType, note } = req.body; // actionType: 'credit' | 'debit' | 'set'
  const prevBalance = user.walletBalanceUsd;

  const numAmount = Number(amount);
  if (isNaN(numAmount)) {
    return res.status(400).json({ error: 'Invalid balance amount.' });
  }

  if (actionType === 'credit') {
    user.walletBalanceUsd += numAmount;
  } else if (actionType === 'debit') {
    user.walletBalanceUsd = Math.max(0, user.walletBalanceUsd - numAmount);
  } else {
    user.walletBalanceUsd = numAmount;
  }

  logAdminAction(
    admin.adminName,
    'BALANCE_ADJUSTMENT',
    `${user.name} (${user.email})`,
    `$${prevBalance.toFixed(2)}`,
    `$${user.walletBalanceUsd.toFixed(2)} [${note || 'Admin adjustment'}]`,
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({
    message: `User balance adjusted. New balance: $${user.walletBalanceUsd.toFixed(2)}`,
    newBalance: user.walletBalanceUsd
  });
});

// Reset user password (Secure admin reset without revealing plaintext)
app.post('/api/admin/users/:id/reset-password', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { newPassword } = req.body;
  const passToSet = newPassword || `Winvest@${Math.floor(1000 + Math.random() * 9000)}`;

  const salt = bcrypt.genSaltSync(10);
  user.passwordHash = bcrypt.hashSync(passToSet, salt);

  logAdminAction(
    admin.adminName,
    'PASSWORD_RESET_ADMIN',
    `${user.name} (${user.email})`,
    'Encrypted Hash',
    'Reset via Admin Gateway',
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({
    message: 'User password successfully reset.',
    temporaryPassword: passToSet // returned once for admin to deliver to client
  });
});

// ==========================================
// 8. ADMIN DEPOSIT MANAGEMENT
// ==========================================

// Get all deposits
app.get('/api/admin/deposits', authenticateAdmin, (req, res) => {
  res.json({ deposits: db.deposits });
});

// Approve deposit
app.post('/api/admin/deposits/:id/approve', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const depositId = req.params.id;
  const adminNote = req.body.adminNote || 'Verified on blockchain explorer';

  const deposit = db.deposits.find((d) => d.id === depositId);
  if (!deposit) {
    return res.status(404).json({ error: 'Deposit request not found.' });
  }

  deposit.status = 'approved';
  deposit.adminNote = adminNote;
  deposit.processedAt = new Date().toISOString();
  deposit.processedBy = admin.adminName;

  // Credit user's investment contracts and total invested
  const user = db.users.find((u) => u.id === deposit.userId);
  if (user) {
    user.totalInvestedUsd += deposit.amountUsd;

    // Check if user has this deposit in their list
    const userDep = user.deposits.find((d) => d.id === depositId);
    if (userDep) {
      userDep.status = 'approved';
      userDep.adminNote = adminNote;
      userDep.processedAt = new Date().toISOString();
      (userDep as any)._lastYieldCalcTime = Date.now();
    } else {
      user.deposits.unshift({
        id: deposit.id,
        amountUsd: deposit.amountUsd,
        amountCrypto: deposit.amountCrypto,
        currency: deposit.currency,
        network: deposit.network,
        dailyYieldPercent: deposit.dailyRate || 3.0,
        startDate: new Date().toISOString().split('T')[0],
        daysActive: 0,
        totalDays: db.settings.contractDurationDays || 60,
        earnedSoFarUsd: 0,
        status: 'approved',
        txHash: deposit.txHash,
        adminNote: adminNote,
        _lastYieldCalcTime: Date.now()
      } as any);
    }
  }

  logAdminAction(
    admin.adminName,
    'APPROVE_DEPOSIT',
    `Deposit #${deposit.id} - ${deposit.userName}`,
    'pending',
    `approved ($${deposit.amountUsd.toLocaleString()} ${deposit.currency})`,
    'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Deposit approved and user contract activated.', deposit });
});

// Reject deposit
app.post('/api/admin/deposits/:id/reject', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const depositId = req.params.id;
  const adminNote = req.body.adminNote || 'Transaction hash invalid or unconfirmed';

  const deposit = db.deposits.find((d) => d.id === depositId);
  if (!deposit) {
    return res.status(404).json({ error: 'Deposit request not found.' });
  }

  deposit.status = 'rejected';
  deposit.adminNote = adminNote;
  deposit.processedAt = new Date().toISOString();
  deposit.processedBy = admin.adminName;

  const user = db.users.find((u) => u.id === deposit.userId);
  if (user) {
    const userDep = user.deposits.find((d) => d.id === depositId);
    if (userDep) {
      userDep.status = 'rejected';
      userDep.adminNote = adminNote;
    }
  }

  logAdminAction(
    admin.adminName,
    'REJECT_DEPOSIT',
    `Deposit #${deposit.id} - ${deposit.userName}`,
    'pending',
    `rejected: ${adminNote}`,
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Deposit rejected.', deposit });
});

// ==========================================
// 9. ADMIN WITHDRAWAL MANAGEMENT
// ==========================================

// Get all withdrawals
app.get('/api/admin/withdrawals', authenticateAdmin, (req, res) => {
  res.json({ withdrawals: db.withdrawals });
});

// Approve withdrawal
app.post('/api/admin/withdrawals/:id/approve', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const withdrawalId = req.params.id;
  const { txHash, adminNote } = req.body;

  const withdrawal = db.withdrawals.find((w) => w.id === withdrawalId);
  if (!withdrawal) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  withdrawal.status = 'completed';
  withdrawal.txHash = txHash || `tx-${Date.now().toString(36)}-payout`;
  withdrawal.adminNote = adminNote || 'Broadcasted to blockchain';
  withdrawal.processedAt = new Date().toISOString();
  withdrawal.processedBy = admin.adminName;

  const user = db.users.find((u) => u.id === withdrawal.userId);
  if (user) {
    user.totalWithdrawnUsd += withdrawal.amountUsd;
    const userWd = user.withdrawals.find((w) => w.id === withdrawalId);
    if (userWd) {
      userWd.status = 'completed';
      userWd.txHash = withdrawal.txHash;
    }
  }

  logAdminAction(
    admin.adminName,
    'APPROVE_WITHDRAWAL',
    `Withdrawal #${withdrawal.id} - ${withdrawal.userName}`,
    'pending',
    `completed ($${withdrawal.amountUsd.toLocaleString()} to ${withdrawal.destinationAddress.substring(0, 8)}...)`,
    'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Withdrawal approved and settlement broadcasted.', withdrawal });
});

// Reject withdrawal (Refunds held balance back to user)
app.post('/api/admin/withdrawals/:id/reject', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const withdrawalId = req.params.id;
  const adminNote = req.body.adminNote || 'Address verification failed or compliance hold';

  const withdrawal = db.withdrawals.find((w) => w.id === withdrawalId);
  if (!withdrawal) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  withdrawal.status = 'rejected';
  withdrawal.adminNote = adminNote;
  withdrawal.processedAt = new Date().toISOString();
  withdrawal.processedBy = admin.adminName;

  // Refund wallet balance
  const user = db.users.find((u) => u.id === withdrawal.userId);
  if (user) {
    user.walletBalanceUsd += withdrawal.amountUsd;
    const userWd = user.withdrawals.find((w) => w.id === withdrawalId);
    if (userWd) {
      userWd.status = 'rejected';
      userWd.adminNote = adminNote;
    }
  }

  logAdminAction(
    admin.adminName,
    'REJECT_WITHDRAWAL',
    `Withdrawal #${withdrawal.id} - ${withdrawal.userName}`,
    'pending',
    `rejected ($${withdrawal.amountUsd.toFixed(2)} refunded): ${adminNote}`,
    'warning',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: 'Withdrawal rejected and balance refunded to user.', withdrawal });
});

// Batch approve withdrawals
app.post('/api/admin/withdrawals/batch-approve', authenticateAdmin, (req, res) => {
  const admin = (req as any).admin;
  const { withdrawalIds } = req.body;

  if (!Array.isArray(withdrawalIds) || withdrawalIds.length === 0) {
    return res.status(400).json({ error: 'No withdrawal IDs provided.' });
  }

  let approvedCount = 0;
  withdrawalIds.forEach((id) => {
    const w = db.withdrawals.find((item) => item.id === id && item.status === 'pending');
    if (w) {
      w.status = 'completed';
      w.txHash = `batch-tx-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      w.processedAt = new Date().toISOString();
      w.processedBy = admin.adminName;
      w.adminNote = 'Batch multi-sig broadcast';

      const user = db.users.find((u) => u.id === w.userId);
      if (user) {
        user.totalWithdrawnUsd += w.amountUsd;
        const userWd = user.withdrawals.find((item) => item.id === id);
        if (userWd) {
          userWd.status = 'completed';
          userWd.txHash = w.txHash;
        }
      }
      approvedCount++;
    }
  });

  logAdminAction(
    admin.adminName,
    'BATCH_APPROVE_WITHDRAWALS',
    `${approvedCount} Withdrawals`,
    'pending',
    'completed',
    'info',
    req.ip || '127.0.0.1'
  );
  saveDatabase(db);

  res.json({ message: `Successfully batch processed and approved ${approvedCount} withdrawals.` });
});

// ==========================================
// 10. ADMIN AUDIT LOGS
// ==========================================

// Get immutable audit logs
app.get('/api/admin/audit-logs', authenticateAdmin, (req, res) => {
  res.json({ auditLogs: db.auditLogs });
});

// ==========================================
// 11. VITE INTEGRATION & SERVER LAUNCH
// ==========================================

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WINVEST] Full-stack Server listening at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
