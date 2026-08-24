'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Star, 
  CheckCircle2, 
  Users, 
  Stethoscope, 
  CalendarCheck,
  ArrowRight,
  HeartHandshake,
  Shield,
  Activity,
  FileCheck2
} from 'lucide-react';

export default function BannerSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('All');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());
    if (specialty && specialty !== 'All') queryParams.set('specialization', specialty);
    router.push(`/doctors?${queryParams.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-10 pb-16 sm:pb-20 border-b border-slate-200">
      {/* Subtle Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.18] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#0f766e 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Ambient Radial Lighting Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-24 w-[30rem] h-[30rem] bg-cyan-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Value Proposition & Interactive Search */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Elegant Trust Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-300 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-900">
                Top-Rated Healthcare Management Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-950 tracking-tight leading-[1.12]">
              Connecting You with <br className="hidden sm:inline" />
              <span className="text-teal-800 underline decoration-teal-400/50 decoration-4">
                Expert Doctors
              </span>{' '}
              & Hospital Care
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-semibold">
              Skip traditional waiting rooms. Book appointments with 100% board-verified specialists, manage digital prescriptions, and take control of your health with ease.
            </p>

            {/* Interactive Hero Search Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 max-w-2xl mx-auto lg:mx-0"
            >
              <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2.5 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctor, condition, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50/80 border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
                  />
                </div>

                {/* Specialization Select */}
                <div className="w-full sm:w-44">
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50/80 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="All">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-700/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Doctors</span>
                </button>
              </form>
            </motion.div>

            {/* Quick Action Badges / Secondary CTA */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 px-4 py-2 rounded-xl transition-colors"
              >
                <Stethoscope className="w-4 h-4 text-teal-700" />
                Browse All Doctors
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Users className="w-4 h-4 text-slate-500" />
                Join as Patient / Doctor
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust Indicators Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 justify-center lg:justify-start text-left">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Verified</p>
                  <p className="text-[11px] text-slate-500">Board Specialists</p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center lg:justify-start text-left">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Slots</p>
                  <p className="text-[11px] text-slate-500">Real-Time Booking</p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center lg:justify-start text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">E-Prescription</p>
                  <p className="text-[11px] text-slate-500">Digital Health Notes</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Visual Composite with Levitating Glassmorphic Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0"
          >
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-2xl -z-10 scale-95" />

            {/* Main Doctor Visual Frame */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/15 border-4 border-white bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
                alt="Expert Physician Consultation"
                className="w-full h-[450px] sm:h-[500px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent pointer-events-none" />

              {/* Bottom In-Frame Doctor Label */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    Chief of Cardiology
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">Dr. Sarah Jenkins, MD</h4>
                  <p className="text-xs text-slate-500">Johns Hopkins Hospital Fellow</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Available Today
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Levitating Card 1: 4.9 Star Rating (Top Left) */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute -top-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl max-w-[210px] hidden sm:flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-slate-900">4.9 / 5.0</span>
                  <span className="text-[10px] text-slate-400 font-bold">(15k+)</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600">Patient Satisfaction</p>
              </div>
            </motion.div>

            {/* Floating Levitating Card 2: 24/7 Digital Care (Bottom Right) */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-6 sm:-right-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl max-w-[210px] hidden sm:flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">100% Board Certified</p>
                <p className="text-[11px] font-semibold text-teal-700">Verified Credentials</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
