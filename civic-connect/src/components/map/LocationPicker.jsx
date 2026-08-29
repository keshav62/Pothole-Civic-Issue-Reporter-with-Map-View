import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapEvents = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker = ({
  initialLocation,
  onLocationChange,
  height = '300px'
}) => {
  const [position, setPosition] = useState(
    initialLocation || { lat: 28.6139, lng: 77.2090 }
  );

  const handleSelect = (lat, lng) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    onLocationChange?.(newPos);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleSelect(pos.coords.latitude, pos.coords.longitude);
        },
        () => {}
      );
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200">
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute top-3 right-3 z-[1000] bg-white border border-slate-200 shadow-md rounded-xl p-2 hover:bg-slate-50 transition-colors"
        title="Locate Me"
      >
        <Navigation className="w-4 h-4 text-emerald-600" />
      </button>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height, width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapEvents onSelect={handleSelect} />
        <Marker position={[position.lat, position.lng]} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
