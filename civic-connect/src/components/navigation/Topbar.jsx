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
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Menu Toggle & Brand Tagline */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>CivicConnect</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : role === 'DEPARTMENT_ADMIN' ? 'DEPT ADMIN' : 'FIELD WORKER'}
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 hidden sm:block">Report. Resolve. Improve Your City.</p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issue ID (e.g. CC-1024), ward, category, worker..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
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
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100">
              <div className="px-4 py-2.5">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Govt Administrator
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    if (role === 'FIELD_WORKER') navigate('/worker/profile');
                    else navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
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
