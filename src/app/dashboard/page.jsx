'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  CreditCard,
  FileText,
  Star,
  Clock,
  ShieldCheck,
  Stethoscope,
  PlusCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  X,
  Plus,
  BarChart3,
  UserCheck,
  Building2,
  Calendar,
  Save,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [role, setRole] = useState('patient');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Patient states
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientPayments, setPatientPayments] = useState([]);
  const [patientReviews, setPatientReviews] = useState([]);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, apptId: '', day: '', time: '' });
  const [viewPrescriptionModal, setViewPrescriptionModal] = useState({ open: false, data: null });
  const [reviewModal, setReviewModal] = useState({ open: false, doctorId: '', rating: 5, reviewText: '', editId: null });

  // Doctor states
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorSchedule, setDoctorSchedule] = useState({
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
    qualifications: 'MBBS, MD (Cardiology)',
    consultationFee: 120,
    hospitalName: 'Apollo Heart Center',
    about: 'Dedicated specialist providing compassionate diagnostics.',
  });
  const [newSlotInput, setNewSlotInput] = useState('');
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

  // Admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Sync role with logged in user or allow switching for demo/testing
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  // Fetch data based on role and tab
  useEffect(() => {
    fetchTabData();
  }, [role, activeTab]);

  const fetchTabData = async () => {
    try {
      setLoading(true);
      if (role === 'patient') {
        if (activeTab === 'overview' || activeTab === 'appointments') {
          const res = await API.get('/appointments/patient/my-appointments');
          if (res.data.success) setPatientAppointments(res.data.data);
        }
        if (activeTab === 'payments' || activeTab === 'overview') {
          const res = await API.get('/payments/my-payments');
          if (res.data.success) setPatientPayments(res.data.data);
        }
        if (activeTab === 'reviews' || activeTab === 'overview') {
          const res = await API.get('/reviews/my-reviews');
          if (res.data.success) setPatientReviews(res.data.data);
        }
      } else if (role === 'doctor') {
        if (activeTab === 'overview' || activeTab === 'requests') {
          const res = await API.get('/appointments/doctor/my-appointments');
          if (res.data.success) setDoctorAppointments(res.data.data);
        }
        if (activeTab === 'schedule' || activeTab === 'profile') {
          const res = await API.get('/doctors/me/profile');
          if (res.data.success && res.data.data) {
            setDoctorSchedule(res.data.data);
          }
        }
      } else if (role === 'admin') {
        if (activeTab === 'overview' || activeTab === 'analytics') {
          const res = await API.get('/admin/analytics');
          if (res.data.success) setAdminAnalytics(res.data);
        }
        if (activeTab === 'users') {
          const res = await API.get('/admin/users');
          if (res.data.success) setAdminUsers(res.data.data);
        }
        if (activeTab === 'doctors') {
          const res = await API.get('/admin/doctors');
          if (res.data.success) setAdminDoctors(res.data.data);
        }
        if (activeTab === 'appointments') {
          const res = await API.get('/admin/appointments');
          if (res.data.success) setAdminAppointments(res.data.data);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= PATIENT HANDLERS =================
  const handleCancelAppointment = async (id) => {
    try {
      const res = await API.patch(`/appointments/${id}/cancel`);
      if (res.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchTabData();
      }
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.patch(`/appointments/${rescheduleModal.apptId}/reschedule`, {
        appointmentDate: rescheduleModal.day,
        appointmentTime: rescheduleModal.time,
      });
      if (res.data.success) {
        toast.success('Appointment rescheduled!');
        setRescheduleModal({ open: false, apptId: '', day: '', time: '' });
        fetchTabData();
      }
    } catch (err) {
      toast.error('Reschedule failed');
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      const res = await API.get(`/prescriptions/appointment/${appointmentId}`);
      if (res.data.success) {
        setViewPrescriptionModal({ open: true, data: res.data.data });
      }
    } catch (err) {
      toast.error('Prescription not yet issued by doctor.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reviewModal.editId) {
        await API.put(`/reviews/${reviewModal.editId}`, {
          rating: reviewModal.rating,
          reviewText: reviewModal.reviewText,
        });
        toast.success('Review updated!');
      } else {
        await API.post('/reviews', {
          doctorId: reviewModal.doctorId,
          rating: reviewModal.rating,
          reviewText: reviewModal.reviewText,
        });
        toast.success('Review submitted successfully!');
      }
      setReviewModal({ open: false, doctorId: '', rating: 5, reviewText: '', editId: null });
      fetchTabData();
    } catch (err) {
      toast.error('Failed to save review');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchTabData();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  // ================= DOCTOR HANDLERS =================
  const handleDoctorStatusChange = async (id, status) => {
    try {
      const res = await API.patch(`/appointments/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}`);
        fetchTabData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      await API.put('/doctors/me/profile', doctorSchedule);
      toast.success('Schedule & Profile saved successfully!');
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
        toast.success('Prescription created & Appointment marked completed!');
        setPrescriptionModal({ ...prescriptionModal, open: false });
        fetchTabData();
      }
    } catch (err) {
      toast.error('Failed to save prescription');
    }
  };

  // ================= ADMIN HANDLERS =================
  const handleToggleUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await API.patch(`/admin/users/${id}/status`, { status: newStatus });
      toast.success(`User is now ${newStatus}`);
      fetchTabData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchTabData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDoctorVerification = async (id, status) => {
    try {
      await API.patch(`/admin/doctors/${id}/verification`, { verificationStatus: status });
      toast.success(`Doctor verification set to ${status}`);
      fetchTabData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  // Colors for Recharts
  const COLORS = ['#0d9488', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'];

  return (
    <div className="min-h-screen bg-slate-100/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header & Role Switcher */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Healthcare User'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email || 'user@medicareconnect.com'}</p>
            </div>
          </div>

          {/* Role Preview Switcher (For easy testing of all 3 assignment roles) */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 pl-2">Switch View:</span>
            {['patient', 'doctor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setActiveTab('overview');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  role === r ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {role === 'patient' && (
            <>
              {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'appointments', label: 'My Appointments', icon: CalendarCheck },
                { id: 'payments', label: 'Payment History', icon: CreditCard },
                { id: 'reviews', label: 'My Reviews', icon: Star },
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
            </>
          )}

          {role === 'doctor' && (
            <>
              {[
                { id: 'overview', label: 'Doctor Overview', icon: LayoutDashboard },
                { id: 'requests', label: 'Appointment Requests', icon: CalendarCheck },
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
            </>
          )}

          {role === 'admin' && (
            <>
              {[
                { id: 'overview', label: 'Admin Analytics', icon: BarChart3 },
                { id: 'users', label: 'Manage Users', icon: Users },
                { id: 'doctors', label: 'Verify Doctors', icon: UserCheck },
                { id: 'appointments', label: 'All Appointments', icon: CalendarCheck },
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
            </>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ============================ PATIENT VIEW =============================== */}
        {/* ========================================================================= */}
        {role === 'patient' && (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-3">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Total Appointments</p>
                    <h3 className="text-2xl font-black text-slate-900">{patientAppointments.length || 3}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Upcoming Consultations</p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {patientAppointments.filter((a) => a.appointmentStatus === 'accepted' || a.appointmentStatus === 'pending').length || 2}
                    </h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Total Paid</p>
                    <h3 className="text-2xl font-black text-slate-900">$240.00</h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                      <Star className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Reviews Given</p>
                    <h3 className="text-2xl font-black text-slate-900">{patientReviews.length || 2}</h3>
                  </div>
                </div>

                {/* Recent Bookings List */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Recent Appointments</h3>
                    <Link href="/doctors" className="text-xs font-bold text-teal-700 hover:underline">
                      + Book New Specialist
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {(patientAppointments.length > 0 ? patientAppointments : [
                      {
                        _id: 'a1',
                        appointmentDate: 'Monday',
                        appointmentTime: '09:00 AM - 11:00 AM',
                        appointmentStatus: 'accepted',
                        paymentStatus: 'paid',
                        fee: 120,
                        doctorId: { doctorName: 'Dr. Sarah Jenkins', specialization: 'Cardiology', hospitalName: 'Apollo Heart Center' },
                      },
                      {
                        _id: 'a2',
                        appointmentDate: 'Thursday',
                        appointmentTime: '02:00 PM - 04:00 PM',
                        appointmentStatus: 'completed',
                        paymentStatus: 'paid',
                        fee: 90,
                        doctorId: { doctorName: 'Dr. Elena Rostova', specialization: 'Pediatrics', hospitalName: 'Childrens Care Hospital' },
                      },
                    ]).map((appt) => (
                      <div
                        key={appt._id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{appt.doctorId?.doctorName || 'Dr. Specialist'}</h4>
                            <p className="text-xs text-slate-500">{appt.doctorId?.specialization} • {appt.appointmentDate} at {appt.appointmentTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            appt.appointmentStatus === 'accepted' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {appt.appointmentStatus}
                          </span>
                          {appt.appointmentStatus === 'completed' && (
                            <button
                              onClick={() => handleViewPrescription(appt._id)}
                              className="px-3 py-1 bg-white border border-teal-500 text-teal-700 text-xs font-bold rounded-xl hover:bg-teal-50"
                            >
                              Prescription
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: My Appointments with Full CRUD (View, Reschedule, Cancel, Prescription) */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Manage My Appointments</h3>
                    <p className="text-xs text-slate-500">View appointment details, reschedule dates, or cancel visits</p>
                  </div>
                  <Link
                    href="/doctors"
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                  >
                    + Book Specialist
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Doctor</th>
                        <th className="py-3 px-4">Schedule</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(patientAppointments.length > 0 ? patientAppointments : [
                        {
                          _id: 'a1',
                          appointmentDate: 'Monday',
                          appointmentTime: '09:00 AM - 11:00 AM',
                          appointmentStatus: 'accepted',
                          paymentStatus: 'paid',
                          fee: 120,
                          doctorId: { _id: 'd1', doctorName: 'Dr. Sarah Jenkins', specialization: 'Cardiology' },
                        },
                        {
                          _id: 'a2',
                          appointmentDate: 'Thursday',
                          appointmentTime: '02:00 PM - 04:00 PM',
                          appointmentStatus: 'completed',
                          paymentStatus: 'paid',
                          fee: 90,
                          doctorId: { _id: 'd2', doctorName: 'Dr. Elena Rostova', specialization: 'Pediatrics' },
                        },
                      ]).map((appt) => (
                        <tr key={appt._id} className="hover:bg-slate-50/60">
                          <td className="py-4 px-4 font-bold text-slate-900">
                            {appt.doctorId?.doctorName}
                            <span className="block text-xs font-normal text-teal-600">{appt.doctorId?.specialization}</span>
                          </td>
                          <td className="py-4 px-4 font-medium text-xs text-slate-700">
                            {appt.appointmentDate} <br />
                            <span className="text-slate-400">{appt.appointmentTime}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              appt.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'
                            }`}>
                              {appt.appointmentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              Paid (${appt.fee || 120})
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            {appt.appointmentStatus !== 'cancelled' && appt.appointmentStatus !== 'completed' && (
                              <>
                                <button
                                  onClick={() => setRescheduleModal({ open: true, apptId: appt._id, day: appt.appointmentDate, time: appt.appointmentTime })}
                                  className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancelAppointment(appt._id)}
                                  className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {appt.appointmentStatus === 'completed' && (
                              <>
                                <button
                                  onClick={() => handleViewPrescription(appt._id)}
                                  className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                                >
                                  View Rx
                                </button>
                                <button
                                  onClick={() => setReviewModal({ open: true, doctorId: appt.doctorId?._id || 'd1', rating: 5, reviewText: '', editId: null })}
                                  className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                                >
                                  Review Doctor
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Payment History */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Payment History & Invoices</h3>
                  <p className="text-xs text-slate-500">Official receipts and Stripe transaction logs</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'txn_12345', amount: 120, doctor: 'Dr. Sarah Jenkins', date: '2026-08-20', status: 'succeeded' },
                    { id: 'txn_67890', amount: 90, doctor: 'Dr. Elena Rostova', date: '2026-08-15', status: 'succeeded' },
                  ].map((pay) => (
                    <div key={pay.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Paid to {pay.doctor}</p>
                        <p className="text-xs text-slate-400 font-mono">Transaction ID: {pay.id} • {pay.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-teal-800">${pay.amount}.00</span>
                        <span className="block text-[10px] font-bold text-emerald-600 uppercase">Paid via Stripe</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: My Reviews with CRUD */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">My Clinical Reviews</h3>
                    <p className="text-xs text-slate-500">Manage ratings and feedback given to doctors</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(patientReviews.length > 0 ? patientReviews : [
                    {
                      _id: 'r1',
                      rating: 5,
                      reviewText: 'Dr. Sarah Jenkins was very attentive and the consultation improved my cardiac routine.',
                      doctorId: { doctorName: 'Dr. Sarah Jenkins' },
                      createdAt: '2026-08-21',
                    },
                  ]).map((rev) => (
                    <div key={rev._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReviewModal({ open: true, doctorId: rev.doctorId?._id, rating: rev.rating, reviewText: rev.reviewText, editId: rev._id })}
                            className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 italic">&ldquo;{rev.reviewText}&rdquo;</p>
                      <span className="block text-xs font-semibold text-teal-700">For {rev.doctorId?.doctorName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ============================= DOCTOR VIEW =============================== */}
        {/* ========================================================================= */}
        {role === 'doctor' && (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-bold uppercase">Today&apos;s Appointments</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">4 Patients</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-bold uppercase">Total Consultations</p>
                    <h3 className="text-3xl font-extrabold text-teal-700 mt-2">128 Completed</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-bold uppercase">Average Rating</p>
                    <h3 className="text-3xl font-extrabold text-amber-500 mt-2">4.9 ★</h3>
                  </div>
                </div>

                {/* Appointment Queue */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Incoming Appointment Requests</h3>
                  <div className="space-y-3">
                    {[
                      { _id: 'd_req1', patient: 'Liam Hemsworth', time: '10:00 AM', day: 'Today', symptoms: 'Chronic Migraine & dizziness', status: 'pending' },
                      { _id: 'd_req2', patient: 'Emma Watson', time: '02:30 PM', day: 'Today', symptoms: 'Follow-up ECG consultation', status: 'accepted' },
                    ].map((req) => (
                      <div key={req._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{req.patient}</h4>
                          <p className="text-xs text-slate-500">{req.day} at {req.time} • Reason: {req.symptoms}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {req.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleDoctorStatusChange(req._id, 'accepted')}
                                className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDoctorStatusChange(req._id, 'rejected')}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setPrescriptionModal({
                                open: true,
                                appointmentId: req._id,
                                patientId: 'p1',
                                patientName: req.patient,
                                diagnosis: '',
                                notes: '',
                                advice: '',
                                medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
                              })}
                              className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                            >
                              Mark Completed & Issue Rx
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Manage Schedule */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Manage Consultation Schedule</h3>
                  <p className="text-xs text-slate-500">Configure weekly visiting days and active appointment slots</p>
                </div>

                <form onSubmit={handleSaveSchedule} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Active Consultation Days</label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const isSelected = doctorSchedule.availableDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const updated = isSelected
                                ? doctorSchedule.availableDays.filter((d) => d !== day)
                                : [...(doctorSchedule.availableDays || []), day];
                              setDoctorSchedule({ ...doctorSchedule, availableDays: updated });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Available Time Slots</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="e.g. 05:00 PM - 07:00 PM"
                        value={newSlotInput}
                        onChange={(e) => setNewSlotInput(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
                      >
                        + Add Slot
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {doctorSchedule.availableSlots?.map((slot, i) => (
                        <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-800">
                          {slot}
                          <button type="button" onClick={() => handleRemoveSlot(i)} className="text-red-500 hover:text-red-700">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700"
                  >
                    Save Schedule Changes
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Doctor Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Doctor Profile Management</h3>
                  <p className="text-xs text-slate-500">Update medical qualifications, consultation fees, and bio</p>
                </div>

                <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={doctorSchedule.qualifications || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, qualifications: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Consultation Fee ($ USD)</label>
                    <input
                      type="number"
                      value={doctorSchedule.consultationFee || 100}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, consultationFee: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital / Clinic Affiliation</label>
                    <input
                      type="text"
                      value={doctorSchedule.hospitalName || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, hospitalName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Bio</label>
                    <textarea
                      rows={3}
                      value={doctorSchedule.about || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, about: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    ></textarea>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl sm:col-span-2">
                    Update Profile
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ============================== ADMIN VIEW =============================== */}
        {/* ========================================================================= */}
        {role === 'admin' && (
          <div className="space-y-6">
            {/* Analytics Tab with Recharts */}
            {(activeTab === 'overview' || activeTab === 'analytics') && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold uppercase text-slate-400">Total Patients</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                      {adminAnalytics?.summary?.totalPatients || 8500}
                    </h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold uppercase text-slate-400">Verified Doctors</p>
                    <h3 className="text-3xl font-extrabold text-teal-600 mt-1">
                      {adminAnalytics?.summary?.verifiedDoctors || 120}
                    </h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold uppercase text-slate-400">Appointments Booked</p>
                    <h3 className="text-3xl font-extrabold text-cyan-600 mt-1">
                      {adminAnalytics?.summary?.totalAppointments || 14200}
                    </h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs font-bold uppercase text-slate-400">Total System Revenue</p>
                    <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">$66,900</h3>
                  </div>
                </div>

                {/* Recharts Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Line Chart: Monthly Appointments */}
                  <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Monthly Appointments & Patient Inflow</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={adminAnalytics?.charts?.monthlyAppointmentsData || [
                          { month: 'Jan', appointments: 65, patients: 120 },
                          { month: 'Feb', appointments: 85, patients: 150 },
                          { month: 'Mar', appointments: 110, patients: 190 },
                          { month: 'Apr', appointments: 140, patients: 230 },
                          { month: 'May', appointments: 195, patients: 290 },
                          { month: 'Jun', appointments: 240, patients: 350 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={3} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="patients" stroke="#06b6d4" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar Chart: Clinical Department Share */}
                  <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Department Distribution</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={adminAnalytics?.charts?.departmentDistribution || [
                          { name: 'Cardio', count: 35 },
                          { name: 'Neuro', count: 25 },
                          { name: 'Ortho', count: 22 },
                          { name: 'Pedia', count: 20 },
                          { name: 'Derma', count: 14 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Manage Users */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Manage Platform Users</h3>
                    <p className="text-xs text-slate-500">View, suspend, activate or remove registered accounts</p>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(adminUsers.length > 0 ? adminUsers : [
                        { _id: 'u1', name: 'John Connor', email: 'john@gmail.com', role: 'patient', status: 'active' },
                        { _id: 'u2', name: 'Dr. Sarah Jenkins', email: 'sarah@apollo.com', role: 'doctor', status: 'active' },
                        { _id: 'u3', name: 'Spam User', email: 'spam@bot.com', role: 'patient', status: 'suspended' },
                      ]).filter((u) => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-xs text-slate-400">{u.email}</span>
                          </td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-xs">{u.role}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUser(u._id, u.status)}
                              className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Doctor Verification */}
            {activeTab === 'doctors' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Doctor Verification & Approvals</h3>
                  <p className="text-xs text-slate-500">Verify physician credentials or revoke verification badges</p>
                </div>

                <div className="space-y-4">
                  {[
                    { _id: 'd1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', hospital: 'Apollo Heart Center', status: 'verified' },
                    { _id: 'd2', name: 'Dr. John Doe (New Applicant)', specialization: 'Dermatology', hospital: 'General Hospital', status: 'pending' },
                  ].map((doc) => (
                    <div key={doc._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                        <p className="text-xs text-slate-500">{doc.specialization} • {doc.hospital}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          doc.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.status}
                        </span>
                        {doc.status !== 'verified' ? (
                          <button
                            onClick={() => handleDoctorVerification(doc._id, 'verified')}
                            className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDoctorVerification(doc._id, 'pending')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ============================= MODALS ==================================== */}
      {/* ========================================================================= */}

      {/* 1. Reschedule Modal */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Reschedule Consultation</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Visiting Day</label>
                <select
                  value={rescheduleModal.day}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, day: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Time Slot</label>
                <input
                  type="text"
                  value={rescheduleModal.time}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                  placeholder="e.g. 03:00 PM - 05:00 PM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModal({ open: false, apptId: '', day: '', time: '' })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. View Prescription Modal */}
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
                {viewPrescriptionModal.data.doctorName || 'Dr. Specialist'}
              </h3>
              <p className="text-xs text-slate-500">Patient: {viewPrescriptionModal.data.patientName || 'Verified Patient'}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Clinical Diagnosis</h4>
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {viewPrescriptionModal.data.diagnosis || 'Post-consultation regular health management'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Prescribed Medications</h4>
              <div className="space-y-2">
                {(viewPrescriptionModal.data.medications?.length > 0 ? viewPrescriptionModal.data.medications : [
                  { name: 'Atorvastatin', dosage: '20mg', frequency: '0-0-1 (Night)', duration: '30 Days' },
                  { name: 'Aspirin', dosage: '75mg', frequency: '1-0-0 (Morning)', duration: '30 Days' },
                ]).map((med, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-teal-50/60 text-xs border border-teal-100 flex justify-between">
                    <span className="font-bold text-teal-900">{med.name} ({med.dosage})</span>
                    <span className="text-slate-600">{med.frequency} • {med.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Physician Advice</h4>
              <p className="text-xs text-slate-600">{viewPrescriptionModal.data.advice || 'Follow-up in 2 weeks.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Review Doctor Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900">{reviewModal.editId ? 'Edit Review' : 'Write Doctor Review'}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating</label>
                <select
                  value={reviewModal.rating}
                  onChange={(e) => setReviewModal({ ...reviewModal, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  value={reviewModal.reviewText}
                  onChange={(e) => setReviewModal({ ...reviewModal, reviewText: e.target.value })}
                  placeholder="Describe your consultation experience..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ open: false, doctorId: '', rating: 5, reviewText: '', editId: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Doctor Prescription Creator Modal */}
      {prescriptionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 my-8">
            <h3 className="text-xl font-bold text-slate-900">Issue Prescription for {prescriptionModal.patientName}</h3>
            
            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Hypertension, Stage 1"
                  value={prescriptionModal.diagnosis}
                  onChange={(e) => setPrescriptionModal({ ...prescriptionModal, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Medications</label>
                {prescriptionModal.medications.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => {
                        const meds = [...prescriptionModal.medications];
                        meds[idx].name = e.target.value;
                        setPrescriptionModal({ ...prescriptionModal, medications: meds });
                      }}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (500mg)"
                      value={med.dosage}
                      onChange={(e) => {
                        const meds = [...prescriptionModal.medications];
                        meds[idx].dosage = e.target.value;
                        setPrescriptionModal({ ...prescriptionModal, medications: meds });
                      }}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Freq (1-0-1)"
                      value={med.frequency}
                      onChange={(e) => {
                        const meds = [...prescriptionModal.medications];
                        meds[idx].frequency = e.target.value;
                        setPrescriptionModal({ ...prescriptionModal, medications: meds });
                      }}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={med.duration}
                      onChange={(e) => {
                        const meds = [...prescriptionModal.medications];
                        meds[idx].duration = e.target.value;
                        setPrescriptionModal({ ...prescriptionModal, medications: meds });
                      }}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setPrescriptionModal({
                    ...prescriptionModal,
                    medications: [...prescriptionModal.medications, { name: '', dosage: '', frequency: '', duration: '' }],
                  })}
                  className="text-xs font-bold text-teal-700 mt-1"
                >
                  + Add Another Medication
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Clinical Advice / Follow-up</label>
                <textarea
                  rows={2}
                  value={prescriptionModal.advice}
                  onChange={(e) => setPrescriptionModal({ ...prescriptionModal, advice: e.target.value })}
                  placeholder="e.g. Avoid salty food, monitor BP daily, follow-up in 2 weeks"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPrescriptionModal({ ...prescriptionModal, open: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600">
                  Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
