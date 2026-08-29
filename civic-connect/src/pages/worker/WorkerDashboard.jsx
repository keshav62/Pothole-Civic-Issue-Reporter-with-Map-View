import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWorker } from '../../context/WorkerContext';
import WorkerStatCard from '../../components/worker/WorkerStatCard';
import TaskCard from '../../components/worker/TaskCard';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  AlertCircle,
  ClipboardCheck,
  ClipboardList,
  UploadCloud,
  UserCheck,
  ChevronRight,
  HardHat,
  MapPin,
  Eye,
  Navigation
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  return { text: 'Good Evening', emoji: '🌙' };
}

// ─── Activity type config ─────────────────────────────────────────────────────
const ACTIVITY_CONFIG = {
  assigned:       { icon: ClipboardList,  color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Task Assigned'   },
  started:        { icon: Clock,          color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Task Started'    },
  proof_uploaded: { icon: UploadCloud,    color: 'text-amber-600',  bg: 'bg-amber-50',  label: 'Proof Uploaded'  },
  completed:      { icon: ClipboardCheck, color: 'text-emerald-600',bg: 'bg-emerald-50',label: 'Task Completed'  },
};

// ─── Sections ─────────────────────────────────────────────────────────────────

/** Greeting + context banner */
const GreetingBanner = ({ stats, worker }) => {
  const greeting = getGreeting();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
      {/* decorative blobs */}
      <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-32 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-indigo-300 text-sm font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            {greeting.text}, {worker?.name?.split(' ')[0] || 'Worker'} {greeting.emoji}
          </h1>
          <p className="mt-2 text-indigo-200 text-sm max-w-sm leading-relaxed">
            You have{' '}
            <span className="text-white font-bold">{stats.assigned} pending</span> and{' '}
            <span className="text-white font-bold">{stats.inProgress} in-progress</span> task
            {stats.inProgress !== 1 ? 's' : ''} today.
            {stats.overdue > 0 && (
              <span className="text-red-300 font-bold"> {stats.overdue} overdue!</span>
            )}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to="/worker/tasks"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <ListTodo className="w-4 h-4" /> View All Tasks
            </Link>
            <Link
              to="/worker/map"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500/40 border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-indigo-500/60 transition-colors"
            >
              Open Map View
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-center">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-lg leading-none">{worker?.name}</p>
            <p className="text-indigo-300 text-xs mt-1">{worker?.department || 'Field Operations'}</p>
            <p className="text-indigo-300 text-xs">{worker?.ward || 'All Wards'}</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Available
            </span>
          </div>
          <img
            src={worker?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
            alt={worker?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-4 ring-white/20 bg-indigo-500 object-cover shadow-lg flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

/** 5-card stat row */
const StatsRow = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    <WorkerStatCard
      label="Today's Tasks"
      value={stats.total}
      icon="📋"
      colorSet={{ bg: 'bg-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-100' }}
      footnote={`${stats.resolved} resolved`}
    />
    <WorkerStatCard
      label="Total Assigned"
      value={stats.assigned}
      icon="🗂️"
      colorSet={{ bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-100' }}
      footnote="Pending start"
    />
    <WorkerStatCard
      label="In Progress"
      value={stats.inProgress}
      icon="⚙️"
      colorSet={{ bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-100' }}
      footnote="Active now"
    />
    <WorkerStatCard
      label="Completed"
      value={stats.resolved}
      icon="✅"
      colorSet={{ bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-100' }}
      footnote="All time"
    />
    <WorkerStatCard
      label="Overdue"
      value={stats.overdue}
      icon="🚨"
      colorSet={{ bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-100' }}
      footnote="Needs attention"
      pulse
    />
  </div>
);

/** Today's Tasks list */
const TodaysTasks = ({ tasks }) => {
  const navigate = useNavigate();
  const active = tasks.filter(t => t.status !== 'RESOLVED' && t.status !== 'resolved');
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Today's Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {active.length} task{active.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <Link
          to="/worker/tasks"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="p-4 space-y-3">
        {active.length > 0 ? (
          active.slice(0, 5).map(task => (
            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-600">{task.id}</span>
                  <IssuePriority priority={task.priority} />
                </div>
                <IssueStatus status={task.status} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {task.address || task.location?.address}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  SLA: {task.slaHours ? `${Math.max(0, task.slaHours - task.elapsedHours)}h remaining` : 'Pending'}
                </span>
                <span className="text-blue-600 font-bold">Nearby</span>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Navigation}
                  onClick={() => window.open(`https://maps.google.com/?q=${task.latitude || task.location?.lat},${task.longitude || task.location?.lng}`, '_blank')}
                >
                  Navigate
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  icon={Eye}
                  onClick={() => navigate(`/worker/tasks/${task.id}`)}
                >
                  View Task
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-14 flex flex-col items-center text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="font-semibold text-slate-700">All caught up!</p>
            <p className="text-sm text-slate-400 mt-1">No pending tasks for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/** SVG pseudo-map of nearby tasks */
const NearbyTasksMap = ({ tasks, worker }) => {
  const activeTasks = tasks.filter(t => t.status !== 'RESOLVED' && t.status !== 'resolved');
  const PRIORITY_COLORS = { HIGH: '#ef4444', High: '#ef4444', CRITICAL: '#dc2626', MEDIUM: '#f59e0b', Medium: '#f59e0b', LOW: '#60a5fa', Low: '#60a5fa' };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Nearby Tasks</h2>
          <p className="text-xs text-slate-500 mt-0.5">{worker?.ward || 'Your Area'}</p>
        </div>
        <Link
          to="/worker/map"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Full map <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SVG map */}
      <div className="flex-1 relative m-4 rounded-xl overflow-hidden min-h-[240px] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 border border-slate-100">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Grid */}
          <defs>
            <pattern id="dash-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e2e8f0" strokeWidth="0.7"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-grid)" />

          {/* Road lines */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 5" />
          <line x1="38%" y1="0" x2="38%" y2="100%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 5" />
          <line x1="72%" y1="0" x2="72%" y2="100%" stroke="#e2e8f0" strokeWidth="1.2" strokeDasharray="5 7" />
          <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5 7" />
          <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5 7" />

          {/* Task pins */}
          {activeTasks.map((task, idx) => {
            const col = PRIORITY_COLORS[task.priority] || '#94a3b8';
            // Generate pseudo-random positions if they don't have mapX/mapY
            const mapX = task.location?.mapX || ((idx * 15 + 20) % 90);
            const mapY = task.location?.mapY || ((idx * 25 + 15) % 90);
            return (
              <g key={task.id}>
                {/* Glow ring */}
                <circle cx={`${mapX}%`} cy={`${mapY}%`} r="16" fill={col} fillOpacity="0.12" />
                {/* Outer ring */}
                <circle cx={`${mapX}%`} cy={`${mapY}%`} r="9" fill={col} fillOpacity="0.25" />
                {/* Core dot */}
                <circle cx={`${mapX}%`} cy={`${mapY}%`} r="6" fill={col} />
                {/* White center */}
                <circle cx={`${mapX}%`} cy={`${mapY}%`} r="2.5" fill="white" />
              </g>
            );
          })}

          {/* Worker "you are here" */}
          <circle cx="50%" cy="50%" r="18" fill="#6366f1" fillOpacity="0.12" />
          <circle cx="50%" cy="50%" r="10" fill="#6366f1" />
          <circle cx="50%" cy="50%" r="4" fill="white" />
        </svg>

        {/* "You" label */}
        <div className="absolute" style={{ left: 'calc(50% + 14px)', top: 'calc(50% - 22px)' }}>
          <span className="text-[10px] font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded-md border border-indigo-200 shadow-sm">
            You
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        {[
          { color: 'bg-indigo-500', label: 'Your location' },
          { color: 'bg-red-500',    label: 'High priority'  },
          { color: 'bg-amber-500',  label: 'Medium'         },
          { color: 'bg-blue-400',   label: 'Low'            },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full flex-shrink-0', color)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Recent Activity feed */
const RecentActivityFeed = ({ activities }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100">
      <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
      <p className="text-xs text-slate-500 mt-0.5">Your latest task updates</p>
    </div>
    <div className="divide-y divide-slate-50">
      {activities.map(item => {
        const cfg = ACTIVITY_CONFIG[item.type] || ACTIVITY_CONFIG.assigned;
        const Icon = cfg.icon;
        return (
          <div key={item.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">
            {/* Icon */}
            <div className={cn('flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5', cfg.bg)}>
              <Icon className={cn('w-4 h-4', cfg.color)} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{item.taskTitle || item.detail}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.message || item.action}</p>
              <p className="text-[11px] text-slate-400 mt-1">{item.timeAgo || item.time}</p>
            </div>

            {/* Link */}
            <Link
              to={`/worker/tasks/${item.taskId || item.issueId}`}
              className="flex-shrink-0 self-center p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label={`View task ${item.taskId || item.issueId}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── WorkerDashboard ──────────────────────────────────────────────────────────
export const WorkerDashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, recentActivity, profile } = useWorker();

  const worker = {
    ...profile,
    name: currentUser?.name || profile.name
  };

  const stats = useMemo(() => ({
    total:      tasks.length,
    assigned:   tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'in-progress').length,
    resolved:   tasks.filter(t => t.status === 'RESOLVED' || t.status === 'resolved').length,
    overdue:    tasks.filter(t => t.slaStatus === 'BREACHED' || (t.slaHours && t.elapsedHours >= t.slaHours)).length,
  }), [tasks]);

  return (
    <div className="p-4 sm:p-6 xl:p-8 max-w-7xl mx-auto space-y-6 pb-10">

      {/* 1. Welcome banner */}
      <GreetingBanner stats={stats} worker={worker} />

      {/* 2. Stat cards */}
      <StatsRow stats={stats} />

      {/* 3. Today's Tasks + Nearby Map — side by side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TodaysTasks tasks={tasks} />
        </div>
        <div>
          <NearbyTasksMap tasks={tasks} worker={worker} />
        </div>
      </div>

      {/* 4. Recent Activity */}
      <RecentActivityFeed activities={recentActivity} />

    </div>
  );
};

export default WorkerDashboard;
