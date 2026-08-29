import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50/80 text-blue-600 border-blue-200/80 shadow-blue-500/5',
    amber: 'bg-amber-50/80 text-amber-600 border-amber-200/80 shadow-amber-500/5',
    emerald: 'bg-emerald-50/80 text-emerald-600 border-emerald-200/80 shadow-emerald-500/5',
    purple: 'bg-purple-50/80 text-purple-600 border-purple-200/80 shadow-purple-500/5',
    red: 'bg-red-50/80 text-red-600 border-red-200/80 shadow-red-500/5',
    cyan: 'bg-cyan-50/80 text-cyan-600 border-cyan-200/80 shadow-cyan-500/5'
  };

  const topAccents = {
    blue: 'border-t-blue-500',
    amber: 'border-t-amber-500',
    emerald: 'border-t-emerald-500',
    purple: 'border-t-purple-500',
    red: 'border-t-red-500',
    cyan: 'border-t-cyan-500'
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 border-t-2 ${topAccents[color] || 'border-t-blue-500'} p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border shadow-xs ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight font-sans">{value}</h3>
        {change && (
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            changeType === 'positive'
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
              : changeType === 'negative'
              ? 'text-red-700 bg-red-50 border border-red-200/60'
              : 'text-slate-600 bg-slate-100 border border-slate-200/60'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};
