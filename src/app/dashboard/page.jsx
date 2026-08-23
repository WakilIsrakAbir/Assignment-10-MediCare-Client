'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  CreditCard, 
  FileText, 
  Star, 
  Clock, 
  ShieldCheck,
  Stethoscope,
  PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'patient';

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
              alt={user?.name || 'User'}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
            />
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-teal-500/30 text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                {role} Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Patient'}!
              </h1>
              <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
                {user?.email || 'patient@medicare.com'} • Active Account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/doctors"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Book New Appointment
            </Link>
          </div>
        </div>

        {/* Metric Cards Based on Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Upcoming Appointments</p>
            <p className="text-2xl font-extrabold text-slate-900">2 Active</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Completed Consultations</p>
            <p className="text-2xl font-extrabold text-slate-900">6 Visits</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Payments</p>
            <p className="text-2xl font-extrabold text-slate-900">$240.00</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Star className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Doctor Reviews Given</p>
            <p className="text-2xl font-extrabold text-slate-900">4 Reviews</p>
          </div>
        </div>

        {/* Active Appointments Preview */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">My Appointments Schedule</h3>
              <p className="text-xs text-slate-500">Manage, reschedule, or review your doctor visits</p>
            </div>
            <Link
              href="/doctors"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-xl"
            >
              + Find More Doctors
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100/70 flex items-center justify-center text-teal-700">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Dr. Sarah Jenkins</h4>
                  <p className="text-xs text-slate-500">Cardiology • Apollo Heart Center</p>
                  <p className="text-xs font-semibold text-teal-700 mt-1">Monday at 09:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Confirmed
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Paid ($120)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100/70 flex items-center justify-center text-cyan-700">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Dr. Elena Rostova</h4>
                  <p className="text-xs text-slate-500">Pediatrics • Childrens Care Hospital</p>
                  <p className="text-xs font-semibold text-teal-700 mt-1">Thursday at 02:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  Upcoming
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Paid ($90)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
