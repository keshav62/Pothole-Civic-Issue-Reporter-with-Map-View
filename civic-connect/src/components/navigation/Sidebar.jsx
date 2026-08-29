import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Users,
  Building2,
  HardHat,
  BarChart3,
  Flame,
  AlertOctagon,
  Settings,
  LogOut,
  User,
  UserCheck,
  ClipboardList,
  Plus,
  Shield
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout, role } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Issues', path: '/admin/issues', icon: FileText },
    { label: 'City Map', path: '/admin/map', icon: MapPin },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Field Workers', path: '/admin/workers', icon: HardHat },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Heatmap', path: '/admin/heatmap', icon: Flame },
    { label: 'Escalations', path: '/admin/escalations', icon: AlertOctagon },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const deptNavItems = [
    { label: 'Dashboard', path: '/department/dashboard', icon: LayoutDashboard },
    { label: 'Issues', path: '/department/issues', icon: FileText },
    { label: 'City Map', path: '/department/map', icon: MapPin },
    { label: 'Workers', path: '/department/workers', icon: HardHat },
    { label: 'Assignments', path: '/department/assign', icon: UserCheck },
    { label: 'Analytics', path: '/department/analytics', icon: BarChart3 },
    { label: 'Escalations', path: '/department/escalations', icon: AlertOctagon }
  ];

  const workerNavItems = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/worker/tasks', icon: ClipboardList },
    { label: 'Task Map', path: '/worker/map', icon: MapPin },
    { label: 'Profile', path: '/worker/profile', icon: User }
  ];

  const citizenNavItems = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'My Reports', path: '/citizen/reports', icon: FileText },
    { label: 'Report Issue', path: '/citizen/report', icon: Plus },
    { label: 'Nearby Map', path: '/citizen/nearby', icon: MapPin }
  ];

  const getNavItems = () => {
    if (role === 'SUPER_ADMIN') return adminNavItems;
    if (role === 'DEPARTMENT_ADMIN') return deptNavItems;
    if (role === 'CITIZEN') return citizenNavItems;
    return workerNavItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={toggleSidebar}
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800/80 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header — Clicking redirects to Landing Page */}
        <Link
          to="/"
          className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950 flex-shrink-0 hover:bg-slate-900/60 transition-colors cursor-pointer group"
          title="Go to Landing Page"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-none tracking-tight group-hover:text-blue-300 transition-colors">CivicConnect</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {role === 'CITIZEN' ? 'CITIZEN PORTAL' : role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : role === 'DEPARTMENT_ADMIN' ? 'DEPT ADMIN' : 'FIELD WORKER'}
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {role === 'SUPER_ADMIN'
              ? 'Headquarters Admin'
              : role === 'DEPARTMENT_ADMIN'
              ? 'Department Control'
              : role === 'CITIZEN'
              ? 'Citizen Portal'
              : 'Field Operations'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 flex-shrink-0 space-y-2">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{currentUser?.roleLabel || 'Official'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-transparent hover:border-red-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
