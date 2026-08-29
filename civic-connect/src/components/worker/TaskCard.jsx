import { Link } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CATEGORY_META, PRIORITY_META } from '../../data/workerMockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDueInfo(dueDateISO, status) {
  if (status === 'resolved') return null;
  const due = new Date(dueDateISO);
  const now = new Date();
  const diffMs = due - now;
  const diffH  = Math.floor(diffMs / 36e5);

  if (diffMs < 0)  return { label: 'Overdue',          color: 'text-red-600 bg-red-50 border-red-200',    icon: AlertCircle };
  if (diffH < 2)   return { label: `Due in ${diffH}h`, color: 'text-red-600 bg-red-50 border-red-200',    icon: Clock       };
  if (diffH < 24)  return { label: `Due in ${diffH}h`, color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock    };
  return {
    label: due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    icon: Calendar,
  };
}

const STATUS_CONFIG = {
  assigned:    { label: 'Assigned',    styles: 'bg-amber-100 text-amber-700 border-amber-200'    },
  'in-progress': { label: 'In Progress', styles: 'bg-blue-100 text-blue-700 border-blue-200'     },
  resolved:    { label: 'Resolved',    styles: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

// ─── TaskCard ─────────────────────────────────────────────────────────────────
/**
 * TaskCard – reusable card for displaying a worker task in a list or grid.
 *
 * Props:
 *   task     {object}  – Task object from workerMockData
 *   compact  {boolean} – Renders a tighter layout (for sidebar / recent list)
 */
const TaskCard = ({ task, compact = false }) => {
  const catMeta   = CATEGORY_META[task.category] || { icon: '📌', color: 'slate' };
  const priMeta   = PRIORITY_META[task.priority] || PRIORITY_META.Low;
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.assigned;
  const dueInfo   = getDueInfo(task.dueDate, task.status);

  return (
    <article
      className={cn(
        'group bg-white rounded-2xl border border-slate-100 shadow-sm',
        'hover:shadow-md hover:border-blue-200 transition-all duration-200',
        compact ? 'p-4' : 'p-5'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div
          className={cn(
            'flex-shrink-0 rounded-xl flex items-center justify-center text-xl border border-slate-100 bg-slate-50',
            compact ? 'w-10 h-10' : 'w-12 h-12'
          )}
          aria-label={task.category}
        >
          {catMeta.icon}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Priority */}
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                priMeta.badge
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: priMeta.dot }}
              />
              {priMeta.label}
            </span>

            {/* Status */}
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                statusCfg.styles
              )}
            >
              {task.status === 'resolved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {statusCfg.label}
            </span>

            {/* Due date pill */}
            {dueInfo && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                  dueInfo.color
                )}
              >
                <dueInfo.icon className="w-3 h-3" />
                {dueInfo.label}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={cn(
              'font-bold text-slate-800 leading-snug mb-1.5',
              compact ? 'text-sm' : 'text-base'
            )}
          >
            {task.title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{task.location.address}</span>
            <span className="text-slate-300 mx-0.5">·</span>
            <span className="text-slate-400">{task.location.ward}</span>
          </p>

          {/* Category label */}
          {!compact && (
            <p className="text-xs text-slate-400">
              Category: <span className="font-medium text-slate-600">{task.category}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action footer */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Reported by <span className="font-medium text-slate-600">{task.reportedBy}</span>
          </span>
          <Link
            to={`/worker/tasks/${task.id}`}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
              task.status === 'resolved'
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30'
            )}
          >
            {task.status === 'resolved' ? 'View Details' : 'View Task'}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Compact CTA */}
      {compact && (
        <div className="mt-3">
          <Link
            to={`/worker/tasks/${task.id}`}
            className="flex items-center justify-center w-full py-1.5 text-xs font-semibold text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View Task
          </Link>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
