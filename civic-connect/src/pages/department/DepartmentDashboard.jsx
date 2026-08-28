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
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DepartmentDashboard = () => {
  const { currentUser } = useAuth();
  const { issues, workers } = useCivic();
  const navigate = useNavigate();

  const deptName = currentUser?.department || 'Road Maintenance';

  // Filter issues for this department
  const deptIssues = issues.filter(i => i.department === deptName);
  const deptWorkers = workers.filter(w => w.department === deptName);

  const pendingCount = deptIssues.filter(i => i.status === 'REPORTED' || i.status === 'VERIFIED').length;
  const inProgressCount = deptIssues.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = deptIssues.filter(i => i.status === 'RESOLVED').length;
  const overdueCount = deptIssues.filter(i => i.slaStatus === 'BREACHED' || i.elapsedHours >= i.slaHours).length;

  const categoryBreakdown = [
    { name: 'Pothole Repair', count: 18, color: '#3B82F6' },
    { name: 'Resurfacing', count: 12, color: '#10B981' },
    { name: 'Cracks & Asphalt', count: 8, color: '#F59E0B' },
    { name: 'Debris Removal', count: 5, color: '#6366F1' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{deptName} Division</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Monitor and manage road-related civic issues.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={UserCheck} onClick={() => navigate('/department/assign')}>
            Smart Worker Assignment
          </Button>
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
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Issues by Category</h3>
          <p className="text-xs text-slate-500 mb-3">Sub-types within {deptName}</p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count">
                  {categoryBreakdown.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worker Workload Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Worker Active Workload Distribution</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/department/workers')}>Manage Staff</Button>
          </div>

          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptWorkers}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="activeTasks" fill="#3B82F6" name="Active Tasks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedTasks" fill="#10B981" name="Completed Tasks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Issues & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Department Issues */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">High Priority Department Issues</h3>
            <Button size="sm" variant="outline" icon={ArrowRight} onClick={() => navigate('/department/issues')}>
              View All
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {deptIssues.slice(0, 3).map(issue => (
              <div key={issue.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                    <IssuePriority priority={issue.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{issue.title}</h4>
                  <span className="text-[10px] text-slate-500">{issue.ward} • Assigned: {issue.assignedWorker || 'Unassigned'}</span>
                </div>
                <IssueStatus status={issue.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Worker Live Status Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
            Field Worker Live Roster
          </h3>

          <div className="space-y-3">
            {deptWorkers.map(w => (
              <div key={w.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{w.name}</p>
                    <p className="text-[10px] text-slate-500">{w.activeTasks} active • {w.onTimeRate} on-time</p>
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
