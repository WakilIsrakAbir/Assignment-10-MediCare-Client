'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot / Reset password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '' });
  const [resetLoading, setResetLoading] = useState(false);

  const { loginUser, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await loginUser(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetForm.email || !resetForm.newPassword) {
      toast.error('Please provide both email and new password');
      return;
    }
    try {
      setResetLoading(true);
      const res = await API.post('/auth/reset-password', resetForm);
      if (res.data.success) {
        toast.success(res.data.message || 'Password reset successfully!');
        setFormData({ email: resetForm.email, password: resetForm.newPassword });
        setShowForgotModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50/60 via-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-teal-100">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Log in to manage appointments, doctor schedules, and digital health records.
          </p>
        </div>

        {/* Default Admin Account Notice */}
        <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5 text-xs text-teal-900 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-700" />
              Default Admin Account
            </p>
            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@medicare.com', password: 'admin123' })}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
            >
              Fill Admin Info
            </button>
          </div>
          <p className="text-slate-600 font-mono text-[11px]">
            admin@medicare.com / admin123
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetForm({ email: formData.email || '', newPassword: '' });
                  setShowForgotModal(true);
                }}
                className="text-xs text-teal-700 hover:text-teal-800 font-bold hover:underline focus:outline-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-teal-700 transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/30 hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Reset Account Password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter your registered email and choose a new password. It will update in database immediately.
            </p>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. saba@gmail.com"
                  value={resetForm.email}
                  onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="e.g. Saba@123"
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 focus:border-teal-600 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-1/2 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {resetLoading ? 'Resetting...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-semibold">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 shadow-xs transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Footer Link */}
      <p className="text-center text-xs sm:text-sm text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="font-bold text-teal-700 hover:text-teal-800 underline">
          Register for free
        </Link>
      </p>
    </div>
  </div>
);
}
