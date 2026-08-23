'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Award, 
  Activity 
} from 'lucide-react';

export default function BannerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-cyan-50/30 to-white py-16 sm:py-24">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Next-Generation Healthcare Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Connecting You with{' '}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Expert Doctors
              </span>{' '}
              & Hospital Care
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Skip traditional waiting rooms. Book verified specialist appointments instantly, manage medical prescriptions, and consult top healthcare professionals—all from one secure platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/doctors"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-2xl shadow-lg shadow-teal-600/30 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <Search className="w-5 h-5" />
                Find Specialists Now
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-2xl shadow-sm transition-all"
              >
                <CalendarCheck className="w-5 h-5 text-teal-600" />
                Register as Patient
              </Link>
            </div>

            {/* Feature Highlights Pill */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">100% Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">Top Rated Care</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual & Interactive Badge with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Doctor Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor with patient"
                  className="w-full h-[430px] object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-teal-500 rounded-lg uppercase tracking-wider">
                    24/7 Digital Health
                  </span>
                  <h3 className="text-lg font-bold mt-1">Compassionate Care On Your Schedule</h3>
                  <p className="text-xs text-teal-100">Connecting top hospitals and diagnostic clinics worldwide</p>
                </div>
              </div>

              {/* Floating Badge 1: Verified Consultation */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Verified Specialists</p>
                  <p className="text-base font-bold text-slate-800">120+ Active Doctors</p>
                </div>
              </motion.div>

              {/* Floating Badge 2: Emergency Response */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-cyan-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-cyan-700">Real-Time Booking</p>
                  <p className="text-xs font-bold text-slate-800">Fast & Zero Waiting</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
