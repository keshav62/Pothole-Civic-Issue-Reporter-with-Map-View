import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useCivic } from '../../context/CivicContext';
import { UserCheck, Star, MapPin, Clock, Award, ShieldAlert } from 'lucide-react';

export const AssignWorkerModal = ({ isOpen, onClose, issue }) => {
  const { workers, assignIssue, showToast } = useCivic();
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  if (!issue) return null;

  // Filter workers by issue department or all active workers
  const relevantWorkers = workers.filter(w => w.department === issue.department || true);

  // Compute recommended worker (available, lowest active tasks, closest distance)
  const recommendedWorker = [...relevantWorkers]
    .filter(w => w.status !== 'OFFLINE' && w.status !== 'ON_LEAVE')
    .sort((a, b) => (a.activeTasks - b.activeTasks) || (a.distanceKm - b.distanceKm))[0];

  const handleAssign = () => {
    if (!selectedWorkerId) {
      showToast('Please select a worker to assign', 'warning');
      return;
    }
    assignIssue(issue.id, issue.department, selectedWorkerId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Field Worker — ${issue.id}`}
      subtitle={`${issue.category} • ${issue.ward} (${issue.department})`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Issue Overview Card */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <p className="font-bold text-slate-900">{issue.title}</p>
          <div className="flex items-center gap-3 text-slate-500 mt-1">
            <span>Location: <strong className="text-slate-700">{issue.address}</strong></span>
            <span>Priority: <strong className="text-amber-600">{issue.priority}</strong></span>
          </div>
        </div>

        {/* Worker Recommendation Alert */}
        {recommendedWorker && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Recommended Worker</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  AI Match 98%
                </span>
              </div>
              <p className="text-xs text-emerald-800 font-semibold mt-1">{recommendedWorker.name}</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Reason: Closest available worker ({recommendedWorker.distanceKm} km), lowest workload ({recommendedWorker.activeTasks} active tasks), {recommendedWorker.onTimeRate} on-time rate.
              </p>
            </div>
          </div>
        )}

        {/* Workers Selection List */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            Select Field Worker:
          </label>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {relevantWorkers.map((worker) => {
              const isSelected = selectedWorkerId === worker.id;
              const isRecommended = recommendedWorker?.id === worker.id;

              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : isRecommended
                      ? 'border-emerald-300 bg-white hover:bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{worker.name}</h4>
                        {isRecommended && (
                          <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                            RECOMMENDED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {worker.activeTasks} active tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {worker.distanceKm} km away
                        </span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          {worker.onTimeRate} on-time
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={worker.status}>{worker.status}</Badge>
                    <input
                      type="radio"
                      name="workerSelection"
                      checked={isSelected}
                      onChange={() => setSelectedWorkerId(worker.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={UserCheck} onClick={handleAssign}>
            Confirm Assignment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
