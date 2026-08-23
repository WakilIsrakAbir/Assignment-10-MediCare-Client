'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  BarChart3,
  Users,
  UserCheck,
  CalendarCheck,
  Search,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle
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
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Admin states
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Route protection
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        toast.error('Please login to access administrator dashboard');
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error(`Access restricted. Redirecting to ${user.role} dashboard.`);
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, authLoading, isAuthenticated, router]);

  // Fetch Admin Data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user, activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      console.error('Admin fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await API.patch(`/admin/users/${id}/status`, { status: newStatus });
      toast.success(`User status changed to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user from database?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted from database');
      fetchAdminData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleDoctorVerification = async (id, status) => {
    try {
      await API.patch(`/admin/doctors/${id}/verify`, { verificationStatus: status });
      toast.success(`Doctor verification status updated to ${status}`);
      fetchAdminData();
    } catch (err) {
      toast.error('Update verification failed');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.Photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Administrator'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-100 text-purple-800">
                  System Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
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
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Real KPI Metrics */}
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

            {/* Recharts Analytics from MongoDB */}
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

              {/* Bar Chart */}
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

        {/* Tab 2: Manage Users */}
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

        {/* Tab 3: Verify Doctors */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Doctor Verification & Approvals</h3>
              <p className="text-xs text-slate-500">Verify physician credentials or revoke verification badges</p>
            </div>

            {adminDoctors.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Doctor Applications Found</h4>
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

        {/* Tab 4: All Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">All Platform Appointments</h3>
              <p className="text-xs text-slate-500">Monitor all scheduled, confirmed and completed visits</p>
            </div>

            {adminAppointments.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Appointments Recorded</h4>
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
    </div>
  );
}
