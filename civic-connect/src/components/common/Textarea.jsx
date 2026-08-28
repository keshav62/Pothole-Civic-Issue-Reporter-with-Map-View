import React, { forwardRef, useId } from 'react';

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      maxLength,
      id,
      name,
      value,
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
    const textareaId = id || name || generatedId;

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`w-full ${wrapperClassName}`}>
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-slate-400">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative rounded-lg shadow-sm">
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            rows={rows}
            maxLength={maxLength}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`block w-full rounded-lg text-sm text-slate-900 placeholder:text-slate-400 bg-white transition-colors duration-150 border focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed px-3.5 py-2.5 resize-y ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 hover:border-slate-400'
            } ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
