import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ClipboardList
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, logout, role } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Issues', path: '/admin/issues', icon: FileText },
    { label: 'City Map', path: '/admin/heatmap', icon: MapPin },
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
    { label: 'City Map', path: '/admin/heatmap', icon: MapPin },
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
    { label: 'Report Issue', path: '/citizen/report', icon: AlertOctagon },
    { label: 'Nearby Issues', path: '/citizen/nearby', icon: MapPin },
    { label: 'Profile', path: '/citizen/profile', icon: User }
  ];

  const getNavItems = () => {
    if (role === 'SUPER_ADMIN') return adminNavItems;
    if (role === 'DEPARTMENT_ADMIN') return deptNavItems;
    if (role === 'CITIZEN') return citizenNavItems;
    return workerNavItems;
  };

  const navItems = getNavItems();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            C
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">CivicConnect</h1>
            <p className="text-[10px] text-slate-400 font-medium">AUTHORITY PORTAL</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {role === 'SUPER_ADMIN' ? 'Headquarters Admin' : role === 'DEPARTMENT_ADMIN' ? 'Department Control' : role === 'CITIZEN' ? 'Citizen Portal' : 'Field Operations'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={`${item.label}-${item.path}`}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile & Logout Bottom */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.roleLabel || 'Official'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
