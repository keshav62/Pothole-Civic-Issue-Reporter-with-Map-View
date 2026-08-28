import { cn } from '../../utils/cn';

/**
 * WorkerStatCard – reusable statistics card for the worker dashboard.
 *
 * Props:
 *   label     {string}   – Card title
 *   value     {number}   – Main metric value
 *   icon      {string}   – Emoji icon
 *   colorSet  {object}   – { bg, text, ring } Tailwind class strings
 *   footnote  {string?}  – Small supporting text under the value
 *   pulse     {boolean?} – Adds a pulse animation dot (for urgent counts)
 */
const WorkerStatCard = ({ label, value, icon, colorSet, footnote, pulse = false }) => {
  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group',
        colorSet.ring && `ring-1 ${colorSet.ring}`
      )}
    >
      {/* Background glow blob */}
      <div
        className={cn(
          'absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-[0.12] transition-opacity group-hover:opacity-20',
          colorSet.bg
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* Text column */}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 truncate">
            {label}
          </p>
          <div className="flex items-end gap-2">
            <span className={cn('text-3xl font-extrabold leading-none', colorSet.text)}>
              {value}
            </span>
            {pulse && value > 0 && (
              <span className="mb-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </span>
            )}
          </div>
          {footnote && (
            <p className="text-[11px] text-slate-400 mt-1.5">{footnote}</p>
          )}
        </div>

        {/* Icon badge */}
        <div className={cn('flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl', colorSet.bg)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default WorkerStatCard;
