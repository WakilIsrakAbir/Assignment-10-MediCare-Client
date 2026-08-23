'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardIndexPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.replace('/login');
      } else {
        const role = user.role || 'patient';
        if (role === 'admin') {
          router.replace('/dashboard/admin');
        } else if (role === 'doctor') {
          router.replace('/dashboard/doctor');
        } else {
          router.replace('/dashboard/patient');
        }
      }
    }
  }, [user, loading, isAuthenticated, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      <p className="text-sm font-semibold text-slate-600">Redirecting to your role dashboard...</p>
    </div>
  );
}
