import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
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
  Clock3,
  ArrowRight,
  ShieldAlert,
  Building2,
  RefreshCw,
  TrendingUp,
  Map,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';

export const AdminDashboard = () => {
  const { issues, departments } = useCivic();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter critical & SLA breached issues
  const criticalIssues = issues.filter(i => i.priority === 'CRITICAL' || i.slaStatus === 'BREACHED');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 1. Page Header & Operational Path */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>CivicConnect</span>
            <span>/</span>
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-800 font-extrabold">Overview</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">HQ Operations Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time municipal service monitoring, department performance, and dispatch diagnostics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE OPERATIONAL STATE</span>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-1.5 rounded border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh dashboard data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/heatmap')} className="h-8 flex items-center gap-1.5 text-[11px] font-bold">
            <Map className="w-3.5 h-3.5 text-slate-500" />
            City Heatmap
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/issues')} className="h-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 text-[11px] font-bold">
            <Layers className="w-3.5 h-3.5" />
            Manage Issues
          </Button>
        </div>
      </div>

      {/* 2. KPI / Metric Area (High-Density & Restrained Layout) */}
      <div className="space-y-4">
        {/* Core Operations Row */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Core Operations</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card: Total Issues */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Logged Cases</span>
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-xl font-bold text-slate-900">12,540</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +8.4%
                </span>
              </div>
            </div>

            {/* Card: Pending */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Awaiting Dispatch</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-xl font-bold text-slate-900">2,340</h3>
                <span className="text-[10px] font-semibold text-slate-400">Queue Active</span>
              </div>
            </div>

            {/* Card: In Progress */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Active In-Field crews</span>
                <Play className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-xl font-bold text-slate-900">1,120</h3>
                <span className="text-[10px] font-semibold text-slate-400">Crews Dispatched</span>
              </div>
            </div>

            {/* Card: Resolved */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Successfully Resolved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-xl font-bold text-slate-900">9,080</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">
                  94.2% Rate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Indicators (Red Alert vs Resolution SLA Performance) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card: Critical Overdue SLA */}
          <div className="bg-white rounded-lg border border-red-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider block">Critical Diagnostics</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">SLA-Breached / Severe Incidents</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Issues currently open that require emergency department allocation.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-red-600 tracking-tight">{criticalIssues.length}</span>
              <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded block mt-1">ATTENTION REQUIRED</span>
            </div>
          </div>

          {/* Card: Resolution Performance */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Clock3 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Performance Metrics</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Average Turnaround Index</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Mean time required for citizen report verification, worker assignment, and fix verification.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">2.4 Days</span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded block mt-1">SLA Standard: &lt; 3.0D</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Issues Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Issues Analytics Overview</h3>
              <p className="text-[10px] text-slate-500">Volume tracking of daily reported issues vs resolved issues</p>
            </div>
            
            <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${timeRange === '7d' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded cursor-pointer transition-colors ${timeRange === '30d' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-72 mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS_DATA.issuesOverTime} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '4px', border: 'none', fontSize: '10px', padding: '6px 10px' }}
                />
                <Bar dataKey="reported" fill="#2563EB" name="Reported Volume" radius={[2, 2, 0, 0]} barSize={22} />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved Volume" radius={[2, 2, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: Issue Status Distribution Pie */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Status Distribution</h3>
            <p className="text-[10px] text-slate-500">Proportional breakdown of current database tickets</p>
          </div>

          <div className="h-48 my-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ANALYTICS_DATA.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MOCK_ANALYTICS_DATA.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '4px', border: 'none', fontSize: '9px', padding: '4px 8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] pt-3 border-t border-slate-100">
            {MOCK_ANALYTICS_DATA.statusDistribution.map((st) => (
              <div key={st.name} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                <span className="text-slate-600 truncate">{st.name}:</span>
                <span className="font-semibold text-slate-800 ml-auto">{st.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Department Performance Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Department Performance Directory</h3>
            <p className="text-[10px] text-slate-500">Resolution output and SLA compliance quotas by municipal division</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/departments')} className="text-blue-600 hover:text-blue-700 hover:bg-slate-50 flex items-center gap-1 text-[10px] font-bold p-1 h-7">
            Detailed Audit
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Division</th>
                <th className="py-2.5 px-4 font-semibold text-right">Logged Tickets</th>
                <th className="py-2.5 px-4 font-semibold text-right">Resolved</th>
                <th className="py-2.5 px-4 font-semibold text-right">Pending</th>
                <th className="py-2.5 px-4 font-semibold text-right">Efficiency Rate</th>
                <th className="py-2.5 px-4 font-semibold text-right">SLA Adherence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
              {departments.map((dept) => {
                const parsePercent = (val) => parseInt(val?.replace('%', '') || '0', 10);
                const effRate = parsePercent(dept.resolutionRate);
                const slaComp = parsePercent(dept.slaCompliance);

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {dept.name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{dept.totalIssues}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600">{dept.resolved}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600">{dept.openIssues}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-slate-800 font-mono">{dept.resolutionRate}</span>
                        <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block shrink-0">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${effRate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-slate-800 font-mono">{dept.slaCompliance}</span>
                        <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block shrink-0">
                          <div className={`h-full rounded-full ${slaComp >= 90 ? 'bg-emerald-500' : slaComp >= 85 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${slaComp}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Grid: Critical Incident Logs + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Issues Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Critical Incident Logs</h3>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/admin/escalations')} className="h-7 text-[10px] font-bold border-slate-200 hover:bg-slate-50 p-1 px-2.5">
              Escalation Queue ({criticalIssues.length})
            </Button>
          </div>

          <div className="mt-4 space-y-2 flex-1">
            {criticalIssues.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active critical or SLA breached incidents detected.
              </div>
            ) : (
              criticalIssues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between gap-3 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold text-[10px] text-slate-500">{issue.id}</span>
                      <span className={`px-1.5 py-0.5 rounded-[3px] text-[8px] font-bold ${issue.slaStatus === 'BREACHED' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        {issue.slaStatus === 'BREACHED' ? 'SLA OVERDUE' : issue.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-850 truncate mt-1.5">{issue.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{issue.department} • Ward {issue.ward || 'General'}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/admin/issues/${issue.id}`)} className="h-7 text-[10px] font-bold border-slate-200 hover:bg-white bg-slate-50/50 shrink-0">
                    Review
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default AdminDashboard;
