import React from 'react';
import { Loader2 } from 'lucide-react';

const SPINNER_SIZES = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const Spinner = ({
  size = 'md',
  color = 'text-blue-600',
  className = '',
  label,
}) => {
  const sizeClass = SPINNER_SIZES[size] || SPINNER_SIZES.md;

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClass} ${color}`} />
      {label && <p className="text-xs font-medium text-slate-500">{label}</p>}
    </div>
  );
};

export const Skeleton = ({
  className = '',
  variant = 'text', // 'text' | 'rectangular' | 'circular'
  width,
  height,
}) => {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'text'
      ? 'rounded-md h-4'
      : 'rounded-xl';

  return (
    <div
      className={`animate-pulse bg-slate-200 ${variantClass} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : undefined),
        height: height || (variant === 'circular' ? '40px' : undefined),
      }}
    />
  );
};

export const PageLoader = ({ message = 'Loading CivicConnect...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export const Loading = ({
  fullPage = false,
  message,
  size = 'md',
  className = '',
}) => {
  if (fullPage) {
    return <PageLoader message={message} />;
  }

  return <Spinner size={size} label={message} className={className} />;
};

Loading.Spinner = Spinner;
Loading.Skeleton = Skeleton;
Loading.PageLoader = PageLoader;

export default Loading;
