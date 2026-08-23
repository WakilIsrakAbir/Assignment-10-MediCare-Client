'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Sparkle, 
  ArrowRight,
  Stethoscope,
  ChevronRight
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
    doctorsCount: 'Specialist Care',
  },
  {
    name: 'Neurology',
    title: 'Brain & Spine Wellness',
    desc: 'Advanced care for neurological disorders, stroke prevention, and migraines.',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50/70',
    textCol: 'text-purple-600',
    doctorsCount: 'Specialist Care',
  },
  {
    name: 'Orthopedics',
    title: 'Bone & Joint Clinic',
    desc: 'Specialized surgical and therapeutic care for joint pain, fractures, and sports injuries.',
    icon: Bone,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50/70',
    textCol: 'text-amber-600',
    doctorsCount: 'Specialist Care',
  },
  {
    name: 'Pediatrics',
    title: 'Child & Infant Health',
    desc: 'Gentle pediatric care, routine immunizations, and developmental monitoring.',
    icon: Baby,
    color: 'from-cyan-500 to-teal-600',
    bgLight: 'bg-cyan-50/70',
    textCol: 'text-cyan-600',
    doctorsCount: 'Specialist Care',
  },
  {
    name: 'Dermatology',
    title: 'Skin, Hair & Aesthetics',
    desc: 'Clinical skin treatments, laser therapy, and advanced dermatological care.',
    icon: Sparkle,
    color: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50/70',
    textCol: 'text-pink-600',
    doctorsCount: 'Specialist Care',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function MedicalSpecializations() {
  return (
    <section className="py-20 bg-slate-50/90 border-y border-slate-200/60 relative overflow-hidden">
      {/* Decorative subtle background shapes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/90 px-3.5 py-1.5 rounded-full border border-teal-200">
            Clinical Departments
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Explore Medical Specializations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Find the right specialist doctor tailored to your unique healthcare requirements and symptoms.
          </p>
        </motion.div>

        {/* Specialization Cards Grid with Staggered Framer Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {specializations.map((spec) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.name}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Link
                  href={`/doctors?specialization=${spec.name}`}
                  className="group relative bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Animated Icon Box */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${spec.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-5`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                      {spec.doctorsCount}
                    </span>

                    <h3 className="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-teal-700 transition-colors">
                      {spec.name}
                    </h3>

                    <p className="text-xs font-semibold text-slate-700 mt-0.5">
                      {spec.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>

                  {/* Bottom Action Arrow */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                    <span>Consult Specialists</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
