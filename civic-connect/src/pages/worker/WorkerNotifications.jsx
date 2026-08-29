import React, { useState } from 'react';
import { useWorker } from '../../context/WorkerContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  XCircle,
  RefreshCw,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';

// Helper to get notification styling based on type
const getNotificationStyles = (type) => {
  switch (type) {
    case 'TASK_ASSIGNED':
      return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'DEADLINE_APPROACHING':
      return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' };
    case 'TASK_OVERDUE':
      return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' };
    case 'STATUS_UPDATED':
      return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'RESOLUTION_APPROVED':
      return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    case 'RESOLUTION_REJECTED':
      return { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' };
    case 'TASK_REASSIGNED':
      return { icon: RefreshCw, color: 'text-slate-500', bg: 'bg-slate-50' };
    default:
      return { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50' };
  }
};

const formatTimeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

export const WorkerNotifications = () => {
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD
  const { notifications, markNotificationRead, markAllNotificationsRead } = useWorker();

  // Filter notifications
  const displayedNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const markAllAsRead = () => {
    markAllNotificationsRead();
  };

  const markAsRead = (id) => {
    markNotificationRead(id);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" /> Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on your tasks and assignments.</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={markAllAsRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        {/* Filters Tab */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-200">
          <button
            onClick={() => setFilter('ALL')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors ${
              filter === 'ALL'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              filter === 'UNREAD'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                filter === 'UNREAD' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {displayedNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-500 mt-1">You have no {filter === 'UNREAD' ? 'unread' : ''} notifications at this time.</p>
            </div>
          ) : (
            displayedNotifications.map((notification) => {
              const { icon: Icon, color, bg } = getNotificationStyles(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-slate-50/50 ${
                    !notification.isRead ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className={`text-sm font-bold truncate ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>

                    <p className={`text-sm mb-2 ${!notification.isRead ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                      {notification.message}
                    </p>

                    {notification.taskId && (
                      <span className="inline-flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                        View Task #{notification.taskId}
                      </span>
                    )}
                  </div>

                  {!notification.isRead && (
                    <div className="flex items-center pl-2">
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerNotifications;
