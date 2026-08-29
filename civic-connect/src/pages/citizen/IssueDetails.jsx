import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueTimeline } from '../../components/issues/IssueTimeline';
import { IssueMap } from '../../components/map/IssueMap';
import {
  ArrowLeft, MapPin, Calendar, Building2, User, Clock,
  ShieldCheck, AlertTriangle, CheckCircle2, Share2, Printer,
  FileText, ExternalLink, Image as ImageIcon
} from 'lucide-react';

export const CitizenIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, showToast } = useCivic();

  const issue = issues.find(i => i.id === id || i.id?.toLowerCase() === id?.toLowerCase());

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Issue Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          We couldn't find an issue with the reference ID "{id}". It may have been archived or removed.
        </p>
        <button
          onClick={() => navigate('/citizen/reports')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Reports
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Civic Issue ${issue.id}: ${issue.title}`,
        text: `Track status of ${issue.title} on CivicConnect`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast?.('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
              {issue.id}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {issue.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IssuePriority priority={issue.priority} />
            <IssueStatus status={issue.status} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight mb-2">
            {issue.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {issue.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Timeline Component */}
        <div className="pt-2">
          <IssueTimeline timeline={issue.timeline || []} />
        </div>
      </div>

      {/* Grid: Details & Map / Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence Photos & Official Resolution Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Evidence Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              Photo Evidence & Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Reported Condition (Before)
                </span>
                {issue.images?.before ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-52 relative group">
                    <img
                      src={issue.images.before}
                      alt="Before"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 h-52 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-4 text-center">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No initial photo uploaded</span>
                  </div>
                )}
              </div>

              {/* After Photo (Resolution) */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Resolution Proof (After)
                </span>
                {issue.images?.after ? (
                  <div className="rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/30 h-52 relative group">
                    <img
                      src={issue.images.after}
                      alt="After Resolution"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                      Verified Fix ✓
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 h-52 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-4 text-center">
                    <Clock className="w-8 h-8 mb-2 opacity-50 text-amber-500" />
                    <span className="text-xs font-medium">
                      {issue.status === 'RESOLVED' ? 'Resolution proof pending upload' : 'Awaiting worker resolution proof'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Official Department & Worker Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Department Response & Notes
            </h3>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Official Status Note:</span>
                <span>SLA Target: <strong>{issue.slaHours || 48} Hours</strong></span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                {issue.workNotes || 'The municipal team has logged this issue. As soon as a field team inspects the site, additional status updates and resolution notes will appear here.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Location Map & Metadata */}
        <div className="space-y-6">
          {/* Location Map Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Incident Location
              </h3>
              <span className="text-[11px] font-bold text-slate-500">{issue.ward || 'Ward 1'}</span>
            </div>

            {issue.latitude && issue.longitude ? (
              <div className="h-48 relative">
                <IssueMap
                  issues={[issue]}
                  center={[issue.latitude, issue.longitude]}
                  zoom={15}
                  height="192px"
                  rolePrefix="/citizen/issues"
                />
              </div>
            ) : (
              <div className="h-48 bg-slate-50 flex items-center justify-center text-slate-400 text-xs p-4 text-center">
                Location coordinates unavailable
              </div>
            )}

            <div className="p-4 bg-white text-xs text-slate-600 flex items-start gap-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-tight font-medium">{issue.address || issue.location?.address || 'No street address listed'}</span>
            </div>
          </div>

          {/* Quick Metadata Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Metadata</h4>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Reported On</span>
                <span className="font-semibold text-slate-800 text-xs">{issue.reportedDate || 'Recent'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Department</span>
                <span className="font-semibold text-slate-800 text-xs">{issue.department || 'General'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Assigned Team</span>
                <span className="font-semibold text-slate-800 text-xs">{issue.assignedWorker || 'Unassigned'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-500 text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> SLA Target</span>
                <span className="font-semibold text-emerald-700 text-xs">{issue.slaHours || 48} hrs (On Schedule)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenIssueDetails;
