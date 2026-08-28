import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { BarChart3, Award, Clock, CheckCircle2 } from 'lucide-react';

export const DepartmentAnalytics = () => {
  const { currentUser } = useAuth();
  const deptName = currentUser?.department || 'Road Maintenance';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> {deptName} Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Throughput trends, ward breakdown, and resolution SLAs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Issues Managed</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">1,240</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Resolution Rate</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">87%</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">Avg Speed</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">1.8 Days</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-bold uppercase block">SLA Compliance</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">91%</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Resolution Efficiency Across Municipal Wards</h3>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ANALYTICS_DATA.wardPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="ward" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="total" fill="#94A3B8" name="Total Reported" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
