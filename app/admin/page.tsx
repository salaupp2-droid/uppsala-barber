import { AdminAuth } from '@/components/admin-auth';
import { AdminDashboard } from '@/components/admin-dashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <AdminAuth>
        <AdminDashboard />
      </AdminAuth>
    </div>
  );
}
