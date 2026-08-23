'use client';

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { motion } from 'framer-motion';
import { Users, UserCheck, CalendarCheck, Star, Award, TrendingUp } from 'lucide-react';

export default function PlatformStatistics() {
  const [stats, setStats] = useState({
    totalDoctors: 120,
    totalPatients: 8500,
    totalAppointments: 14200,
    totalReviews: 3400,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats');
        if (res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Verified Doctors',
      value: stats.totalDoctors,
      suffix: '+',
      description: 'Board certified medical specialists across all departments',
      icon: UserCheck,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      label: 'Happy Patients',
      value: stats.totalPatients,
      suffix: '+',
      description: 'Patients received consultations and treatments',
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      label: 'Appointments Booked',
      value: stats.totalAppointments,
      suffix: '+',
      description: 'Online appointments scheduled without queues',
      icon: CalendarCheck,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      label: 'Positive Reviews',
      value: stats.totalReviews,
      suffix: '+',
      description: 'Verified 5-star clinical feedback from genuine patients',
      icon: Star,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4" />
            <span>Real-Time Healthcare Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Trusted by Thousands of Patients Daily
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            MediCare Connect is transforming access to hospital appointments with high patient satisfaction and verified outcomes.
          </p>
        </div>

        {/* Stats Grid with Framer Motion Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 border border-slate-700/60 hover:border-teal-500/50 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  <span className="text-teal-400 font-bold ml-0.5">{item.suffix}</span>
                </div>

                <h3 className="text-base font-bold text-slate-200 mt-2">{item.label}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
