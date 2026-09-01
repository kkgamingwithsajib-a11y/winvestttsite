import { MarketPair, LiveTransaction, TradeSignal, FaqItem, UserAccount } from '../types';

export const INITIAL_MARKET_PAIRS: MarketPair[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 92450.80, change24h: 3.42, high24h: 93800.00, low24h: 89400.00, volume24h: '$48.2B', icon: '₿' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3415.60, change24h: 2.15, high24h: 3490.00, low24h: 3310.00, volume24h: '$22.6B', icon: 'Ξ' },
  { symbol: 'SOL/USD', name: 'Solana', price: 198.40, change24h: 5.80, high24h: 204.50, low24h: 186.20, volume24h: '$8.4B', icon: '◎' },
  { symbol: 'BNB/USD', name: 'BNB', price: 645.20, change24h: 1.10, high24h: 652.00, low24h: 638.00, volume24h: '$2.1B', icon: '◈' },
  { symbol: 'XRP/USD', name: 'XRP', price: 2.45, change24h: 4.30, high24h: 2.58, low24h: 2.32, volume24h: '$4.9B', icon: '✕' },
  { symbol: 'ADA/USD', name: 'Cardano', price: 0.88, change24h: -0.95, high24h: 0.92, low24h: 0.85, volume24h: '$1.3B', icon: '₳' },
];

export const INITIAL_TRANSACTIONS: LiveTransaction[] = [
  { id: 'tx-1', type: 'payout', username: 'Alex_V***', amountUsd: 1450.00, amountBtc: 0.01568, txHash: 'f48c...89a2', timestamp: '2 mins ago', status: 'confirmed', timeAgo: '2m' },
  { id: 'tx-2', type: 'deposit', username: 'Klaus_M***', amountUsd: 5000.00, amountBtc: 0.05408, txHash: '3b91...c47e', timestamp: '4 mins ago', status: 'confirmed', timeAgo: '4m' },
  { id: 'tx-3', type: 'payout', username: 'Satoshi_9***', amountUsd: 320.50, amountBtc: 0.00346, txHash: '8e12...b65d', timestamp: '6 mins ago', status: 'confirmed', timeAgo: '6m' },
  { id: 'tx-4', type: 'deposit', username: 'Elena_R***', amountUsd: 12500.00, amountBtc: 0.13520, txHash: 'a710...df38', timestamp: '8 mins ago', status: 'confirmed', timeAgo: '8m' },
  { id: 'tx-5', type: 'payout', username: 'David_K***', amountUsd: 780.00, amountBtc: 0.00843, txHash: '1c44...99ea', timestamp: '11 mins ago', status: 'confirmed', timeAgo: '11m' },
  { id: 'tx-6', type: 'deposit', username: 'Zack_W***', amountUsd: 1000.00, amountBtc: 0.01081, txHash: 'e92f...73a1', timestamp: '14 mins ago', status: 'confirmed', timeAgo: '14m' },
  { id: 'tx-7', type: 'payout', username: 'Nadia_H***', amountUsd: 2150.00, amountBtc: 0.02325, txHash: '6d8b...321f', timestamp: '17 mins ago', status: 'confirmed', timeAgo: '17m' },
  { id: 'tx-8', type: 'deposit', username: 'Marco_P***', amountUsd: 25000.00, amountBtc: 0.27041, txHash: 'c53a...884b', timestamp: '19 mins ago', status: 'confirmed', timeAgo: '19m' },
  { id: 'tx-9', type: 'payout', username: 'Liam_J***', amountUsd: 450.00, amountBtc: 0.00486, txHash: '9120...bb54', timestamp: '22 mins ago', status: 'confirmed', timeAgo: '22m' },
];

