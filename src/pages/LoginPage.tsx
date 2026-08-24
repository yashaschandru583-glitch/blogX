import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Flame, Mail, Lock, LogIn, ArrowRight, Sparkles, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('warning', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      showToast('success', 'Logged in successfully! Welcome back.');
      navigate('/');
    } catch (err: any) {
      showToast('error', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      showToast('success', `Signed in as demo user ${demoEmail}`);
      navigate('/');
    } catch (err: any) {
      showToast('error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page" className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#FF2B2B]/10 via-[#FF7A00]/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2B2B] to-[#FF7A00] flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,43,43,0.4)]">
              <Flame className="w-6 h-6 fill-white text-transparent" />
            </div>
            <span className="text-3xl font-extrabold tracking-wider text-white">
              BLOG<span className="text-[#FF2B2B] drop-shadow-[0_0_12px_rgba(255,43,43,0.8)]">X</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Sign in to continue writing, commenting, and managing your stories.
          </p>
        </div>

        {/* Login Card */}
        <div
          id="login-card"
          className="bg-[#151515] border border-[#292929] hover:border-[#FF2B2B]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.8)] transition-all relative"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF7A00]" /> Email Address
              </label>
              <div className="relative">
                <input
                  id="input-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@blogx.dev"
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-3 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFD60A]" /> Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="input-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-3 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,43,43,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>

          {/* Quick Demo Login Credentials Bar */}
          <div className="mt-6 pt-5 border-t border-[#292929]">
            <p className="text-[11px] text-[#9CA3AF] font-semibold text-center mb-2.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD60A]" /> Quick Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-quick-login-alex"
                onClick={() => handleQuickLogin('alex@blogx.dev')}
                className="px-3 py-2 rounded-xl bg-[#0D0D0D] border border-[#292929] hover:border-[#FF2B2B]/50 text-[11px] text-[#E5E5E5] font-medium transition-all"
              >
                Alex Chen <span className="text-[#9CA3AF] block text-[9px]">alex@blogx.dev</span>
              </button>
              <button
                type="button"
                id="btn-quick-login-sarah"
                onClick={() => handleQuickLogin('sarah@blogx.dev')}
                className="px-3 py-2 rounded-xl bg-[#0D0D0D] border border-[#292929] hover:border-[#FF7A00]/50 text-[11px] text-[#E5E5E5] font-medium transition-all"
              >
                Sarah Connor <span className="text-[#9CA3AF] block text-[9px]">sarah@blogx.dev</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-[#9CA3AF]">
            Don't have an account?{' '}
            <Link
              id="link-go-to-register"
              to="/register"
              className="text-[#FF7A00] hover:text-[#FF2B2B] font-bold transition-colors ml-1"
            >
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
