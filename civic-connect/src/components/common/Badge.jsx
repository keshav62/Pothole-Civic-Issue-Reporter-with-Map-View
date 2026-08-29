import React from 'react';
import { ROLE_LABELS, ROLE_BADGE_VARIANTS } from '../../utils/constants';

const VARIANTS = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  secondary: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',

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

const DOT_COLORS = {
  primary: 'bg-blue-500',
  secondary: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-400',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs font-medium',
  lg: 'px-3 py-1.5 text-sm font-medium',
};

export const Badge = ({
  children,
  variant = 'secondary',
  role,
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  // If a role is passed, automatically determine label and color
  let activeVariant = variant;
  let content = children;

  if (role) {
    activeVariant = ROLE_BADGE_VARIANTS[role] || 'secondary';
    content = children || ROLE_LABELS[role] || role;
  }

  const variantStyle = VARIANTS[activeVariant] || VARIANTS[variant] || VARIANTS.secondary;
  const dotStyle = DOT_COLORS[activeVariant] || DOT_COLORS.secondary;
  const sizeStyle = SIZES[size] || 'px-2.5 py-0.5 text-xs font-medium'; // default from admin branch

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variantStyle} ${sizeStyle} leading-none select-none ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyle} shrink-0`} />}
      {Icon && <Icon className="w-3 h-3" />}
      {content || variant}
    </span>
  );
};

export default Badge;
