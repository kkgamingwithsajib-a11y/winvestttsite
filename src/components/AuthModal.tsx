import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles,
  Users,
  Building2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { UserAccount } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  onLoginSuccess: (user: UserAccount, token: string) => void;
  onOpenAdminLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
  onOpenAdminLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      setSuccessMsg('Authentication verified. Loading your portfolio...');
      setTimeout(() => {
        onLoginSuccess(user, token);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Please enter your full legal name for shareholder records.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Please enter a valid investor email address.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPass) {
      setErrorMsg('Password confirmation does not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the institutional Terms of Custody.');
      return;
    }

    setIsLoading(true);

    try {
      const { token, user } = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirmPassword: regConfirmPass,
        referralCode: regReferral.trim() || undefined,
      });

      setSuccessMsg('Account created successfully! Welcome to Winvest.');
      setTimeout(() => {
        onLoginSuccess(user, token);
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const msg = await api.forgotPassword(forgotEmail.trim());
      setSuccessMsg(msg);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to process password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-[#070c1f] border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#050917]/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base block">Winvest Portal</span>
              <span className="text-[10px] font-mono text-emerald-400">Institutional Gateway</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#060a1a] border-b border-slate-800 font-mono text-xs">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Investor Sign In
          </button>

          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3 text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-500 text-emerald-400 font-bold bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center space-x-2 text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                  />
                  <span>Keep Session Active</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Investor Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Alexander Vance"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@investor.com"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Affiliate Referral Code (Optional)</label>
                <input
                  type="text"
                  value={regReferral}
                  onChange={(e) => setRegReferral(e.target.value)}
                  placeholder="WIN-89421"
                  className="w-full bg-[#050814] border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <label className="flex items-start space-x-2 text-[11px] text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
                <span>I agree to the Winvest Terms of Custody, Lloyd's Insurance, & AML Disclosures</span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: FORGOT */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 font-mono text-xs">
              <p className="text-slate-400 leading-relaxed">
                Enter your registered investor email to receive a secure recovery code.
              </p>

              <div>
                <label className="text-slate-300 block mb-1">Investor Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full bg-[#050814] border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  Send Recovery
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
