import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useCivic } from '../../context/CivicContext';
import { Settings, Shield, Bell, Clock, Database, Save } from 'lucide-react';

export const AdminSettings = () => {
  const { showToast } = useCivic();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> System Settings & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure SLA thresholds, automated escalation routing, notification triggers, and enterprise data policies.
          </p>
        </div>
        <Button variant="primary" icon={Save} onClick={handleSave}>
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: SLA & Routing Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Clock className="w-4 h-4 text-blue-600" /> Municipal SLA Response Thresholds (Hours)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Critical Priority SLA (Hours)" type="number" defaultValue="12" />
                <Input label="High Priority SLA (Hours)" type="number" defaultValue="24" />
                <Input label="Medium Priority SLA (Hours)" type="number" defaultValue="48" />
                <Input label="Low Priority SLA (Hours)" type="number" defaultValue="72" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Bell className="w-4 h-4 text-amber-500" /> Automated Escalation Rules
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                  <div>
                    <span className="font-bold text-slate-900 block">Auto-escalate to HQ Super Admin when SLA reaches 80%</span>
                    <span className="text-slate-500">Sends urgent SMS and portal notification to HQ on-call administrator.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                  <div>
                    <span className="font-bold text-slate-900 block">Auto-recommend closest field worker using GPS AI matching</span>
                    <span className="text-slate-500">Computes workload, proximity, and historical completion speed.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COL: System Info & Export */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" /> Municipal Data Backups
            </h3>
            <p className="text-xs text-slate-500">Export complete civic issue records, audit trails, and worker logs in CSV/JSON format.</p>

            <div className="space-y-2">
              <Button variant="outline" className="w-full text-xs" onClick={() => showToast('Exporting CSV data log...', 'info')}>
                Export Full Issues CSV
              </Button>
              <Button variant="outline" className="w-full text-xs" onClick={() => showToast('Exporting Analytics JSON...', 'info')}>
                Export Analytics Audit JSON
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
