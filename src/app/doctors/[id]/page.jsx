'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import API from '../../../services/api';
import { 
  Star, 
  Building2, 
  Stethoscope, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  ArrowLeft,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
          if (res.data.data.availableDays?.length > 0) {
            setSelectedDay(res.data.data.availableDays[0]);
          }
          if (res.data.data.availableSlots?.length > 0) {
            setSelectedSlot(res.data.data.availableSlots[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
        // Fallback demo data
        setDoctor({
          _id: id,
          doctorName: 'Dr. Sarah Jenkins',
          specialization: 'Cardiology',
          qualifications: 'MBBS, MD (Cardiology), FACC',
          experience: 12,
          consultationFee: 120,
          hospitalName: 'Apollo Heart Center',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableSlots: ['09:00 AM - 11:00 AM', '03:00 PM - 05:00 PM'],
          rating: 4.9,
          totalReviews: 128,
          about: 'Senior Consultant Cardiologist specializing in interventional cardiology, cardiovascular diagnostics, and preventative heart wellness.',
        });
        setSelectedDay('Monday');
        setSelectedSlot('09:00 AM - 11:00 AM');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleBooking = () => {
    toast.success(`Slot selected for ${selectedDay} at ${selectedSlot}. Proceeding to checkout.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-semibold text-teal-700 animate-pulse">Loading Specialist Profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Specialist Profile Not Found</h2>
        <Link href="/doctors" className="mt-4 text-teal-600 font-bold underline">
          Return to Doctors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 bg-white px-4 py-2 rounded-xl shadow-xs border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* Doctor Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <div className="relative rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto shadow-md">
              <img
                src={doctor.profileImage}
                alt={doctor.doctorName}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-white" />
                {doctor.rating || 4.9} ({doctor.totalReviews || 120})
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
              <Stethoscope className="w-3.5 h-3.5" />
              {doctor.specialization}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {doctor.doctorName}
            </h1>
            <p className="text-sm font-semibold text-teal-600">{doctor.qualifications}</p>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{doctor.hospitalName}</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {doctor.about}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <span className="block text-xs text-slate-400 font-medium">Experience</span>
                <span className="text-base font-bold text-slate-800">{doctor.experience}+ Years</span>
              </div>
              <div className="bg-teal-50 p-3 rounded-2xl">
                <span className="block text-xs text-teal-600 font-medium">Consultation Fee</span>
                <span className="text-base font-extrabold text-teal-800">${doctor.consultationFee}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl col-span-2 sm:col-span-1">
                <span className="block text-xs text-emerald-600 font-medium">Verification</span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified Doctor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Booking Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Schedule an Appointment</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an available day and time slot to confirm your consultation.
            </p>
          </div>

          {/* Available Days */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Select Visiting Day
            </label>
            <div className="flex flex-wrap gap-3">
              {doctor.availableDays?.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedDay === day
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Select Time Slot
            </label>
            <div className="flex flex-wrap gap-3">
              {doctor.availableSlots?.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedSlot === slot
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-500">Total Consultation Amount</span>
              <p className="text-2xl font-extrabold text-teal-800">${doctor.consultationFee}</p>
            </div>

            <button
              onClick={handleBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/30 transition-all"
            >
              <CalendarCheck className="w-5 h-5" />
              Book Appointment Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
