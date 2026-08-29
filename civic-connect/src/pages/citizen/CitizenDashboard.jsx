import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { NearbyCivicAlerts } from '../../components/citizen/NearbyCivicAlerts';
import {
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Map,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();

  const myReports = issues;
  const resolvedCount = myReports.filter(i => i.status === 'RESOLVED').length;
  const inProgressCount = myReports.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;

  const recentReports = myReports.slice(0, 4);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Refined Welcome Hero Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>CIVICCONNECT CITIZEN PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Welcome back, {currentUser?.name || 'Citizen'}
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Report civic issues in your neighborhood, track real-time resolution timelines, and help keep city infrastructure safe and functioning.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              icon={Plus}
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/citizen/report')}
            >
              Report Civic Issue
            </Button>
            <Button
              size="lg"
              variant="darkOutline"
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => navigate('/citizen/reports')}
            >
              View My Reports
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Reports</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{myReports.length}</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Active</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-amber-600 tracking-tight">{inProgressCount}</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Tracked</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{resolvedCount}</h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Closed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Community Score</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-purple-600 tracking-tight">950 <span className="text-xs font-semibold text-slate-400">pts</span></h3>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Top 5%</span>
          </div>
        </div>
      </div>

      {/* REALTIME NEARBY CIVIC ALERTS CARD */}
      <NearbyCivicAlerts />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reported Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Reported Issues</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={() => navigate('/citizen/reports')}
            >
              View All Reports
            </Button>
          </div>

          <div className="space-y-3">
            {recentReports.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate('/citizen/reports')}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs">
                    {issue.id.slice(-3)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                      <IssuePriority priority={issue.priority} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">{issue.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{issue.address}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <IssueStatus status={issue.status} />
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood Map Widget */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Neighborhood Map</h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center p-4">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Neighborhood Map"
                className="w-full h-full object-cover opacity-60 absolute inset-0"
              />
              <div className="relative z-10 text-center space-y-2">
                <span className="px-3 py-1 bg-slate-950/90 text-white rounded-full text-xs font-bold border border-slate-700 shadow-md inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Ward 15 Active Issues
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              icon={Map}
              className="w-full text-xs font-bold py-2.5"
              onClick={() => navigate('/citizen/nearby')}
            >
              Explore Interactive Ward Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
