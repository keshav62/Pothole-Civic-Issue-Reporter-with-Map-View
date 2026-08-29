import React from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

export const MapFilters = ({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onReset,
  categories = ['All', 'Pothole', 'Water Leakage', 'Garbage Pileup', 'Streetlight', 'Drainage', 'Traffic Signal', 'Other'],
  statuses = ['All', 'REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
  priorities = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> Map Filters
        </span>
        {onReset && (
          <button
            onClick={onReset}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange?.(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-500"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
