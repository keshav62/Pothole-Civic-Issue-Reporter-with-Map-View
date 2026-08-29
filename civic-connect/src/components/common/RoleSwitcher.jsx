import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, HardHat, RefreshCw, User } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'SUPER_ADMIN', label: 'Super Admin', path: '/admin/dashboard', icon: Shield, color: 'bg-blue-600 text-white' },
    { id: 'DEPARTMENT_ADMIN', label: 'Dept Admin', path: '/department/dashboard', icon: Building2, color: 'bg-blue-600 text-white' },
    { id: 'FIELD_WORKER', label: 'Field Worker', path: '/worker/dashboard', icon: HardHat, color: 'bg-amber-600 text-white' },
    { id: 'CITIZEN', label: 'Citizen', path: '/citizen/dashboard', icon: User, color: 'bg-emerald-600 text-white' }
  ];

  const handleRoleChange = (roleObj) => {
    switchRole(roleObj.id);
    setTimeout(() => {
      navigate(roleObj.path);
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-2xs shrink-0 max-w-full">
      <span className="hidden xl:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 shrink-0 whitespace-nowrap">
        <RefreshCw className="w-3 h-3 text-cyan-400 shrink-0" /> Role:
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {roles.map((r) => {
          const isActive = currentUser?.role === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? `${r.color} shadow-2xs`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={r.label}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
