import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useWorker } from '../../context/WorkerContext';
import { cn } from '../../utils/cn';

export const NotificationBell = () => {
  const { notifications } = useWorker();

  // Compute unread count from mock data
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NavLink
      to="/worker/notifications"
      className={({ isActive }) =>
        cn(
          'relative p-2 rounded-xl transition-colors',
          isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        )
      }
      title="Notifications"
    >
      <Bell className="w-5 h-5" />

      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
      )}
    </NavLink>
  );
};
