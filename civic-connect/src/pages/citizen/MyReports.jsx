import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueTimeline } from '../../components/issues/IssueTimeline';
import { Button } from '../../components/common/Button';
import { MapPin, Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyReports = () => {
  const { issues } = useCivic();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-black text-slate-900">My Submitted Reports</h1>
        </div>

        <Button variant="success" size="sm" onClick={() => navigate('/citizen/report')}>
          + Report New Issue
        </Button>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-blue-600">{issue.id}</span>
                <IssuePriority priority={issue.priority} />
                <IssueStatus status={issue.status} />
              </div>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Reported {issue.reportedDate}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
              <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">{issue.description}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">{issue.address} ({issue.ward})</span>
            </div>

            {/* Before / After Photo Evidence Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Reported Photo Evidence</span>
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={issue.images.before} alt="Reported" className="w-full h-full object-cover" />
                </div>
              </div>

              {issue.images.after && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-600">Verified Repair Proof</span>
                  <div className="aspect-video rounded-xl overflow-hidden border border-emerald-300 bg-slate-100">
                    <img src={issue.images.after} alt="Resolved" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="pt-3 border-t border-slate-100">
              <IssueTimeline timeline={issue.timeline} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReports;
