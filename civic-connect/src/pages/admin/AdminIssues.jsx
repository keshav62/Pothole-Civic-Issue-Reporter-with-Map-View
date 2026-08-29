import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueTable } from '../../components/issues/IssueTable';
import { AssignWorkerModal } from '../../components/issues/AssignWorkerModal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { Search, Filter, RotateCcw, ShieldCheck } from 'lucide-react';

export const AdminIssues = () => {
  const { issues, departments } = useCivic();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningIssue, setAssigningIssue] = useState(null);

  const pageSize = 8;

  const filteredIssues = issues.filter((issue) => {
    const q = (searchTerm || '').toLowerCase();
    const title = (issue.title || '').toLowerCase();
    const issueId = (issue.id || issue._id || '').toLowerCase();
    const address = (issue.address || '').toLowerCase();
    const matchesSearch = !q || title.includes(q) || issueId.includes(q) || address.includes(q);

    const matchesCategory = !categoryFilter || issue.category === categoryFilter;
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
    const matchesDept = !departmentFilter || issue.department === departmentFilter;
    const matchesWard = !wardFilter || issue.ward === wardFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesDept && matchesWard;
  });

  const totalPages = Math.ceil(filteredIssues.length / pageSize) || 1;
  const paginatedIssues = filteredIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setPriorityFilter('');
    setDepartmentFilter('');
    setWardFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">All Municipal Civic Issues</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, filter, and take bulk administrative action across all reported issues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Advanced Filters</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">{filteredIssues.length} issues matched</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <Input
            placeholder="Search by ID, keyword..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={['Pothole', 'Water Leakage', 'Garbage Pileup', 'Streetlight', 'Drainage', 'Traffic Signal', 'Park Maintenance']}
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
            placeholder="All Departments"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={departments.map(d => d.name)}
          />

          <Select
            placeholder="All Wards"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            options={['Ward 4', 'Ward 8', 'Ward 12', 'Ward 15', 'Ward 22']}
          />
        </div>
      </div>

      {/* Data Table */}
      <IssueTable
        issues={paginatedIssues}
        onAssignClick={(issue) => setAssigningIssue(issue)}
        rolePrefix="/admin"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredIssues.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Assign Worker Modal */}
      <AssignWorkerModal
        isOpen={!!assigningIssue}
        onClose={() => setAssigningIssue(null)}
        issue={assigningIssue}
      />
    </div>
  );
};

export default AdminIssues;
