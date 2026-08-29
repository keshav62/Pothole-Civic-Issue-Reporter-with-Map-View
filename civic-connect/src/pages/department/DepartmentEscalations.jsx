import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueTable } from '../../components/issues/IssueTable';
import { AlertOctagon, Flame } from 'lucide-react';

export const DepartmentEscalations = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const deptName = currentUser?.department || 'Road Maintenance';

  const escalatedList = issues.filter(
    i => i.department === deptName && (i.priority === 'CRITICAL' || i.slaStatus === 'BREACHED' || i.elapsedHours >= i.slaHours)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-red-200 shadow-xs bg-red-50/20">
        <div>
          <h1 className="text-2xl font-black text-red-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" /> {deptName} Escalations
          </h1>
          <p className="text-xs text-red-700 mt-1">Breached SLAs and urgent issues requiring immediate staff dispatch.</p>
        </div>
      </div>

      <IssueTable issues={escalatedList} rolePrefix="/admin" />
    </div>
  );
};
