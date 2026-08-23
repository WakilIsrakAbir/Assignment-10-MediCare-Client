'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Home, Search, HeartCrack, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-teal-50/50 via-white to-slate-50 px-4 py-16">
      <div className="max-w-xl w-full text-center">
        {/* Healthcare Error Illustration */}
        <div className="relative mx-auto w-36 h-36 mb-8 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-teal-100/70 animate-ping absolute opacity-40"></div>
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl relative z-10 rotate-6 hover:rotate-0 transition-transform duration-300">
            <HeartCrack className="w-16 h-16" />
          </div>
        </div>

        {/* 404 Header & Message */}
        <div className="inline-block px-4 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
          Error 404 - Page Not Found
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Lost in the Healthcare Ward?
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">
          The medical page or consultation route you are looking for might have been relocated, removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/30 hover:shadow-xl transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/doctors"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-2xl transition-colors shadow-xs"
          >
            <Search className="w-4 h-4 text-teal-600" />
            Find Doctors
          </Link>
        </div>

        <div className="mt-12 text-xs text-slate-400">
          Need immediate medical assistance? Call our 24/7 hotline at <span className="font-bold text-teal-700">+1 (800) 456-7890</span>
        </div>
      </div>
    </div>
  );
}
