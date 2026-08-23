'use client';

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { motion } from 'framer-motion';
import { Users, UserCheck, CalendarCheck, Star, TrendingUp, Sparkles } from 'lucide-react';

export default function PlatformStatistics() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalReviews: 0,
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
      suffix: '',
      description: 'Board certified medical specialists across all departments',
      icon: UserCheck,
      color: 'from-teal-400 to-emerald-500',
    },
    {
      label: 'Registered Patients',
      value: stats.totalPatients,
      suffix: '',
      description: 'Patients received consultations and treatments',
      icon: Users,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      label: 'Appointments Booked',
      value: stats.totalAppointments,
      suffix: '',
      description: 'Online appointments scheduled without physical queues',
      icon: CalendarCheck,
      color: 'from-indigo-400 to-purple-500',
    },
    {
      label: 'Patient Reviews',
      value: stats.totalReviews,
      suffix: '',
      description: 'Verified clinical feedback from genuine patients',
      icon: Star,
      color: 'from-amber-400 to-orange-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Mesh Glows */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Real-Time Healthcare Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Trusted by Thousands of Patients Daily
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Our centralized hospital ecosystem delivers verified clinical quality, seamless doctor scheduling, and digital records.
          </p>
        </motion.div>

        {/* Stats Grid with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-teal-400/50 shadow-xl transition-all duration-300 group"
              >
                {/* Icon Box */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Counter */}
                <div className="flex items-baseline gap-1">
                  <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white group-hover:text-teal-300 transition-colors">
                    {item.value}
                  </h3>
                  <span className="text-2xl font-bold text-teal-400">{item.suffix}</span>
                </div>

                <p className="text-sm font-bold text-slate-200 mt-2">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
