import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display in this view.',
  action,
  actionText,
  actionLabel,
  onAction,
  className = '',
}) => {
  const displayIcon = icon && React.isValidElement(icon) ? icon : <Icon className="w-7 h-7" />;
  const label = actionText || actionLabel;

  return (
    <div
      className={`p-10 text-center flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 my-4 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {displayIcon}
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action ? (
        action
      ) : label && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {label}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
