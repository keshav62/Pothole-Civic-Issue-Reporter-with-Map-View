import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { NotificationBell } from '../notifications/NotificationBell';
import { Menu, Search, User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ toggleSidebar }) => {
  const { currentUser, logout, role } = useAuth();
  const { notifications } = useCivic();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs text-slate-100">
      {/* Left: Mobile Menu Toggle & Page Context Label */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-200 tracking-tight">CivicConnect</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {role === 'SUPER_ADMIN' ? 'HQ Admin' : role === 'DEPARTMENT_ADMIN' ? 'Dept Control' : 'Field Crew'}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search issues, categories, or workers..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-slate-700 transition-all"
          />
        </div>
      </div>

      {/* Right: Role Switcher, Notifications & Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Interactive Quick Role Switcher for Hackathon Demo */}
        <RoleSwitcher />

        {/* Notifications Bell */}
        <NotificationBell />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-1.5 p-1 rounded-md hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-md border border-slate-200 py-1 z-50 divide-y divide-slate-100">
              <div className="px-4 py-2">
                <p className="text-[11px] font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{currentUser?.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                  Govt Authorized
                </div>
              </div>

              <div className="py-0.5">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    if (role === 'FIELD_WORKER') navigate('/worker/profile');
                    else navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-1.5 text-[10px] text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3 h-3 text-slate-400" />
                  Account Settings
                </button>
              </div>

              <div className="py-0.5">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-1.5 text-[10px] text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-3 h-3 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
