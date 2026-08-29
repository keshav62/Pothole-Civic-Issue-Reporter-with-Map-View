import React from 'react';
import { ROLE_LABELS, ROLE_BADGE_VARIANTS } from '../../utils/constants';

const VARIANTS = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200/80',
  secondary: 'bg-slate-100 text-slate-700 border-slate-200/80',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
  danger: 'bg-red-50 text-red-700 border-red-200/80',
  info: 'bg-sky-50 text-sky-700 border-sky-200/80',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200/80',

  // Severity Badges
  CRITICAL: 'bg-red-50 text-red-700 border-red-200 font-bold',
  HIGH: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
  MEDIUM: 'bg-blue-50 text-blue-800 border-blue-200 font-semibold',
  LOW: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',

  // Status Badges
  REPORTED: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  VERIFIED: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  ASSIGNED: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',

  // SLA & Roster States
  ON_TIME: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  BREACHED: 'bg-red-50 text-red-700 border-red-200/80 font-bold',
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  BUSY: 'bg-amber-50 text-amber-700 border-amber-200/80',
  OFFLINE: 'bg-slate-100 text-slate-600 border-slate-200/80'
};

const DOT_COLORS = {
  primary: 'bg-blue-500',
  secondary: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-400',
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-amber-500',
  MEDIUM: 'bg-blue-500',
  LOW: 'bg-slate-400',
  REPORTED: 'bg-purple-500',
  VERIFIED: 'bg-blue-500',
  ASSIGNED: 'bg-indigo-500',
  IN_PROGRESS: 'bg-amber-500',
  RESOLVED: 'bg-emerald-500',
  REJECTED: 'bg-rose-500',
  AVAILABLE: 'bg-emerald-500',
  BUSY: 'bg-amber-500',
  OFFLINE: 'bg-slate-400'
};

const SIZES = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs font-semibold',
  lg: 'px-3 py-1 text-xs font-bold',
};

export const Badge = ({
  children,
  variant = 'secondary',
  role,
  size = 'md',
  dot = true,
  icon: Icon,
  className = '',
  ...props
}) => {
  let activeVariant = variant;
  let content = children;

  if (role) {
    activeVariant = ROLE_BADGE_VARIANTS[role] || 'secondary';
    content = children || ROLE_LABELS[role] || role;
  }

  const variantStyle = VARIANTS[activeVariant] || VARIANTS[variant] || VARIANTS.secondary;
  const dotStyle = DOT_COLORS[activeVariant] || DOT_COLORS.secondary;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${variantStyle} ${sizeStyle} leading-tight select-none shrink-0 ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyle} shrink-0`} />}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{content || variant}</span>
    </span>
  );
};

export default Badge;
