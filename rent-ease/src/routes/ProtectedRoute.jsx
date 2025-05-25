import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /auth/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If a role is required and the user does not have that role, redirect them.
  // For now, we'll redirect to a generic "unauthorized" page or back to login.
  // This can be expanded later.
  if (role && user?.userType !== role) {
    // Potentially redirect to a specific "Unauthorized" page
    // For now, redirecting to login or a default dashboard if they are logged in but wrong role
    alert('You do not have permission to access this page.');
    return <Navigate to={user?.userType === 'owner' ? "/owner/dashboard" : "/tenant/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
