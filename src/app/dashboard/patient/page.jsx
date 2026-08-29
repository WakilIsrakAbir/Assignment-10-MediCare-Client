'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Star,
  Clock,
  Stethoscope,
  Grid,
  List,
  X,
  Printer,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboardPage() {
  const { user, authReady, isAuthenticated } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  // Patient states
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientPayments, setPatientPayments] = useState([]);
  const [patientReviews, setPatientReviews] = useState([]);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, apptId: '', day: '', time: '' });
  const [viewPrescriptionModal, setViewPrescriptionModal] = useState({ open: false, data: null });
  const [reviewModal, setReviewModal] = useState({ open: false, doctorId: '', rating: 5, reviewText: '', editId: null });

  // Route protection
  useEffect(() => {
    if (authReady) {
      if (!isAuthenticated || !user) {
        router.replace('/login');
      } else if (user.role !== 'patient') {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, authReady, isAuthenticated, router]);

  // Fetch Patient Data
  useEffect(() => {
    if (user && user.role === 'patient') {
      fetchPatientData();
    }
  }, [user, activeTab]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in.');
        router.replace('/login');
      } else {
        console.warn('Patient fetch status:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const res = await API.patch(`/appointments/${id}/cancel`);
      if (res.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchPatientData();
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
        fetchPatientData();
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
      fetchPatientData();
    } catch (err) {
      toast.error('Failed to save review');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchPatientData();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const totalPaidAmount = patientPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const upcomingCount = patientAppointments.filter(
    (a) => a.appointmentStatus === 'accepted' || a.appointmentStatus === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Patient Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
              alt={user?.name || 'Avatar'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';
              }}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs bg-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Patient'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-teal-100 text-teal-800">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <Link
            href="/doctors"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4" /> Book Doctor Appointment
          </Link>
        </div>

        {/* Patient Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'appointments', label: 'My Appointments', icon: CalendarCheck },
            { id: 'payments', label: 'Payment History', icon: CreditCard },
            { id: 'reviews', label: 'My Reviews', icon: Star },
            { id: 'profile', label: 'My Profile', icon: User },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-28 bg-slate-100 rounded-2xl"></div>
              ))}
            </div>
            <div className="space-y-3 pt-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-100 rounded-2xl w-full"></div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Overview */}
        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
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
                <h3 className="text-2xl font-black text-slate-900">{upcomingCount}</h3>
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

            {/* Recent Appointments */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Recent Appointments</h3>
                <Link href="/doctors" className="text-xs font-bold text-teal-700 hover:underline">
                  + Book Specialist
                </Link>
              </div>

              {patientAppointments.length === 0 ? (
                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl">
                  <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No appointments booked yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.slice(0, 5).map((appt) => (
                    <div
                      key={appt._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{appt.doctorId?.doctorName || 'Dr. Specialist'}</h4>
                        <p className="text-xs text-slate-500">{appt.doctorId?.specialization} • {appt.appointmentDate} at {appt.appointmentTime}</p>
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

        {/* Tab 2: My Appointments */}
        {!loading && activeTab === 'appointments' && (
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
              </div>
            </div>

            {patientAppointments.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Appointments Recorded</h4>
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
                            <>
                              <button
                                onClick={() => handleViewPrescription(appt._id)}
                                className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
                              >
                                Prescription
                              </button>
                              <button
                                onClick={() => setReviewModal({
                                  open: true,
                                  doctorId: appt.doctorId?._id || appt.doctorId,
                                  doctorName: appt.doctorId?.doctorName || 'Doctor',
                                  rating: 5,
                                  reviewText: '',
                                  editId: null
                                })}
                                className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg"
                              >
                                ★ Rate & Review
                              </button>
                            </>
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
                    {appt.appointmentStatus === 'completed' && (
                      <div className="flex gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleViewPrescription(appt._id)}
                          className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl"
                        >
                          Prescription
                        </button>
                        <button
                          onClick={() => setReviewModal({
                            open: true,
                            doctorId: appt.doctorId?._id || appt.doctorId,
                            doctorName: appt.doctorId?.doctorName || 'Doctor',
                            rating: 5,
                            reviewText: '',
                            editId: null
                          })}
                          className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl"
                        >
                          ★ Rate & Review
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Payment History */}
        {!loading && activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment & Transaction Records</h3>
              <p className="text-xs text-slate-500">Stripe payment receipts for your consultations</p>
            </div>

            {patientPayments.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Payments Recorded</h4>
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
                        <td className="py-3.5 px-4">{p.doctorId?.doctorName || 'Doctor'}</td>
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

        {/* Tab 4: My Reviews */}
        {!loading && activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">My Doctor Reviews</h3>
              <p className="text-xs text-slate-500">Manage patient feedback and star ratings</p>
            </div>

            {patientReviews.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Reviews Submitted Yet</h4>
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
                      <div className="flex gap-3">
                        <button
                          onClick={() => setReviewModal({
                            open: true,
                            doctorId: rev.doctorId?._id || rev.doctorId,
                            doctorName: rev.doctorId?.doctorName || 'Doctor',
                            rating: rev.rating || 5,
                            reviewText: rev.reviewText || '',
                            editId: rev._id,
                          })}
                          className="text-xs font-bold text-teal-600 hover:text-teal-800"
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

        {/* Tab 5: My Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 max-w-2xl">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Patient Personal Profile</h3>
              <p className="text-xs text-slate-500">Your profile details registered on MediCare Connect</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user?.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';
                  }}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 bg-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{user?.name}</h4>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                  <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Role</label>
                  <p className="text-sm font-semibold text-teal-700 uppercase">{user?.role}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Account Status</label>
                  <p className="text-sm font-semibold text-emerald-600 capitalize">{user?.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reschedule Modal */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Reschedule Consultation</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">New Visiting Day</label>
                <select
                  value={rescheduleModal.day}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, day: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
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
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">New Time Slot</label>
                <input
                  type="text"
                  value={rescheduleModal.time}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                  placeholder="e.g. 03:00 PM - 05:00 PM"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModal({ open: false, apptId: '', day: '', time: '' })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700">
                  Confirm Reschedule
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
                {viewPrescriptionModal.data.doctorId?.doctorName || 'Doctor Prescription'}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: {viewPrescriptionModal.data.patientId?.name || user?.name}
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

      {/* Rate & Review Doctor Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 border border-slate-100 shadow-2xl relative">
            <button
              onClick={() => setReviewModal({ open: false, doctorId: '', doctorName: '', rating: 5, reviewText: '', editId: null })}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
                Patient Feedback
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Rate & Review {reviewModal.doctorName || 'Doctor'}
              </h3>
              <p className="text-xs text-slate-500">
                Share your consultation experience to help other patients.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-2">Overall Rating</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewModal.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-black text-slate-700 ml-2">{reviewModal.rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">Your Experience / Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={reviewModal.reviewText}
                  onChange={(e) => setReviewModal({ ...reviewModal, reviewText: e.target.value })}
                  placeholder="Share details about the doctor's communication, diagnosis, care quality..."
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50/60 focus:bg-white focus:border-teal-600 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewModal({ open: false, doctorId: '', doctorName: '', rating: 5, reviewText: '', editId: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm">
                  {reviewModal.editId ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
