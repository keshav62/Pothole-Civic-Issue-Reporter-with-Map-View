import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, MapPin, Bell, User } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const MobileNavigation = () => {
  const { notifications } = useCivic();
  const unreadCount = notifications.filter(n => !n.read && n.role === 'FIELD_WORKER').length;

  const items = [
    { label: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/worker/tasks', icon: ClipboardList },
    { label: 'Map', path: '/worker/map', icon: MapPin },
    { label: 'Alerts', path: '/worker/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/worker/profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-400 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all relative ${
                  isActive ? 'text-blue-400 font-bold bg-slate-800' : 'hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
