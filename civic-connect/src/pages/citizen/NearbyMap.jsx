import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { useRealtimeAlerts } from '../../context/AlertContext';
import { IssueMap } from '../../components/map/IssueMap';
import { Button } from '../../components/common/Button';
import { MapPin, ArrowLeft, Plus, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NearbyMap = () => {
  const { issues } = useCivic();
  const { userLocation, alerts } = useRealtimeAlerts();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold mb-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Neighborhood Interactive Ward Map</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              {alerts.length} Active Issues Within Alert Radius
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore real-time civic issue markers relative to your live GPS position (<span className="font-bold text-blue-600">{userLocation?.address || 'Sector 15'}</span>).
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => navigate('/citizen/report')}>
          Report Issue Here
        </Button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <IssueMap
          issues={issues}
          userLocation={userLocation}
          zoom={14}
          height="580px"
          rolePrefix="/citizen"
        />
      </div>
    </div>
  );
};

export default NearbyMap;
