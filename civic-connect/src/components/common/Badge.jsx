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

  const variantStyle = VARIANTS[activeVariant] || VARIANTS.secondary;
  const dotStyle = DOT_COLORS[activeVariant] || DOT_COLORS.secondary;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyle} ${sizeStyle} font-medium leading-none select-none ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyle} shrink-0`} />}
      {content}
    </span>
  );
};

export default Badge;
