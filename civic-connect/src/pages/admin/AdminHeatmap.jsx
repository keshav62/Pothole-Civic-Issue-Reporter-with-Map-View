import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCivic } from '../../context/CivicContext';
import { useLocation } from '../../hooks/useLocation';
import { IssueMap } from '../../components/map/IssueMap';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ISSUE_CATEGORIES } from '../../data/issueCategories';
import { MOCK_ANALYTICS_DATA } from '../../data/mockAnalytics';
import {
  Flame,
  MapPin,
  Filter,
  AlertTriangle,
  Layers,
  Award,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Navigation,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const WARD_CENTERS = {
  'Ward 15': { lat: 28.6139, lng: 77.2090, zoom: 14 },
  'Ward 8': { lat: 28.6250, lng: 77.2180, zoom: 14 },
  'Ward 12': { lat: 28.6010, lng: 77.1950, zoom: 14 },
  'Ward 4': { lat: 28.6300, lng: 77.2200, zoom: 14 },
  'Ward 22': { lat: 28.5900, lng: 77.2000, zoom: 14 },
};

export const AdminHeatmap = () => {
  const { issues } = useCivic();
  const { coords, accuracy, loading: gpsLoading, error: gpsError, getCurrentLocation } = useLocation();

  const [selectedWard, setSelectedWard] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [showLocationBanner, setShowLocationBanner] = useState(true);

  // Attempt initial location lookup on component mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleLocateMe = useCallback(() => {
    getCurrentLocation();
    if (coords?.lat && coords?.lng) {
      setFlyToCoords({ lat: coords.lat, lng: coords.lng, zoom: 15 });
    }
  }, [getCurrentLocation, coords]);

  const userLocationProp = useMemo(() => {
    return coords
      ? {
          lat: coords.lat,
          lng: coords.lng,
          accuracy: accuracy,
          label: 'You Are Here (Super Admin)',
        }
      : null;
  }, [coords, accuracy]);

  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      const mWard = !selectedWard || selectedWard === 'ALL' || i.ward === selectedWard;
      const mCat =
        !selectedCategory ||
        selectedCategory === 'ALL' ||
        i.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        i.category?.toLowerCase().includes(selectedCategory.toLowerCase());
      const mPrio =
        !selectedPriority || selectedPriority === 'ALL' || i.priority === selectedPriority;
      const mDept =
        !selectedDepartment || selectedDepartment === 'ALL' || i.department === selectedDepartment;
      return mWard && mCat && mPrio && mDept;
    });
  }, [issues, selectedWard, selectedCategory, selectedPriority, selectedDepartment]);

  const handleWardClick = (wardName) => {
    setSelectedWard(selectedWard === wardName ? '' : wardName);
    if (WARD_CENTERS[wardName]) {
      setFlyToCoords({ ...WARD_CENTERS[wardName] });
    }
  };

  const handleReset = () => {
    setSelectedWard('');
    setSelectedCategory('');
    setSelectedPriority('');
    setSelectedDepartment('');
    setFlyToCoords({ lat: 28.6139, lng: 77.2090, zoom: 13 });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>CITY-WIDE SPATIAL DENSITY ANALYTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight flex items-center gap-2">
            Super Admin City Hotspot & Heatmap Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Spatial density visualization of municipal complaints, road damage, and infrastructure breakdowns across all 5 municipal zones.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleLocateMe}
            disabled={gpsLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            title="Detect and center map on your current location"
          >
            {gpsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Navigation className="w-4 h-4 text-white fill-white" />
            )}
            <span>{gpsLoading ? 'Detecting GPS…' : coords ? 'Recenter on Me' : 'Locate Me'}</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              showHeatmap
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}</span>
          </button>

          <Button variant="darkOutline" size="md" icon={RefreshCw} onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Geolocation Status Notices */}
      {gpsError && showLocationBanner && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Location Permission Notice</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {gpsError} You can still inspect all city heatmap data and filters on the map below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLocationBanner(false)}
            className="text-amber-600 hover:text-amber-900 text-xs font-bold px-2 py-1 rounded-lg hover:bg-amber-100/60 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        {/* Category Carousel */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" /> Category Filter
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredIssues.length} issues in view
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              !selectedCategory
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>

          {ISSUE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.id}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Select
            placeholder="All Wards"
            value={selectedWard}
            onChange={(e) => handleWardClick(e.target.value)}
            options={['Ward 4', 'Ward 8', 'Ward 12', 'Ward 15', 'Ward 22']}
          />

          <Select
            placeholder="All Departments"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            options={[
              'Road Maintenance',
              'Water Supply',
              'Sanitation',
              'Electrical',
              'Drainage',
              'Parks',
              'Traffic',
            ]}
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
        <div className="lg:col-span-3 space-y-2">
          <IssueMap
            issues={filteredIssues}
            center={[28.6139, 77.2090]}
            zoom={13}
            height="580px"
            rolePrefix="/admin"
            userLocation={userLocationProp}
            showHeatmap={showHeatmap}
            flyToCoords={flyToCoords}
            onLocateMe={handleLocateMe}
            isLocating={gpsLoading}
          />
        </div>

        {/* Side Panel: Top Problem Areas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Hotspot Ranking
              </h3>
              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                Live Data
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {MOCK_ANALYTICS_DATA.topProblemAreas.map((area, idx) => (
                <div
                  key={area.ward}
                  onClick={() => handleWardClick(area.ward)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedWard === area.ward
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
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

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60 font-medium">
                    <span>
                      Primary: <strong>{area.primaryCategory}</strong>
                    </span>
                    <span
                      className={`font-bold ${
                        area.status === 'HIGH_RISK' ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {area.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900">
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

export default AdminHeatmap;
