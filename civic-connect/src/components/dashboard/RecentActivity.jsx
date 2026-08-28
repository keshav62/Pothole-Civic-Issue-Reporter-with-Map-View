import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

export const RecentActivity = ({ activities }) => {
  const defaultActivities = [
    { id: 1, text: "Road Department verified issue CC-1024", time: "10 mins ago", type: "verify", icon: ShieldCheck, color: "text-blue-500" },
    { id: 2, text: "Worker Rahul Sharma completed CC-1018", time: "45 mins ago", type: "complete", icon: CheckCircle2, color: "text-emerald-500" },
    { id: 3, text: "CC-1042 exceeded 24h SLA limit", time: "1 hour ago", type: "breach", icon: AlertCircle, color: "text-red-500" },
    { id: 4, text: "Field Worker Amit Kumar assigned to CC-1054", time: "2 hours ago", type: "assign", icon: Clock, color: "text-purple-500" }
  ];

  const items = activities || defaultActivities;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Recent Activity Feed</h3>
        <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">Live Feed</span>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((act) => {
          const Icon = act.icon || Clock;
          return (
            <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className={`p-1.5 rounded-md bg-slate-100 ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-snug">{act.text}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{act.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
