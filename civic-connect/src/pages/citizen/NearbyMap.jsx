import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCivic } from '../../context/CivicContext';
import { useRealtimeAlerts } from '../../context/AlertContext';
import { useLocation } from '../../hooks/useLocation';
import { IssueMap } from '../../components/map/IssueMap';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { ISSUE_CATEGORIES } from '../../data/issueCategories';
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Plus,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Flame,
  Layers,
  Sparkles,
  Loader2,
  XCircle,
  Radio,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getDistanceKm } from '../../utils/geoUtils';


export const NearbyMap = () => {
  const { issues } = useCivic();
  const { userLocation, alerts } = useRealtimeAlerts();
  const navigate = useNavigate();

  // Browser Geolocation via hook
  const { coords, accuracy, loading: gpsLoading, error: gpsError, getCurrentLocation } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('ALL'); // 'ALL' | '2' | '5' | '10'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'RESOLVED'
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [flyToCoords, setFlyToCoords] = useState(null);
  const [showLocationBanner, setShowLocationBanner] = useState(true);

  // Attempt initial location lookup on component mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // When GPS coords resolve, update map center smoothly
  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      setFlyToCoords({ lat: coords.lat, lng: coords.lng, zoom: 15 });
    }
  }, [coords]);

  // Handle manual "Locate Me" trigger
  const handleLocateMe = useCallback(() => {
    getCurrentLocation();
    if (coords?.lat && coords?.lng) {
      setFlyToCoords({ lat: coords.lat, lng: coords.lng, zoom: 15 });
    }
  }, [getCurrentLocation, coords]);

  // Enrich issues with distance from user's current GPS location
  const issuesWithDistance = useMemo(() => {
    return (issues || []).map((issue) => {
      let lat = issue.lat ?? issue.latitude ?? issue.location?.lat ?? issue.leaflet?.lat;
      let lng = issue.lng ?? issue.longitude ?? issue.location?.lng ?? issue.leaflet?.lng;

      if (issue.location?.coordinates && Array.isArray(issue.location.coordinates) && issue.location.coordinates.length >= 2) {
        lng = issue.location.coordinates[0];
        lat = issue.location.coordinates[1];
      }

      const distance =
        coords?.lat && coords?.lng && lat != null && lng != null
          ? getDistanceKm(coords.lat, coords.lng, lat, lng)
          : null;

      const issueId = issue.id || issue.issueId || (issue._id ? String(issue._id) : `CC-${Math.random()}`);

      return {
        ...issue,
        id: issueId,
        _id: issue._id || issueId,
        lat,
        lng,
        distance,
      };
    });
  }, [issues, coords]);

  // Filter issues based on category, radius, search, and status
  const filteredIssues = useMemo(() => {
    return issuesWithDistance
      .filter((issue) => {
        // 1. Category match
        const mCat =
          !selectedCategory ||
          selectedCategory === 'ALL' ||
          (issue.category || '').toLowerCase() === selectedCategory.toLowerCase() ||
          (issue.category || '').toLowerCase().includes(selectedCategory.toLowerCase());

        // 2. Radius match (only active when distance is known)
        let mRadius = true;
        if (selectedRadius !== 'ALL' && issue.distance !== null) {
          const maxKm = parseFloat(selectedRadius);
          mRadius = issue.distance <= maxKm;
        }

        // 3. Search query match
        const q = (searchQuery || '').trim().toLowerCase();
        const mSearch =
          !q ||
          (issue.title || '').toLowerCase().includes(q) ||
          (issue.description || '').toLowerCase().includes(q) ||
          (issue.address || '').toLowerCase().includes(q) ||
          (issue.ward || '').toLowerCase().includes(q);

        // 4. Status match
        const mStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'OPEN'
            ? issue.status !== 'RESOLVED' && issue.status !== 'CLOSED'
            : issue.status === statusFilter);

        return mCat && mRadius && mSearch && mStatus;
      })
      .sort((a, b) => {
        // Sort by distance (closest first) if GPS is available, otherwise by date
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        const idA = String(a.id || a._id || '');
        const idB = String(b.id || b._id || '');
        return idB.localeCompare(idA);
      });
  }, [issuesWithDistance, selectedCategory, selectedRadius, searchQuery, statusFilter]);

  // Clicking an issue card in the side list
  const handleCardClick = (issue) => {
    setSelectedIssueId(issue.id);
    if (issue.lat && issue.lng) {
      setFlyToCoords({ lat: issue.lat, lng: issue.lng, zoom: 16 });
    }
  };

  const userLocationProp = coords
    ? {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: accuracy,
        label: 'You Are Here (Live Location)',
      }
    : null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/citizen/dashboard')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>CITIZEN NEIGHBORHOOD MAP</span>
              </div>
              {alerts && alerts.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {alerts.length} Active Alert Issues
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Neighborhood Civic Issue Explorer
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Locate potholes, water leaks, broken lights, and public hazards near you in real-time. Verify resolution progress across your municipal ward.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {/* Locate Me Button */}
            <button
              onClick={handleLocateMe}
              disabled={gpsLoading}
              className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              title="Detect and center map on your current location"
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Navigation className="w-4 h-4 text-white fill-white" />
              )}
              <span>{gpsLoading ? 'Detecting GPS…' : coords ? 'Recenter on Me' : 'Locate Me'}</span>
            </button>

            <Button
              variant="darkOutline"
              size="md"
              icon={Plus}
              onClick={() => navigate('/citizen/report')}
              className="text-xs font-bold py-3"
            >
              Report New Issue
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Geolocation Status Notices */}
      {gpsError && showLocationBanner && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Location Permission Notice</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {gpsError} You can still freely explore, zoom, and filter all civic issues across city wards on the map below.
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

      {coords && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-blue-950 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <span className="font-bold text-blue-900">
              Live Location Active:
            </span>
            <span className="font-mono text-blue-700 text-[11px]">
              {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E (±{accuracy || 15}m)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-800">
            Showing issues sorted by proximity to you
          </span>
        </div>
      )}

      {/* 3. Category Filter Tabs Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        {/* Category Pills Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Filter by Civic Category
            </span>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing <strong>{filteredIssues.length}</strong> of {issues.length} total reports
          </span>
        </div>

        {/* Category Buttons Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              !selectedCategory
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({issues.length})
          </button>

          {ISSUE_CATEGORIES.map((cat) => {
            const count = issues.filter(
              (i) => i.category?.toLowerCase() === cat.id.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.id}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Distance Range Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by street, title, or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Proximity Radius */}
          <div>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
              disabled={!coords}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 disabled:opacity-50"
            >
              <option value="ALL">All Distances across City</option>
              <option value="2">Within 2 km of my location</option>
              <option value="5">Within 5 km of my location</option>
              <option value="10">Within 10 km of my location</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              <option value="ALL">All Resolution Statuses</option>
              <option value="OPEN">Unresolved Only (Open & In Progress)</option>
              <option value="IN_PROGRESS">Currently In Progress</option>
              <option value="RESOLVED">Resolved Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Interactive Map + Proximity Issue List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Full Leaflet Map with Live Marker & Distance Overlays */}
        <div className="lg:col-span-2 space-y-3">
          <IssueMap
            issues={filteredIssues}
            center={[28.6139, 77.2090]}
            zoom={13}
            height="600px"
            rolePrefix="/citizen"
            userLocation={userLocationProp}
            selectedIssueId={selectedIssueId}
            flyToCoords={flyToCoords}
            emptyMessage={`No ${selectedCategory || 'civic'} issues match your search filters in this area.`}
          />

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 px-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block ring-2 ring-blue-200 animate-pulse" />
                <span className="font-bold text-blue-700">You Are Here</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block ring-2 ring-red-200" />
                <span>Critical Incident</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ring-2 ring-amber-200" />
                <span>High Priority</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-200" />
                <span>Resolved</span>
              </span>
            </div>

            <span className="font-semibold text-slate-600">
              Click any pin to inspect ticket details and repair timeline
            </span>
          </div>
        </div>

        {/* Right Col: Nearby Civic Issues Scrollable Cards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Nearby Issue Reports
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {coords ? 'Sorted closest to your position' : 'Active neighborhood reports'}
                </p>
              </div>

              <span className="text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg">
                {filteredIssues.length} Found
              </span>
            </div>

            {/* Scrollable Issue Cards */}
            <div className="space-y-3 mt-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-600">No issues found</p>
                  <p className="text-[11px]">Try adjusting your category or radius filters above.</p>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;

                  return (
                    <div
                      key={issue.id}
                      onClick={() => handleCardClick(issue)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {/* Top row: ID + Priority + Distance Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                            {issue.id}
                          </span>
                          <IssuePriority priority={issue.priority} />
                        </div>

                        {issue.distance !== null ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-full">
                            📍 {issue.distance} km
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {issue.ward}
                          </span>
                        )}
                      </div>

                      {/* Title & Category */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {issue.category}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1 mt-0.5">
                          {issue.title}
                        </h4>
                      </div>

                      {/* Location & Status */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60">
                        <span className="truncate max-w-[140px] text-[10px]">
                          {issue.address || issue.ward}
                        </span>
                        <IssueStatus status={issue.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick CTA to report at current location */}
          <div className="pt-3 border-t border-slate-100">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="w-full text-xs font-bold py-2.5"
              onClick={() => navigate('/citizen/report')}
            >
              Report a Hazard in this Area
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;
