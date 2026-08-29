import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWorker } from '../../context/WorkerContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { MapPin, Navigation, User, Crosshair, ArrowRight, Clock, Layers } from 'lucide-react';

// Custom Marker Icons for Leaflet
const createWorkerTaskIcon = (priority, status, isSelected = false) => {
  let color = '#3b82f6'; // Blue
  if (priority === 'CRITICAL' || status === 'OVERDUE') color = '#ef4444'; // Red
  else if (priority === 'HIGH') color = '#f59e0b'; // Amber
  else if (status === 'COMPLETED' || status === 'RESOLVED') color = '#10b981'; // Emerald

  const size = isSelected ? 32 : 26;
  const borderWidth = isSelected ? 4 : 3;

  return L.divIcon({
    className: 'custom-task-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      ">
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Custom Icon for Worker's Current Location ("You Are Here")
const workerUserIcon = L.divIcon({
  className: 'worker-user-marker',
  html: `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-center;">
      <div style="position: absolute; inset: 0; background-color: rgba(37, 99, 235, 0.3); border-radius: 50%; animation: ping 1.5s infinite;"></div>
      <div style="background-color: #2563eb; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; items-center; justify-center; margin: auto;">
        <div style="width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

export const WorkerMap = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks } = useWorker();

  // Default worker center location (Mumbai Ward 12 / Sector 15)
  const defaultCenter = [19.1145, 72.8710];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(14);

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH_PRIORITY') return task.priority === 'HIGH' || task.priority === 'CRITICAL';
    if (filter === 'OVERDUE') return task.status === 'OVERDUE';
    if (filter === 'IN_PROGRESS') return task.status === 'IN_PROGRESS';
    if (filter === 'NEARBY') return true;
    return true;
  });

  const handleRecenter = () => {
    setMapCenter([...defaultCenter]);
    setMapZoom(14);
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden bg-slate-900 -m-4 sm:-m-6 lg:-m-8">
      {/* 1. Header & Filters Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pointer-events-none">
        <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-2 pointer-events-auto">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h1 className="font-extrabold text-slate-900 text-sm leading-tight">Field Task Map</h1>
            <p className="text-[10px] text-slate-500 font-semibold">{filteredTasks.length} Active Pins in Range</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="bg-slate-900/90 backdrop-blur p-1 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-1 overflow-x-auto max-w-full pointer-events-auto">
          {['ALL', 'HIGH_PRIORITY', 'NEARBY', 'OVERDUE', 'IN_PROGRESS'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Real Interactive Leaflet Map Container */}
      <div className="w-full h-full relative z-10">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <RecenterMap center={mapCenter} zoom={mapZoom} />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Worker Current Location Marker */}
          <Marker position={defaultCenter} icon={workerUserIcon}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-center font-sans">
                <span className="text-xs font-bold text-blue-600 block">You Are Here</span>
                <span className="text-[10px] text-slate-500">Field Worker Live Location</span>
              </div>
            </Popup>
          </Marker>

          {/* Task Map Markers */}
          {filteredTasks.map((task) => {
            if (!task.latitude || !task.longitude) return null;
            const isSelected = selectedTask?.id === task.id;

            return (
              <Marker
                key={task.id}
                position={[task.latitude, task.longitude]}
                icon={createWorkerTaskIcon(task.priority, task.status, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedTask(task);
                    setMapCenter([task.latitude, task.longitude]);
                  }
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 max-w-xs space-y-2 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-blue-600">{task.id}</span>
                      <IssuePriority priority={task.priority} />
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{task.title}</h4>
                    <p className="text-[11px] text-slate-600 truncate">{task.location}</p>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                      <IssueStatus status={task.status} />
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-[10px] py-1 px-2 font-bold"
                        onClick={() => navigate(`/worker/tasks/${task.id}`)}
                      >
                        View Task
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* 3. Task Details Bottom Drawer Card */}
      {selectedTask && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[400] animate-in slide-in-from-bottom-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-3 bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {selectedTask.id}
                  </span>
                  <IssuePriority priority={selectedTask.priority} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-7 h-7 flex items-center justify-center bg-slate-200/60 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shrink-0 cursor-pointer font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{selectedTask.location}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">2.4 km away from your location</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <IssueStatus status={selectedTask.status} />
                <Button
                  size="sm"
                  variant="primary"
                  icon={ArrowRight}
                  className="py-1.5 px-3 text-xs font-bold"
                  onClick={() => navigate(`/worker/tasks/${selectedTask.id}`)}
                >
                  Open Task Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        title="Recenter Map to Your Location"
        className="absolute bottom-6 left-6 z-[400] w-12 h-12 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-center transition-all cursor-pointer"
      >
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WorkerMap;
