import React, { useState, useRef, useEffect } from 'react';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from './NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationBell = () => {
  const { notifications, markNotificationAsRead } = useCivic();
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  const filteredNotifs = notifications.filter(n => !n.role || n.role === role);
  const unreadCount = filteredNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => filteredNotifs.forEach(n => markNotificationAsRead(n.id))}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-3 py-2 space-y-2">
            {filteredNotifs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
            ) : (
              filteredNotifs.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onMarkRead={markNotificationAsRead}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
