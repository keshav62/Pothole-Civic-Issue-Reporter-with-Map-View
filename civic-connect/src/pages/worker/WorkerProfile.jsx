import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  User, 
  MapPin, 
  Building, 
  Briefcase, 
  LogOut, 
  Key, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { useWorker } from '../../context/WorkerContext';

export const WorkerProfile = () => {
  const { logout, currentUser } = useAuth();
  const { profile } = useWorker();
  const navigate = useNavigate();

  // Local state for toggles (mock)
  const [isAvailable, setIsAvailable] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Merge profile data
  const worker = {
    ...profile,
    name: currentUser?.name || profile?.name || 'Worker',
    email: currentUser?.email || profile?.email || ''
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 pb-24">
      
      {/* 1. Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-12 sm:mt-16 text-center sm:text-left">
          <div className="relative">
            <img 
              src={worker.avatar || '/placeholder-avatar.png'} 
              alt={worker.name} 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
            />
            <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {worker.name}
              </h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{worker.role}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                {worker.department}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {worker.ward}
              </span>
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-1">
              Employee ID: <span className="text-slate-700">{worker.employeeId || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-indigo-500" /> 
          Performance Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{worker.completedTasksCount || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Tasks Completed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-blue-200 transition-colors">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{worker.activeTasksCount || 0}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">In Progress</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-purple-200 transition-colors">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{worker.avgResolutionHours || '0h'}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Avg Resolution</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-200 transition-colors">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{worker.completionRate || '0%'}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Completion Rate</span>
          </div>
        </div>
      </div>

      {/* 3. Profile Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 p-5 sm:p-6 border-b border-slate-100">
          <User className="w-5 h-5 text-indigo-500" /> 
          Account Settings
        </h3>
        
        <div className="divide-y divide-slate-100">
          <button className="w-full flex items-center gap-4 p-5 sm:px-6 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              <Edit3 className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-slate-900">Edit Profile</h4>
              <p className="text-xs text-slate-500 mt-0.5">Update your contact details and preferences</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-4 p-5 sm:px-6 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
              <Key className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-slate-900">Change Password</h4>
              <p className="text-xs text-slate-500 mt-0.5">Secure your account with a new password</p>
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 sm:px-6 hover:bg-red-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-red-600">Logout</h4>
              <p className="text-xs text-red-400 mt-0.5">Sign out of your field worker account</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default WorkerProfile;
