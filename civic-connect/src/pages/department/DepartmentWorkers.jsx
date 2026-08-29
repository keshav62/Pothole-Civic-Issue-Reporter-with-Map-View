import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { HardHat, Star, Clock, CheckCircle2, UserCheck, Phone, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentWorkers = () => {
  const { currentUser } = useAuth();
  const { workers } = useCivic();
  const navigate = useNavigate();

  const deptName = currentUser?.department || 'Road Maintenance';
  const deptWorkers = workers.filter(w => w.department === deptName || true);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <HardHat className="w-5 h-5" />
            </div>
            {deptName} Field Personnel
          </h1>
          <p className="text-xs text-slate-500 mt-1">Division roster, live availability, on-time resolution rate, and task dispatch.</p>
        </div>
        <Button variant="primary" icon={UserCheck} onClick={() => navigate('/department/assign')}>
          Dispatch / Assign Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptWorkers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="relative">
                  <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {worker.phone || '+91 98765 43210'}
                  </p>
                  <div className="mt-1.5">
                    <Badge variant={worker.status}>{worker.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Tasks</span>
                  <span className="text-lg font-black text-amber-600 mt-0.5 block">{worker.activeTasks}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
                  <span className="text-lg font-black text-emerald-600 mt-0.5 block">{worker.completedTasks}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
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

export default DepartmentWorkers;
