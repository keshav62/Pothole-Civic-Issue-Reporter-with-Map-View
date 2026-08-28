import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/common/Toast';
import { cn } from '../utils/cn';
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Wifi,
  Shield,
} from 'lucide-react';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { name: 'Dashboard',      path: '/worker/dashboard',      icon: LayoutDashboard, badge: null },
  { name: 'Assigned Tasks', path: '/worker/tasks',          icon: ClipboardList,   badge: 3    },
  { name: 'Task Map',       path: '/worker/map',            icon: Map,             badge: null },
  { name: 'Notifications',  path: '/worker/notifications',  icon: Bell,            badge: 2    },
  { name: 'Profile',        path: '/worker/profile',        icon: User,            badge: null },
];

// ─── Sidebar NavLink Item ─────────────────────────────────────────────────────
const SidebarItem = ({ item, collapsed, onClick }) => (
  <NavLink
    to={item.path}
    end={item.path === '/worker/dashboard'}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      )
    }
  >
    {({ isActive }) => (
      <>
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full -ml-3" />
        )}

        <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.name}</span>
            {item.badge && (
              <span className={cn(
                'ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold',
                isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}

        {/* Tooltip when collapsed */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl border border-white/10">
            {item.name}
            {item.badge && (
              <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-indigo-500 rounded-full text-[9px] font-bold">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </>
    )}
  </NavLink>
);

// ─── Page title from route ────────────────────────────────────────────────────
function usePageTitle() {
  const { pathname } = useLocation();
  const match = NAV_ITEMS.find(i => pathname.startsWith(i.path));
  if (pathname.includes('/tasks/')) return 'Task Details';
  return match?.name ?? 'Field Worker';
}

// ─── WorkerLayout ─────────────────────────────────────────────────────────────
export const WorkerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed]   = useState(false);
  const [profileMenuOpen, setProfileMenuOpen]      = useState(false);
  const profileRef = useRef(null);
  const navigate   = useNavigate();
  const pageTitle  = usePageTitle();
  const { currentUser, logout } = useAuth();
  
  const workerData = {
    name: currentUser?.name || 'Worker',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: currentUser?.department || 'Field Operations',
    ward: currentUser?.ward || 'Assigned Area'
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/');
  };

  // ── Sidebar shell (shared between desktop & mobile) ──────────────────────
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-slate-900 text-white">

      {/* Logo + collapse toggle */}
      <div className={cn(
        'flex items-center h-16 border-b border-white/5 px-4 flex-shrink-0',
        desktopCollapsed && !isMobile ? 'justify-center' : 'justify-between'
      )}>
        {(!desktopCollapsed || isMobile) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-none truncate">CivicConnect</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Field Worker Portal</p>
            </div>
          </div>
        )}

        {desktopCollapsed && !isMobile && (
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Shield className="w-4 h-4 text-white" />
          </div>
        )}

        {isMobile ? (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setDesktopCollapsed(p => !p)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-2"
            title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={cn('w-4 h-4 transition-transform duration-300', !desktopCollapsed && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* Worker mini-card */}
      {(!desktopCollapsed || isMobile) && (
        <div className="mx-3 my-4 p-3 bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={workerData.avatar}
                alt={workerData.name}
                className="w-9 h-9 rounded-full bg-slate-700 object-cover ring-2 ring-indigo-500/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{workerData.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{workerData.ward}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Wifi className="w-2.5 h-2.5" /> Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed avatar */}
      {desktopCollapsed && !isMobile && (
        <div className="flex justify-center mt-4 mb-2 flex-shrink-0">
          <div className="relative">
            <img src={workerData.avatar} alt="Avatar" className="w-9 h-9 rounded-full ring-2 ring-indigo-500/50" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {(!desktopCollapsed || isMobile) && (
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 px-3 pt-2 pb-1.5">
            Navigation
          </p>
        )}
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={desktopCollapsed && !isMobile}
            onClick={() => isMobile && setMobileSidebarOpen(false)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150',
            desktopCollapsed && !isMobile ? 'justify-center' : ''
          )}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!desktopCollapsed || isMobile) && <span>Logout</span>}
          {desktopCollapsed && !isMobile && (
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-red-400 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-white/10">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Toast />
      
      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out',
          desktopCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ──────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />
      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent isMobile />
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Header ──────────────────────────────────────────────── */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200/80 flex items-center px-4 sm:px-6 gap-4 z-30 shadow-sm">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">{pageTitle}</h1>
            <p className="text-xs text-slate-400 hidden sm:block">{workerData.department} · {workerData.ward}</p>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notification bell */}
            <NavLink
              to="/worker/notifications"
              className={({ isActive }) =>
                cn(
                  'relative p-2 rounded-xl transition-colors',
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )
              }
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
            </NavLink>

            {/* Status pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Available</span>
            </div>

            {/* Worker avatar + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(p => !p)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="relative">
                  <img
                    src={workerData.avatar}
                    alt={workerData.name}
                    className="w-8 h-8 rounded-full bg-slate-200 object-cover ring-2 ring-indigo-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">{workerData.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Field Worker</p>
                </div>
                <ChevronRight className={cn('hidden md:block w-3.5 h-3.5 text-slate-400 transition-transform duration-200', profileMenuOpen && 'rotate-90')} />
              </button>

              {/* Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{workerData.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{workerData.email}</p>
                  </div>
                  <NavLink
                    to="/worker/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-slate-400" /> View Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;
