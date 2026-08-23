'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Award, 
  Activity,
  HeartPulse,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function BannerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/80 via-cyan-50/40 to-white py-16 sm:py-24">
      {/* Animated Decorative Ambient Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: 'easeInOut',
        }}
        className="absolute top-10 left-1/4 w-80 h-80 bg-teal-400/30 rounded-full blur-3xl -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content with Framer Motion Stagger */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/90 border border-teal-300 text-teal-800 text-xs sm:text-sm font-bold shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Next-Generation Healthcare Management</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              Connecting You with{' '}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent underline decoration-teal-300/50 decoration-wavy decoration-2">
                Expert Doctors
              </span>{' '}
              & Hospital Care
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Skip traditional waiting rooms. Book verified specialist appointments instantly, manage medical prescriptions, and consult top healthcare professionals—all from one secure platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/doctors"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 rounded-2xl shadow-lg shadow-teal-600/30 hover:shadow-xl transition-all"
                >
                  <Search className="w-5 h-5" />
                  Find Specialists Now
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 rounded-2xl shadow-xs transition-all"
                >
                  <CalendarCheck className="w-5 h-5 text-teal-600" />
                  Register as Patient
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Highlights Pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">100% Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Top Rated Care</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Dynamic Visual with Floating Interactive Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Doctor Main Image Card */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group"
              >
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor with patient"
                  className="w-full h-[440px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Consultation Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                        <Activity className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. Sarah Jenkins</p>
                        <p className="text-[11px] text-teal-600 font-medium">Chief of Cardiology</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Available
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Levitating Badge 1: 24/7 Support */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <HeartPulse className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">24/7 Digital Care</p>
                  <p className="text-[10px] text-slate-500">Live Hospital Network</p>
                </div>
              </motion.div>

              {/* Floating Levitating Badge 2: 99% Satisfaction */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">99.4% Verified</p>
                  <p className="text-[10px] text-slate-500">Patient Satisfaction</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
