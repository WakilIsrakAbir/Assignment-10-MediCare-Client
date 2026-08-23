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
  Printer,
  Grid,
  List
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
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

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
    availableDays: [],
    availableSlots: [],
    qualifications: '',
    experience: 0,
    consultationFee: 0,
    hospitalName: '',
    specialization: 'General Medicine',
    about: '',
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

  // Admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Sync role with logged-in user
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
          if (res.data.success) setPatientAppointments(res.data.data || []);
        }
        if (activeTab === 'payments' || activeTab === 'overview') {
          const res = await API.get('/payments/my-payments');
          if (res.data.success) setPatientPayments(res.data.data || []);
        }
        if (activeTab === 'reviews' || activeTab === 'overview') {
          const res = await API.get('/reviews/my-reviews');
          if (res.data.success) setPatientReviews(res.data.data || []);
        }
      } else if (role === 'doctor') {
        if (activeTab === 'overview' || activeTab === 'requests') {
          const res = await API.get('/appointments/doctor/my-appointments');
          if (res.data.success) setDoctorAppointments(res.data.data || []);
        }
        if (activeTab === 'schedule' || activeTab === 'profile' || activeTab === 'overview') {
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
          if (res.data.success) setAdminUsers(res.data.data || []);
        }
        if (activeTab === 'doctors') {
          const res = await API.get('/admin/doctors');
          if (res.data.success) setAdminDoctors(res.data.data || []);
        }
        if (activeTab === 'appointments') {
          const res = await API.get('/admin/appointments');
          if (res.data.success) setAdminAppointments(res.data.data || []);
        }
        if (activeTab === 'payments') {
          const res = await API.get('/payments/all');
          if (res.data.success) setPatientPayments(res.data.data || []);
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
      if (res.data.success && res.data.data) {
        setViewPrescriptionModal({ open: true, data: res.data.data });
      } else {
        toast.error('No digital prescription found for this visit.');
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
      toast.success('Doctor Profile & Schedules saved to database!');
      fetchTabData();
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
      toast.success(`User status updated to ${newStatus}`);
      fetchTabData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user from database?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted from database');
      fetchTabData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDoctorVerification = async (id, status) => {
    try {
      await API.patch(`/admin/doctors/${id}/verify`, { verificationStatus: status });
      toast.success(`Doctor verification status updated to ${status}`);
      fetchTabData();
    } catch (err) {
      toast.error('Update verification failed');
    }
  };

  // Calculate dynamic totals for Patient
  const totalPaidAmount = patientPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const upcomingAppointmentsCount = patientAppointments.filter(
    (a) => a.appointmentStatus === 'accepted' || a.appointmentStatus === 'pending'
  ).length;

  // Calculate dynamic totals for Doctor
  const uniquePatientsCount = new Set(
    doctorAppointments.map((a) => a.patientId?._id || a.patientId).filter(Boolean)
  ).size;
  const pendingRequestsCount = doctorAppointments.filter((a) => a.appointmentStatus === 'pending').length;

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
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'MediCare User'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email || 'user@medicare.com'}</p>
            </div>
          </div>

          {/* Role Preview Switcher for seamless testing */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 pl-2">Switch Role:</span>
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
                    <h3 className="text-2xl font-black text-slate-900">{patientAppointments.length}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Upcoming Consultations</p>
                    <h3 className="text-2xl font-black text-slate-900">{upcomingAppointmentsCount}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Total Paid</p>
                    <h3 className="text-2xl font-black text-slate-900">${totalPaidAmount}.00</h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
                      <Star className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Reviews Given</p>
                    <h3 className="text-2xl font-black text-slate-900">{patientReviews.length}</h3>
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

                  {patientAppointments.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl">
                      <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">No appointments booked yet</p>
                      <p className="text-xs text-slate-400 mt-1">Browse verified doctors to book your first medical visit.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patientAppointments.slice(0, 5).map((appt) => (
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
                  )}
                </div>
              </div>
            )}

            {/* Tab: My Appointments */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Manage My Appointments</h3>
                    <p className="text-xs text-slate-500">View appointment details, reschedule dates, or cancel visits</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
                    >
                      {viewMode === 'table' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                      {viewMode === 'table' ? 'Card View' : 'Table View'}
                    </button>
                    <Link
                      href="/doctors"
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                    >
                      + Book Specialist
                    </Link>
                  </div>
                </div>

                {patientAppointments.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Appointments Found in Database</h4>
                    <p className="text-xs text-slate-400 mt-1">Book an appointment with any verified doctor.</p>
                  </div>
                ) : viewMode === 'table' ? (
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
                        {patientAppointments.map((appt) => (
                          <tr key={appt._id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {appt.doctorId?.doctorName || 'Dr. Specialist'}
                              <span className="block text-xs text-slate-400 font-normal">{appt.doctorId?.specialization}</span>
                            </td>
                            <td className="py-3.5 px-4 text-xs">{appt.appointmentDate} • {appt.appointmentTime}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                appt.appointmentStatus === 'accepted' ? 'bg-teal-100 text-teal-800' :
                                appt.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {appt.appointmentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                appt.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {appt.paymentStatus || 'unpaid'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              {appt.appointmentStatus === 'completed' && (
                                <button
                                  onClick={() => handleViewPrescription(appt._id)}
                                  className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
                                >
                                  Prescription
                                </button>
                              )}
                              {appt.appointmentStatus !== 'completed' && appt.appointmentStatus !== 'cancelled' && (
                                <>
                                  <button
                                    onClick={() => setRescheduleModal({ open: true, apptId: appt._id, day: appt.appointmentDate, time: appt.appointmentTime })}
                                    className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientAppointments.map((appt) => (
                      <div key={appt._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900">{appt.doctorId?.doctorName}</h4>
                            <p className="text-xs text-slate-500">{appt.doctorId?.specialization}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                          }`}>
                            {appt.appointmentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">🗓️ {appt.appointmentDate} at {appt.appointmentTime}</p>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                          {appt.appointmentStatus === 'completed' && (
                            <button
                              onClick={() => handleViewPrescription(appt._id)}
                              className="px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-bold"
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

            {/* Tab: Payment History */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Payment & Transaction Records</h3>
                  <p className="text-xs text-slate-500">Stripe payment receipts for doctor appointments</p>
                </div>

                {patientPayments.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Payments Recorded in Database</h4>
                    <p className="text-xs text-slate-400 mt-1">Transactions will appear here after paying consultation fees.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Transaction ID</th>
                          <th className="py-3 px-4">Doctor</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patientPayments.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">{p.transactionId}</td>
                            <td className="py-3.5 px-4">{p.doctorId?.doctorName || 'Doctor Specialist'}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-600">${p.amount}.00 USD</td>
                            <td className="py-3.5 px-4 text-xs text-slate-400">
                              {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Recent'}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                Succeeded
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: My Reviews */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">My Doctor Feedback & Reviews</h3>
                  <p className="text-xs text-slate-500">Manage patient testimonials and star ratings</p>
                </div>

                {patientReviews.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Reviews Submitted Yet</h4>
                    <p className="text-xs text-slate-400 mt-1">Leave a review after your consultation with a doctor.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patientReviews.map((rev) => (
                      <div key={rev._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400" />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setReviewModal({ open: true, doctorId: rev.doctorId?._id || rev.doctorId, rating: rev.rating, reviewText: rev.reviewText, editId: rev._id })}
                              className="text-xs font-bold text-slate-600 hover:text-teal-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              className="text-xs font-bold text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 italic">"{rev.reviewText}"</p>
                      </div>
                    ))}
                  </div>
                )}
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
                    <p className="text-xs text-slate-500 font-semibold">Doctor Rating</p>
                    <h3 className="text-2xl font-black text-slate-900">
                      {doctorSchedule?.rating ? `${doctorSchedule.rating} / 5.0` : '5.0 / 5.0'}
                    </h3>
                  </div>
                </div>

                {/* Patient Queue */}
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
                              {appt.appointmentDate} at {appt.appointmentTime} • Symptoms: {appt.symptoms || 'General Checkup'}
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
            )}

            {/* Tab: Appointment Requests */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Patient Appointment Requests</h3>
                  <p className="text-xs text-slate-500">Accept, reject, or mark consultations completed and issue prescriptions</p>
                </div>

                {doctorAppointments.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Appointment Requests Found in Database</h4>
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
                            <strong>Reason:</strong> {appt.symptoms || 'General wellness consultation'}
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
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm"
                            >
                              Mark Completed & Write Prescription
                            </button>
                          )}
                          {appt.appointmentStatus === 'completed' && (
                            <button
                              onClick={() => handleViewPrescription(appt._id)}
                              className="px-3 py-2 bg-white border border-teal-600 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-50"
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

            {/* Tab: Manage Schedule */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Manage Visiting Schedule & Slots</h3>
                  <p className="text-xs text-slate-500">Configure consultation days and time intervals stored in database</p>
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
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs flex-1"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                      >
                        Add Day
                      </button>
                    </div>
                  </div>

                  {/* Slots */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Available Time Slots</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(doctorSchedule.availableSlots || []).map((slot, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
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
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
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

            {/* Tab: Doctor Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Doctor Profile Information</h3>
                  <p className="text-xs text-slate-500">Update professional credentials, consultation fee, and hospital affiliation</p>
                </div>

                <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Specialization</label>
                    <select
                      value={doctorSchedule.specialization || 'General Medicine'}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, specialization: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs"
                    >
                      {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Oncology', 'Gynecology'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Qualifications</label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS, MD (Cardiology)"
                      value={doctorSchedule.qualifications || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, qualifications: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={doctorSchedule.experience || 0}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, experience: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Consultation Fee ($ USD)</label>
                    <input
                      type="number"
                      value={doctorSchedule.consultationFee || 0}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, consultationFee: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hospital Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Heart Center"
                      value={doctorSchedule.hospitalName || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, hospitalName: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">About Doctor</label>
                    <textarea
                      rows={3}
                      value={doctorSchedule.about || ''}
                      onChange={(e) => setDoctorSchedule({ ...doctorSchedule, about: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
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
        )}

        {/* ========================================================================= */}
        {/* ============================= ADMIN VIEW ================================ */}
        {/* ========================================================================= */}
        {role === 'admin' && (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Dynamic Real Metrics from MongoDB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Total Patients</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">
                      {adminAnalytics?.summary?.totalPatients ?? 0}
                    </h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Verified Doctors</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">
                      {adminAnalytics?.summary?.verifiedDoctors ?? 0}
                    </h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Appointments Booked</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">
                      {adminAnalytics?.summary?.totalAppointments ?? 0}
                    </h3>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Total System Revenue</p>
                    <h3 className="text-3xl font-black text-emerald-600 mt-1">
                      ${adminAnalytics?.summary?.totalRevenue ?? 0}.00
                    </h3>
                  </div>
                </div>

                {/* Recharts Analytics from Database */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Line Chart */}
                  <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Monthly Appointments & Patient Activity</h3>
                    <div className="h-72 w-full">
                      {adminAnalytics?.charts?.monthlyAppointmentsData?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={adminAnalytics.charts.monthlyAppointmentsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="appointments" stroke="#0d9488" strokeWidth={3} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="patients" stroke="#06b6d4" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                          No chart data available in database
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bar Chart: Clinical Department Distribution */}
                  <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Department Distribution</h3>
                    <div className="h-72 w-full">
                      {adminAnalytics?.charts?.departmentDistribution?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={adminAnalytics.charts.departmentDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400">
                          No doctors registered in departments yet
                        </div>
                      )}
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

                {adminUsers.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Users Found in Database</h4>
                  </div>
                ) : (
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
                        {adminUsers
                          .filter((u) => u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
                          .map((u) => (
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
                                  {u.status || 'active'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-2">
                                <button
                                  onClick={() => handleToggleUser(u._id, u.status || 'active')}
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
                )}
              </div>
            )}

            {/* Tab: Doctor Verification */}
            {activeTab === 'doctors' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Doctor Verification & Approvals</h3>
                  <p className="text-xs text-slate-500">Verify physician credentials or revoke verification badges</p>
                </div>

                {adminDoctors.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Doctor Applications Found in Database</h4>
                    <p className="text-xs text-slate-400 mt-1">When users register with Doctor role, their applications appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminDoctors.map((doc) => (
                      <div key={doc._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900">{doc.doctorName}</h4>
                          <p className="text-xs text-slate-500">{doc.specialization} • {doc.hospitalName || 'Clinic'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Qualifications: {doc.qualifications} | Fee: ${doc.consultationFee}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                            doc.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.verificationStatus}
                          </span>
                          {doc.verificationStatus !== 'verified' ? (
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
                )}
              </div>
            )}

            {/* Tab: All Appointments */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">All Platform Appointments</h3>
                  <p className="text-xs text-slate-500">Monitor all scheduled, confirmed and completed visits across platform</p>
                </div>

                {adminAppointments.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-800">No Appointments Recorded in Database</h4>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Patient</th>
                          <th className="py-3 px-4">Doctor</th>
                          <th className="py-3 px-4">Schedule</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Payment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminAppointments.map((appt) => (
                          <tr key={appt._id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{appt.patientId?.name || 'Patient'}</td>
                            <td className="py-3.5 px-4">{appt.doctorId?.doctorName || 'Doctor'}</td>
                            <td className="py-3.5 px-4 text-xs">{appt.appointmentDate} at {appt.appointmentTime}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                appt.appointmentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                appt.appointmentStatus === 'accepted' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {appt.appointmentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                                appt.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {appt.paymentStatus || 'unpaid'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  <option value="Saturday">Saturday</option>
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
                {viewPrescriptionModal.data.doctorId?.doctorName || 'Doctor Prescription'}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: {viewPrescriptionModal.data.patientId?.name || 'Verified Patient'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Clinical Diagnosis</h4>
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {viewPrescriptionModal.data.diagnosis || 'Clinical evaluation'}
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

            {viewPrescriptionModal.data.advice && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Doctor Advice</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  {viewPrescriptionModal.data.advice}
                </p>
              </div>
            )}

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

      {/* 3. Issue Prescription Modal (Doctor) */}
      {prescriptionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Issue Digital Prescription</h3>
                <p className="text-xs text-slate-500">Patient: {prescriptionModal.patientName}</p>
              </div>
              <button
                onClick={() => setPrescriptionModal({ ...prescriptionModal, open: false })}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  value={prescriptionModal.diagnosis}
                  onChange={(e) => setPrescriptionModal({ ...prescriptionModal, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Bronchitis, Stage 1 Hypertension"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-slate-700">Medications List</label>
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
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].name = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].dosage = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        value={med.frequency}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].frequency = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration (7 Days)"
                        value={med.duration}
                        onChange={(e) => {
                          const updated = [...prescriptionModal.medications];
                          updated[idx].duration = e.target.value;
                          setPrescriptionModal({ ...prescriptionModal, medications: updated });
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Clinical Advice</label>
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
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
