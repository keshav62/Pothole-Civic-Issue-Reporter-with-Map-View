import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs hover:shadow border border-blue-600/80 font-bold',
  secondary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-2xs font-bold border border-slate-900',
  outline: 'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-800 bg-white shadow-2xs font-semibold',
  darkOutline: 'border border-slate-700 bg-slate-800/80 hover:bg-slate-800 active:bg-slate-900 text-white shadow-2xs font-semibold',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-2xs font-bold border border-red-600',
  warning: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-2xs font-bold border border-amber-500',
  success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-2xs font-bold border border-emerald-600',
  ghost: 'bg-transparent hover:bg-slate-100/80 active:bg-slate-200/60 text-slate-700 font-semibold border border-transparent',
  ghostDark: 'bg-transparent hover:bg-white/10 text-slate-200 font-semibold border border-transparent'
};

const SIZES = {
  xs: 'text-[11px] px-2.5 py-1 gap-1 rounded-lg',
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-xl',
  md: 'text-xs px-4 py-2 gap-2 rounded-xl',
  lg: 'text-sm px-5 py-2.5 gap-2.5 rounded-xl',
  icon: 'p-2 rounded-xl'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  const isButtonDisabled = disabled || isLoading || loading;

  const baseStyles = 'inline-flex items-center justify-center transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={cn(baseStyles, variantClass, sizeClass, fullWidth && 'w-full', className)}
      {...props}
    >
      {isLoading || loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0 flex items-center">{leftIcon}</span>
      ) : null}

      {children}

      {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
