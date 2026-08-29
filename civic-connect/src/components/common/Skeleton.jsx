import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8 rounded-xl" />
    </div>
    <Skeleton className="h-7 w-20" />
    <Skeleton className="h-3 w-16" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-4">
    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
