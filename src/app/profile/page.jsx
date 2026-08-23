'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'patient@example.com',
    phone: user?.phone || '+1 (555) 234-5678',
    gender: user?.gender || 'Female',
    role: user?.role || 'patient',
    Photo: user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile details updated successfully!');
  };

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
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <img
                src={profile.Photo}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs text-slate-500 capitalize">{profile.role} Account</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3" /> Verified Status
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
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
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">Profile Photo URL</label>
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
