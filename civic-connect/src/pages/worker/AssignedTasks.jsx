import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { MapPin, Clock, Eye, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const AssignedTasks = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const workerName = currentUser?.name || 'Rahul Sharma';
  const myTasks = issues.filter(
    i => i.assignedWorker === workerName || i.workerId === currentUser?.id || i.assignedTo === currentUser?.id
  );

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'ACTIVE') return task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS' || task.status === 'assigned' || task.status === 'in-progress';
    if (filter === 'COMPLETED') return task.status === 'RESOLVED' || task.status === 'resolved';
    if (filter === 'OVERDUE') return task.slaStatus === 'BREACHED' || task.elapsedHours >= task.slaHours;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">My Assigned Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and update the issues assigned to you.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg shadow-sm border border-slate-200">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Tasks</option>
            <option value="ACTIVE">Active (Pending/In Progress)</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col hover:shadow-md transition-shadow">
              {task.images?.before?.[0] || task.images?.before ? (
                <div className="h-40 w-full bg-slate-200 relative mb-4 rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={Array.isArray(task.images.before) ? task.images.before[0] : task.images.before} 
                    alt={task.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <IssuePriority priority={task.priority} />
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs text-blue-600">{task.id}</span>
                <IssueStatus status={task.status} />
              </div>

              <div className="flex-1 flex flex-col">
                {!task.images?.before && (
                  <div className="flex items-center gap-2 mb-2">
                    <IssuePriority priority={task.priority} />
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {task.category}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{task.title}</h3>
                <p className="text-xs text-slate-500 flex items-start gap-1 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{task.address || task.location?.address}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-4 mt-4 border-t border-slate-100">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {task.slaHours ? `Due in: ${Math.max(0, task.slaHours - task.elapsedHours)}h` : 'Due soon'}
                </span>
                <Button size="sm" variant="primary" icon={Eye} fullWidth className="sm:w-auto" onClick={() => navigate(`/worker/tasks/${task.id}`)}>
                  Manage Task
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tasks found</h3>
            <p className="text-slate-500">There are no tasks matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
