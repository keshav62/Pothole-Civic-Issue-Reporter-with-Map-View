import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import Button from './Button';

export const ErrorMessage = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  onDismiss,
  dismissible = false,
  variant = 'banner', // 'banner' | 'card' | 'inline'
  className = '',
}) => {
  const displayMessage =
    message || (error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.');

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-red-600 font-medium ${className}`}>
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{displayMessage}</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 bg-red-50/70 border border-red-200 rounded-2xl text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-600 max-w-sm mb-4 leading-relaxed">{displayMessage}</p>
        {onRetry && (
          <Button
            variant="danger"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Default: banner
  return (
    <div
      className={`p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 shadow-xs ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          {title && <h5 className="text-sm font-semibold text-red-900">{title}</h5>}
          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{displayMessage}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-red-800 hover:text-red-900 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry action
            </button>
          )}
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 rounded-md p-1 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
