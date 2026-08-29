import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, CheckCheck, CheckCircle2, Clock, AlertTriangle,
  Info, Shield, ChevronRight, Sparkles, Inbox
} from 'lucide-react';

export const CitizenNotifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useCivic();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'

  // Filter citizen-relevant notifications
  const citizenNotifications = useMemo(() => {
    return notifications.filter(n =>
      n.role === 'CITIZEN' ||
      n.userId === currentUser?.id ||
      !n.role
    );
  }, [notifications, currentUser]);

  const unreadCount = citizenNotifications.filter(n => !n.read).length;

  const displayNotifications = useMemo(() => {
    if (filter === 'UNREAD') {
      return citizenNotifications.filter(n => !n.read);
    }
    return citizenNotifications;
  }, [citizenNotifications, filter]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'APPROVAL':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'ASSIGNMENT':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'SLA_WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'SYSTEM':
        return <Info className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'APPROVAL': return 'bg-emerald-50 border-emerald-100';
      case 'ASSIGNMENT': return 'bg-blue-50 border-blue-100';
      case 'SLA_WARNING': return 'bg-amber-50 border-amber-100';
      case 'SYSTEM': return 'bg-purple-50 border-purple-100';
      default: return 'bg-slate-50 border-slate-100';
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markNotificationAsRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-emerald-600" />
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time updates regarding your reported civic issues, civic alerts, and status changes.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsAsRead?.()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs / Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            filter === 'ALL'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>All Notifications</span>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
            {citizenNotifications.length}
          </span>
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            filter === 'UNREAD'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Unread Only</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {displayNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                item.read
                  ? 'bg-white border-slate-200 hover:bg-slate-50/80 shadow-xs'
                  : 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50 shadow-xs'
              }`}
            >
              {/* Type icon */}
              <div className={`p-2.5 rounded-xl border shrink-0 ${getNotificationBg(item.type)}`}>
                {getNotificationIcon(item.type)}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-bold truncate ${item.read ? 'text-slate-800' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">{item.time || 'Recent'}</span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {item.message}
                </p>
                {item.link && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    View Associated Issue <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No notifications</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            {filter === 'UNREAD'
              ? 'You are all caught up! There are no unread notifications right now.'
              : 'You have no notifications yet. When you report an issue, status updates will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CitizenNotifications;
