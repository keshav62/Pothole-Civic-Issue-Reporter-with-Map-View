import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
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
  FileText,
  Clock,
  Play,
  CheckCircle2,
  Flame,
  Award,
  ArrowRight,
  ShieldAlert,
  Building2,
  Globe,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';

export const AdminDashboard = () => {
  const { issues, departments } = useCivic();
  const navigate = useNavigate();

  const criticalIssues = issues.filter(i => i.priority === 'CRITICAL' || i.slaStatus === 'BREACHED');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Dark Hero Banner (Same as Citizen Portal Theme) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>SUPER ADMIN COMMAND CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Municipal Command Center
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Real-time city-wide infrastructure monitoring, division SLA enforcement, worker rosters, and municipal issue dispatch.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/admin/issues')}
            >
              Manage All Issues
            </Button>
            <Button
              size="lg"
              variant="darkOutline"
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/admin/heatmap')}
            >
              View City Heatmap
            </Button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Issues"
          value="12,540"
          change="+8.4%"
          changeType="positive"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Pending"
          value="2,340"
          change="-4.2%"
          changeType="positive"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Progress"
          value="1,120"
          change="+12.1%"
          changeType="neutral"
          icon={Play}
          color="cyan"
        />
        <StatCard
          title="Resolved"
          value="9,080"
          change="+15.3%"
          changeType="positive"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Critical"
          value="84"
          change="-2.1%"
          changeType="positive"
          icon={Flame}
          color="red"
        />
        <StatCard
          title="Avg Resolution"
          value="2.4 days"
          change="-0.5 days"
          changeType="positive"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Issues Overview Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Issues Volume Overview (7 Days)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Reported vs Resolved daily volume across municipal wards</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold border border-slate-200/60">
              Last 7 Days
            </span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS_DATA.issuesOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="reported" fill="#2563eb" name="Reported" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Issue Status Distribution Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Issue Status Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Proportional breakdown of active city issues</p>
          </div>

          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ANALYTICS_DATA.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MOCK_ANALYTICS_DATA.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {MOCK_ANALYTICS_DATA.statusDistribution.map((st) => (
              <div key={st.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                <span className="text-slate-600 text-[11px] truncate">{st.name}: <strong>{st.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Performance Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">Resolution rates & SLA compliance by municipal division</p>
          </div>
          <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate('/admin/departments')}>
            View All Departments
          </Button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Total Issues</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Resolution Rate</th>
                <th className="py-3 px-4">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    {dept.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">{dept.totalIssues}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">{dept.resolved}</td>
                  <td className="py-3 px-4 text-amber-700 font-bold">{dept.openIssues}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{dept.resolutionRate}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {dept.slaCompliance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Issues Escalation + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Critical & SLA Breached Escalations</h3>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/escalations')}>
              View Escalations ({criticalIssues.length})
            </Button>
          </div>

          <div className="space-y-3">
            {criticalIssues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-red-700">{issue.id}</span>
                    <IssuePriority priority={issue.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{issue.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{issue.department} • {issue.ward}</p>
                </div>
                <Button size="sm" variant="danger" onClick={() => navigate(`/admin/issues/${issue.id}`)}>
                  Take Action
                </Button>
              </div>
            ))}
          </div>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminDashboard;
