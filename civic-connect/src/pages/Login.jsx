import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, HardHat, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

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
    }
  ];

  const handleRoleSelect = (card) => {
    loginAs(card.role);
    navigate(card.path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-3xl font-black shadow-xl shadow-blue-500/20 mb-2">
          C
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">CivicConnect</h1>
        <p className="text-xs uppercase tracking-widest font-bold text-blue-400">Enterprise Authority Management Platform</p>
        <p className="text-slate-400 text-sm italic">"Report. Resolve. Improve Your City."</p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
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
                <span>Enter Portal</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* GovTech Footer */}
      <div className="mt-12 text-center text-slate-500 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Official Government Grade Enterprise System • Municipal Administration Authority Portal</span>
      </div>
    </div>
  );
};
