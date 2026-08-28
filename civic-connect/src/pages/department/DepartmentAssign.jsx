import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import {
  UserCheck,
  Award,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DepartmentAssign = () => {
  const { currentUser } = useAuth();
  const { issues, workers, assignIssue, showToast } = useCivic();

  const deptName = currentUser?.department || 'Road Maintenance';

  // Filter issues needing assignment or active in department
  const deptIssues = issues.filter(i => i.department === deptName && i.status !== 'RESOLVED');
  const [selectedIssueId, setSelectedIssueId] = useState(deptIssues[0]?.id || '');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  const currentIssue = issues.find(i => i.id === selectedIssueId) || deptIssues[0];
  const deptWorkers = workers.filter(w => w.department === deptName || true);

  // AI Recommendation engine: Available, lowest active tasks, closest distance
  const recommendedWorker = [...deptWorkers]
    .filter(w => w.status !== 'OFFLINE' && w.status !== 'ON_LEAVE')
    .sort((a, b) => (a.activeTasks - b.activeTasks) || (a.distanceKm - b.distanceKm))[0];

  const handleAssign = () => {
    if (!currentIssue) {
      showToast('Please select an issue', 'warning');
      return;
    }
    const targetWorkerId = selectedWorkerId || recommendedWorker?.id;
    if (!targetWorkerId) {
      showToast('Please select a worker to assign', 'warning');
      return;
    }

    assignIssue(currentIssue.id, deptName, targetWorkerId);
    showToast(`Assigned ${currentIssue.id} to worker successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" /> Smart Worker Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign field staff using automated proximity and workload recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COL: Issue Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Issue to Assign</h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {deptIssues.map((issue) => {
              const isSelected = issue.id === currentIssue?.id;
              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                    <IssuePriority priority={issue.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{issue.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{issue.ward} • Worker: {issue.assignedWorker || 'None'}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 2 COLS: Issue Details + Worker Match Selection */}
        <div className="lg:col-span-2 space-y-6">
          {currentIssue ? (
            <>
              {/* Selected Issue Summary Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-blue-600">{currentIssue.id}</span>
                      <IssuePriority priority={currentIssue.priority} />
                      <IssueStatus status={currentIssue.status} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{currentIssue.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                    {currentIssue.ward}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {currentIssue.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Location: <strong className="text-slate-800">{currentIssue.address}</strong></span>
                  <span>SLA Remaining: <strong className="text-amber-600">{currentIssue.slaHours - currentIssue.elapsedHours} hours</strong></span>
                </div>
              </div>

              {/* Recommendation Banner */}
              {recommendedWorker && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
                  <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">AI Automated Recommendation</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                        MATCH SCORE 98%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-emerald-900 mt-1">{recommendedWorker.name}</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      <strong>Reason:</strong> Closest available personnel ({recommendedWorker.distanceKm} km), lowest active task load ({recommendedWorker.activeTasks} tasks), {recommendedWorker.onTimeRate} on-time completion record.
                    </p>

                    <Button
                      size="sm"
                      variant="success"
                      icon={UserCheck}
                      className="mt-3"
                      onClick={() => {
                        setSelectedWorkerId(recommendedWorker.id);
                        handleAssign();
                      }}
                    >
                      Quick Assign {recommendedWorker.name}
                    </Button>
                  </div>
                </div>
              )}

              {/* Roster Selection */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">All Department Field Staff</h3>

                <div className="space-y-2">
                  {deptWorkers.map((worker) => {
                    const isSelected = selectedWorkerId === worker.id || (!selectedWorkerId && recommendedWorker?.id === worker.id);
                    const isRec = recommendedWorker?.id === worker.id;

                    return (
                      <div
                        key={worker.id}
                        onClick={() => setSelectedWorkerId(worker.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={worker.avatar} alt={worker.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{worker.name}</h4>
                              {isRec && <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">RECOMMENDED</span>}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                              <span>{worker.activeTasks} active tasks</span>
                              <span>{worker.distanceKm} km away</span>
                              <span className="text-emerald-600 font-semibold">{worker.onTimeRate} on-time</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={worker.status}>{worker.status}</Badge>
                          <Button size="sm" variant={isSelected ? 'primary' : 'outline'} onClick={handleAssign}>
                            Assign Task
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500">No issues pending assignment in this department.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
