'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import API from '../../services/api';
import { Star, Clock, Award, DollarSign, ArrowRight, Stethoscope, Building2, UserCheck } from 'lucide-react';

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/doctors/featured');
        if (res.data.success && Array.isArray(res.data.data)) {
          setDoctors(res.data.data);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching featured doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
              Top Medical Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Featured Verified Doctors
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl">
              Consult with board-certified physicians across major clinical specialties with proven track records of patient care.
            </p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-5 py-2.5 rounded-xl transition-colors shrink-0"
          >
            Browse All Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Doctor Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-50 rounded-3xl p-6 animate-pulse space-y-4 border border-slate-100">
                <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Doctor Image & Badges */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.doctorName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-teal-800 shadow-xs flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    {doctor.specialization}
                  </div>
                  <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    {doctor.rating || 4.9}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {doctor.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{doctor.qualifications}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-3">
                      <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">{doctor.hospitalName}</span>
                    </div>

                    {/* Stats Pill */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <span className="block text-[11px] text-slate-500 font-medium">Experience</span>
                        <span className="text-sm font-bold text-slate-800">{doctor.experience}+ Years</span>
                      </div>
                      <div className="bg-teal-50/60 rounded-xl p-2.5">
                        <span className="block text-[11px] text-teal-700 font-medium">Consultation</span>
                        <span className="text-sm font-extrabold text-teal-800">${doctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-sm hover:shadow-md transition-all"
                    >
                      Book Appointment <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-3xl border border-slate-200/80 p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Verified Doctors Currently Listed</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              New medical specialists can register their doctor account. Once verified and approved by the platform Administrator, their profiles will appear here automatically.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                Register as Doctor
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
