'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Stethoscope,
  Users,
  Star,
  Save,
  Plus,
  X,
  Printer,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDashboardPage() {
  const { user, setUser, authReady, isAuthenticated } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Doctor states
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState({
    availableDays: [],
    availableSlots: [],
    qualifications: '',
    experience: 0,
    consultationFee: 0,
    hospitalName: '',
    specialization: 'General Medicine',
    about: '',
    profileImage: '',
  });
  const [newSlotInput, setNewSlotInput] = useState('');
  const [newDayInput, setNewDayInput] = useState('Monday');
  const [prescriptionModal, setPrescriptionModal] = useState({
    open: false,
    appointmentId: '',
    patientId: '',
    patientName: '',
    diagnosis: '',
    notes: '',
    advice: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
  });
  const [viewPrescriptionModal, setViewPrescriptionModal] = useState({ open: false, data: null });

  // Route protection
  useEffect(() => {
    if (authReady) {
      if (!isAuthenticated || !user) {
        router.replace('/login');
      } else if (user.role !== 'doctor') {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, authReady, isAuthenticated, router]);

  // Fetch Doctor Data
  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchDoctorData();
    }
  }, [user, activeTab]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'overview' || activeTab === 'requests') {
        const res = await API.get('/appointments/doctor/my-appointments');
        if (res.data.success) setDoctorAppointments(res.data.data || []);
      }
      if (activeTab === 'schedule' || activeTab === 'profile' || activeTab === 'overview') {
        const res = await API.get('/doctors/me/profile');
        if (res.data.success && res.data.data) {
          setDoctorSchedule(res.data.data);
          if (res.data.data.profileImage && user && user.Photo !== res.data.data.profileImage && setUser) {
            const updated = { ...user, Photo: res.data.data.profileImage };
            setUser(updated);
            localStorage.setItem('medicare_user', JSON.stringify(updated));
          }
        }
      }
      if (activeTab === 'reviews' || activeTab === 'overview') {
        const revRes = await API.get('/reviews/doctor-received');
        if (revRes.data.success) {
          setDoctorReviews(revRes.data.data || []);
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in.');
        router.replace('/login');
      } else {
        console.warn('Doctor fetch status:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorStatusChange = async (id, status, appointmentObj = null) => {
    try {
      const res = await API.patch(`/appointments/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}`);
        if (status === 'completed' && appointmentObj) {
          setPrescriptionModal({
            open: true,
            appointmentId: id,
            patientId: appointmentObj.patientId?._id || appointmentObj.patientId || '',
            patientName: appointmentObj.patientId?.name || 'Patient',
            diagnosis: '',
            notes: '',
            advice: '',
            medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
          });
        }
        fetchDoctorData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/doctors/me/profile', doctorSchedule);
      if (res.data.success) {
        toast.success('Doctor profile & photo updated in database!');
        if (doctorSchedule.profileImage && setUser) {
          const updated = { ...user, Photo: doctorSchedule.profileImage };
          setUser(updated);
          localStorage.setItem('medicare_user', JSON.stringify(updated));
        }
        fetchDoctorData();
      }
    } catch (err) {
      toast.error('Failed to update schedule');
    }
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    setDoctorSchedule({
      ...doctorSchedule,
      availableSlots: [...(doctorSchedule.availableSlots || []), newSlotInput.trim()],
    });
    setNewSlotInput('');
  };

  const handleRemoveSlot = (index) => {
    const updated = doctorSchedule.availableSlots.filter((_, i) => i !== index);
    setDoctorSchedule({ ...doctorSchedule, availableSlots: updated });
  };

  const handleAddDay = () => {
    if (!newDayInput) return;
    if (doctorSchedule.availableDays?.includes(newDayInput)) {
      toast.error('Day already added to schedule');
      return;
    }
    setDoctorSchedule({
      ...doctorSchedule,
      availableDays: [...(doctorSchedule.availableDays || []), newDayInput],
    });
  };

  const handleRemoveDay = (dayToRemove) => {
    const updated = doctorSchedule.availableDays.filter((d) => d !== dayToRemove);
    setDoctorSchedule({ ...doctorSchedule, availableDays: updated });
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/prescriptions', {
        appointmentId: prescriptionModal.appointmentId,
        patientId: prescriptionModal.patientId,
        diagnosis: prescriptionModal.diagnosis,
        notes: prescriptionModal.notes,
        advice: prescriptionModal.advice,
        medications: prescriptionModal.medications.filter((m) => m.name.trim() !== ''),
      });
      if (res.data.success) {
        toast.success('Prescription created & saved to database!');
        setPrescriptionModal({ ...prescriptionModal, open: false });
        fetchDoctorData();
      }
    } catch (err) {
      toast.error('Failed to save prescription');
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      const res = await API.get(`/prescriptions/appointment/${appointmentId}`);
      if (res.data.success && res.data.data) {
        setViewPrescriptionModal({ open: true, data: res.data.data });
      } else {
        toast.error('No digital prescription found.');
      }
    } catch (err) {
      toast.error('Prescription not yet issued.');
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const uniquePatientsCount = new Set(
    doctorAppointments.map((a) => a.patientId?._id || a.patientId).filter(Boolean)
  ).size;
  const pendingRequestsCount = doctorAppointments.filter((a) => a.appointmentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Doctor Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={doctorSchedule?.profileImage || user?.Photo || 'https://images.unsplash.com/photo-1594824813686-2a91a92e10fb?auto=format&fit=crop&w=160&q=80'}
              alt="Avatar"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1594824813686-2a91a92e10fb?auto=format&fit=crop&w=160&q=80';
              }}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs bg-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Doctor Specialist'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800">
                  Doctor Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Doctor Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Doctor Overview', icon: LayoutDashboard },
            { id: 'requests', label: 'Appointment Requests', icon: CalendarCheck },
            { id: 'reviews', label: 'Patient Reviews', icon: Star },
            { id: 'schedule', label: 'Manage Schedule', icon: Clock },
            { id: 'profile', label: 'Doctor Profile Settings', icon: Stethoscope },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton during Tab Data Fetch */}
        {loading && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-pulse">
            <div className="h-7 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 bg-slate-100 rounded-2xl"></div>
              ))}
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-100 rounded-2xl w-full"></div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Overview */}
        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold">Total Unique Patients</p>
                <h3 className="text-2xl font-black text-slate-900">{uniquePatientsCount}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-3">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold">Pending Requests</p>
                <h3 className="text-2xl font-black text-slate-900">{pendingRequestsCount}</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-semibold">Rating Status</p>
                <h3 className="text-2xl font-black text-slate-900">
                  {doctorSchedule?.rating && doctorSchedule.rating > 0
                    ? `${Number(doctorSchedule.rating).toFixed(1)} / 5.0`
                    : '0.0 / 5.0'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {doctorSchedule?.totalReviews && doctorSchedule.totalReviews > 0
                    ? `Based on ${doctorSchedule.totalReviews} patient reviews`
                    : 'No patient reviews yet'}
                </p>
              </div>
            </div>

            {/* Scheduled Consultations */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Scheduled Consultations Queue</h3>
              {doctorAppointments.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No patient bookings in database yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {doctorAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">{appt.patientId?.name || 'Patient'}</h4>
                        <p className="text-xs text-slate-500">
                          {appt.appointmentDate} at {appt.appointmentTime} • Reason: {appt.symptoms || 'Consultation'}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        appt.appointmentStatus === 'accepted' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.appointmentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}        {/* Tab 2: Appointment Requests */}
        {!loading && activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Patient Appointment Requests</h3>
              <p className="text-xs text-slate-500">Accept, reject, or mark consultations completed and issue prescriptions</p>
            </div>

            {doctorAppointments.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Appointment Requests Found</h4>
              </div>
            ) : (
              <div className="space-y-4">
                {doctorAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{appt.patientId?.name || 'Patient'}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          appt.appointmentStatus === 'accepted' ? 'bg-teal-100 text-teal-800' :
                          appt.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {appt.appointmentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Schedule: {appt.appointmentDate} at {appt.appointmentTime}
                      </p>
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-2">
                        <strong>Reason:</strong> {appt.symptoms || 'General consultation'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {appt.appointmentStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleDoctorStatusChange(appt._id, 'accepted')}
                            className="px-3.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDoctorStatusChange(appt._id, 'cancelled')}
                            className="px-3.5 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {appt.appointmentStatus === 'accepted' && (
                        <button
                          onClick={() => handleDoctorStatusChange(appt._id, 'completed', appt)}
                          className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
                        >
                          Complete & Issue Prescription
                        </button>
                      )}

                      {appt.appointmentStatus === 'completed' && (
                        <button
                          onClick={() => handleViewPrescription(appt._id)}
                          className="px-3.5 py-2 bg-white border border-teal-600 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-50"
                        >
                          View Prescription
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Patient Reviews & Ratings */}
        {!loading && activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Patient Reviews & Star Ratings</h3>
                <p className="text-xs text-slate-500">Real feedback submitted by your patients after consultation</p>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <div>
                  <span className="text-base font-black text-amber-900">
                    {doctorSchedule?.rating ? Number(doctorSchedule.rating).toFixed(1) : '5.0'} / 5.0
                  </span>
                  <span className="text-[11px] text-amber-700 block font-bold">
                    ({doctorReviews.length} Verified Reviews)
                  </span>
                </div>
              </div>
            </div>

            {doctorReviews.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Patient Reviews Received Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Patients can write reviews and give star ratings after their visits are marked completed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:border-teal-300 transition-colors"
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
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent Consultation'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-100">
                      "{rev.reviewText}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Manage Schedule */}
        {!loading && activeTab === 'schedule' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Manage Visiting Schedule & Slots</h3>
              <p className="text-xs text-slate-500">Configure consultation days and time intervals</p>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-6">
              {/* Days */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Visiting Days</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(doctorSchedule.availableDays || []).map((day) => (
                    <span
                      key={day}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold"
                    >
                      {day}
                      <button type="button" onClick={() => handleRemoveDay(day)} className="hover:text-red-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <select
                    value={newDayInput}
                    onChange={(e) => setNewDayInput(e.target.value)}
                    className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none flex-1"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                      <option key={d} value={d} className="text-slate-900 font-medium">{d}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Add Day
                  </button>
                </div>
              </div>

              {/* Slots */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-2">Available Time Slots</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(doctorSchedule.availableSlots || []).map((slot, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold"
                    >
                      {slot}
                      <button type="button" onClick={() => handleRemoveSlot(idx)} className="hover:text-red-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Add Slot
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Schedule to Database
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Doctor Profile Information</h3>
              <p className="text-xs text-slate-500">Update professional credentials, consultation fee, and hospital affiliation</p>
            </div>

            <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Specialization</label>
                <select
                  value={doctorSchedule.specialization || 'General Medicine'}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                >
                  {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Oncology', 'Gynecology'].map((s) => (
                    <option key={s} value={s} className="text-slate-900 font-medium">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Cardiology)"
                  value={doctorSchedule.qualifications || ''}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Experience (Years)</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={doctorSchedule.experience || 0}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, experience: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Consultation Fee ($ USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={doctorSchedule.consultationFee || 0}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, consultationFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Profile Photo / Avatar Image URL</label>
                <div className="flex gap-3 items-center">
                  <img
                    src={doctorSchedule.profileImage || user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-teal-500 shadow-xs shrink-0"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/your-doctor-photo.jpg"
                    value={doctorSchedule.profileImage || ''}
                    onChange={(e) => setDoctorSchedule({ ...doctorSchedule, profileImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">Hospital Affiliation</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Heart Center"
                  value={doctorSchedule.hospitalName || ''}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, hospitalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-800 tracking-wide mb-1.5">About Doctor</label>
                <textarea
                  rows={3}
                  placeholder="Write a brief professional summary about your medical practice and patient care..."
                  value={doctorSchedule.about || ''}
                  onChange={(e) => setDoctorSchedule({ ...doctorSchedule, about: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 shadow-sm"
                >
                  Save Profile to Database
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Prescription Creation Modal */}
      {prescriptionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Clinical Prescription</h3>
                <p className="text-xs text-slate-500">Issuing prescription for {prescriptionModal.patientName}</p>
              </div>
              <button
                onClick={() => setPrescriptionModal({ ...prescriptionModal, open: false })}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Primary Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension"
                  value={prescriptionModal.diagnosis}
                  onChange={(e) => setPrescriptionModal({ ...prescriptionModal, diagnosis: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-800">Medications List</label>
                  <button
                    type="button"
                    onClick={() =>
                      setPrescriptionModal({
                        ...prescriptionModal,
                        medications: [
                          ...prescriptionModal.medications,
                          { name: '', dosage: '', frequency: '', duration: '' },
                        ],
                      })
                    }
                    className="text-xs text-teal-700 font-bold hover:underline"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptionModal.medications.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Medicine"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].name = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].dosage = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Freq"
                        value={med.frequency}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].frequency = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].duration = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Clinical Advice & Notes</label>
                <textarea
                  rows={2}
                  value={prescriptionModal.advice}
                  onChange={(e) => setPrescriptionModal({ ...prescriptionModal, advice: e.target.value })}
                  placeholder="e.g. Drink plenty of water, avoid cold beverages, follow up in 7 days."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPrescriptionModal({ ...prescriptionModal, open: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {viewPrescriptionModal.open && viewPrescriptionModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 border border-teal-100 shadow-2xl relative">
            <button
              onClick={() => setViewPrescriptionModal({ open: false, data: null })}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-teal-100 pb-4">
              <span className="text-[10px] font-bold uppercase text-teal-600 tracking-wider bg-teal-50 px-2.5 py-1 rounded-md">
                Official Digital Prescription
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {viewPrescriptionModal.data.doctorId?.doctorName || user?.name}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: {viewPrescriptionModal.data.patientId?.name || 'Patient'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Clinical Diagnosis</h4>
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {viewPrescriptionModal.data.diagnosis}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Prescribed Medications</h4>
              <div className="space-y-2">
                {(viewPrescriptionModal.data.medications || []).map((m, idx) => (
                  <div key={idx} className="p-3 bg-teal-50/40 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{m.name} ({m.dosage})</span>
                      <span className="block text-slate-500">{m.frequency}</span>
                    </div>
                    <span className="font-bold text-teal-700">{m.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => setViewPrescriptionModal({ open: false, data: null })}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
