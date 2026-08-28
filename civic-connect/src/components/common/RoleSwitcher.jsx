import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, HardHat, RefreshCw, User } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', path: '/admin/dashboard', icon: Shield, color: 'bg-indigo-600' },
    { id: 'DEPARTMENT_ADMIN', label: 'Dept Admin', path: '/department/dashboard', icon: Building2, color: 'bg-blue-600' },
    { id: 'FIELD_WORKER', label: 'Field Worker', path: '/worker/dashboard', icon: HardHat, color: 'bg-amber-600' },
    { id: 'CITIZEN', label: 'Citizen', path: '/citizen/dashboard', icon: User, color: 'bg-emerald-600' }
  ];

  const handleRoleChange = (roleObj) => {
    switchRole(roleObj.id);
    // Delay navigation by a tick to allow React to update the AuthContext state,
    // avoiding a race condition where the router checks old permissions and redirects to /unauthorized.
    setTimeout(() => {
      navigate(roleObj.path);
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 shadow-inner overflow-x-auto max-w-full">
      <span className="hidden lg:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 shrink-0">
        <RefreshCw className="w-3 h-3 text-cyan-400" /> Quick Role:
      </span>
      {roles.map((r) => {
        const isActive = currentUser?.role === r.id;
        const Icon = r.icon;
        return (
          <button
            key={r.id}
            onClick={() => handleRoleChange(r)}
            className={`flex flex-shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? `${r.color} text-white shadow-xs`
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
