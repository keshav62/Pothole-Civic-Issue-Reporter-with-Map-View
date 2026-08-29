import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IssueStatus } from '../issues/IssueStatus';
import { IssuePriority } from '../issues/IssuePriority';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { calculateDistance, formatDistance } from '../../utils/geo';

// Custom DivIcon for Leaflet issue markers with priority colors
const createCustomIcon = (priority, status) => {
  let color = '#3B82F6'; // Default Blue (Low)
  const p = (priority || '').toUpperCase();
  const s = (status || '').toUpperCase();

  if (p === 'CRITICAL' || s === 'BREACHED') color = '#EF4444'; // Red
  else if (p === 'HIGH') color = '#F59E0B'; // Amber
  else if (p === 'MEDIUM') color = '#EAB308'; // Yellow
  else if (s === 'RESOLVED') color = '#10B981'; // Green

  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-center;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Pulse Icon for User Live Location Marker
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(37, 99, 235, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="background-color: #2563EB; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 12px rgba(37, 99, 235, 0.9); z-index: 10;"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const IssueMap = ({
  issues = [],
  userLocation = null,
  center = [28.6280, 77.2160],
  zoom = 13,
  height = '450px',
  rolePrefix = '/admin'
}) => {
  const navigate = useNavigate();
  const mapCenter = (userLocation && userLocation.lat) ? [userLocation.lat, userLocation.lng] : center;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User GPS Live Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="p-1 text-center space-y-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">📍 YOUR GPS LOCATION</span>
                <p className="text-[11px] font-bold text-slate-900">{userLocation.address || 'Live Location'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Issue Markers */}
        {issues.map((issue) => {
          const lat = issue.latitude || issue.location?.lat;
          const lng = issue.longitude || issue.location?.lng;
          if (!lat || !lng) return null;

          let distanceText = '';
          if (userLocation && userLocation.lat && userLocation.lng) {
            const meters = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
            distanceText = formatDistance(meters);
          }

          return (
            <Marker
              key={issue.id}
              position={[lat, lng]}
              icon={createCustomIcon(issue.priority, issue.status)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
                    <IssuePriority priority={issue.priority} />
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{issue.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{issue.address}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Ward: <strong>{issue.ward}</strong></span>
                    {distanceText && (
                      <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        📍 {distanceText} away
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <IssueStatus status={issue.status} />
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-[11px] py-1 px-2"
                      onClick={() => navigate(`${rolePrefix}/reports`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default IssueMap;
