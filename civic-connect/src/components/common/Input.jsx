import React, { forwardRef, useId } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      leftIcon,
      rightIcon,
      type = 'text',
      id,
      name,
      placeholder,
      required = false,
      disabled = false,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);

    const displayLeftIcon = leftIcon || (Icon && <Icon className="h-4 w-4" />);

    return (
      <div className={`w-full ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {displayLeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {displayLeftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`block w-full rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-white transition-colors duration-150 border focus:outline-none focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              displayLeftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300'
                : 'border-slate-300 focus:border-blue-500 hover:border-slate-400'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
