import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CivicProvider } from './context/CivicContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { DepartmentLayout } from './layouts/DepartmentLayout';
import { WorkerLayout } from './layouts/WorkerLayout';

// Public & Auth Pages
import { Login } from './pages/Login';
import { Unauthorized } from './pages/Unauthorized';
import { NotFound } from './pages/NotFound';

// Super Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminIssues } from './pages/admin/AdminIssues';
import { AdminIssueDetails } from './pages/admin/AdminIssueDetails';
import { UserManagement } from './pages/admin/UserManagement';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { FieldWorkerManagement } from './pages/admin/FieldWorkerManagement';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminHeatmap } from './pages/admin/AdminHeatmap';
import { AdminEscalations } from './pages/admin/AdminEscalations';
import { AdminSettings } from './pages/admin/AdminSettings';

// Department Admin Pages
import { DepartmentDashboard } from './pages/department/DepartmentDashboard';
import { DepartmentIssues } from './pages/department/DepartmentIssues';
import { DepartmentAssign } from './pages/department/DepartmentAssign';
import { DepartmentWorkers } from './pages/department/DepartmentWorkers';
import { DepartmentAnalytics } from './pages/department/DepartmentAnalytics';
import { DepartmentEscalations } from './pages/department/DepartmentEscalations';

// Field Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { AssignedTasks } from './pages/worker/AssignedTasks';
import { TaskDetails } from './pages/worker/TaskDetails';
import { WorkerMap } from './pages/worker/WorkerMap';
import { WorkerNotifications } from './pages/worker/WorkerNotifications';
import { WorkerProfile } from './pages/worker/WorkerProfile';

// Protected Route Wrapper enforcing Role Based Access
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Root Redirect based on user role
const RootRedirect = () => {
  const { currentUser, role } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'DEPARTMENT_ADMIN') return <Navigate to="/department/dashboard" replace />;
  if (role === 'FIELD_WORKER') return <Navigate to="/worker/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CivicProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route path="/" element={<RootRedirect />} />

              {/* SUPER ADMIN ROUTES */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="issues" element={<AdminIssues />} />
                <Route path="issues/:id" element={<AdminIssueDetails />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="workers" element={<FieldWorkerManagement />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="heatmap" element={<AdminHeatmap />} />
                <Route path="escalations" element={<AdminEscalations />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* DEPARTMENT ADMIN ROUTES */}
              <Route
                path="/department"
                element={
                  <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                    <DepartmentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/department/dashboard" replace />} />
                <Route path="dashboard" element={<DepartmentDashboard />} />
                <Route path="issues" element={<DepartmentIssues />} />
                <Route path="issues/:id" element={<AdminIssueDetails />} />
                <Route path="assign" element={<DepartmentAssign />} />
                <Route path="workers" element={<DepartmentWorkers />} />
                <Route path="analytics" element={<DepartmentAnalytics />} />
                <Route path="escalations" element={<DepartmentEscalations />} />
              </Route>

              {/* FIELD WORKER ROUTES */}
              <Route
                path="/worker"
                element={
                  <ProtectedRoute allowedRoles={['FIELD_WORKER', 'SUPER_ADMIN', 'DEPARTMENT_ADMIN']}>
                    <WorkerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/worker/dashboard" replace />} />
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="tasks" element={<AssignedTasks />} />
                <Route path="tasks/:id" element={<TaskDetails />} />
                <Route path="map" element={<WorkerMap />} />
                <Route path="notifications" element={<WorkerNotifications />} />
                <Route path="profile" element={<WorkerProfile />} />
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </ToastProvider>
        </CivicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
