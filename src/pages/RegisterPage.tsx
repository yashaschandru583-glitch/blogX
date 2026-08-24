import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PhotoUpload } from '../components/PhotoUpload';
import { Flame, User, Mail, Lock, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      showToast('warning', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('warning', 'Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      showToast('warning', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        avatar,
        bio: bio.trim() || undefined
      });
      showToast('success', 'Account created successfully! Welcome to BLOGX.');
      navigate('/');
    } catch (err: any) {
      showToast('error', err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-page" className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#FF2B2B]/10 via-[#22C55E]/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg">
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
            Create Your Author Account
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Join the community to publish articles, participate in discussions, and build your audience.
          </p>
        </div>

        {/* Register Card */}
        <div
          id="register-card"
          className="bg-[#151515] border border-[#292929] hover:border-[#FF2B2B]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,0,0,0.8)] transition-all relative"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FF2B2B]" /> Full Name <span className="text-[#FF2B2B]">*</span>
              </label>
              <input
                id="input-register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF7A00]" /> Email Address <span className="text-[#FF2B2B]">*</span>
              </label>
              <input
                id="input-register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                required
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFD60A]" /> Password <span className="text-[#FF2B2B]">*</span>
                </label>
                <input
                  id="input-register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#22C55E]" /> Confirm Password <span className="text-[#FF2B2B]">*</span>
                </label>
                <input
                  id="input-register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] shadow-inner transition-all"
                  required
                />
              </div>
            </div>

            {/* Profile Avatar Upload (Drag & Drop, Presets, URL) */}
            <div className="pt-1">
              <PhotoUpload
                value={avatar}
                onChange={(newAvatar) => setAvatar(newAvatar)}
                label="Profile Picture / Avatar"
                mode="avatar"
                idPrefix="register-avatar-upload"
              />
            </div>

            {/* Bio Field (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E5E5E5] mb-1.5">
                Bio (Optional)
              </label>
              <input
                id="input-register-bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software architect, full-stack developer, writer..."
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2 text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B]"
              />
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-register"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,43,43,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-[#9CA3AF]">
            Already have an account?{' '}
            <Link
              id="link-go-to-login"
              to="/login"
              className="text-[#FF7A00] hover:text-[#FF2B2B] font-bold transition-colors ml-1"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
