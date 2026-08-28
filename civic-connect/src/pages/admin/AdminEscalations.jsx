import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { AssignWorkerModal } from '../../components/issues/AssignWorkerModal';
import { AlertOctagon, Flame, Clock, ShieldAlert, PhoneCall, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminEscalations = () => {
  const { issues, escalateIssue } = useCivic();
  const navigate = useNavigate();
  const [assigningIssue, setAssigningIssue] = useState(null);

  // Escalated issues filter: Critical priority, Breached SLA, or Overdue
  const escalatedList = issues.filter(
    i => i.priority === 'CRITICAL' || i.slaStatus === 'BREACHED' || i.elapsedHours >= i.slaHours
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-red-200 shadow-xs bg-red-50/20">
        <div>
          <h1 className="text-2xl font-black text-red-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" /> Escalation Management Center
          </h1>
          <p className="text-xs text-red-700 mt-1">
            Emergency control panel for SLA breaches, critical infrastructure hazards, and overdue assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-black text-xs shadow-sm">
            {escalatedList.length} Active Escalations
          </span>
        </div>
      </div>

      {/* Escalation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" /> High-Risk SLA Violations
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Issue ID & Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">SLA Limit</th>
                <th className="py-3 px-4">Elapsed Time</th>
                <th className="py-3 px-4">Status & Breach Warning</th>
                <th className="py-3 px-4 text-right">Emergency Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {escalatedList.map((issue) => {
                const isBreached = issue.slaStatus === 'BREACHED' || issue.elapsedHours >= issue.slaHours;

                return (
                  <tr key={issue.id} className={`hover:bg-slate-50 ${isBreached ? 'bg-red-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs text-red-700">{issue.id}</span>
                      <p className="font-bold text-slate-900 truncate max-w-xs">{issue.title}</p>
                      <span className="text-[10px] text-slate-400">{issue.ward}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{issue.department}</td>
                    <td className="py-3 px-4">
                      <IssuePriority priority={issue.priority} />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{issue.slaHours} hrs</td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${isBreached ? 'text-red-600' : 'text-amber-600'}`}>
                        {issue.elapsedHours} hrs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <IssueStatus status={issue.status} />
                        {isBreached && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                            <ShieldAlert className="w-3 h-3 text-red-600" />
                            ⚠️ SLA BREACHED
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={UserPlus}
                          onClick={() => setAssigningIssue(issue)}
                        >
                          Reassign
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={PhoneCall}
                          onClick={() => alert(`Calling Department Head for ${issue.department}...`)}
                        >
                          Contact Head
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AssignWorkerModal
        isOpen={!!assigningIssue}
        onClose={() => setAssigningIssue(null)}
        issue={assigningIssue}
      />
    </div>
  );
};
