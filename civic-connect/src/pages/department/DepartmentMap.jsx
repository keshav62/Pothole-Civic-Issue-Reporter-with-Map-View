import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { useLocation } from '../../hooks/useLocation';
import { IssueMap } from '../../components/map/IssueMap';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { ISSUE_CATEGORIES } from '../../data/issueCategories';
import { MOCK_DEPARTMENTS } from '../../data/mockDepartments';
import {
  MapPin,
  Filter,
  Flame,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  Award,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Navigation,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Ward coordinates lookup for quick map recentering
const WARD_CENTERS = {
  'Ward 15': { lat: 28.6139, lng: 77.2090, zoom: 14 },
  'Ward 8': { lat: 28.6250, lng: 77.2180, zoom: 14 },
  'Ward 12': { lat: 28.6010, lng: 77.1950, zoom: 14 },
  'Ward 4': { lat: 28.6300, lng: 77.2200, zoom: 14 },
  'Ward 22': { lat: 28.5900, lng: 77.2000, zoom: 14 },
  'Ward 5': { lat: 28.6220, lng: 77.2110, zoom: 14 },
};

export const DepartmentMap = () => {
  const { currentUser } = useAuth();
  const { issues, departments } = useCivic();
  const { coords, accuracy, loading: gpsLoading, error: gpsError, getCurrentLocation } = useLocation();
  const navigate = useNavigate();

  // Default to the logged-in Department Admin's department if available
  const userDept = currentUser?.department || 'Road Maintenance';

  const [selectedDept, setSelectedDept] = useState(userDept);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
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
      setFlyToCoords({ lat: coords.lat, lng: coords.lng, zoom: 14 });
    }
  }, [getCurrentLocation, coords]);

  const userLocationProp = useMemo(() => {
    return coords
      ? {
          lat: coords.lat,
          lng: coords.lng,
          accuracy: accuracy,
          label: 'You Are Here (Department Admin)',
        }
      : null;
  }, [coords, accuracy]);

  // Derive relevant categories based on selected department (or all categories if 'ALL')
  const availableCategories = useMemo(() => {
    if (!selectedDept || selectedDept === 'ALL') return ISSUE_CATEGORIES;
    const deptCats = ISSUE_CATEGORIES.filter(c => c.department === selectedDept);
    return deptCats.length > 0 ? deptCats : ISSUE_CATEGORIES;
  }, [selectedDept]);

  // Filter issues according to all controls
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      // 1. Department match
      const mDept =
        !selectedDept ||
        selectedDept === 'ALL' ||
        i.department?.toLowerCase() === selectedDept.toLowerCase();

      // 2. Category match (supports partial name match or exact ID)
      const mCat =
        !selectedCategory ||
        selectedCategory === 'ALL' ||
        i.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        i.category?.toLowerCase().includes(selectedCategory.toLowerCase());

      // 3. Ward match
      const mWard = !selectedWard || selectedWard === 'ALL' || i.ward === selectedWard;

      // 4. Priority match
      const mPriority =
        !selectedPriority || selectedPriority === 'ALL' || i.priority === selectedPriority;

      // 5. Status match
      const mStatus =
        !selectedStatus ||
        selectedStatus === 'ALL' ||
        (selectedStatus === 'OPEN'
          ? i.status !== 'RESOLVED' && i.status !== 'CLOSED'
          : i.status === selectedStatus);

      return mDept && mCat && mWard && mPriority && mStatus;
    });
  }, [issues, selectedDept, selectedCategory, selectedWard, selectedPriority, selectedStatus]);

  // Dynamic Hotspot & Density Analysis by Ward for the current filtered view
  const wardHotspots = useMemo(() => {
    const counts = {};
    filteredIssues.forEach((issue) => {
      const w = issue.ward || 'Unknown Ward';
      if (!counts[w]) {
        counts[w] = {
          ward: w,
          total: 0,
          critical: 0,
          high: 0,
          categories: {},
        };
      }
      counts[w].total += 1;
      if (issue.priority === 'CRITICAL') counts[w].critical += 1;
      if (issue.priority === 'HIGH') counts[w].high += 1;
      counts[w].categories[issue.category] = (counts[w].categories[issue.category] || 0) + 1;
    });

    return Object.values(counts)
      .map((item) => {
        // Find dominant category in this ward
        let topCat = 'General';
        let maxC = 0;
        Object.entries(item.categories).forEach(([cat, cnt]) => {
          if (cnt > maxC) {
            maxC = cnt;
            topCat = cat;
          }
        });

        const riskLevel =
          item.critical > 0
            ? 'HIGH_RISK'
            : item.total >= 3 || item.high >= 2
            ? 'MODERATE_RISK'
            : 'STABLE';

        return {
          ...item,
          primaryCategory: topCat,
          riskLevel,
        };
      })
      .sort((a, b) => b.critical * 3 + b.total - (a.critical * 3 + a.total));
  }, [filteredIssues]);

  // Handle clicking a ward hotspot card -> animate map camera
  const handleWardClick = (wardName) => {
    setSelectedWard(selectedWard === wardName ? '' : wardName);
    if (WARD_CENTERS[wardName]) {
      setFlyToCoords({ ...WARD_CENTERS[wardName] });
    }
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedDept(userDept);
    setSelectedCategory('');
    setSelectedWard('');
    setSelectedPriority('');
    setSelectedStatus('');
    setFlyToCoords({ lat: 28.6139, lng: 77.2090, zoom: 13 });
  };

  const criticalCount = filteredIssues.filter((i) => i.priority === 'CRITICAL').length;
  const inProgressCount = filteredIssues.filter(
    (i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED'
  ).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>DEPARTMENT SPATIAL INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-blue-400" />
              {selectedDept === 'ALL' ? 'City-Wide Cross-Department' : `${selectedDept} Division`} Map
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
              Explore real-time spatial complaint clusters, filter by specific municipal breakdown categories, and inspect problem hotspots across city wards.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
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
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}</span>
            </button>

            <Button
              variant="darkOutline"
              size="md"
              icon={RefreshCw}
              onClick={handleResetFilters}
              className="text-xs font-bold py-2.5"
            >
              Reset Filters
            </Button>
          </div>
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
                {gpsError} You can still filter department complaint issues and explore city wards on the map below.
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

      {/* 2. Top Summary KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Filtered Issues</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{filteredIssues.length}</p>
          <span className="text-[10px] text-slate-400 font-medium">In active map scope</span>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical Severity</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600 mt-2">{criticalCount}</p>
          <span className="text-[10px] text-red-500 font-bold">Needs immediate dispatch</span>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Wards</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{wardHotspots.length}</p>
          <span className="text-[10px] text-slate-400 font-medium">Reporting incidents</span>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{inProgressCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Field crew deployed</span>
        </div>
      </div>

      {/* 3. Category & Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        {/* Department & Category Selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Category & Division Scope
            </span>
          </div>

          {/* Quick Category Buttons Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
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

            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji || '📋'}</span>
                <span>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSelectedCategory(''); // reset category on dept switch
              }}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="ALL">All City Departments</option>
              {MOCK_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} Division
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Specific Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">All Breakdown Types</option>
              {ISSUE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Ward / Zone
            </label>
            <select
              value={selectedWard}
              onChange={(e) => handleWardClick(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">All City Wards</option>
              <option value="Ward 15">Ward 15 (Central Arterial)</option>
              <option value="Ward 8">Ward 8 (Market / Commercial)</option>
              <option value="Ward 12">Ward 12 (Residential Park)</option>
              <option value="Ward 4">Ward 4 (Transit & Metro)</option>
              <option value="Ward 22">Ward 22 (South Suburb)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Severity
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">All Severities</option>
              <option value="CRITICAL">🔴 CRITICAL Priority</option>
              <option value="HIGH">🟠 HIGH Priority</option>
              <option value="MEDIUM">🟡 MEDIUM Priority</option>
              <option value="LOW">🔵 LOW Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Resolution Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Unresolved Only</option>
              <option value="REPORTED">Newly Reported</option>
              <option value="ASSIGNED">Assigned to Crew</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Map + Hotspots Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map View */}
        <div className="lg:col-span-3 space-y-3">
          <IssueMap
            issues={filteredIssues}
            center={[28.6139, 77.2090]}
            zoom={13}
            height="580px"
            rolePrefix="/department"
            userLocation={userLocationProp}
            showHeatmap={showHeatmap}
            flyToCoords={flyToCoords}
            onLocateMe={handleLocateMe}
            isLocating={gpsLoading}
            emptyMessage={`No ${selectedCategory || selectedDept} issues found matching your filter criteria.`}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block ring-2 ring-red-200" />
                <span>Critical / Breached</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200" />
                <span>High Severity</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block ring-2 ring-blue-200" />
                <span>Medium / Low</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
                <span>Resolved</span>
              </span>
            </div>

            <span className="font-semibold text-slate-600">
              💡 Tip: Click any issue pin for full details or click a ward on the right to auto-focus.
            </span>
          </div>
        </div>

        {/* Right Side Panel: Ward Problem Concentration & Hotspot Rankings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Category Hotspots
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">High-density complaint zones</p>
              </div>
              <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-lg">
                {wardHotspots.length} Zones
              </span>
            </div>

            {/* Hotspot List Cards */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {wardHotspots.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No hotspots found for this filter combination.
                </div>
              ) : (
                wardHotspots.map((area, idx) => {
                  const isSelected = selectedWard === area.ward;
                  return (
                    <div
                      key={area.ward}
                      onClick={() => handleWardClick(area.ward)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                              idx === 0
                                ? 'bg-red-600'
                                : idx === 1
                                ? 'bg-amber-600'
                                : 'bg-slate-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{area.ward}</h4>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          {area.total} {area.total === 1 ? 'issue' : 'issues'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200/60 font-medium">
                        <span className="truncate max-w-[130px]">
                          Top: <strong>{area.primaryCategory}</strong>
                        </span>
                        <span
                          className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                            area.riskLevel === 'HIGH_RISK'
                              ? 'bg-red-100 text-red-700'
                              : area.riskLevel === 'MODERATE_RISK'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {area.riskLevel.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Department Recommendation Callout */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 text-xs text-blue-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-blue-900">
              <Award className="w-4 h-4 text-blue-600" />
              Strategic Resource Allocation
            </p>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {selectedCategory
                ? `Prioritize field dispatch for ${selectedCategory} complaints in ${
                    wardHotspots[0]?.ward || 'hotspot wards'
                  } to prevent SLA breaches.`
                : `Focus maintenance crews in Ward 15 & Ward 8 to address 60%+ of active municipal hazards.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentMap;

