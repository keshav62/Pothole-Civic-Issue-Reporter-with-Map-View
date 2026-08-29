import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertOctagon, CheckCircle2, Clock, MapPin, Plus, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { currentUser } = useAuth();
  const { issues } = useCivic();
  const navigate = useNavigate();

  // In a real app we'd filter by currentUser.id, but since mock data might use different IDs, 
  // we filter by citizen role or just show a subset for demo purposes.
  // The mock issues reporter is "U-001", and our new citizen is "USR-CIT-001".
  const myReports = issues.filter(issue => issue.reporter === 'U-001' || issue.reporter === currentUser?.id);
  
  const resolvedCount = myReports.filter(i => i.status === 'resolved').length;
  const inProgressCount = myReports.filter(i => i.status === 'in-progress').length;
  const pendingCount = myReports.filter(i => i.status === 'pending').length;

  const recentReports = myReports.slice(0, 3); // top 3

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fade-in-up">
      
      {/* Welcome & CTA Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Citizen'}! 👋
            </h1>
            <p className="text-emerald-100 font-medium text-sm sm:text-base max-w-md">
              Help us keep the city safe and clean. Report issues you spot in your neighborhood and track their resolution.
            </p>
          </div>
          <button 
            onClick={() => navigate('/citizen/report')}
            className="flex items-center justify-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto shrink-0"
          >
            <Plus className="w-5 h-5" />
            Report New Issue
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{myReports.length}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
          </div>
          <p className="text-3xl font-black text-emerald-600">{resolvedCount}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
          </div>
          <p className="text-3xl font-black text-amber-600">{inProgressCount}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-2 text-slate-500 mb-3">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{pendingCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">Your Recent Reports</h2>
            <button 
              onClick={() => navigate('/citizen/reports')}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.map(issue => (
                <div key={issue.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">
                    {issue.categoryIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{issue.title}</h3>
                      <Badge variant={issue.status}>{issue.status.replace('-', ' ')}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5" />
                        {issue.location.address}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0"></span>
                      <span className="shrink-0">{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-700">No reports yet</h3>
                <p className="text-sm text-slate-500 mt-1">When you report an issue, it will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Community Alerts / Nearby Snapshot */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800">Community Alerts</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[300px]">
            {/* Map Placeholder Image */}
            <div className="h-48 bg-slate-100 relative w-full overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                alt="City Map" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  3 active issues in your area
                </p>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center">
              <p className="text-sm text-slate-600 font-medium text-center mb-4">
                Stay informed about ongoing maintenance and issues in your neighborhood.
              </p>
              <Button 
                variant="outline" 
                className="w-full font-bold text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => navigate('/citizen/nearby')}
              >
                View Map
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CitizenDashboard;
