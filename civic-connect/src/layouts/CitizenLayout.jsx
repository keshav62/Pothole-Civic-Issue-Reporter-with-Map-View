import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { Toast } from '../components/common/Toast';

export const CitizenLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-fade-in flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
};

export default CitizenLayout;
