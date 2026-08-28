import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import { APP_ROUTES } from '../utils/constants';

export const RoleRoute = ({
  allowedRoles = [],
  children,
  redirectTo = APP_ROUTES.UNAUTHORIZED,
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading.PageLoader message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If no roles specified, allow any authenticated user
  if (allowedRoles.length === 0) {
    return children ? children : <Outlet />;
  }

  const hasPermission = user && allowedRoles.includes(user.role);

  if (!hasPermission) {
    return <Navigate to={redirectTo} state={{ attemptedPath: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
