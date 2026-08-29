import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/auth/GoogleAuthModal';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, HardHat, ArrowRight, ShieldCheck, Mail, LogIn, User } from 'lucide-react';

export const Login = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleModalMode, setGoogleModalMode] = useState('SIGN_IN');

  const roleCards = [
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin Portal',
      subtitle: 'Municipal Headquarters Control & Governance',
      description: 'Manage entire city infrastructure, department metrics, user access, and citywide heatmap analytics.',
      icon: Shield,
      color: 'bg-indigo-600',
      borderColor: 'hover:border-indigo-500',
      path: '/admin/dashboard'
    },
    {
      role: 'DEPARTMENT_ADMIN',
      title: 'Department Admin Portal',
      subtitle: 'Road, Sanitation, Water & Electrical Operations',
      description: 'Monitor division complaints, evaluate AI worker recommendations, and manage field task assignments.',
      icon: Building2,
      color: 'bg-blue-600',
      borderColor: 'hover:border-blue-500',
      path: '/department/dashboard'
    },
    {
      role: 'FIELD_WORKER',
      title: 'Field Worker Operations',
      subtitle: 'Mobile-Optimized Field Resolution Workstation',
      description: 'View assigned tasks, navigate to complaint sites, track SLA countdowns, and upload before/after repair proof.',
      icon: HardHat,
      color: 'bg-amber-600',
      borderColor: 'hover:border-amber-500',
      path: '/worker/dashboard'
    },
    {
      role: 'CITIZEN',
      title: 'Citizen Portal',
      subtitle: 'Public Issue Reporting & Tracking',
      description: 'Report civic issues, track resolution progress, view nearby issues, and communicate with departments.',
      icon: User,
      color: 'bg-emerald-600',
      borderColor: 'hover:border-emerald-500',
      path: '/citizen/dashboard'
    }
  ];

  const handleRoleSelect = (card) => {
    loginAs(card.role);
    navigate(card.path);
  };

  const openGoogleAuth = (mode) => {
    setGoogleModalMode(mode);
    setGoogleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-3xl font-black shadow-xl shadow-blue-500/20 mb-1">
          C
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">CivicConnect</h1>
        <p className="text-xs uppercase tracking-widest font-bold text-blue-400">Enterprise Authority Management Platform</p>
        <p className="text-slate-400 text-xs italic">"Report. Resolve. Improve Your City."</p>
      </div>

      {/* Gmail Authentication Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 mb-8">
        <div className="text-center space-y-1">
          <h2 className="text-base font-bold text-white">Official Single Sign-On (SSO)</h2>
          <p className="text-xs text-slate-400">Log in or register with your Gmail / Google Workspace account</p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => openGoogleAuth('SIGN_IN')}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold px-4 py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer border border-slate-200"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Gmail / Google</span>
          </button>

          <button
            onClick={() => openGoogleAuth('SIGN_UP')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Create New Authority Account with Gmail</span>
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or fast demo access</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.role}
              onClick={() => handleRoleSelect(card)}
              className={`bg-slate-900/90 rounded-2xl border border-slate-800 ${card.borderColor} p-6 shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{card.title}</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">{card.subtitle}</p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{card.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>Direct Access</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        defaultMode={googleModalMode}
      />

      {/* GovTech Footer */}
      <div className="mt-10 text-center text-slate-500 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Official Government Grade Enterprise System • Municipal Administration Authority Portal</span>
      </div>
    </div>
  );
};
