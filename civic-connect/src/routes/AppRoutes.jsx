import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// App Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import ReportsPage from '../pages/reports/ReportsPage';
import MapPage from '../pages/map/MapPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

import { APP_ROUTES, USER_ROLES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Dashboard (which redirects to /login if unauthenticated) */}
      <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />

      {/* Public Auth Routes */}
      <Route path={APP_ROUTES.LOGIN} element={<Login />} />
      <Route path={APP_ROUTES.REGISTER} element={<Register />} />
      <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* Protected Routes inside unified DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={APP_ROUTES.REPORTS} element={<ReportsPage />} />
        <Route path={APP_ROUTES.MAP} element={<MapPage />} />
        <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />

        {/* Example: Specific Role-Gated Routes (Ready for Member 2-5 features) */}
        <Route
          path="/admin/audit"
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DEPARTMENT_ADMIN]}>
              <DashboardPage />
            </RoleRoute>
          }
        />
      </Route>

      {/* Error & Fallback Routes */}
      <Route path={APP_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
