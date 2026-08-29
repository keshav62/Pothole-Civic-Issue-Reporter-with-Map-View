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
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#080f1a] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800/60 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Brand Header */}
      <div className="h-14 flex items-center px-6 border-b border-slate-800/80 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider">
            C
          </div>
          <div>
            <h1 className="font-semibold text-slate-100 text-sm tracking-tight leading-none">CivicConnect</h1>
            <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-1">AUTHORITY PORTAL</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <div>
          <div className="px-3 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {role === 'SUPER_ADMIN' 
              ? 'Control Center' 
              : role === 'DEPARTMENT_ADMIN' 
                ? 'Department Management' 
                : role === 'CITIZEN' 
                  ? 'Citizen Operations' 
                  : 'Field Service'}
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                key={`${item.label}-${item.path}`}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-blue-600/15 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {/* Left indicator accent line */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-500 rounded-r-full" />
                )}
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile & Logout Bottom */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded bg-slate-800/30">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-800"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-200 truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[9px] text-slate-500 truncate">{currentUser?.roleLabel || 'Official'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 border border-slate-800 hover:border-red-900/30 transition-all cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
