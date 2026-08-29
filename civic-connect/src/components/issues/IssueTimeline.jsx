import React from 'react';
import { CheckCircle2, Circle, Clock, User, ShieldCheck } from 'lucide-react';

export const IssueTimeline = ({ timeline = [] }) => {
  const steps = [
    { key: 'REPORTED', title: 'Reported' },
    { key: 'VERIFIED', title: 'Verified' },
    { key: 'ASSIGNED', title: 'Assigned' },
    { key: 'IN_PROGRESS', title: 'In Progress' },
    { key: 'RESOLVED', title: 'Resolved' }
  ];

  // Find index of current status
  const currentStatus = timeline[timeline.length - 1]?.status || 'REPORTED';
  const currentStepIdx = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="py-4">
      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Resolution Progress Timeline</h4>
      <div className="relative">
        {/* Horizontal Line for Desktop */}
        <div className="hidden sm:block absolute top-4 left-4 right-4 h-0.5 bg-slate-200" />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const historyItem = timeline.find(t => t.status === step.key);

            return (
              <div key={step.key} className="relative flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-50 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div>
                  <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  {historyItem ? (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      <p>{historyItem.date}</p>
                      <p className="font-medium text-slate-700">{historyItem.actor}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-0.5">Pending</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
