import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
import { useLocation } from '../../hooks/useLocation';
import { calculateDistance, formatDistance, formatTimeAgo } from '../../utils/geo';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { SLAIndicator } from '../../components/worker/SLAIndicator';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MapPin, Search, Filter, Calendar, Clock, Eye, AlertCircle } from 'lucide-react';

export const AssignedTasks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { tasks } = useWorker();
  const { coords } = useLocation();

  // Search and Filter Logic (100% null-safe)
  const filteredTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];

    const q = (searchQuery || '').trim().toLowerCase();

    return tasks.filter((task) => {
      const taskId = String(task.issueId || task.id || task._id || '').toLowerCase();
      const taskTitle = String(task.title || '').toLowerCase();
      const taskCategory = String(task.category || '').toLowerCase();
      const taskAddress = String(
        task.address ||
        (typeof task.location === 'string' ? task.location : task.location?.address) ||
        task.ward ||
        ''
      ).toLowerCase();
      const taskStatus = String(task.status || '').toUpperCase();

      const matchesSearch = !q || taskId.includes(q) || taskTitle.includes(q) || taskCategory.includes(q) || taskAddress.includes(q);

      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        matchesStatus = taskStatus === statusFilter.toUpperCase();
      }

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">

      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Assigned Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">Manage, navigate, and track your assigned field operations in real-time.</p>
      </div>

      {/* 2 & 3. Search Bar and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4">

        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
            placeholder="Search by ID, Title, Location, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <Filter className="h-4 w-4 text-slate-400 hidden md:block mr-1" />
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Assigned', value: 'ASSIGNED' },
            { label: 'Accepted', value: 'ACCEPTED' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Overdue', value: 'OVERDUE' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                statusFilter === filter.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Task List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const displayId = task.issueId || task.id || (task._id ? String(task._id) : 'ISS-000');
            const keyId = task._id || task.id || task.issueId || Math.random();
            const taskAddress = task.address || (typeof task.location === 'string' ? task.location : task.location?.address) || task.ward || 'Municipal Field Zone';
            const beforeImg = task.beforeImage || task.images?.[0];
            const navigateTarget = task.issueId || task.id || task._id;

            let lat = task.latitude ?? task.lat ?? task.location?.lat;
            let lng = task.longitude ?? task.lng ?? task.location?.lng;
            if (task.location?.coordinates && Array.isArray(task.location.coordinates) && task.location.coordinates.length >= 2) {
              lng = task.location.coordinates[0];
              lat = task.location.coordinates[1];
            }

            const refLat = coords?.lat != null ? coords.lat : 31.2540;
            const refLng = coords?.lng != null ? coords.lng : 75.7050;
            const distMeters = (lat != null && lng != null) ? calculateDistance(refLat, refLng, lat, lng) : 0;
            const formattedDist = formatDistance(distMeters);
            const formattedTime = formatTimeAgo(task.createdAt);

            const prio = (task.priority || 'MEDIUM').toUpperCase();
            let prioBg = 'bg-amber-100/70 text-amber-800 border-amber-200';
            if (prio === 'CRITICAL') prioBg = 'bg-red-100 text-red-700 border-red-200';
            else if (prio === 'HIGH') prioBg = 'bg-amber-100 text-amber-800 border-amber-200';
            else if (prio === 'LOW') prioBg = 'bg-blue-100 text-blue-700 border-blue-200';

            return (
              <div key={keyId} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group">

                {/* Card Image (if exists) */}
                {beforeImg && (
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={beforeImg}
                      alt={task.title || 'Task Image'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-black px-2.5 py-1 rounded-md font-mono">
                        {displayId}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${prioBg}`}>
                        {prio}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1 space-y-3">

                  {/* Top Bar: Priority + Category + ID + Live Distance + Time Ago */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {!beforeImg && (
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${prioBg}`}>
                          {prio}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                        {task.category || 'POTHOLE'}
                      </span>
                      {!beforeImg && (
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {displayId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                        {formattedDist} away
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {formattedTime}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {task.title || 'Civic Issue Task'}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Location & Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-auto">
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 min-w-0">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                      <span className="truncate">{taskAddress}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={MapPin}
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat || 31.254},${lng || 75.705}`, '_blank')}
                      >
                        Navigate
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={Eye}
                        onClick={() => navigate(`/worker/tasks/${navigateTarget}`)}
                      >
                        View Issue &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* 5. Empty State */
          <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">No tasks found</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
              We couldn't find any tasks matching your current search and filter criteria. Try adjusting them.
            </p>
            {(searchQuery || statusFilter !== 'ALL') && (
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
