'use client';

import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Save, CheckCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser, authReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultAvatar = user?.role === 'doctor'
    ? 'https://images.unsplash.com/photo-1594824813686-2a91a92e10fb?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Female',
    role: 'patient',
    Photo: defaultAvatar,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Female',
        role: user.role || 'patient',
        Photo: user.Photo || defaultAvatar,
      });
    }
  }, [user, defaultAvatar]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.put('/auth/profile', {
        name: profile.name,
        Photo: profile.Photo,
        phone: profile.phone,
        gender: profile.gender,
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success('Profile details updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !authReady) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
          <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information and contact settings.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
              <img
                src={profile.Photo || defaultAvatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultAvatar;
                }}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md bg-slate-100"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{profile.name || 'User'}</h3>
                <p className="text-xs text-slate-500 capitalize">{profile.role} Account</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3" /> Active & Verified Status
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 text-sm font-semibold cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">Profile Photo URL</label>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, Photo: defaultAvatar })}
                    className="text-[11px] text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Use High-Res Default Photo
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profile.Photo}
                  onChange={(e) => setProfile({ ...profile, Photo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-600 bg-white"
                >
                  <option value="Male" className="text-slate-900 font-medium">Male</option>
                  <option value="Female" className="text-slate-900 font-medium">Female</option>
                  <option value="Other" className="text-slate-900 font-medium">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

