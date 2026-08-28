import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Bell,
  User,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  HardHat,
  Building2,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES, APP_ROUTES } from '../../utils/constants';
import Badge from './Badge';

// Map icon names to Lucide icon components
const ICON_COMPONENTS = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  PlusCircle: <PlusCircle className="w-5 h-5" />,
  HardHat: <HardHat className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
};

// Configurable sidebar navigation schema by role
export const ROLE_NAVIGATION_ITEMS = {
  COMMON: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.DASHBOARD,
      icon: 'LayoutDashboard',
    },
    {
      label: 'Issue Map',
      path: APP_ROUTES.MAP,
      icon: 'MapPin',
    },
    {
      label: 'Reports & Issues',
      path: APP_ROUTES.REPORTS,
      icon: 'FileText',
    },
    {
      label: 'Profile',
      path: APP_ROUTES.PROFILE,
      icon: 'User',
    },
    {
      label: 'Settings',
      path: APP_ROUTES.SETTINGS,
      icon: 'Settings',
    },
  ],
};

export const Sidebar = ({
  isOpen = true,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  navItems,
}) => {
  const { user } = useAuth();
  const currentRole = user?.role || USER_ROLES.CITIZEN;

  // Use provided custom navItems or default role navigation
  const items = navItems || ROLE_NAVIGATION_ITEMS.COMMON;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out lg:static lg:top-0 lg:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Role Identity Tag */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Workspace Role
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge role={currentRole} size="sm" dot />
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block" title={currentRole} />
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const iconElement =
              typeof item.icon === 'string'
                ? ICON_COMPONENTS[item.icon] || <FileText className="w-5 h-5" />
                : item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Auto-close drawer on mobile on link click
                  if (window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs border border-blue-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{iconElement}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Quick Info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Civic User'}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-700 font-semibold text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
