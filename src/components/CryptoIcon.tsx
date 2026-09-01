import React from 'react';

interface CryptoIconProps {
  currency: string;
  className?: string;
  size?: number;
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({ currency, className = 'w-6 h-6', size = 24 }) => {
  const upper = currency?.toUpperCase() || '';

  if (upper.includes('BTC') || upper.includes('BITCOIN')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[11px] leading-none font-extrabold tracking-tighter">₿</span>
      </div>
    );
  }

  if (upper.includes('ETH') || upper.includes('ETHEREUM')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[10px] leading-none font-bold">Ξ</span>
      </div>
    );
  }

  if (upper.includes('USDT') || upper.includes('TETHER')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[9px] leading-none font-black">₮</span>
      </div>
    );
  }

  if (upper.includes('SOL') || upper.includes('SOLANA')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500/30 to-teal-500/30 border border-purple-400/40 text-cyan-300 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[9px] leading-none font-black">S</span>
      </div>
    );
  }

  if (upper.includes('BNB') || upper.includes('BINANCE')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[9px] leading-none font-black">B</span>
      </div>
    );
  }

  if (upper.includes('TRX') || upper.includes('TRON')) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
        <span className="text-[9px] leading-none font-black">T</span>
      </div>
    );
  }

  // Default crypto icon
  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold shrink-0 ${className}`} style={{ width: size, height: size }}>
      <span className="text-[9px] leading-none font-black">{upper.charAt(0) || '$'}</span>
    </div>
  );
};
