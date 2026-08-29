import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SLAIndicator = ({ dueDate, status, className }) => {
  const [now, setNow] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    // If the task is already completed, we don't need to tick the clock
    if (status === 'COMPLETED') return;

    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1 minute
    return () => clearInterval(timer);
  }, [status]);

  if (!dueDate) return null;

  // If completed, just show a green check (SLA Met/Resolved)
  if (status === 'COMPLETED') {
    return (
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200", className)}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        SLA Met
      </div>
    );
  }

  const targetDate = new Date(dueDate);
  const diffMs = targetDate.getTime() - now.getTime();
  const isOverdue = diffMs < 0;

  // Absolute diff in hours and minutes
  const absDiffMs = Math.abs(diffMs);
  const diffHours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffDays = Math.floor(diffHours / 24);

  // Determine state and message
  let state = 'NORMAL';
  let message = '';
  let Icon = Clock;

  if (isOverdue) {
    state = 'OVERDUE';
    Icon = AlertTriangle;
    if (diffDays > 0) {
      message = `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`;
    } else if (diffHours > 0) {
      message = `${diffHours}h ${diffMinutes}m overdue`;
    } else {
      message = `${diffMinutes}m overdue`;
    }
  } else {
    // Not overdue
    if (diffHours < 6) {
      state = 'WARNING';
      message = `Due in ${diffHours}h ${diffMinutes}m`;
    } else if (diffDays > 0) {
      state = 'NORMAL';
      message = `${diffDays}d ${diffHours % 24}h remaining`;
    } else {
      state = 'NORMAL';
      message = `${diffHours}h ${diffMinutes}m remaining`;
    }
  }

  // Styles based on state
  const stateStyles = {
    NORMAL: 'bg-blue-50 text-blue-700 border-blue-200',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse',
    OVERDUE: 'bg-red-50 text-red-700 border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all duration-300",
        stateStyles[state],
        className
      )}
      title={`Due: ${targetDate.toLocaleString()}`}
    >
      <Icon className={cn("w-3.5 h-3.5", state === 'OVERDUE' && "animate-bounce")} />
      {message}
    </div>
  );
};
