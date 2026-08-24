'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import StripeBookingModal from '../../../components/booking/StripeBookingModal';
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
  CalendarCheck,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const isDoctor = user?.role === 'doctor';
  const isAdmin = user?.role === 'admin';
  const isNonPatient = isDoctor || isAdmin;

  useEffect(() => {
    const fetchDoctorAndReviews = async () => {
      try {
        const [docRes, revRes] = await Promise.allSettled([
          API.get(`/doctors/${id}`),
          API.get(`/reviews/doctor/${id}`),
        ]);

        if (docRes.status === 'fulfilled' && docRes.value.data.success) {
          const docData = docRes.value.data.data;
          setDoctor(docData);
          if (docData.availableDays?.length > 0) {
            setSelectedDay(docData.availableDays[0]);
          }
          if (docData.availableSlots?.length > 0) {
            setSelectedSlot(docData.availableSlots[0]);
          }
        }

        if (revRes.status === 'fulfilled' && revRes.value.data.success) {
          setReviews(revRes.value.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndReviews();
  }, [id]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in as a patient to book an appointment.');
      router.push('/login');
      return;
    }
    if (isDoctor) {
      toast.error('Doctor accounts cannot book appointments. Please log in as a Patient.');
      return;
    }
    if (isAdmin) {
      toast.error('Administrator accounts cannot book appointments. Please log in as a Patient.');
      return;
    }
    if (user?.role !== 'patient') {
      toast.error('Only patient accounts are permitted to book doctor appointments.');
      return;
    }
    if (!selectedDay || !selectedSlot) {
      toast.error('Please choose visiting day and time slot.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSuccess = (appointment) => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-md w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 bg-slate-200 rounded-3xl shrink-0"></div>
                <div className="space-y-3 flex-1">
                  <div className="h-8 bg-slate-200 rounded-lg w-2/3"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="h-5 bg-slate-200 rounded-md w-36"></div>
                <div className="h-20 bg-slate-200 rounded-2xl w-full"></div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
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
              {doctor.about || 'Dedicated specialist providing compassionate diagnostics and patient-centered healthcare.'}
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
            <h2 className="text-2xl font-bold text-slate-900">Schedule Consultation & Pay with Stripe</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an available day and time slot to confirm your doctor appointment.
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

          {/* Symptoms Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Describe Your Health Symptoms / Reason for Visit
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Mild chest tightness, shortness of breath after climbing stairs for 3 days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
            ></textarea>
          </div>

          {/* Role restriction banner */}
          {isDoctor && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Doctor Account Mode</p>
                <p className="text-amber-800 text-xs mt-0.5">
                  You are logged in with a Doctor account ({user?.name}). Appointment bookings and Stripe consultation payments are reserved exclusively for registered Patient accounts.
                </p>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Administrator Preview Mode</p>
                <p className="text-blue-800 text-xs mt-0.5">
                  You are previewing this doctor profile in Administrator mode. Appointment bookings are reserved for Patient accounts.
                </p>
              </div>
            </div>
          )}

          {/* Confirm Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-500">Total Consultation Fee</span>
              <p className="text-2xl font-extrabold text-teal-800">${doctor.consultationFee}.00 USD</p>
            </div>

            {isDoctor ? (
              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed border border-slate-300 shadow-none"
              >
                <CreditCard className="w-5 h-5 text-slate-400" />
                Booking Disabled (Doctor Account)
              </button>
            ) : isAdmin ? (
              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 bg-slate-100 cursor-not-allowed border border-slate-300 shadow-none"
              >
                <CreditCard className="w-5 h-5 text-slate-400" />
                Booking Disabled (Admin Account)
              </button>
            ) : (
              <button
                onClick={handleBookingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/30 hover:shadow-xl transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Stripe Checkout
              </button>
            )}
          </div>
        </div>

        {/* Patient Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Verified Patient Reviews & Ratings</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real feedback and experience shared by patients who consulted with {doctor.doctorName}.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl shrink-0">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              <div>
                <span className="text-base font-black text-amber-900">
                  {doctor.rating ? Number(doctor.rating).toFixed(1) : '5.0'} / 5.0
                </span>
                <span className="text-[11px] text-amber-700 block font-bold">
                  ({reviews.length} Verified Reviews)
                </span>
              </div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
              <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Patient Reviews Yet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Be the first patient to consult and review {doctor.doctorName}!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.patientPhoto || rev.patientId?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                        alt="Patient"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-teal-500 bg-white"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {rev.patientName || rev.patientId?.name || 'Verified Patient'}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent Visit'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-800">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                    "{rev.reviewText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stripe Modal */}
      <StripeBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        selectedDay={selectedDay}
        selectedSlot={selectedSlot}
        symptoms={symptoms}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
