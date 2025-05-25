import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector

// Layouts
import AuthLayout from '../components/common/AuthLayout';
import OwnerLayout from '../components/common/OwnerLayout';
import TenantLayout from '../components/common/TenantLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import OwnerDashboardPage from '../pages/owner/dashboard/OwnerDashboardPage';
import TenantDashboardPage from '../pages/tenant/dashboard/TenantDashboardPage';
import AddPropertyPage from '../pages/owner/property/AddPropertyPage';
import PropertyDetailPage from '../pages/owner/property/PropertyDetailPage';
import AddRoomPage from '../pages/owner/room/AddRoomPage';
import EditRoomPage from '../pages/owner/room/EditRoomPage';
import RoomDetailPage from '../pages/owner/room/RoomDetailPage'; 
import TenantRoomDetailPage from '../pages/tenant/room/TenantRoomDetailPage'; // Import TenantRoomDetailPage
import NotFoundPage from '../pages/NotFoundPage'; // Import NotFoundPage

// Protected Route
import ProtectedRoute from './ProtectedRoute';

// AuthRedirectWrapper Component
const AuthRedirectWrapper = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    const dashboardPath = user?.userType === 'owner' ? '/owner/dashboard' : '/tenant/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/auth/login" 
          element={
            <AuthRedirectWrapper>
              <AuthLayout><LoginPage /></AuthLayout>
            </AuthRedirectWrapper>
          } 
        />
        <Route 
          path="/auth/signup" 
          element={
            <AuthRedirectWrapper>
              <AuthLayout><SignupPage /></AuthLayout>
            </AuthRedirectWrapper>
          } 
        />

        {/* Owner Routes - Protected */}
        <Route 
          path="/owner/dashboard" 
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <OwnerDashboardPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/property/add" 
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <AddPropertyPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/property/:propertyId" 
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <PropertyDetailPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/property/:propertyId/room/add" 
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <AddRoomPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/property/:propertyId/room/:roomId/edit" 
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <EditRoomPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner/property/:propertyId/room/:roomId/details"
          element={
            <ProtectedRoute role="owner">
              <OwnerLayout>
                <RoomDetailPage />
              </OwnerLayout>
            </ProtectedRoute>
          } 
        />
         {/* Default route for /owner, redirects to dashboard */}
         <Route 
          path="/owner" 
          element={<Navigate to="/owner/dashboard" replace />} 
        />


        {/* Tenant Routes - Protected */}
        <Route 
          path="/tenant/dashboard" 
          element={
            <ProtectedRoute role="tenant">
              <TenantLayout>
                <TenantDashboardPage />
              </TenantLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tenant/property/:propertyId/room/:roomId/details"  // New Route for TenantRoomDetailPage
          element={
            <ProtectedRoute role="tenant">
              <TenantLayout>
                <TenantRoomDetailPage />
              </TenantLayout>
            </ProtectedRoute>
          } 
        />
        {/* Default route for /tenant, redirects to dashboard */}
        <Route 
          path="/tenant" 
          element={<Navigate to="/tenant/dashboard" replace />} 
        />

        {/* Default Redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to="/auth/login" replace />
          } 
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
