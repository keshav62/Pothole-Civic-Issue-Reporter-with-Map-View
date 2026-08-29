import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from '../components/navigation/Topbar';
import { Toast } from '../components/common/Toast';

export const CitizenLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Topbar will contain the RoleSwitcher */}
      <Topbar toggleSidebar={() => {}} />

      <main className="app-page-enter flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
};

export default CitizenLayout;
