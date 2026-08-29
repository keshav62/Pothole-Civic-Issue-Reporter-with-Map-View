import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { useWorker } from '../../context/WorkerContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AccountSettingsModal } from '../../components/common/AccountSettingsModal';
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
  Activity,
  ShieldCheck,
  Sparkles,
  Award
} from 'lucide-react';

export const WorkerProfile = () => {
  const { logout, currentUser } = useAuth();
  const { profile } = useWorker();
  const { showToast } = useCivic();
  const navigate = useNavigate();

  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Merge worker data
  const worker = {
    ...profile,
    name: currentUser?.name || profile?.name || 'Rahul Sharma',
    email: currentUser?.email || profile?.email || 'rahul.sharma@civicconnect.gov.in',
    avatar: currentUser?.avatar || profile?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: currentUser?.department || profile?.department || 'Road Maintenance',
    ward: currentUser?.ward || profile?.ward || 'Ward 12 - Andheri East',
    employeeId: profile?.id || 'FW-101'
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Dark Hero Banner (Matches Citizen & Admin Portals) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-blue-500/40 bg-slate-800 shadow-md"
              />
              <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full absolute -bottom-1 -right-1" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>FIELD WORKER PROFILE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {worker.name}
              </h1>
              <p className="text-slate-400 font-mono text-xs mt-0.5">
                {worker.department} • {worker.ward} (ID: {worker.employeeId})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="md"
              variant="primary"
              icon={User}
              className="py-2.5 px-4 font-bold text-xs shrink-0"
              onClick={() => setAccountModalOpen(true)}
            >
              Edit Account Settings
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Performance Statistics */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-blue-600" />
          Field Performance Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 border border-emerald-200/80 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">142</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Tasks Completed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-200/80 rounded-xl flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-blue-600 tracking-tight">3</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Active Tasks</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 border border-purple-200/80 rounded-xl flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-purple-600 tracking-tight">2.4h</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Avg Resolution Time</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200/80 rounded-xl flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-amber-600 tracking-tight">98.4%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">On-Time SLA Rate</span>
          </div>
        </div>
      </div>

      {/* 3. Account Settings & Security Options */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Account Management & Security
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          <button
            onClick={() => setAccountModalOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Edit Contact Profile & Credentials</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Update phone number, email address, and notification preferences</p>
            </div>
          </button>

          <button
            onClick={() => setAccountModalOpen(true)}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">Security Credentials & Password</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Change password and manage 2-Factor authentication settings</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50/60 transition-colors text-left cursor-pointer group"
          >
            <div className="w-9 h-9 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-red-600">Sign Out of Field Worker Portal</h4>
              <p className="text-[11px] text-red-400 mt-0.5">Disconnect session on this mobile workstation</p>
            </div>
          </button>
        </div>
      </div>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </div>
  );
};

export default WorkerProfile;
