import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { MapPin, Clock, Navigation, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssignedTasks = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const workerName = currentUser?.name || 'Rahul Sharma';
  const myTasks = issues.filter(
    i => i.assignedWorker === workerName || i.workerId === currentUser?.id || true
  );

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'ACTIVE') return task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS';
    if (filter === 'COMPLETED') return task.status === 'RESOLVED';
    if (filter === 'OVERDUE') return task.slaStatus === 'BREACHED' || task.elapsedHours >= task.slaHours;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <h1 className="text-lg font-black text-slate-900">My Assigned Tasks</h1>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          {filteredTasks.length} Tasks
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl overflow-x-auto">
        {['ALL', 'ACTIVE', 'COMPLETED', 'OVERDUE'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === tab ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-blue-600">{task.id}</span>
              <IssueStatus status={task.status} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <IssuePriority priority={task.priority} />
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {task.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {task.address}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Due in: {Math.max(0, task.slaHours - task.elapsedHours)}h
              </span>
              <Button size="sm" variant="primary" icon={Eye} onClick={() => navigate(`/worker/tasks/${task.id}`)}>
                Open Task Workstation
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
