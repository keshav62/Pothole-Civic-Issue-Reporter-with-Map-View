import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueTable } from '../../components/issues/IssueTable';
import { AssignWorkerModal } from '../../components/issues/AssignWorkerModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const DepartmentIssues = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();

  const deptName = currentUser?.department || 'Road Maintenance';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [assigningIssue, setAssigningIssue] = useState(null);

  // Filter issues belonging strictly to this department
  const departmentIssues = issues.filter(i => {
    const isDept = i.department === deptName;
    const matchesSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || i.status === statusFilter;
    const matchesPriority = !priorityFilter || i.priority === priorityFilter;
    const matchesWard = !wardFilter || i.ward === wardFilter;

    return isDept && matchesSearch && matchesStatus && matchesPriority && matchesWard;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{deptName} Issues</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and assign tasks specific to your division.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-blue-600" /> Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            placeholder="Search issue..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']}
          />

          <Select
            placeholder="All Priorities"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']}
          />

          <Select
            placeholder="All Wards"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            options={['Ward 4', 'Ward 8', 'Ward 12', 'Ward 15', 'Ward 22']}
          />
        </div>
      </div>

      {/* Table */}
      <IssueTable
        issues={departmentIssues}
        onAssignClick={(issue) => setAssigningIssue(issue)}
        rolePrefix="/admin"
      />

      <AssignWorkerModal
        isOpen={!!assigningIssue}
        onClose={() => setAssigningIssue(null)}
        issue={assigningIssue}
      />
    </div>
  );
};
