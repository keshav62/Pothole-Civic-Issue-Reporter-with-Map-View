import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

export const WorkerNotifications = () => {
  const { notifications, markNotificationAsRead } = useCivic();

  const workerNotifs = notifications.filter(n => !n.role || n.role === 'FIELD_WORKER');

  return (
    <div className="space-y-4 max-w-3xl mx-auto pb-10">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" /> Notifications & Task Dispatch Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts for task assignment and SLA limits.</p>
        </div>
        <button
          onClick={() => workerNotifs.forEach(n => markNotificationAsRead(n.id))}
          className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" /> Mark all read
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {workerNotifs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No notifications right now.</p>
        ) : (
          workerNotifs.map(notif => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onMarkRead={markNotificationAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerNotifications;
