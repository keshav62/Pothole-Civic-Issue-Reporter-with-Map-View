import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { IssueMap } from '../../components/map/IssueMap';
import { Button } from '../../components/common/Button';
import { MapPin, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NearbyMap = () => {
  const { issues } = useCivic();
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
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Neighborhood Interactive Ward Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore real-time civic issue markers, ward boundaries, and resolution status.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => navigate('/citizen/report')}>
          Report Issue Here
        </Button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <IssueMap issues={issues} center={[28.6139, 77.2090]} zoom={13} height="560px" rolePrefix="/citizen" />
      </div>
    </div>
  );
};

export default NearbyMap;
