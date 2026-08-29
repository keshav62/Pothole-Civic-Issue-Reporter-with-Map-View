import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
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

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/workers/me/tasks');
        const formattedTasks = (response.data.tasks || []).map(issue => ({
          id: issue._id,
          displayId: issue.issueId || issue._id.substring(0, 8).toUpperCase(),
          title: issue.title,
          location: issue.address || 'Location not specified',
          category: issue.category,
          status: issue.status,
          priority: issue.priority,
          assignedDate: issue.createdAt,
          dueDate: issue.dueDate || new Date(new Date(issue.createdAt).getTime() + 86400000).toISOString(),
          beforeImage: issue.images?.[0] || null
        }));
        setTasks(formattedTasks);
      } catch (err) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Search and Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        task.displayId.toLowerCase().includes(query) ||
        task.title.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      // Filter by Status
      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        matchesStatus = task.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Assigned Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track your assigned field operations.</p>
      </div>

      {/* 2 & 3. Search Bar and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">

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
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-500 font-medium">Loading your assigned tasks...</span>
        </div>
      ) : error ? (
        <div className="py-12 px-4 bg-red-50/50 rounded-2xl border border-red-100 flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="text-lg font-bold text-red-700">Failed to load tasks</h3>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">

              {/* Card Image (if exists) */}
              {task.beforeImage && (
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={task.beforeImage}
                    alt={task.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-black px-2.5 py-1 rounded-md">
                      {task.displayId}
                    </span>
                    <IssuePriority priority={task.priority} />
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">

                {/* Header (if no image) */}
                {!task.beforeImage && (
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-1 rounded-md">
                      {task.displayId}
                    </span>
                    <IssuePriority priority={task.priority} />
                  </div>
                )}

                {/* Title & Category */}
                <div className="mb-4">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="text-base font-black text-slate-900 line-clamp-2 leading-tight">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" className="text-[10px] uppercase tracking-wider">
                      {task.category}
                    </Badge>
                    <IssueStatus status={task.status} />
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{task.location}</span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-6 mt-auto text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Assigned</span>
                    <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(task.assignedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Time Remaining</span>
                    <SLAIndicator dueDate={task.dueDate} status={task.status} className="w-full justify-center" />
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="primary"
                  fullWidth
                  icon={Eye}
                  className="mt-auto shadow-sm"
                  onClick={() => navigate(`/worker/tasks/${task.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
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
      )}
    </div>
  );
};

export default AssignedTasks;
