import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  onClick,
  ...props
}) => {
  return (
    <section
      onClick={onClick}
      className={`bg-white rounded-2xl ${
        bordered ? 'border border-slate-200/80' : ''
      } shadow-2xs ${
        hoverable
          ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={`text-sm sm:text-base font-bold text-slate-900 leading-tight tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-xs text-slate-500 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`px-5 py-3 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
