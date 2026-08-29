import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { NotificationBell } from '../notifications/NotificationBell';
import { Menu, Search, User, LogOut, ShieldCheck, ChevronDown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ toggleSidebar }) => {
  const { currentUser, logout, role } = useAuth();
  const { notifications } = useCivic();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Mobile Sidebar Toggle & Brand Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE MUNICIPAL NETWORK</span>
          </div>

          <div className="sm:hidden">
            <h2 className="text-sm font-black text-slate-900 leading-none">CivicConnect</h2>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {role === 'SUPER_ADMIN' ? 'HQ CONTROL' : role === 'DEPARTMENT_ADMIN' ? 'DIVISION' : 'FIELD'}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Command Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search issue ID (e.g. CC-1024), ward, category, worker..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            Ctrl K
          </span>
        </div>
      </div>

      {/* Right: Quick Role Switcher, Notifications & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for Hackathon & Live Testing */}
        <RoleSwitcher />

        {/* Notifications Bell */}
        <NotificationBell />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-expanded={profileDropdown}
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name || 'User Avatar'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.roleLabel || 'Official'}</p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{currentUser?.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{currentUser?.isFirebaseGoogleAuth || currentUser?.isGoogleAuth ? 'Firebase SSO Verified' : 'Verified Govt Official'}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    if (role === 'FIELD_WORKER') navigate('/worker/profile');
                    else navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account Settings & Security
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out of Platform
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
