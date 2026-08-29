import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Building2,
  FileText,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  HardHat,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentDashboard = () => {
  const { currentUser } = useAuth();
  const { issues, workers } = useCivic();
  const navigate = useNavigate();

  const deptName = currentUser?.department || 'Road Maintenance';

  const deptIssues = issues.filter(i => i.department === deptName);
  const deptWorkers = workers.filter(w => w.department === deptName);

  const pendingCount = deptIssues.filter(i => i.status === 'REPORTED' || i.status === 'VERIFIED').length;
  const inProgressCount = deptIssues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = deptIssues.filter(i => i.status === 'RESOLVED').length;
  const overdueCount = deptIssues.filter(i => i.slaStatus === 'BREACHED' || i.elapsedHours >= i.slaHours).length;

  const categoryBreakdown = [
    { name: 'Pothole Repair', count: 18, color: '#2563eb' },
    { name: 'Resurfacing', count: 12, color: '#10b981' },
    { name: 'Cracks & Asphalt', count: 8, color: '#f59e0b' },
    { name: 'Debris Removal', count: 5, color: '#6366f1' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Refined Dark Hero Banner (Same as Citizen Portal) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>DEPARTMENT ADMIN CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {deptName} Division
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Monitor division workloads, assign field workers, track SLA compliance, and manage road-related civic issues across city wards.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              icon={UserCheck}
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/department/assign')}
            >
              Smart Worker Assignment
            </Button>
            <Button
              size="lg"
              variant="darkOutline"
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/department/issues')}
            >
              View Division Issues
            </Button>
          </div>
        </div>
      </div>

      {/* Top Department KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Dept Issues" value={deptIssues.length.toString()} change="+5.2%" changeType="positive" icon={FileText} color="blue" />
        <StatCard title="Pending Action" value={pendingCount.toString()} change="-2" changeType="positive" icon={Clock} color="amber" />
        <StatCard title="In Progress" value={inProgressCount.toString()} change="+3" changeType="neutral" icon={Play} color="cyan" />
        <StatCard title="Resolved" value={resolvedCount.toString()} change="+14" changeType="positive" icon={CheckCircle2} color="emerald" />
        <StatCard title="Overdue / Breached" value={overdueCount.toString()} change="-1" changeType="positive" icon={AlertTriangle} color="red" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues by Category */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-0.5">Issues by Category</h3>
          <p className="text-xs text-slate-500 mb-3">Sub-types within {deptName}</p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="count">
                  {categoryBreakdown.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 text-[11px] truncate">{cat.name}: <strong>{cat.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Worker Workload Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Worker Active Workload Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Active vs completed tasks per worker</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/department/workers')}>Manage Staff</Button>
          </div>

          <div className="h-60 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptWorkers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="activeTasks" fill="#2563eb" name="Active Tasks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedTasks" fill="#10b981" name="Completed Tasks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Issues & Field Worker Live Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Department Issues */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">High Priority Division Issues</h3>
            <Button size="sm" variant="outline" icon={ArrowRight} onClick={() => navigate('/department/issues')}>
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {deptIssues.slice(0, 3).map(issue => (
              <div key={issue.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                    <IssuePriority priority={issue.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{issue.title}</h4>
                  <span className="text-[10px] text-slate-500 font-medium">{issue.ward} • Worker: {issue.assignedWorker || 'Unassigned'}</span>
                </div>
                <IssueStatus status={issue.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Worker Live Status Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Field Worker Live Roster</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{deptWorkers.length} Active</span>
          </div>

          <div className="space-y-3">
            {deptWorkers.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{w.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{w.activeTasks} active tasks • {w.onTimeRate} on-time</p>
                  </div>
                </div>
                <Badge variant={w.status}>{w.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
