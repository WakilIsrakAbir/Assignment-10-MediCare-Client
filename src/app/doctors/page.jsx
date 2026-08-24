'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '../../services/api';
import { 
  Search, 
  Filter, 
  Star, 
  Building2, 
  Stethoscope, 
  Clock, 
  DollarSign, 
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);

  const specializations = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'General Medicine',
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        specialization: specialization === 'All' ? '' : specialization,
        sortBy,
        page,
        limit: 6,
      };
      const res = await API.get('/doctors', { params });
      if (res.data.success) {
        setDoctors(res.data.data);
        setTotalPages(res.data.totalPages);
        setTotalDoctors(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDoctors();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-3.5 py-1.5 rounded-full">
            Specialist Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Find & Book Top Doctors
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Filter certified medical practitioners by clinical specialty, rating, experience, and consultation fees.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 mb-10 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor by name, clinic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Specialization Select */}
            <div className="md:col-span-3">
              <select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by specialization"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-600 bg-white cursor-pointer"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec === 'All' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                aria-label="Sort doctors by"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-600 bg-white cursor-pointer"
              >
                <option value="rating">Sort by: Highest Rating</option>
                <option value="experience">Sort by: Experience</option>
                <option value="fee">Sort by: Consultation Fee</option>
              </select>
            </div>
          </form>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 animate-pulse space-y-4 border border-slate-200">
                <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
                <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Specialists Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or specialization filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSpecialization('All');
                setSortBy('rating');
                setPage(1);
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 rounded-xl hover:bg-teal-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
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

                  <div className="pt-2">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-sm hover:shadow-md transition-all"
                    >
                      View Profile & Book <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-slate-700 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
