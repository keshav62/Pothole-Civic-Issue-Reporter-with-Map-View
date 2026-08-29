import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../common/Button';
import { TaskMap } from '../../pages/worker/TaskMap';

export const LocationCard = ({ address, latitude, longitude, distance = "2.4 km away" }) => {
  const handleNavigate = () => {
    // Open Google Maps in a new tab with the destination coordinates
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="h-48 relative overflow-hidden bg-slate-100 z-0">
        <TaskMap latitude={latitude} longitude={longitude} address={address} />
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {distance}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{address}</p>
          <div className="flex gap-3 mt-1.5 text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded inline-flex">
            <span>Lat: {latitude}</span>
            <span>Lng: {longitude}</span>
          </div>
        </div>

        <Button
          variant="outline"
          icon={Navigation}
          fullWidth
          className="font-bold border-slate-200 hover:bg-slate-50"
          onClick={handleNavigate}
        >
          Navigate
        </Button>
      </div>
    </div>
  );
};
