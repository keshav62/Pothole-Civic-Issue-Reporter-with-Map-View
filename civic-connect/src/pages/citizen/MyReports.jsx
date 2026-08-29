import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueTimeline } from '../../components/issues/IssueTimeline';
import { Button } from '../../components/common/Button';
import { MapPin, Calendar, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyReports = () => {
  const { issues } = useCivic();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = filterStatus === 'ALL' || issue.status === filterStatus;
    const q = (searchQuery || '').toLowerCase();
    const title = (issue.title || '').toLowerCase();
    const issueId = (issue.id || issue._id || '').toLowerCase();
    const ward = (issue.ward || '').toLowerCase();
    const matchesSearch = !q || title.includes(q) || issueId.includes(q) || ward.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold mb-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Citizen Dashboard
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">My Submitted Civic Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track resolution status, official department updates, and repair proof photos.</p>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate('/citizen/report')}>
          + Report New Issue
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, ID, or ward..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'REPORTED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {st === 'ALL' ? 'All Reports' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center space-y-3">
            <p className="text-sm font-bold text-slate-800">No reported issues found</p>
            <p className="text-xs text-slate-500">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{issue.id}</span>
                  <IssuePriority priority={issue.priority} />
                  <IssueStatus status={issue.status} />
                </div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Reported on {issue.reportedDate}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{issue.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">{issue.description}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{issue.address} ({issue.ward})</span>
              </div>

              {/* Photo Evidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reported Photo</span>
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={issue.images.before} alt="Reported" className="w-full h-full object-cover" />
                  </div>
                </div>

                {issue.images.after && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Verified Repair Proof</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default MyReports;
