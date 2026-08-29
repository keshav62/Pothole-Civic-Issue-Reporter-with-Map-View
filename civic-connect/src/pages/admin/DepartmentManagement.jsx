import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Building2, Users, HardHat, CheckCircle2, Clock, Plus, BarChart3, Sparkles } from 'lucide-react';

export const DepartmentManagement = () => {
  const { departments, addDepartment } = useCivic();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', head: '', headEmail: '' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addDepartment(newDept);
    setIsAddModalOpen(false);
    setNewDept({ name: '', head: '', headEmail: '' });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Dark Hero Banner (Same as Citizen & Admin Portals) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>MUNICIPAL DIVISIONS DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Department Management
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Monitor municipal departments, operational heads, active workforce, and resolution efficiency across city divisions.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              icon={Plus}
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Department
            </Button>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{dept.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate">Head: {dept.head}</p>
                  </div>
                </div>
                <Badge variant={dept.status}>{dept.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Field Staff</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block flex items-center gap-1">
                    <HardHat className="w-4 h-4 text-amber-500 shrink-0" />
                    {dept.workersCount} workers
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Resolution Rate</span>
                  <span className="text-sm font-bold text-blue-600 mt-0.5 block">
                    {dept.resolutionRate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Open Issues</span>
                  <span className="text-sm font-bold text-amber-600 mt-0.5 block">
                    {dept.openIssues}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Resolved Total</span>
                  <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                    {dept.resolved}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">SLA: <strong className="text-slate-800 font-bold">{dept.slaCompliance}</strong></span>
              <Button size="sm" variant="outline">
                Manage Department
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Municipal Department"
        subtitle="Establish new public service division"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-dept-form" variant="primary" icon={Plus}>Add Division</Button>
          </div>
        }
      >
        <form id="add-dept-form" onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Department Name"
            required
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            placeholder="e.g. Public Lighting & Power"
          />

          <Input
            label="Department Head Name"
            required
            value={newDept.head}
            onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
            placeholder="e.g. Er. Satish Chandra"
          />

          <Input
            label="Head Email Address"
            type="email"
            required
            value={newDept.headEmail}
            onChange={(e) => setNewDept({ ...newDept, headEmail: e.target.value })}
            placeholder="satish.chandra@civicconnect.gov.in"
          />
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
