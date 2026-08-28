import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Topbar } from '../components/navigation/Topbar';
import { MobileNavigation } from '../components/navigation/MobileNavigation';
import { Toast } from '../components/common/Toast';

export const WorkerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      {/* Sidebar for Desktop */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Container */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-3 sm:p-5 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav bar for Mobile Devices */}
      <MobileNavigation />

      <Toast />
    </div>
  );
};
