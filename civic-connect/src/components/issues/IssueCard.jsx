import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IssueStatus } from './IssueStatus';
import { IssuePriority } from './IssuePriority';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

export const IssueCard = ({
  issue,
  onClick,
  href,
  showImage = true,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(issue);
    } else if (href) {
      navigate(href);
    }
  };

  const getEmoji = (cat) => {
    switch (cat) {
      case 'Pothole': return '🕳️';
      case 'Water Leakage': return '💧';
      case 'Garbage Pileup':
      case 'Garbage': return '🗑️';
      case 'Streetlight': return '💡';
      case 'Drainage': return '🌊';
      case 'Traffic Signal': return '🚦';
      default: return '📋';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between group ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
              {getEmoji(issue.category)}
            </span>
            <div>
              <span className="font-mono text-xs font-bold text-slate-400 block">{issue.id}</span>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm line-clamp-1">
                {issue.title}
              </h3>
            </div>
          </div>
          <IssueStatus status={issue.status} />
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {issue.description || 'No detailed description.'}
        </p>

        {showImage && issue.images?.before && (
          <div className="mb-3 rounded-xl overflow-hidden h-28 border border-slate-100 bg-slate-50 relative">
            <img src={issue.images.before} alt={issue.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{issue.address || issue.location?.address || 'Location on map'}</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <IssuePriority priority={issue.priority} />
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