export const INITIAL_AI_SIGNALS: TradeSignal[] = [
  { id: 'sig-1', pair: 'BTC/USDT', type: 'BUY', entryPrice: 91840, exitPrice: 92420, profitPercent: 0.63, confidence: 96.4, strategy: 'Quantum Orderbook Arbitrage', executionTimeMs: 0.38, timestamp: '12s ago' },
  { id: 'sig-2', pair: 'ETH/USDT', type: 'BUY', entryPrice: 3385, exitPrice: 3412, profitPercent: 0.79, confidence: 94.8, strategy: 'Deep RL Sentiment Momentum', executionTimeMs: 0.42, timestamp: '45s ago' },
  { id: 'sig-3', pair: 'SOL/USDT', type: 'SELL', entryPrice: 201.2, exitPrice: 198.5, profitPercent: 1.34, confidence: 97.1, strategy: 'Multi-Exchange Volatility Scalp', executionTimeMs: 0.29, timestamp: '1m ago' },
  { id: 'sig-4', pair: 'BTC/USDT', type: 'BUY', entryPrice: 91400, exitPrice: 91980, profitPercent: 0.63, confidence: 95.2, strategy: 'Liquidity Imbalance Capture', executionTimeMs: 0.45, timestamp: '2m ago' },
  { id: 'sig-5', pair: 'BNB/USDT', type: 'BUY', entryPrice: 639.4, exitPrice: 644.8, profitPercent: 0.84, confidence: 93.6, strategy: 'Neural Cross-Asset Hedging', executionTimeMs: 0.51, timestamp: '3m ago' },
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Winvest (Wealth Invest Corp)?',
    answer: 'Winvest is an advanced, AI-driven crypto wealth generation platform established in 2018 and formally incorporated as Wealth Invest Corp in New York (One Vanderbilt Ave). Our proprietary autonomous trading algorithms, neural reinforcement models, and multi-exchange liquidity engines trade digital assets 24/7 to deliver steady daily yields.'
  },
  {
    id: 'faq-2',
    category: 'investment',
    question: 'How does the 3.00% Daily for 60 Days plan work?',
    answer: 'Investors deposit Bitcoin (starting from just $10 equivalent). Your capital is deployed into our automated high-frequency trading engine. You receive a fixed 3.00% daily return credited to your wallet balance every 24 hours for 60 calendar days, totaling 180.00% gross return (80% pure net profit). Capital is factored into the daily payouts.'
  },
  {
    id: 'faq-3',
    category: 'investment',
    question: 'Is the return affected by Bitcoin market volatility?',
    answer: 'No. When you deposit Bitcoin, the value is locked into a fixed USD notional contract for the duration of the 60-day cycle. You earn guaranteed USD-denominated daily yields, protecting your principal and profit from market downturns while providing high liquidity upon withdrawal.'
  },
  {
    id: 'faq-4',
    category: 'withdrawals',
    question: 'What are the withdrawal minimums and processing times?',
    answer: 'The minimum withdrawal is just $1.00. Withdrawals are processed 24/7 with zero platform fees from Winvest (only standard Bitcoin network mining fees apply). Payouts are executed automatically through our multi-signature hot/cold liquidity reserve, typically reaching your external wallet within minutes to a maximum of 24 hours.'
  },
  {
    id: 'faq-5',
    category: 'affiliate',
    question: 'How does the 3-Tier Affiliate Referral Program work?',
    answer: 'Winvest provides an instant 3-level commission structure: Level 1 (Direct Referrals) earns 5.0%, Level 2 (Sub-referrals) earns 2.0%, and Level 3 earns 1.0% on all deposits made by your invited members. Commissions are credited instantly in real-time and can be withdrawn immediately or reinvested.'
  },
  {
    id: 'faq-6',
    category: 'security',
    question: 'How is user capital secured?',
    answer: 'We utilize enterprise-grade BitGo multi-signature cold storage custody, quantum-resistant TLS 1.3 encryption, Cloudflare DDoS defense layers, and automated algorithmic stop-loss circuit breakers that halt and hedge risk if volatility exceeds 2.5% in any 1-minute window.'
  },
  {
    id: 'faq-7',
    category: 'general',
    question: 'Do I get an official Shareholder Certificate?',
    answer: 'Yes! Every verified participant in the Winvest 60-day investment pool receives an authentic, numbered digital Certificate of Share Participation issued under Wealth Invest Corp (NYS Entity ID: 7291842), complete with corporate watermark and verification hash.'
  },
  {
    id: 'faq-8',
    category: 'withdrawals',
    question: 'Can I reinvest my daily profits (compounding)?',
    answer: 'Absolutely. You can choose to withdraw your daily profits every 24 hours or use the "Reinvest" feature in your investor dashboard to launch new parallel 60-day contracts starting at just $10, compounding your passive income stream.'
  },
  {
    id: 'faq-9',
    category: 'security',
    question: 'Where is Winvest legally registered?',
    answer: 'Wealth Invest Corp is registered with the Department of State in New York, USA, with executive headquarters located at One Vanderbilt Avenue, 45th Floor, New York, NY 10017.'
  }
];

export const INITIAL_USER_ACCOUNT: UserAccount = {
  id: 'usr-1001',
  name: 'Investor Demo',
  email: 'investor@winvest.com',
  role: 'user',
  status: 'active',
  walletBalanceUsd: 148.50,
  totalInvestedUsd: 1500.00,
  totalEarnedUsd: 360.00,
  totalWithdrawnUsd: 211.50,
  referralCode: 'WIN-89421',
  referralEarningsUsd: 75.00,
  totalReferrals: 3,
  joinedDate: '2025-01-10',
  deposits: [
    {
      id: 'dep-101',
      amountUsd: 1000.00,
      amountCrypto: 0.01082,
      currency: 'BTC',
      dailyYieldPercent: 3.0,
      startDate: '2025-02-10',
      daysActive: 8,
      totalDays: 60,
      earnedSoFarUsd: 240.00,
      status: 'active',
      txHash: '9a31...b72e'
    },
    {
      id: 'dep-102',
      amountUsd: 500.00,
      amountCrypto: 0.00541,
      currency: 'BTC',
      dailyYieldPercent: 3.0,
      startDate: '2025-02-14',
      daysActive: 8,
      totalDays: 60,
      earnedSoFarUsd: 120.00,
      status: 'active',
      txHash: 'e42f...c91d'
    }
  ],
  withdrawals: [
    {
      id: 'wd-501',
      amountUsd: 211.50,
      amountCrypto: 0.00228,
      currency: 'BTC',
      destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      timestamp: '2025-02-16 14:22',
      status: 'completed',
      txHash: '7c8b...441e'
    }
  ]
};

export const INITIAL_PAYMENT_METHODS = [
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

export const INITIAL_PLANS = [
  {
    id: 'plan-flagship-60d',
    name: 'Flagship 60-Day Quantum Plan',
    badge: 'Most Popular • 3.00% Daily',
    dailyYieldPercent: 3.0,
    minAmountUsd: 10,
    maxAmountUsd: 500000,
    durationDays: 60,
    profitType: 'daily_withdrawable' as const,
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
    profitType: 'daily_withdrawable' as const,
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
    minAmountUsd: 5000,
    maxAmountUsd: 1000000,
    durationDays: 90,
    profitType: 'daily_withdrawable' as const,
    returnPrincipal: true,
    isActive: true,
    description: 'Direct optical pipeline execution with custom high-watermark profit allocation.',
    features: [
      '3.80% high-frequency daily arbitrage yield',
      '342% Total Gross Yield over 90 calendar days',
      'Dedicated institutional risk manager',
      'Direct multi-signature cold storage segregation',
      'Priority zero-delay batch withdrawal routing'
    ]
  }
];

