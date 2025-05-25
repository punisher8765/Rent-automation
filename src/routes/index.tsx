import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage } from '@/pages/auth';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { OwnerDashboard } from '@/pages/owner/dashboard';
import { OwnerProperties } from '@/pages/owner/properties';
import { OwnerRooms } from '@/pages/owner/rooms';
import { OwnerTenants } from '@/pages/owner/tenants';
import { OwnerPayments } from '@/pages/owner/payments';
import { TenantDashboard } from '@/pages/tenant/dashboard';
import { TenantRoom } from '@/pages/tenant/room';
import { TenantPayments } from '@/pages/tenant/payments';
import { ProfilePage } from '@/pages/common/profile';
import { NotFoundPage } from '@/pages/common/not-found';
import { useAuth } from '@/hooks/use-auth';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
}: { 
  children: React.ReactNode, 
  requiredRole?: 'owner' | 'tenant' 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        
        {/* Owner Routes */}
        <Route path="/owner" element={
          <ProtectedRoute requiredRole="owner">
            <DashboardLayout userRole="owner" />
          </ProtectedRoute>
        }>
          <Route index element={<OwnerDashboard />} />
          <Route path="properties" element={<OwnerProperties />} />
          <Route path="rooms" element={<OwnerRooms />} />
          <Route path="tenants" element={<OwnerTenants />} />
          <Route path="payments" element={<OwnerPayments />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Tenant Routes */}
        <Route path="/tenant" element={
          <ProtectedRoute requiredRole="tenant">
            <DashboardLayout userRole="tenant" />
          </ProtectedRoute>
        }>
          <Route index element={<TenantDashboard />} />
          <Route path="room" element={<TenantRoom />} />
          <Route path="payments" element={<TenantPayments />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}