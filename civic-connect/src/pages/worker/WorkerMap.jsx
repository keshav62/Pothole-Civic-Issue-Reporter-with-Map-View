import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { MapPin, Navigation, Filter, User, Crosshair, ArrowRight } from 'lucide-react';

export const WorkerMap = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks } = useWorker();

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH_PRIORITY') return task.priority === 'HIGH' || task.priority === 'CRITICAL';
    if (filter === 'OVERDUE') return task.status === 'OVERDUE';
    if (filter === 'IN_PROGRESS') return task.status === 'IN_PROGRESS';
    if (filter === 'NEARBY') return true; // Mock: assume all are nearby for now
    return true;
  });

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden bg-slate-50 -m-4 sm:-m-6 lg:-m-8">

      {/* 1. Header & Filters (Floating over map) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h1 className="font-black text-slate-900">Task Map</h1>
          </div>

          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-md flex">
            {['ALL', 'HIGH_PRIORITY', 'NEARBY', 'OVERDUE', 'IN_PROGRESS'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Isolated Map Placeholder Component */}
      {/* This section is isolated and easily replaceable with Leaflet later */}
      <div className="flex-1 relative bg-[#e5e3df] w-full h-full">
        {/* Mock Map Background Pattern */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Worker Location Marker (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-ping absolute -inset-2"></div>
            <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10">
              <Crosshair className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="mt-1 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-sm">You</span>
        </div>

        {/* Task Markers (Mock absolute positions relative to center) */}
        {filteredTasks.map((task, index) => {
          // Generate deterministic pseudo-random positions based on ID
          const seed = parseInt(task.id.replace(/\D/g, '')) || index;
          const top = 30 + ((seed * 17) % 50); // 30% to 80%
          const left = 20 + ((seed * 23) % 60); // 20% to 80%
          const isSelected = selectedTask?.id === task.id;

          let markerColor = 'bg-blue-500';
          if (task.priority === 'CRITICAL' || task.status === 'OVERDUE') markerColor = 'bg-red-500';
          else if (task.priority === 'HIGH') markerColor = 'bg-amber-500';
          else if (task.status === 'COMPLETED') markerColor = 'bg-emerald-500';

          return (
            <div
              key={task.id}
              className="absolute z-10 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 hover:z-20"
              style={{ top: `${top}%`, left: `${left}%` }}
              onClick={() => setSelectedTask(task)}
            >
              <div className={`w-7 h-7 ${markerColor} rounded-full border-2 border-white shadow-md flex items-center justify-center ${isSelected ? 'ring-4 ring-blue-500/30' : ''}`}>
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Task Information Panel (Bottom Overlay) */}
      {selectedTask && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-30 animate-in slide-in-from-bottom-4 pointer-events-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded">
                    {selectedTask.id}
                  </span>
                  <IssuePriority priority={selectedTask.priority} />
                </div>
                <h3 className="font-bold text-slate-900 leading-tight line-clamp-1">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">{selectedTask.location}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">2.4 km away</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <IssueStatus status={selectedTask.status} />
                <Button
                  size="sm"
                  variant="primary"
                  icon={ArrowRight}
                  className="py-1.5 px-3 text-xs"
                  onClick={() => navigate(`/worker/tasks/${selectedTask.id}`)}
                >
                  View Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recenter Button */}
      <button className="absolute bottom-4 left-4 z-20 w-12 h-12 bg-white rounded-full border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors pointer-events-auto">
        <Navigation className="w-5 h-5" />
      </button>

    </div>
  );
};

export default WorkerMap;
