'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Sparkle, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';

const specializations = [
  {
    name: 'Cardiology',
    title: 'Heart & Vascular Care',
    desc: 'Comprehensive diagnostics and treatment for heart conditions and hypertension.',
    icon: Heart,
    color: 'from-rose-500 to-red-600',
    bgLight: 'bg-rose-50/70',
    textCol: 'text-rose-600',
    doctorsCount: '24+ Specialists',
  },
  {
    name: 'Neurology',
    title: 'Brain & Spine Wellness',
    desc: 'Advanced care for neurological disorders, stroke prevention, and migraines.',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50/70',
    textCol: 'text-purple-600',
    doctorsCount: '18+ Specialists',
  },
  {
    name: 'Orthopedics',
    title: 'Bone & Joint Clinic',
    desc: 'Specialized surgical and therapeutic care for joint pain, fractures, and sports injuries.',
    icon: Bone,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50/70',
    textCol: 'text-amber-600',
    doctorsCount: '30+ Specialists',
  },
  {
    name: 'Pediatrics',
    title: 'Child & Infant Health',
    desc: 'Gentle pediatric care, routine immunizations, and developmental monitoring.',
    icon: Baby,
    color: 'from-cyan-500 to-teal-600',
    bgLight: 'bg-cyan-50/70',
    textCol: 'text-cyan-600',
    doctorsCount: '22+ Specialists',
  },
  {
    name: 'Dermatology',
    title: 'Skin, Hair & Aesthetics',
    desc: 'Clinical skin treatments, laser therapy, and advanced dermatological care.',
    icon: Sparkle,
    color: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50/70',
    textCol: 'text-pink-600',
    doctorsCount: '16+ Specialists',
  },
];

export default function MedicalSpecializations() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-3.5 py-1.5 rounded-full">
            Clinical Departments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Explore Medical Specializations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Find the right specialist doctor tailored to your unique healthcare requirements and symptoms.
          </p>
        </div>

        {/* Specialization Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {specializations.map((spec) => {
            const Icon = spec.icon;
            return (
              <Link
                key={spec.name}
                href={`/doctors?specialization=${spec.name}`}
                className="group relative bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Box */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${spec.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 mb-5`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 mt-0.5">{spec.title}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    {spec.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">{spec.doctorsCount}</span>
                  <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
