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
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-black text-slate-900">Neighborhood Ward Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore active civic complaints and resolution markers in Ward 15</p>
        </div>

        <Button variant="success" size="sm" icon={Plus} onClick={() => navigate('/citizen/report')}>
          Report Issue Here
        </Button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <IssueMap issues={issues} center={[28.6139, 77.2090]} zoom={13} height="520px" rolePrefix="/citizen" />
      </div>
    </div>
  );
};

export default NearbyMap;
