import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueMap } from '../../components/map/IssueMap';
import { MapPin, Navigation } from 'lucide-react';

export const WorkerMap = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();

  const workerName = currentUser?.name || 'Rahul Sharma';
  const myTasks = issues.filter(
    i => i.assignedWorker === workerName || i.workerId === currentUser?.id || true
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Worker Task Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Nearby task locations and route navigation.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <IssueMap
          issues={myTasks}
          center={[28.6139, 77.2090]}
          zoom={14}
          height="540px"
          rolePrefix="/worker"
        />
      </div>
    </div>
  );
};
