'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CalendarClock, 
  FileText, 
  CreditCard, 
  Stethoscope, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

const benefits = [
  {
    title: '100% Verified Specialists',
    description: 'Every doctor on MediCare Connect undergo rigorous credential verification and hospital affiliation checks by our medical board.',
    icon: ShieldCheck,
    color: 'from-teal-500 to-emerald-600',
  },
  {
    title: 'Instant Online Scheduling',
    description: 'Select available time slots in real time. Reschedule or manage your clinical appointments with complete ease.',
    icon: CalendarClock,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Digital Health Records & Prescriptions',
    description: 'Access diagnostic prescriptions, doctor notes, and medical history securely from your personal patient dashboard.',
    icon: FileText,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'Secure & Transparent Payments',
    description: 'Safe payment processing with integrated Stripe gateway. Instant invoices, transparent fees, and zero hidden charges.',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Advantage Pitch */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full">
              Platform Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Why Choose <br className="hidden sm:inline" />
              <span className="text-teal-700">MediCare Connect?</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We eliminate traditional hospital queues and cumbersome paperwork by empowering patients with immediate access to top physicians and digital care management.
            </p>

            <div className="p-6 rounded-2xl bg-gradient-to-tr from-teal-900 to-slate-900 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-6 h-6 text-teal-400" />
                <h4 className="font-bold text-base">Patient First Philosophy</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 98% of patients report significant reduction in wait times and superior consultation experience through our platform.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 pt-1"
              >
                Learn more about our standards <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Key Benefits Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-slate-50 hover:bg-teal-50/40 p-6 rounded-3xl border border-slate-200/80 hover:border-teal-300 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
