import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Button } from '../../components/common/Button';
import { Plus, CheckCircle2, Clock, MapPin, FileText, ChevronRight, ShieldCheck, Sparkles, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();

  const myReports = issues;
  const resolvedCount = myReports.filter(i => i.status === 'RESOLVED').length;
  const inProgressCount = myReports.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const pendingCount = myReports.filter(i => i.status === 'REPORTED' || i.status === 'VERIFIED').length;

  const recentReports = myReports.slice(0, 4);

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-700/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>CIVICCONNECT CITIZEN PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome, {currentUser?.name || 'Citizen'}! 👋
            </h1>
            <p className="text-blue-100 font-medium text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
              Report civic issues in your neighborhood, track real-time resolution timelines, and help improve your city infrastructure.
            </p>
          </div>

          <Button
            size="lg"
            variant="success"
            icon={Plus}
            className="shadow-xl py-3.5 px-6 font-black text-sm shrink-0"
            onClick={() => navigate('/citizen/report')}
          >
            + Report New Civic Issue
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Reports</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{myReports.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-600 mt-2">{resolvedCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-2">{inProgressCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Community Score</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-600 mt-2">950 pts</p>
        </div>
      </div>

      {/* Main Grid: My Reports & Nearby Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Reported Complaints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Your Reported Issues</h2>
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
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-base shrink-0">
                    {issue.id.slice(-3)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                      <IssuePriority priority={issue.priority} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate mt-1">{issue.title}</h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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

        {/* Right Col: Quick Nearby Map Card */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900">Neighborhood Map</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center p-4">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Neighborhood Map"
                className="w-full h-full object-cover opacity-70 absolute inset-0"
              />
              <div className="relative z-10 text-center space-y-2">
                <span className="px-3 py-1 bg-slate-900/90 text-white rounded-full text-xs font-bold border border-slate-700 shadow-md inline-block">
                  📍 Ward 15 Active Issues
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
