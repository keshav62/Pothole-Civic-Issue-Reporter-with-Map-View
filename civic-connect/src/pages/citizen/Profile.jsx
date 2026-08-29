import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import {
  User, Mail, Phone, MapPin, Award, Shield, CheckCircle2,
  Bell, Lock, Save, Sparkles, LogOut, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CitizenProfile = () => {
  const { currentUser, logout } = useAuth();
  const { issues, showToast } = useCivic();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || 'Demo Citizen');
  const [email, setEmail] = useState(currentUser?.email || 'citizen@civicconnect.org');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [ward, setWard] = useState('Ward 1 (Central Zone)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Citizen stats
  const myReports = issues.filter(issue =>
    issue.reporterId === currentUser?.id ||
    issue.reporter === currentUser?.id ||
    issue.reporter === 'U-001' ||
    (currentUser?.id === 'USR-CIT-001' && (issue.reporter === 'U-001' || issue.reportedBy?.includes('Citizen')))
  );

  const resolvedReports = myReports.filter(i => ['RESOLVED', 'resolved'].includes(i.status));
  const civicPoints = myReports.length * 50 + resolvedReports.length * 100;

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast?.('Profile updated successfully!', 'success');
    }, 600);
  };

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information, contact preferences, and view your civic impact.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full ring-2 ring-white" title="Verified Citizen">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{name}</h2>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full w-max mx-auto sm:mx-0">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Level 2 Civic Champion
            </span>
          </div>
          <p className="text-sm text-slate-500">{email}</p>
          <p className="text-xs text-slate-400 font-mono">ID: {currentUser?.id || 'USR-CIT-001'}</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center sm:text-right shrink-0 min-w-[140px]">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Civic Impact</span>
          <span className="text-2xl font-black text-emerald-800 block mt-0.5">{civicPoints} pts</span>
          <span className="text-[11px] text-emerald-600 mt-1 block">{myReports.length} reports logged</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            {myReports.length}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reports Raised</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Contributing Citizen</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            {resolvedReports.length}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resolved Issues</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Community Impact</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Badge Tier</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">Active Contributor</p>
          </div>
        </div>
      </div>

      {/* Edit Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="w-4 h-4 text-emerald-600" />
          Personal Details
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Residential Ward
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notification Preferences
            </h4>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700 font-medium">
                Email notifications for report status changes and SLA updates
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700 font-medium">
                SMS alerts for critical civic advisories in your ward
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitizenProfile;
