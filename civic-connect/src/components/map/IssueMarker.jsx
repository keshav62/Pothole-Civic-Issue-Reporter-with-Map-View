import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { IssueStatus } from '../issues/IssueStatus';
import { IssuePriority } from '../issues/IssuePriority';
import { MapPin, ChevronRight } from 'lucide-react';

const PRIORITY_COLORS = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#3B82F6',
  LOW: '#10B981',
};

export const createIssueIcon = (priority, status) => {
  const color = status === 'RESOLVED' ? '#10B981' : (PRIORITY_COLORS[priority] || '#3B82F6');
  const isPulse = priority === 'CRITICAL' && status !== 'RESOLVED';

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        ${isPulse ? `<div style="position:absolute;width:28px;height:28px;border-radius:50%;background:${color};opacity:0.35;animation:pulse 2s infinite;"></div>` : ''}
        <div style="width:20px;height:20px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const IssueMarker = ({ issue, rolePrefix = '/citizen/issues' }) => {
  const navigate = useNavigate();

  if (!issue.latitude || !issue.longitude) return null;

  return (
    <Marker
      position={[issue.latitude, issue.longitude]}
      icon={createIssueIcon(issue.priority, issue.status)}
    >
      <Popup maxWidth={260}>
        <div className="p-1 space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-xs text-slate-500">{issue.id}</span>
            <IssuePriority priority={issue.priority} />
          </div>
          <h4 className="font-bold text-sm text-slate-900 leading-snug">{issue.title}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{issue.address || issue.location?.address}</span>
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <IssueStatus status={issue.status} />
            <button
              onClick={() => navigate(`${rolePrefix}/${issue.id}`)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IssueMarker;
