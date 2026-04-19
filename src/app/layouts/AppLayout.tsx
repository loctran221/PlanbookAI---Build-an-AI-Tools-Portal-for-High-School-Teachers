import { Outlet, Navigate } from 'react-router';
import { AppSidebar } from '../components/AppSidebar';
import { useAuth } from '../contexts/AuthContext';

export function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}