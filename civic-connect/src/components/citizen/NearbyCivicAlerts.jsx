import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeAlerts } from '../../context/AlertContext';
import { Button } from '../common/Button';
import {
  AlertOctagon,
  Radio,
  MapPin,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Navigation,
  AlertTriangle
} from 'lucide-react';

export const NearbyCivicAlerts = () => {
  const navigate = useNavigate();
  const {
    alerts,
    userLocation,
    locationStatus,
    locationLastUpdated,
    requestLocationPermission
  } = useRealtimeAlerts();

  const getSeverityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'CRITICAL') return { icon: '🔴', label: 'CRITICAL', bg: 'bg-red-500/10 text-red-700 border-red-200' };
    if (p === 'HIGH') return { icon: '🟠', label: 'HIGH', bg: 'bg-amber-500/10 text-amber-800 border-amber-200' };
    if (p === 'MEDIUM') return { icon: '🟡', label: 'MEDIUM', bg: 'bg-amber-500/10 text-amber-700 border-amber-100' };
    return { icon: '🔵', label: 'LOW', bg: 'bg-blue-500/10 text-blue-700 border-blue-200' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🚨</span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
              NEARBY CIVIC ALERTS
            </h2>

            {locationStatus === 'active' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                ● LIVE LOCATION
              </span>
            ) : locationStatus === 'permission_denied' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                LOCATION REQUIRED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <Clock className="w-3 h-3 text-slate-500" />
                UPDATED RECENTLY
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Realtime incidents detected around {userLocation?.address || 'your current GPS location'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {locationStatus === 'permission_denied' && (
            <Button
              size="sm"
              variant="outline"
              onClick={requestLocationPermission}
              className="text-xs py-1 px-3"
            >
              Enable GPS
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/citizen/alerts')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            View All Alerts ({alerts.length}) &rarr;
          </Button>
        </div>
      </div>

      {/* Alert Content */}
      <div className="p-4 sm:p-5">
        {locationStatus === 'permission_denied' ? (
          <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center space-y-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">GPS Location Permission Required</h3>
              <p className="text-[11px] text-slate-600 max-w-md mx-auto mt-1">
                Enable browser location permissions to receive real-time proximity alerts for potholes, water leaks, and power outages near you.
              </p>
            </div>
            <Button size="sm" variant="primary" onClick={requestLocationPermission}>
              Enable Location Access
            </Button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">No active civic issues detected nearby</h3>
            <p className="text-[11px] text-slate-500">Your immediate neighborhood currently looks clear within your alert radius.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => {
              const sev = getSeverityBadge(alert.priority);
              return (
                <div
                  key={alert.alertId}
                  onClick={() => navigate('/citizen/alerts')}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-white hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-lg shrink-0 mt-0.5">{sev.icon}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${sev.bg}`}>
                          {sev.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{alert.category}</span>
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {alert.issueId}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {alert.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {alert.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600 block">{alert.formattedDistance}</span>
                      <span className="text-[10px] font-semibold text-slate-400 block">{alert.formattedTimeAgo}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}

            {alerts.length > 3 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => navigate('/citizen/alerts')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  Show {alerts.length - 3} more nearby alerts &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyCivicAlerts;
