import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  AlertTriangle, 
  ArrowRight,
  Server,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (token: string, admin: any) => void;
  onOpenUserLogin: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  onOpenUserLogin,
}) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!masterPassword.trim()) {
      setErrorMsg('Please enter valid administrative credentials or passkey.');
      return;
    }

    setIsLoading(true);

    try {
      const { token, admin } = await api.adminLogin({
        email: adminEmail.trim(),
        password: masterPassword.trim(),
        passkey: masterPassword.trim(),
      });

      onAdminLoginSuccess(token, admin);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid Master Passkey or Password. Access Denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#070b18] rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Terminal Header Bar */}
        <div className="bg-[#040710] px-6 py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Root Admin Gateway
                </h3>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  LEVEL 4 RESTRICTED
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Wealth Invest Corp • Executive Systems Controller</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-950/40 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Authorized Personnel Only. All actions are immutably logged.</span>
          </div>
          <span className="text-[10px] text-amber-400/80">TLS 1.3</span>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Access Denied</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-slate-300 block mb-1.5 font-bold">Admin Operator ID</label>
              <div className="relative">
                <Server className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@winvest.com"
                  className="w-full bg-[#030611] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-bold">Master Security Passkey</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter master root key..."
                  className="w-full bg-[#030611] border border-amber-500/40 rounded-xl pl-10 pr-4 py-3 text-amber-300 font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating Root Access...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Access Root Console</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* User switch */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end text-[11px] font-mono">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUserLogin();
              }}
              className="text-slate-400 hover:text-white"
            >
              Switch to Investor Portal →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
