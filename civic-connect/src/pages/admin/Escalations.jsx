import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Building2, Users, HardHat, CheckCircle2, Clock, Plus, BarChart3 } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Department Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor municipal departments, operational heads, active workforce, and resolution efficiency.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          + Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Head: {dept.head}</p>
                  </div>
                </div>
                <Badge variant={dept.status}>{dept.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Field Staff</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                    <HardHat className="w-4 h-4 text-amber-500" />
                    {dept.workersCount} workers
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution Rate</span>
                  <span className="text-base font-bold text-blue-600 mt-0.5 block">
                    {dept.resolutionRate}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Open Issues</span>
                  <span className="text-base font-bold text-amber-600 mt-0.5 block">
                    {dept.openIssues}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolved Total</span>
                  <span className="text-base font-bold text-emerald-600 mt-0.5 block">
                    {dept.resolved}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">SLA: <strong>{dept.slaCompliance}</strong></span>
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
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Plus}>Add Division</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
