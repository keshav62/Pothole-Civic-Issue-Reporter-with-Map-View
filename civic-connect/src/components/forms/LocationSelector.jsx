import React, { useState } from 'react';
import { LocationPicker } from '../map/LocationPicker';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

export const LocationSelector = ({
  value,
  onChange,
  label = 'Issue Location'
}) => {
  const [address, setAddress] = useState(value?.address || '');

  const handleLocationChange = (coords) => {
    const updated = {
      latitude: coords.lat,
      longitude: coords.lng,
      address: address || `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`
    };
    onChange?.(updated);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      <div className="space-y-2">
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search address or landmark..."
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              onChange?.({ ...(value || {}), address: e.target.value });
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800"
          />
        </div>

        <LocationPicker
          initialLocation={value?.latitude ? { lat: value.latitude, lng: value.longitude } : undefined}
          onLocationChange={handleLocationChange}
          height="220px"
        />
      </div>
    </div>
  );
};

export default LocationSelector;
