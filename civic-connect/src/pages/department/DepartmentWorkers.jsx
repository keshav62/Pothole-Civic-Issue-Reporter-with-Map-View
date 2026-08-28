import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { HardHat, Star, Clock, CheckCircle2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentWorkers = () => {
  const { currentUser } = useAuth();
  const { workers } = useCivic();
  const navigate = useNavigate();

  const deptName = currentUser?.department || 'Road Maintenance';
  const deptWorkers = workers.filter(w => w.department === deptName || true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-500" /> {deptName} Field Personnel
          </h1>
          <p className="text-xs text-slate-500 mt-1">Roster, performance metrics, and task dispatching.</p>
        </div>
        <Button variant="primary" icon={UserCheck} onClick={() => navigate('/department/assign')}>
          Dispatch / Assign Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptWorkers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{worker.name}</h3>
                  <p className="text-[11px] text-slate-500">{worker.phone}</p>
                  <div className="mt-1">
                    <Badge variant={worker.status}>{worker.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Tasks</span>
                  <span className="text-base font-bold text-amber-600 mt-0.5 block">{worker.activeTasks}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
                  <span className="text-base font-bold text-emerald-600 mt-0.5 block">{worker.completedTasks}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> {worker.onTimeRate} On-Time
              </span>
              <Button size="sm" variant="outline" onClick={() => navigate('/department/assign')}>
                Assign Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
