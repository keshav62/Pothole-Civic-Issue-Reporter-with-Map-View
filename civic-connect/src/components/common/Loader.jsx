import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading data...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center text-slate-500 gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
};
