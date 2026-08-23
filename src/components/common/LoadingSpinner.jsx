'use client';

import React from 'react';
import { HeartPulse, Stethoscope } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading healthcare services...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        <div className="w-20 h-20 rounded-full bg-teal-100 animate-ping absolute opacity-75"></div>
        <div className="w-16 h-16 rounded-full bg-teal-500/20 animate-pulse absolute"></div>
        
        {/* Center icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-xl relative z-10">
          <HeartPulse className="w-7 h-7 animate-bounce" />
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-teal-800 tracking-wide animate-pulse">
        {text}
      </p>
      <span className="text-xs text-slate-400 mt-1">Please hold on while we prepare your data</span>
    </div>
  );
}
