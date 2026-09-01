import React, { useState } from 'react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  X,
  Sparkles,
  QrCode
} from 'lucide-react';

interface CorporateAndCertificateProps {
  isOpenModal: boolean;
  onCloseModal: () => void;
  defaultUserName?: string;
  defaultAmount?: number;
}

export const CorporateAndCertificate: React.FC<CorporateAndCertificateProps> = ({
  isOpenModal,
  onCloseModal,
  defaultUserName = 'Alexandre Vance',
  defaultAmount = 5000,
}) => {
  const [certName, setCertName] = useState<string>(defaultUserName);
  const [certAmount, setCertAmount] = useState<number>(defaultAmount);
  const [certSerial, setCertSerial] = useState<string>('WIC-NY-2025-998471');

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* On-Page Corporate Showcase Section */}
      <section id="certificate" className="py-20 md:py-28 relative bg-[#070b19] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Corporate Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Incorporated in New York, USA</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
                Official Corporate Registration & <br />
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  Shareholder Certification
                </span>
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                Winvest operates under <strong className="text-white">Wealth Invest Corp</strong>, a formalized multinational financial technology corporation. Every 60-day investment pool deposit generates an individualized, tamper-evident Certificate of Share Ownership.
              </p>

              <div className="bg-[#090f23] rounded-2xl border border-slate-800 p-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Legal Entity Name:</span>
                  <span className="text-white font-bold">WEALTH INVEST CORP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Corporate Jurisdiction:</span>
                  <span className="text-white font-bold">New York Department of State (NYS)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Global Headquarters:</span>
                  <span className="text-slate-200">One Vanderbilt Ave, New York, NY 10017</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Entity Registration Code:</span>
                  <span className="text-amber-400 font-bold">NYS-DOS-7291842</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Capital Asset Backing:</span>
                  <span className="text-emerald-400 font-bold">100% Cold Multi-Sig Vaults</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCertName(defaultUserName);
                    setCertAmount(defaultAmount);
                    // trigger modal via prop
                  }}
                  className="px-6 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center space-x-2 font-mono uppercase tracking-wider"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Customize & Preview Share Certificate</span>
                </button>
              </div>
            </div>

            {/* Right: Realistic Gold-Embossed Certificate Preview Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#121626] via-[#0e1220] to-[#080a14] border-2 border-amber-500/40 p-8 shadow-2xl shadow-amber-500/10">
                {/* Certificate Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <span className="text-9xl font-black font-display text-amber-300">WIC</span>
                </div>

                <div className="border border-amber-500/30 rounded-2xl p-6 relative z-10 bg-[#070913]/60 backdrop-blur-sm space-y-6">
                  {/* Top Header of Certificate */}
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
                        UNITED STATES OF AMERICA • STATE OF NEW YORK
                      </span>
                      <h4 className="text-xl font-display font-extrabold text-amber-200">
                        WEALTH INVEST CORP
                      </h4>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400/60 bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-inner">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Cert Title */}
                  <div className="text-center py-2">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                      OFFICIAL CERTIFICATE OF SHARE PARTICIPATION
                    </span>
                    <p className="text-xs text-slate-300 mt-1 italic">
                      This certifies that the holder is an authorized beneficiary of the Winvest AI Quantum Pool
                    </p>
                  </div>

                  {/* Cert Body Info */}
                  <div className="bg-[#05070e]/80 p-4 rounded-xl border border-amber-500/20 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shareholder:</span>
                      <span className="text-white font-bold">{certName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Notional Allocation:</span>
                      <span className="text-emerald-400 font-bold">${certAmount.toLocaleString()}.00 USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fixed Daily Rate:</span>
                      <span className="text-amber-300 font-bold">3.00% Daily (60 Days / 180% Total)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certificate Serial:</span>
                      <span className="text-slate-400">{certSerial}</span>
                    </div>
                  </div>

                  {/* Signatures & Seal */}
                  <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-[10px] font-mono text-slate-400">
                    <div>
                      <div className="h-6 border-b border-slate-700 w-28 mb-1 flex items-end">
                        <span className="font-serif italic text-slate-300 text-xs">W. Sterling, CEO</span>
                      </div>
                      <span>Managing Director</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode className="w-8 h-8 text-amber-400/80" />
                      <div className="text-right">
                        <span className="text-amber-400 font-bold block">VERIFIED</span>
                        <span>NY-STATE SEAL</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Modal View for Full Certificate Customization & Printing */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#090f23] rounded-3xl border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl my-8">
            
            {/* Close button */}
            <button
              onClick={onCloseModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Generate Your Personalized Share Certificate</h3>
                <p className="text-xs text-slate-400">Issued under Wealth Invest Corp • New York, NY</p>
              </div>
            </div>

            {/* Customization Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Shareholder Full Name</label>
                <input
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#050814] border border-slate-700 focus:border-amber-400 rounded-xl text-sm text-white font-mono"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Allocated Capital Amount (USD)</label>
                <input
                  type="number"
                  value={certAmount}
                  onChange={(e) => setCertAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#050814] border border-slate-700 focus:border-amber-400 rounded-xl text-sm text-white font-mono"
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Full Certificate Visual Display */}
            <div className="border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#0e1428] to-[#080c18] relative shadow-inner mb-6">
              <div className="text-center pb-4 border-b border-amber-500/20">
                <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase font-bold">
                  STATE OF NEW YORK • DEPARTMENT OF STATE
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-amber-200 mt-1">
                  WEALTH INVEST CORP
                </h2>
                <span className="text-xs text-slate-400 font-mono">Headquarters: One Vanderbilt Ave, New York, NY 10017</span>
              </div>

              <div className="text-center py-6">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">CERTIFICATE OF PARTICIPATION IN DIGITAL POOL</p>
                <p className="text-sm text-slate-300">This officially certifies that:</p>
                <h3 className="text-2xl font-serif text-white font-bold my-2 italic underline decoration-amber-500/40 decoration-1 underline-offset-8">
                  {certName || 'Authorized Member'}
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto mt-3">
                  holds <strong className="text-emerald-400">${certAmount.toLocaleString()}.00 USD</strong> in the Winvest AI Quantum High-Frequency Pool, with scheduled 3.00% daily yields for 60 calendar days (180.00% cumulative return).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#05070e]/80 p-4 rounded-xl border border-amber-500/20 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">DAILY YIELD</span>
                  <span className="text-amber-300 font-bold">3.00% / Day</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">TOTAL ROI</span>
                  <span className="text-emerald-400 font-bold">180.00%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CONTRACT TERM</span>
                  <span className="text-cyan-300 font-bold">60 Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">LIQUIDITY</span>
                  <span className="text-white font-bold">24/7 Daily</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-amber-500/20 mt-6 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-300 font-serif italic block text-sm">Wealth Invest Governance</span>
                  <span className="text-[10px] text-slate-500">Board of Directors Signature</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold block">{certSerial}</span>
                  <span className="text-[10px] text-slate-500">Cryptographic Seal ID</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={onCloseModal}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
