import React, { useState } from 'react';
import { useRealtimeAlerts } from '../../context/AlertContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { SafeImage } from '../../components/common/SafeImage';
import {
  AlertOctagon,
  Radio,
  MapPin,
  Clock,
  Filter,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Sparkles,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const AlertsPage = () => {
  const {
    alerts,
    userLocation,
    locationStatus,
    locationLastUpdated,
    requestLocationPermission,
    settings,
    updateSettings,
    markAsRead,
    markAllAsRead,
    requestBrowserNotificationPermission
  } = useRealtimeAlerts();

  // Filters State
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeRadius, setActiveRadius] = useState(settings.radiusMeters || 2000);

  // Modals
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState(null);

  // Update radius when button clicked
  const handleRadiusChange = (radiusMeters) => {
    setActiveRadius(radiusMeters);
    updateSettings({ radiusMeters });
  };

  // Filtered Alert List
  const filteredAlerts = alerts.filter(alert => {
    // Radius filter
    if (alert.distanceMeters > activeRadius) return false;

    // Severity filter
    if (selectedSeverity !== 'ALL' && (alert.priority || '').toUpperCase() !== selectedSeverity) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      const cat = (alert.category || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      if (!cat.includes(target) && !target.includes(cat)) {
        return false;
      }
    }

    return true;
  });

  const getSeverityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'CRITICAL') return { icon: '🔴', label: 'CRITICAL', bg: 'bg-red-500/10 text-red-700 border-red-200 shadow-2xs' };
    if (p === 'HIGH') return { icon: '🟠', label: 'HIGH', bg: 'bg-amber-500/10 text-amber-800 border-amber-200' };
    if (p === 'MEDIUM') return { icon: '🟡', label: 'MEDIUM', bg: 'bg-amber-500/10 text-amber-700 border-amber-100' };
    return { icon: '🔵', label: 'LOW', bg: 'bg-blue-500/10 text-blue-700 border-blue-200' };
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>REALTIME LOCATION DISPATCH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Civic Alerts
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Stay informed about active civic issues, road hazards, pipe leaks, and power outages near your current location.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {alerts.length > 0 && (
              <Button
                variant="darkOutline"
                size="md"
                onClick={markAllAsRead}
                className="text-xs font-bold py-2.5"
              >
                Mark All Read
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Settings}
              onClick={() => setSettingsModalOpen(true)}
              className="text-xs font-bold py-2.5"
            >
              Alert Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Live Location Status Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900">Current Location:</h2>
              <span className="text-xs font-black text-blue-600">{userLocation?.address || 'Sector 15, New Delhi'}</span>
              
              {locationStatus === 'active' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                  Location Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                  GPS Permission Needed
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Lat: <span className="font-mono font-bold text-slate-700">{userLocation?.lat?.toFixed(4)}</span> • Lng:{' '}
              <span className="font-mono font-bold text-slate-700">{userLocation?.lng?.toFixed(4)}</span> • Last updated{' '}
              <span className="font-semibold text-slate-700">{Math.max(0, Math.floor((Date.now() - new Date(locationLastUpdated).getTime()) / 1000))} seconds ago</span>
            </p>
          </div>
        </div>

        {locationStatus === 'permission_denied' && (
          <Button size="sm" variant="primary" onClick={requestLocationPermission}>
            Enable Location Access
          </Button>
        )}
      </div>

      {/* Control Bar: Radius Selector & Category Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Radius Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Alert Radius:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { label: '500m', val: 500 },
                { label: '1 km', val: 1000 },
                { label: '2 km', val: 2000 },
                { label: '5 km', val: 5000 },
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => handleRadiusChange(r.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRadius === r.val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  selectedSeverity === sev
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Category:</span>
          {['ALL', 'Pothole', 'Water', 'Electricity', 'Garbage', 'Streetlight', 'Drainage', 'Traffic'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No matching civic alerts found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no active issues within your selected {activeRadius >= 1000 ? `${activeRadius/1000}km` : `${activeRadius}m`} radius matching your active filters.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const sev = getSeverityBadge(alert.priority);
            return (
              <div
                key={alert.alertId}
                onClick={() => {
                  markAsRead(alert.alertId);
                  setSelectedAlertForDetail(alert);
                }}
                className={`bg-white rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 group ${
                  !alert.isRead ? 'border-blue-300 ring-1 ring-blue-500/10 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{sev.icon}</span>
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg border ${sev.bg}`}>
                      {sev.label}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {alert.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {alert.issueId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      📍 {alert.formattedDistance} away
                    </span>
                    <span className="text-slate-500 font-semibold">{alert.formattedTimeAgo}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{alert.address}</span>
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs font-bold self-start sm:self-center"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Issue
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Details Modal */}
      {selectedAlertForDetail && (
        <Modal
          isOpen={Boolean(selectedAlertForDetail)}
          onClose={() => setSelectedAlertForDetail(null)}
          title={`Civic Alert Detail — ${selectedAlertForDetail.issueId}`}
          subtitle={`${selectedAlertForDetail.category} • ${selectedAlertForDetail.formattedDistance} away`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl text-xs">
              <span className="font-bold uppercase tracking-wider">{selectedAlertForDetail.priority} PRIORITY ALERT</span>
              <span className="font-mono text-blue-400 font-bold">{selectedAlertForDetail.formattedDistance} away</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">{selectedAlertForDetail.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedAlertForDetail.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Location Address:</span>
                <span className="font-bold text-slate-900">{selectedAlertForDetail.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Reported Time:</span>
                <span className="font-bold text-slate-900">{selectedAlertForDetail.formattedTimeAgo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className="font-bold text-blue-600">{selectedAlertForDetail.status}</span>
              </div>
            </div>

            {selectedAlertForDetail.issueObj?.images?.before && (
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1">Attached Evidence Photo:</span>
                <SafeImage
                  src={selectedAlertForDetail.issueObj.images.before}
                  alt={selectedAlertForDetail.title}
                  className="w-full h-48 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedAlertForDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert Settings Modal */}
      {settingsModalOpen && (
        <Modal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          title="Realtime Alert Settings"
          subtitle="Configure location radius and push notification preferences"
          maxWidth="max-w-md"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Default Alert Radius:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '500m', val: 500 },
                  { label: '1 km', val: 1000 },
                  { label: '2 km', val: 2000 },
                  { label: '5 km', val: 5000 },
                ].map(r => (
                  <button
                    key={r.val}
                    onClick={() => handleRadiusChange(r.val)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeRadius === r.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Browser Push Notifications</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Receive immediate popups for Critical alerts</p>
                </div>
                <Button
                  size="sm"
                  variant={settings.browserNotifications ? 'primary' : 'outline'}
                  onClick={requestBrowserNotificationPermission}
                >
                  {settings.browserNotifications ? 'Enabled ✓' : 'Enable Push'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="primary" onClick={() => setSettingsModalOpen(false)}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AlertsPage;
