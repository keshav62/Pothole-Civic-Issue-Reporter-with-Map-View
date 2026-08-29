import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CivicProvider } from './context/CivicContext';
import { AlertProvider } from './context/AlertContext';
import { ToastProvider } from './context/ToastContext';
import { WorkerProvider } from './context/WorkerContext';
import { ToastContainer } from './components/common/Toast';

// Layouts
import { AdminLayout } from './layouts/AdminLayout';
import { DepartmentLayout } from './layouts/DepartmentLayout';
import { WorkerLayout } from './layouts/WorkerLayout';
import { CitizenLayout } from './layouts/CitizenLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
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
import { DepartmentMap } from './pages/department/DepartmentMap';

// Field Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { AssignedTasks } from './pages/worker/AssignedTasks';
import { TaskDetails } from './pages/worker/TaskDetails';
import { WorkerMap } from './pages/worker/WorkerMap';
import { WorkerNotifications } from './pages/worker/WorkerNotifications';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { UploadProof } from './pages/worker/UploadProof';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ReportIssue } from './pages/citizen/ReportIssue';
import { MyReports } from './pages/citizen/MyReports';
import { NearbyMap } from './pages/citizen/NearbyMap';
import { AlertsPage } from './pages/citizen/AlertsPage';

// Protected Route Wrapper enforcing Strict 1:1 Role Based Access
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const roleDashboard = {
    CITIZEN: '/citizen/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
    DEPARTMENT_ADMIN: '/department/dashboard',
    FIELD_WORKER: '/worker/dashboard'
  };

  // Enforce strict role isolation: redirect to assigned portal if role is not allowed for path
  if (allowedRoles && !allowedRoles.includes(role)) {
    const targetPath = roleDashboard[role] || '/citizen/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CivicProvider>
          <AlertProvider>
            <ToastProvider>
              <Routes>
                {/* LANDING PAGE & AUTH */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* SUPER ADMIN ROUTES (Strictly SUPER_ADMIN only) */}
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
                  <Route path="map" element={<AdminHeatmap />} />
                  <Route path="escalations" element={<AdminEscalations />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* DEPARTMENT ADMIN ROUTES (Strictly DEPARTMENT_ADMIN only) */}
                <Route
                  path="/department"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN']}>
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
                  <Route path="map" element={<DepartmentMap />} />
                  <Route path="heatmap" element={<DepartmentMap />} />
                </Route>

                {/* FIELD WORKER ROUTES (Strictly FIELD_WORKER only) */}
                <Route
                  path="/worker"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_WORKER']}>
                      <WorkerProvider>
                        <WorkerLayout />
                      </WorkerProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/worker/dashboard" replace />} />
                  <Route path="dashboard" element={<WorkerDashboard />} />
                  <Route path="tasks" element={<AssignedTasks />} />
                  <Route path="tasks/:id" element={<TaskDetails />} />
                  <Route path="tasks/:id/upload" element={<UploadProof />} />
                  <Route path="map" element={<WorkerMap />} />
                  <Route path="notifications" element={<WorkerNotifications />} />
                  <Route path="profile" element={<WorkerProfile />} />
                </Route>

                {/* CITIZEN ROUTES (Strictly CITIZEN only) */}
                <Route
                  path="/citizen"
                  element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                      <CitizenLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/citizen/dashboard" replace />} />
                  <Route path="dashboard" element={<CitizenDashboard />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="report" element={<ReportIssue />} />
                  <Route path="reports" element={<MyReports />} />
                  <Route path="nearby" element={<NearbyMap />} />
                </Route>

                {/* FALLBACK */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer />
            </ToastProvider>
          </AlertProvider>
        </CivicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
