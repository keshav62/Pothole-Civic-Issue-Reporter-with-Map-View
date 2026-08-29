import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

export const RecentActivity = ({ activities }) => {
  const defaultActivities = [
    { id: 1, text: "Road Department verified issue CC-1024", time: "10 mins ago", type: "verify", icon: ShieldCheck, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { id: 2, text: "Worker Rahul Sharma completed CC-1018", time: "45 mins ago", type: "complete", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { id: 3, text: "CC-1042 exceeded 24h SLA limit", time: "1 hour ago", type: "breach", icon: AlertCircle, color: "text-red-600 bg-red-50 border-red-100" },
    { id: 4, text: "Field Worker Amit Kumar assigned to CC-1054", time: "2 hours ago", type: "assign", icon: Clock, color: "text-purple-600 bg-purple-50 border-purple-100" }
  ];

  const items = activities || defaultActivities;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Operations Log</h3>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Feed
        </span>
      </div>

      <div className="mt-4 space-y-2 flex-1">
        {items.map((act, idx) => {
          const Icon = act.icon || Clock;
          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-150"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className={`p-1.5 rounded-md border shrink-0 ${act.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 leading-snug">{act.text}</p>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5 block tracking-wide">{act.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
