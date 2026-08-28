import React from 'react';

const BADGE_VARIANTS = {
  // Priority
  CRITICAL: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  HIGH: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  LOW: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',

  // Status
  REPORTED: 'bg-purple-100 text-purple-800 border-purple-200',
  VERIFIED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  ASSIGNED: 'bg-sky-100 text-sky-800 border-sky-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',

  // SLA
  ON_TIME: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  WARNING: 'bg-amber-50 text-amber-700 border-amber-200',
  BREACHED: 'bg-red-50 text-red-700 border-red-200 font-semibold',
  RESOLVED_ON_TIME: 'bg-emerald-100 text-emerald-800 border-emerald-200',

  // Worker / User Status
  AVAILABLE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  BUSY: 'bg-amber-100 text-amber-800 border-amber-200',
  OFFLINE: 'bg-slate-100 text-slate-600 border-slate-200',
  ON_LEAVE: 'bg-purple-100 text-purple-800 border-purple-200',
  ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DISABLED: 'bg-slate-100 text-slate-600 border-slate-200'
};

export const Badge = ({ children, variant = 'LOW', className = '', icon: Icon }) => {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.LOW;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${variantClass} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children || variant}
    </span>
  );
};
