import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const TOAST_CONFIG = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    style: 'bg-white border-emerald-200 text-slate-800 shadow-lg shadow-emerald-500/5',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    style: 'bg-white border-red-200 text-slate-800 shadow-lg shadow-red-500/5',
    bar: 'bg-red-500',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    style: 'bg-white border-amber-200 text-slate-800 shadow-lg shadow-amber-500/5',
    bar: 'bg-amber-500',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    style: 'bg-white border-blue-200 text-slate-800 shadow-lg shadow-blue-500/5',
    bar: 'bg-blue-500',
  },
};

export const ToastItem = ({ id, message, type = 'info', onDismiss }) => {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

  return (
    <div
      role="alert"
      className={`relative overflow-hidden rounded-xl border p-4 flex items-start gap-3 min-w-[300px] max-w-md transition-all duration-300 transform translate-y-0 opacity-100 ${config.style}`}
    >
      {config.icon}
      <div className="flex-1 text-xs font-medium text-slate-700 leading-snug pt-0.5">
        {message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss?.(id)}
        className="text-slate-400 hover:text-slate-600 rounded-md p-1 -mr-1 -mt-1 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.bar}`} />
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

