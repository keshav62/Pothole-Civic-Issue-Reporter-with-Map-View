import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-2 focus:ring-blue-500/20 shadow-xs border border-blue-600 font-bold',
  secondary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white focus:ring-2 focus:ring-slate-700/20 shadow-xs font-bold',
  outline: 'border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 text-slate-800 focus:ring-2 focus:ring-blue-500/20 bg-white shadow-2xs font-bold',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-2 focus:ring-red-500/20 shadow-xs font-bold',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-2 focus:ring-amber-400/20 shadow-xs font-bold',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-2 focus:ring-emerald-500/20 shadow-xs font-bold',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-2 focus:ring-slate-400/20 shadow-none font-bold'
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-xs px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2.5',
  icon: 'p-2'
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

  const baseStyles = 'inline-flex items-center justify-center rounded-xl transition-all duration-150 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
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
