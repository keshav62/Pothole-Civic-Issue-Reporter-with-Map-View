import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import {
  HardHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Eye,
  MapPin,
  Play,
  ArrowRight,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerDashboard = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();

  const workerName = currentUser?.name || 'Rahul Sharma';

  // Tasks assigned to this field worker
  const assignedTasks = issues.filter(
    i => i.assignedWorker === workerName || i.workerId === currentUser?.id || i.department === 'Road Maintenance'
  );

  const activeTasks = assignedTasks.filter(i => i.status === 'ASSIGNED' || i.status === 'IN_PROGRESS');
  const completedCount = assignedTasks.filter(i => i.status === 'RESOLVED').length;
  const overdueCount = assignedTasks.filter(i => i.slaStatus === 'BREACHED' || i.elapsedHours >= i.slaHours).length;

  return (
    <div className="space-y-4">
      {/* Mobile-Optimized Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight">Good morning, {workerName.split(' ')[0]}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Ready for today's field resolution shifts.</p>
        </div>

        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
        />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Today's Tasks</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">5</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">{activeTasks.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">{completedCount || 18}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Overdue</span>
          <span className="text-xl font-black text-red-600 mt-1 block">{overdueCount}</span>
        </div>
      </div>

      {/* Today's Priority Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" /> Today's Priority Tasks
          </h2>
          <button
            onClick={() => navigate('/worker/tasks')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All ({assignedTasks.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            You're all caught up! No active tasks pending.
          </div>
        ) : (
          activeTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-600">{task.id}</span>
                  <IssuePriority priority={task.priority} />
                </div>
                <IssueStatus status={task.status} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {task.address}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  SLA: {task.slaHours - task.elapsedHours}h remaining
                </span>
                <span className="text-blue-600 font-bold">0.8 km away</span>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Navigation}
                  onClick={() => window.open(`https://maps.google.com/?q=${task.latitude},${task.longitude}`, '_blank')}
                >
                  Navigate
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Eye}
                  onClick={() => navigate(`/worker/tasks/${task.id}`)}
                >
                  View Task
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
