import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueMap } from '../../components/map/IssueMap';
import { Select } from '../../components/common/Select';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';
import { Flame, MapPin, Filter, AlertTriangle, ShieldAlert, Award } from 'lucide-react';

export const AdminHeatmap = () => {
  const { issues, departments } = useCivic();
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const filteredIssues = issues.filter(i => {
    const mWard = !selectedWard || i.ward === selectedWard;
    const mCat = !selectedCategory || i.category === selectedCategory;
    const mPrio = !selectedPriority || i.priority === selectedPriority;
    return mWard && mCat && mPrio;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" /> City Hotspot & Heatmap Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Spatial density visualization of municipal complaints, road damage, and infrastructure breakdowns.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          <Filter className="w-3.5 h-3.5 text-blue-600" /> Map Density Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            placeholder="All Wards"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            options={['Ward 4', 'Ward 8', 'Ward 12', 'Ward 15', 'Ward 22']}
          />

          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={['Pothole', 'Water Leakage', 'Garbage Pileup', 'Streetlight', 'Drainage', 'Traffic Signal']}
          />

          <Select
            placeholder="All Severities"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']}
          />
        </div>
      </div>

      {/* Main Map + Hotspot Side Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map View */}
        <div className="lg:col-span-3">
          <IssueMap
            issues={filteredIssues}
            center={[28.6139, 77.2090]}
            zoom={13}
            height="560px"
            rolePrefix="/admin"
          />
        </div>

        {/* Side Panel: Top Problem Areas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Hotspot Ranking
              </h3>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                Live Data
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {MOCK_ANALYTICS_DATA.topProblemAreas.map((area, idx) => (
                <div
                  key={area.ward}
                  onClick={() => setSelectedWard(area.ward)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedWard === area.ward
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{area.ward}</h4>
                    </div>
                    <span className="text-xs font-black text-red-600">{area.issuesCount} issues</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                    <span>Primary: <strong>{area.primaryCategory}</strong></span>
                    <span className={`font-bold ${
                      area.status === 'HIGH_RISK' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {area.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
            <p className="font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-600" /> Strategic Insight
            </p>
            <p className="text-[11px] text-blue-800 mt-1">
              Ward 15 accounts for 34% of total road surface complaints. Rapid patch deployment recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
