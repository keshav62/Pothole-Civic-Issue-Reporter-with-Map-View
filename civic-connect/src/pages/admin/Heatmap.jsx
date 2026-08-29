import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { HardHat, Star, Clock, CheckCircle2, MapPin, Eye, Activity } from 'lucide-react';

export const FieldWorkerManagement = () => {
  const { workers, updateWorkerStatus } = useCivic();
  const [selectedWorker, setSelectedWorker] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Field Worker Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor ground staff workload, active tasks, shift availability, and resolution ratings.
          </p>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-500" /> Active Roster ({workers.length} Personnel)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Workload / Active Tasks</th>
                <th className="py-3 px-4">Completed Total</th>
                <th className="py-3 px-4">On-Time Rate</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{worker.name}</p>
                        <p className="text-[10px] text-slate-400">{worker.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{worker.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            worker.activeTasks >= 4 ? 'bg-red-500' : worker.activeTasks >= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(worker.activeTasks * 20, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{worker.activeTasks} active</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{worker.completedTasks} tasks</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{worker.onTimeRate}</td>
                  <td className="py-3 px-4">
                    <Badge variant={worker.status}>{worker.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="sm" variant="outline" icon={Eye} onClick={() => setSelectedWorker(worker)}>
                      View Workload
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <Modal
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          title={`Worker Profile — ${selectedWorker.name}`}
          subtitle={`${selectedWorker.department} Division`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={selectedWorker.avatar}
                alt={selectedWorker.name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedWorker.name}</h3>
                <p className="text-xs text-slate-500">{selectedWorker.email} • {selectedWorker.phone}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={selectedWorker.status}>{selectedWorker.status}</Badge>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    {selectedWorker.rating} / 5.0 Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Tasks</span>
                <span className="text-lg font-black text-amber-600 mt-1 block">{selectedWorker.activeTasks}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
                <span className="text-lg font-black text-emerald-600 mt-1 block">{selectedWorker.completedTasks}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Speed</span>
                <span className="text-lg font-black text-blue-600 mt-1 block">{selectedWorker.avgResolutionHours}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Update Status:</span>
              <div className="flex items-center gap-1">
                {['AVAILABLE', 'BUSY', 'OFFLINE', 'ON_LEAVE'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateWorkerStatus(selectedWorker.id, st);
                      setSelectedWorker({ ...selectedWorker, status: st });
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      selectedWorker.status === st ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
