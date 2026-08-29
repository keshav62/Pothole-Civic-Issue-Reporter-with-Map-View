import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IssueStatus } from '../issues/IssueStatus';
import { IssuePriority } from '../issues/IssuePriority';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

// Custom DivIcon for Leaflet markers with status/priority colors
const createCustomIcon = (priority, status) => {
  let color = '#3B82F6'; // Default Blue
  if (priority === 'CRITICAL' || status === 'BREACHED') color = '#EF4444'; // Red
  else if (priority === 'HIGH') color = '#F59E0B'; // Amber
  else if (status === 'RESOLVED') color = '#10B981'; // Green

  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; items-center; justify-center;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const IssueMap = ({
  issues = [],
  center = [28.6139, 77.2090],
  zoom = 12,
  height = '450px',
  rolePrefix = '/admin'
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map((issue) => {
          const lat = issue.location?.lat ?? issue.latitude;
          const lng = issue.location?.lng ?? issue.longitude;
          if (!lat || !lng) return null;
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
                    <span>Dept: <strong>{issue.department}</strong></span>
                    <span>Ward: <strong>{issue.ward}</strong></span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <IssueStatus status={issue.status} />
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-[11px] py-1 px-2"
                      onClick={() => navigate(`${rolePrefix}/issues/${issue.id}`)}
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
