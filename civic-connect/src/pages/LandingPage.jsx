import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/auth/GoogleAuthModal';
import {
  ShieldCheck,
  Building2,
  HardHat,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  Plus,
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();
  const [googleAuthOpen, setGoogleAuthOpen] = useState(false);
  const [googleAuthMode, setGoogleAuthMode] = useState('SIGN_IN');

  const handleLaunchRole = (roleKey, redirectPath) => {
    loginAs(roleKey);
    navigate(redirectPath);
  };

  const openGoogleSignIn = () => {
    setGoogleAuthMode('SIGN_IN');
    setGoogleAuthOpen(true);
  };

  const openGoogleSignUp = () => {
    setGoogleAuthMode('SIGN_UP');
    setGoogleAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]" />

      {/* Top Header Navigation */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40">
              C
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-none">CivicConnect</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-1">Civic & Authority Platform</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#portals" className="hover:text-blue-400 transition-colors">Citizen & Authority Modules</a>
            <a href="#workflow" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-blue-400 transition-colors">GovTech Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchRole('CITIZEN', '/citizen/dashboard')}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Citizen Report</span>
            </button>

            <button
              onClick={openGoogleSignIn}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Sign In</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              Launch Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Next-Gen Municipal Operations & SLA Dispatch</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none max-w-4xl mx-auto">
          Report. Resolve. Improve Your City.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          The unified civic platform bridging <strong className="text-blue-400">Citizens</strong> with <strong className="text-white">Super Admin HQ</strong>, <strong className="text-white">Department Control</strong>, and <strong className="text-white">Field Operations</strong> with real-time GPS heatmaps and photo-verified SLA dispatch.
        </p>

        {/* Primary Dual Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleLaunchRole('CITIZEN', '/citizen/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Plus className="w-4 h-4" />
            <span>Report Civic Issue as Citizen</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleLaunchRole('SUPER_ADMIN', '/admin/dashboard')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Launch Super Admin Headquarters</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Live Network Metric Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Resolved</span>
            <span className="text-2xl font-black text-white mt-1 block">12,540+</span>
            <span className="text-[10px] text-blue-400 font-bold mt-0.5 block">↑ +15.3% this month</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg SLA Resolution</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">2.4 Days</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">vs 14 days traditional</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SLA Compliance</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">98.4%</span>
            <span className="text-[10px] text-blue-400 font-bold mt-0.5 block">Verified On-Time</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City Wards Covered</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">35 Wards</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Unified Command</span>
          </div>
        </div>
      </section>

      {/* 4 Core Portals Section (Including Citizen) */}
      <section id="portals" className="relative z-10 py-16 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Complete Platform Architecture</h2>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Four Specialized Modules Connecting Citizens & Authorities
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Role-based control rooms designed specifically for residents, government administrators, division chiefs, and field crews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Citizen Resident Module Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-5">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Module 1</span>
                <h3 className="text-xl font-black text-white mt-1">Citizen Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Public resident reporting portal to log potholes, sanitation hazards, water leaks, and streetlight outages with real-time status tracking.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>GPS Auto-Locate & Address Input</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Real Device Photo File Picker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Resolution Timeline & Community Points</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunchRole('CITIZEN', '/citizen/dashboard')}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Enter Citizen Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Super Admin Module Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Module 2</span>
                <h3 className="text-xl font-black text-white mt-1">Super Admin HQ</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Citywide governance center with executive KPI dashboards, ward density heatmaps, department SLA audit tables, and emergency escalations.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Citywide Heatmap Density View</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Department Performance Audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>User & Department Registration</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunchRole('SUPER_ADMIN', '/admin/dashboard')}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Enter Super Admin HQ</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Department Admin Module Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Module 3</span>
                <h3 className="text-xl font-black text-white mt-1">Department Admin</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Division operational control room for Road Maintenance, Sanitation, Electrical, Water Supply, Drainage, Parks, and Traffic dispatch.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Smart AI Worker Match Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Division Workload Balancing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Department Issues Pipeline</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunchRole('DEPARTMENT_ADMIN', '/department/dashboard')}
                className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-600/20"
              >
                <span>Enter Department Admin</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Field Worker Module Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-5">
                  <HardHat className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Module 4</span>
                <h3 className="text-xl font-black text-white mt-1">Field Worker Mobile</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Mobile-first task dispatch workstation with live SLA countdown timers, Google Maps turn-by-turn navigation, and photo evidence uploaders.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Live SLA Countdown Timer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Device Image Photo File Picker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Google Maps Navigation Link</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleLaunchRole('FIELD_WORKER', '/worker/dashboard')}
                className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20"
              >
                <span>Enter Field Worker Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline Section */}
      <section id="workflow" className="relative z-10 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">End-to-End Operational Flow</h2>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              From Citizen Report to Verified Field Resolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">1</span>
              <h4 className="text-base font-bold text-white">Citizen Report</h4>
              <p className="text-xs text-slate-400 mt-2">
                Potholes, sanitation issues, or broken lights logged by residents with precise GPS coordinates.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">2</span>
              <h4 className="text-base font-bold text-white">HQ Verification</h4>
              <p className="text-xs text-slate-400 mt-2">
                Admins verify complaint severity, assign SLA timer targets, and route to division chiefs.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center mb-4">3</span>
              <h4 className="text-base font-bold text-white">AI Worker Dispatch</h4>
              <p className="text-xs text-slate-400 mt-2">
                Smart algorithm selects nearest field worker with lowest active workload and highest SLA rate.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center mb-4">4</span>
              <h4 className="text-base font-bold text-white">Photo Proof Upload</h4>
              <p className="text-xs text-slate-400 mt-2">
                Field worker uploads local photo proof of completion. Status updates to RESOLVED in HQ database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-xs flex items-center justify-center">C</div>
            <span className="font-bold text-slate-300">CivicConnect Unified Platform</span>
            <span>• Hackathon Enterprise Edition</span>
          </div>

          <p>© 2026 CivicConnect GovTech. Connecting Citizens & City Authorities.</p>
        </div>
      </footer>

      {/* Firebase Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleAuthOpen}
        onClose={() => setGoogleAuthOpen(false)}
        defaultMode={googleAuthMode}
      />
    </div>
  );
};
