import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../common/Button';

export const LocationCard = ({ address, latitude, longitude, distance = "2.4 km away" }) => {
  const handleNavigate = () => {
    // Open Google Maps in a new tab with the destination coordinates
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="h-32 bg-slate-100 relative">
        {/* Map Placeholder */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400" 
          alt="Map" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-md" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/30 rounded-[100%] blur-[1px]"></span>
          </div>
        </div>
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
