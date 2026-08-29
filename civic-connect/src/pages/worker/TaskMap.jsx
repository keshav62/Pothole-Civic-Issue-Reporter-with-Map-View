import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

const taskIcon = L.divIcon({
  className: 'custom-single-task-marker',
  html: `
    <div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export const TaskMap = ({ latitude, longitude, address }) => {
  const isValidCoordinate = (coord) => typeof coord === 'number' && !isNaN(coord);
  const isValid = isValidCoordinate(latitude) && isValidCoordinate(longitude);

  if (!isValid) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <MapPin className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-semibold">Location Data Unavailable</span>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={taskIcon}>
        {address && (
          <Popup className="custom-leaflet-popup">
            <div className="p-1 text-xs font-sans font-bold text-slate-900">
              {address}
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
};

export default TaskMap;
