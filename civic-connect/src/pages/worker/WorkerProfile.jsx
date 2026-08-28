import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { User, Star, HardHat, CheckCircle2, Clock, ShieldCheck, Phone, Mail, Award } from 'lucide-react';

export const WorkerProfile = () => {
  const { currentUser } = useAuth();
  const { updateWorkerStatus } = useCivic();

  const worker = currentUser || {
    id: 'USR-004',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@field.civicconnect.gov.in',
    phone: '+91 98765 43210',
    department: 'Road Maintenance',
    ward: 'Ward 15',
    status: 'AVAILABLE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    rating: 4.8,
    tasksCompleted: 87,
    onTimeRate: '94%',
    avgResolutionHours: '1.8 hrs'
  };

  return (
    <div className="space-y-4">
      {/* Profile Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
          />
          <div>
            <h1 className="text-lg font-black text-slate-900">{worker.name}</h1>
            <p className="text-xs text-slate-500 font-semibold">{worker.department} Division</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={worker.status}>{worker.status}</Badge>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                {worker.rating || 4.8} / 5.0 Rating
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{worker.phone || '+91 98765 43210'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 truncate">
            <Mail className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{worker.email}</span>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> Performance Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Tasks Completed</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">{worker.tasksCompleted || 87}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">On-Time SLA Rate</span>
            <span className="text-xl font-black text-blue-600 mt-1 block">{worker.onTimeRate || '94%'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Speed</span>
            <span className="text-xl font-black text-purple-600 mt-1 block">{worker.avgResolutionHours || '1.8 hrs'}</span>
          </div>
        </div>
      </div>

      {/* Shift Duty Status Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Shift Status</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => updateWorkerStatus(worker.id, 'AVAILABLE')}
            className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
              worker.status === 'AVAILABLE'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            AVAILABLE FOR DISPATCH
          </button>
          <button
            onClick={() => updateWorkerStatus(worker.id, 'BUSY')}
            className={`p-3 rounded-xl border font-bold text-center cursor-pointer transition-all ${
              worker.status === 'BUSY'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            ON FIELD TASK (BUSY)
          </button>
        </div>
      </div>
    </div>
  );
};
