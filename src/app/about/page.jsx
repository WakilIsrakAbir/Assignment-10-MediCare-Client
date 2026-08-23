'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, ShieldCheck, Award, Users, Stethoscope, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-3.5 py-1.5 rounded-full">
            Our Mission & Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Transforming Modern Healthcare Access
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            MediCare Connect is dedicated to eliminating barriers between patients and world-class physicians through digitized scheduling, secure records, and compassionate healthcare solutions.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verified Quality</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every medical specialist undergoes thorough credentialing, license verification, and peer reviews before joining our network.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Patient Centered</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero waiting time with real-time slot selection, digital prescription storage, and 24/7 emergency dispatch support.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Clinical Excellence</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Partnering with top hospital networks to ensure high clinical standards and post-consultation follow-up care.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to consult a medical specialist?</h2>
            <p className="text-sm text-teal-200 mt-1">Book your doctor appointment in less than 2 minutes.</p>
          </div>
          <Link
            href="/doctors"
            className="px-8 py-3.5 rounded-2xl font-bold text-teal-900 bg-white hover:bg-teal-50 transition-colors shrink-0 flex items-center gap-2"
          >
            Find Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
