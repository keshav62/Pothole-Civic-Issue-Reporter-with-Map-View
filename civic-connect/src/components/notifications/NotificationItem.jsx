import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationItem = ({ notif, onMarkRead }) => {
  const icons = {
    ASSIGNMENT: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    SLA_WARNING: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    APPROVAL: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    SYSTEM: <Bell className="w-4 h-4 text-purple-500 shrink-0" />
  };

  return (
    <div
      onClick={() => onMarkRead(notif.id)}
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        notif.read
          ? 'bg-white border-slate-100 text-slate-600'
          : 'bg-blue-50/50 border-blue-100 text-slate-900 font-medium'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {icons[notif.type] || icons.SYSTEM}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold truncate">{notif.title}</h4>
            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
        </div>
      </div>
    </div>
  );
};
