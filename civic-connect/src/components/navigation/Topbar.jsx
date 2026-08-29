import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { NotificationBell } from '../notifications/NotificationBell';
import { CommandPalette } from '../common/CommandPalette';
import { AccountSettingsModal } from '../common/AccountSettingsModal';
import { Menu, Search, User, LogOut, ShieldCheck, ChevronDown, Radio } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const Topbar = ({ toggleSidebar }) => {
  const { currentUser, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Global listener for command palette trigger
  useEffect(() => {
    const handleToggle = () => setCommandPaletteOpen(prev => !prev);
    window.addEventListener('toggle-command-palette', handleToggle);
    return () => window.removeEventListener('toggle-command-palette', handleToggle);
  }, []);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        {/* Left: Mobile Sidebar Toggle & Brand Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap hover:bg-emerald-100/80 transition-colors cursor-pointer"
              title="Go to Landing Page"
            >
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse shrink-0" />
              <span>LIVE MUNICIPAL NETWORK</span>
            </Link>

            <Link
              to="/"
              className="sm:hidden group cursor-pointer"
              title="Go to Landing Page"
            >
              <h2 className="text-xs font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">CivicConnect</h2>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                {role === 'SUPER_ADMIN' ? 'HQ CONTROL' : role === 'DEPARTMENT_ADMIN' ? 'DIVISION' : role === 'FIELD_WORKER' ? 'FIELD' : 'CITIZEN'}
              </span>
            </Link>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2 min-w-0">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-9 bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:bg-white rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 transition-all cursor-pointer shadow-2xs group min-w-0"
          >
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              <span className="text-slate-500 font-medium truncate whitespace-nowrap">
                Search issue ID, ward, category...
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0 ml-2">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Right: Quick Role Switcher, Notifications & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Role Switcher */}
          <RoleSwitcher />

          {/* Search icon for mobile */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Bell */}
          <NotificationBell />

          {/* User Profile Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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

              <div className="hidden xl:block text-left min-w-0">
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
                    <span>Verified Official Account</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      setAccountModalOpen(true);
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

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Account Settings & Security Modal */}
      <AccountSettingsModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </>
  );
};
