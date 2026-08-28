import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Bell,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Badge from './Badge';
import Button from './Button';
import { APP_ROUTES } from '../../utils/constants';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate(APP_ROUTES.LOGIN);
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link
              to={isAuthenticated ? APP_ROUTES.DASHBOARD : APP_ROUTES.LOGIN}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Civic<span className="text-blue-600">Connect</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                  Issue Reporter
                </span>
              </div>
            </Link>
          </div>

          {/* Center Links (If public or minimal desktop links) */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to={APP_ROUTES.DASHBOARD}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to={APP_ROUTES.MAP}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Map View
                </Link>
                <Link
                  to={APP_ROUTES.REPORTS}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Reports
                </Link>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                Public Civic Infrastructure Portal
              </span>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {user.role}
                    </span>
                  </div>
                  <Badge role={user.role} size="sm" dot className="hidden md:inline-flex" />
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <Badge role={user.role} size="sm" dot />
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={APP_ROUTES.PROFILE}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          to={APP_ROUTES.SETTINGS}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <MapPin className="w-4 h-4 text-slate-400" />
                          Account Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={APP_ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to={APP_ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
