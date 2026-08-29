import React, { useState } from 'react';
import { IssueStatus } from './IssueStatus';
import { IssuePriority } from './IssuePriority';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { Eye, ShieldCheck, UserPlus, ArrowUpDown, MapPin, Calendar, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';

export const IssueTable = ({ issues = [], onAssignClick, rolePrefix = '/admin' }) => {
  const navigate = useNavigate();
  const { verifyIssue, rejectIssue, escalateIssue } = useCivic();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('reportedDate');
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === issues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(issues.map(i => i.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Bulk Action Header if Selected */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 px-4 py-2.5 flex items-center justify-between border-b border-blue-100 text-xs text-blue-900 font-medium">
          <span>{selectedIds.length} issues selected</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => selectedIds.forEach(id => verifyIssue(id))}>
              Bulk Verify
            </Button>
            <Button size="sm" variant="danger" onClick={() => selectedIds.forEach(id => escalateIssue(id))}>
              Bulk Escalate
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  {selectedIds.length === issues.length && issues.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Issue ID</th>
              <th className="py-3 px-4">Title & Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Assigned Worker</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {issues.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <p className="text-xs font-bold text-slate-700">No civic issues found matching your current filters.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try resetting search keywords or status criteria.</p>
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
              const isSelected = selectedIds.includes(issue.id);
              return (
                <tr key={issue.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleSelect(issue.id)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{issue.id}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 truncate">{issue.title}</p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {issue.reportedDate}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{issue.category}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{issue.ward}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <IssuePriority priority={issue.priority} />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{issue.department}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {issue.assignedWorker || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 px-4">
                    <IssueStatus status={issue.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Eye}
                        onClick={() => navigate(`${rolePrefix}/issues/${issue.id}`)}
                      >
                        View
                      </Button>
                      <Dropdown
                        items={[
                          { label: 'View Details', icon: Eye, onClick: () => navigate(`${rolePrefix}/issues/${issue.id}`) },
                          { label: 'Verify Issue', icon: ShieldCheck, onClick: () => verifyIssue(issue.id) },
                          { label: 'Assign Worker', icon: UserPlus, onClick: () => onAssignClick && onAssignClick(issue) },
                          { label: 'Escalate Issue', danger: true, onClick: () => escalateIssue(issue.id) }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Fallback */}
      <div className="lg:hidden divide-y divide-slate-100">
        {issues.map((issue) => (
          <div key={issue.id} className="p-4 space-y-3 bg-white hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
              <IssueStatus status={issue.status} />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900">{issue.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{issue.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px]">
              <IssuePriority priority={issue.priority} />
              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">{issue.department}</span>
              <span className="text-slate-500 font-medium">{issue.ward}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">Worker: {issue.assignedWorker || 'Unassigned'}</span>
              <Button size="sm" variant="outline" icon={Eye} onClick={() => navigate(`${rolePrefix}/issues/${issue.id}`)}>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
