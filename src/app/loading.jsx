import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <LoadingSpinner text="Connecting to MediCare Portal..." />
    </div>
  );
}
