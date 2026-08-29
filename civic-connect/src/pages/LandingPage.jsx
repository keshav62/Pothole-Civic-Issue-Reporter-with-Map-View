import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/auth/GoogleAuthModal';
import { Button } from '../components/common/Button';
import {
  Shield,
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
  ChevronRight,
  Radio,
  Globe,
  Activity,
  Layers,
  Zap,
  Lock,
  Cpu,
  BarChart3,
  Flame,
  CheckCircle,
  FileText,
  Navigation,
  Star,
  ShieldAlert,
  Users,
  Search,
  ArrowUpRight,
  UserPlus,
  LogIn
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

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* ── Ambient Mesh Lighting & Glow Effects ──────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[800px] -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[1600px] -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── Top Header Navigation ───────────────────────────────────────── */}
      <header className="relative z-40 border-b border-slate-800/80 bg-[#060911]/85 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-none">CivicConnect</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mt-0.5">GovTech Municipal Platform</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#portals" className="hover:text-blue-400 transition-colors">4 Role Modules</a>
            <a href="#bento" className="hover:text-blue-400 transition-colors">Platform Capabilities</a>
            <a href="#workflow" className="hover:text-blue-400 transition-colors">Dispatch Pipeline</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="darkOutline"
              onClick={() => navigate('/login')}
              leftIcon={<LogIn className="w-3.5 h-3.5 text-blue-400 mr-0.5" />}
              className="text-xs font-bold px-4"
            >
              Log In
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/signup')}
              leftIcon={<UserPlus className="w-3.5 h-3.5 mr-0.5" />}
              className="text-xs font-bold shadow-lg shadow-blue-500/25 px-4"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
        {/* Live Network Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-xl shadow-blue-500/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Municipal GIS & Incident Dispatch Engine</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Modern Digital Infrastructure for{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Modern Municipalities
          </span>
        </h1>

        {/* Hero Paragraph */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          CivicConnect unifies <strong className="text-white font-bold">Citizens</strong>, <strong className="text-white font-bold">Super Admin HQ</strong>, <strong className="text-white font-bold">Division Chiefs</strong>, and <strong className="text-white font-bold">Field Workers</strong> into a single real-time operational network with automated SLA tracking and photo-verified repairs.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            icon={UserPlus}
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto py-4 px-8 font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]"
          >
            Create New Account & Signup
          </Button>

          <Button
            size="lg"
            variant="darkOutline"
            icon={LogIn}
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto py-4 px-8 font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-[1.02]"
          >
            Sign In to Portal
          </Button>
        </div>

        {/* Quick Demo Instant Launch Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mr-1">Instant Demo Switcher:</span>
          {[
            { role: 'CITIZEN', label: 'Citizen Portal', path: '/citizen/dashboard', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-400' },
            { role: 'SUPER_ADMIN', label: 'Super Admin HQ', path: '/admin/dashboard', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:border-blue-400' },
            { role: 'DEPARTMENT_ADMIN', label: 'Department Control', path: '/department/dashboard', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:border-amber-400' },
            { role: 'FIELD_WORKER', label: 'Field Worker App', path: '/worker/dashboard', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400' },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => handleLaunchRole(r.role, r.path)}
              className={`px-3.5 py-1.5 rounded-xl bg-slate-900/90 border ${r.badge} transition-all cursor-pointer shadow-2xs hover:scale-105 flex items-center gap-1.5 font-bold`}
            >
              <span>{r.label}</span>
              <ArrowRight className="w-3 h-3 opacity-70" />
            </button>
          ))}
        </div>

        {/* Live Metric Highlights Bar */}
        <div id="impact" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Issues Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-white block">12,540+</span>
            <span className="text-[10px] text-emerald-400 font-bold block">↑ +15.3% Monthly Resolution</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Avg SLA Resolution</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">2.4 Days</span>
            <span className="text-[10px] text-slate-400 font-medium block">vs 14 days traditional</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">SLA Compliance</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 block">98.4%</span>
            <span className="text-[10px] text-blue-400 font-bold block">Verified On-Time Repairs</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">City Wards Network</span>
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 block">35 Wards</span>
            <span className="text-[10px] text-slate-400 font-medium block">Unified GIS Coverage</span>
          </div>
        </div>
      </section>

      {/* ── 4 Core Role Portals Section ─────────────────────────────────── */}
      <section id="portals" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#060911]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Platform Modules</h2>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              4 Tailored Role Control Rooms
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              Each portal is designed specifically for its user persona to streamline municipal governance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Citizen Portal */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-2xs group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Module 1</span>
                <h3 className="text-lg font-black text-white mt-1">Citizen Portal</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Resident reporting portal to log potholes, sanitation hazards, water leaks, and streetlight outages.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>GPS Auto-Locate Input</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Photo Evidence Uploads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Real-Time Timeline Tracker</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="md"
                className="mt-6 w-full"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => handleLaunchRole('CITIZEN', '/citizen/dashboard')}
              >
                Enter Citizen Portal
              </Button>
            </div>

            {/* Super Admin HQ */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-2xs group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Module 2</span>
                <h3 className="text-lg font-black text-white mt-1">Super Admin HQ</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Citywide command center with executive KPI dashboards, ward density heatmaps, and SLA audits.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>GIS City Heatmap Layer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Department Performance Audit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Critical SLA Escalations</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="md"
                className="mt-6 w-full"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => handleLaunchRole('SUPER_ADMIN', '/admin/dashboard')}
              >
                Enter Super Admin HQ
              </Button>
            </div>

            {/* Department Admin */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-2xs group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Module 3</span>
                <h3 className="text-lg font-black text-white mt-1">Department Admin</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Division control room for Road Maintenance, Sanitation, Electrical, Water, Drainage, and Traffic dispatch.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Smart Worker Match Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Workload Distribution Charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Live Staff Roster Controls</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="warning"
                size="md"
                className="mt-6 w-full"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => handleLaunchRole('DEPARTMENT_ADMIN', '/department/dashboard')}
              >
                Enter Department Admin
              </Button>
            </div>

            {/* Field Worker Mobile */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-2xs group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <HardHat className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Module 4</span>
                <h3 className="text-lg font-black text-white mt-1">Field Worker Mobile</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Action-oriented workstation with live SLA countdown timers, Google Maps navigation, and proof uploaders.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Live SLA Countdown Timers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Device Photo Proof Upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google Maps Navigation</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="success"
                size="md"
                className="mt-6 w-full"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => handleLaunchRole('FIELD_WORKER', '/worker/dashboard')}
              >
                Enter Field Worker Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Asymmetric Bento Grid Feature Showcase ──────────────────────── */}
      <section id="bento" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#070b14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>GovTech Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Enterprise Civic Scale
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built for high availability, zero latency, role-based security, and seamless municipal collaboration.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Large Featured Card (Spans 2 cols) */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-[#0c1424] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all shadow-2xl flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Real-Time GIS Engine</span>
                <h3 className="text-2xl font-black text-white">Interactive Citywide Heatmaps & Ward Density</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                  Filter thousands of active potholes, pipe leaks, and streetlight outages across 35 municipal wards. Instant clustering markers allow headquarters to spot high-density failure zones before they turn into critical emergencies.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Leaflet GIS Layer • Sub-second Query Speed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Bento 2: Smart Worker Dispatch */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition-all shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Division Dispatch</span>
                <h3 className="text-lg font-black text-white">Smart AI Worker Matching</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically assigns complaints to the nearest available field worker based on skill division, current workload, and proximity.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-bold text-amber-400 flex items-center justify-between">
                <span>94% Dispatch Accuracy</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bento 3: SLA Countdown & Escalation */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-red-500/50 transition-all shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">SLA Guarantee</span>
                <h3 className="text-lg font-black text-white">Automated SLA Escalation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Issues approaching resolution deadline automatically trigger warning notifications to division chiefs and escalate to HQ Super Admin.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-bold text-red-400 flex items-center justify-between">
                <span>Zero Unresolved Leaks</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bento 4: Photo Proof Verification */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Verification Audit</span>
                <h3 className="text-lg font-black text-white">Photo Evidence Audit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Field workers upload before and after repair proof photos from their device camera before marking any task as RESOLVED.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                <span>100% Audit Verifiable</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bento 5: Enterprise SSO & Access Control */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 transition-all shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Security & SSO</span>
                <h3 className="text-lg font-black text-white">Firebase Google SSO</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verified official authentication via Firebase SSO and Google Auth modal, ensuring strict role-based access control (RBAC).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-bold text-purple-400 flex items-center justify-between">
                <span>Govt Verified Credentials</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Operational Dispatch Pipeline Section ───────────────────────── */}
      <section id="workflow" className="relative z-10 py-20 border-t border-slate-800/80 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <h2 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Resolution Pipeline</h2>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              End-to-End Operational Lifecycle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/30">1</span>
              <h4 className="text-sm font-bold text-white">1. Incident Logged</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Potholes or water leaks logged by residents with GPS coordinates and photo evidence.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/30">2</span>
              <h4 className="text-sm font-bold text-white">2. HQ Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Super Admins verify complaint severity, assign SLA timer targets, and route to division chiefs.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30">3</span>
              <h4 className="text-sm font-bold text-white">3. Smart Crew Match</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart algorithm assigns nearest field worker with lowest active workload and highest SLA rate.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 relative space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30">4</span>
              <h4 className="text-sm font-bold text-white">4. Photo Verified Repair</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Field worker uploads photo proof of repair. Status updates to RESOLVED in HQ database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── High-Conversion Call To Action Banner ────────────────────────── */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Modernize Your Municipal Infrastructure?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Access CivicConnect now via single sign-on or create a new municipal account.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/signup')}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="py-3.5 px-8 font-extrabold text-xs shadow-xl shadow-blue-500/30"
            >
              Sign Up for Account
            </Button>
            <Button
              size="lg"
              variant="darkOutline"
              onClick={() => navigate('/login')}
              leftIcon={<LogIn className="w-4 h-4 text-blue-400" />}
              className="py-3.5 px-8 font-extrabold text-xs"
            >
              Log In to Portal
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#060911] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-300">CivicConnect Municipal Platform</span>
            <span>• GovTech Enterprise Edition</span>
          </div>

          <p>© 2026 CivicConnect Municipal Authority. Connecting Citizens & City Authorities.</p>
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

export default LandingPage;
