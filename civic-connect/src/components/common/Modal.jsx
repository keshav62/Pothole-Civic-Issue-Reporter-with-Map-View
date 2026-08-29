import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-5xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  footer,
  size = 'md',
  maxWidth,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const desc = subtitle || description;
  const widthClass = maxWidth || SIZES[size] || SIZES.md;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-150 my-auto ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/80">
            <div>
              {title && (
                <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                  {title}
                </h3>
              )}
              {desc && (
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5 max-h-[calc(85vh-120px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
