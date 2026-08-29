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
    blue: 'bg-blue-50 text-blue-600 border-blue-200/80',
    amber: 'bg-amber-50 text-amber-600 border-amber-200/80',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    purple: 'bg-purple-50 text-purple-600 border-purple-200/80',
    red: 'bg-red-50 text-red-600 border-red-200/80',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200/80'
  };

  const topAccents = {
    blue: 'border-t-blue-600',
    amber: 'border-t-amber-500',
    emerald: 'border-t-emerald-500',
    purple: 'border-t-purple-600',
    red: 'border-t-red-600',
    cyan: 'border-t-cyan-500'
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 border-t-2 ${topAccents[color] || 'border-t-blue-600'} p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border shrink-0 ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans leading-none">{value}</h3>
        {change && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
            changeType === 'positive'
              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/80'
              : changeType === 'negative'
              ? 'text-red-700 bg-red-50 border border-red-200/80'
              : 'text-slate-600 bg-slate-100 border border-slate-200/80'
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

export default StatCard;
