import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';
import AppRoutes from './routes/AppRoutes';
import WorkerRoutes from './routes/WorkerRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {/* Worker module prototype: redirect root → /worker/dashboard */}
          <Routes>
            <Route path="/" element={<Navigate to="/worker/dashboard" replace />} />
            <Route path="/worker/*" element={<WorkerRoutes />} />
            {/* All other routes go through the main app routing (auth, dashboard, etc.) */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
