import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IssueStatus } from '../issues/IssueStatus';
import { IssuePriority } from '../issues/IssuePriority';
import { Button } from '../common/Button';
import { getDistanceKm } from '../../utils/geoUtils';
import { HeatMap } from './HeatMap';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Clock, AlertTriangle, Loader2 } from 'lucide-react';

// Custom DivIcon for Leaflet markers with status/priority colors
const createCustomIcon = (priority, status, isSelected = false) => {
  const prio = (priority || '').toString().toUpperCase();
  const stat = (status || '').toString().toUpperCase();

  let color = '#3B82F6'; // Default Blue
  if (prio === 'CRITICAL' || stat === 'BREACHED') color = '#EF4444'; // Red
  else if (prio === 'HIGH') color = '#F59E0B'; // Amber
  else if (stat === 'RESOLVED') color = '#10B981'; // Green
  else if (prio === 'LOW') color = '#06B6D4'; // Cyan

  const size = isSelected ? 30 : 24;
  const pulse = prio === 'CRITICAL' || isSelected;

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${pulse ? `
          <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: ${color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        ` : ''}
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        ">
          <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4]
  });
};

// Distinct "You Are Here" Marker for Citizen / User live location
const createUserLiveIcon = () =>
  L.divIcon({
    className: 'user-live-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; background-color: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: ping 1.8s infinite;"></div>
        <div style="
          background-color: #2563eb;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 3.5px solid white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        ">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });

const RecenterMap = ({ center, zoom, flyToCoords }) => {
  const map = useMap();
  const prevFlyRef = useRef(null);

  useEffect(() => {
    if (flyToCoords && (!prevFlyRef.current || prevFlyRef.current.lat !== flyToCoords.lat || prevFlyRef.current.lng !== flyToCoords.lng)) {
      prevFlyRef.current = flyToCoords;
      map.flyTo([flyToCoords.lat, flyToCoords.lng], flyToCoords.zoom || 15, { duration: 1.2 });
    } else if (center && Array.isArray(center) && center.length === 2 && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, flyToCoords, map]);
  return null;
};

export const IssueMap = ({
  issues = [],
  center = [28.6139, 77.2090],
  zoom = 13,
  height = '480px',
  rolePrefix = '/admin',
  userLocation = null, // { lat: number, lng: number, accuracy?: number, label?: string, address?: string }
  showHeatmap = false,
  selectedIssueId = null,
  onMarkerSelect = null,
  flyToCoords = null,
  onLocateMe = null,
  isLocating = false,
  emptyMessage = 'No civic issues match the selected category filter in this area.',
}) => {
  const navigate = useNavigate();
  const mapCenter = (userLocation && userLocation.lat && userLocation.lng) ? [userLocation.lat, userLocation.lng] : center;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterMap center={center} zoom={zoom} flyToCoords={flyToCoords} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heatmap / Hotspot density glow layer */}
        {showHeatmap && <HeatMap issues={issues} opacity={0.5} />}

        {/* Citizen / User live location marker */}
        {userLocation?.lat && userLocation?.lng && (
          <>
            {userLocation.accuracy && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={Math.min(userLocation.accuracy, 300)}
                pathOptions={{
                  fillColor: '#3b82f6',
                  fillOpacity: 0.12,
                  color: '#2563eb',
                  weight: 1.5,
                  dashArray: '4 4'
                }}
              />
            )}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLiveIcon()}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-center font-sans">
                  <span className="font-bold text-blue-600 text-xs flex items-center justify-center gap-1">
                    <Navigation className="w-3 h-3 fill-blue-600" /> {userLocation.label || userLocation.address || 'Your Current Location'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {userLocation.accuracy ? `GPS accuracy ±${Math.round(userLocation.accuracy)}m` : 'Live Browser Geolocation'}
                  </span>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Issue Pins */}
        {issues.map((issue) => {
          let lat = issue.lat ?? issue.latitude ?? issue.location?.lat ?? issue.leaflet?.lat;
          let lng = issue.lng ?? issue.longitude ?? issue.location?.lng ?? issue.leaflet?.lng;

          if (issue.location?.coordinates && Array.isArray(issue.location.coordinates) && issue.location.coordinates.length >= 2) {
            lng = issue.location.coordinates[0];
            lat = issue.location.coordinates[1];
          }

          if (lat == null || lng == null) return null;

          const issueId = issue.id || issue.issueId || (issue._id ? String(issue._id) : Math.random());
          const isSelected = selectedIssueId === issueId || selectedIssueId === issue.id || selectedIssueId === issue._id;
          const distance = userLocation?.lat && userLocation?.lng ? getDistanceKm(userLocation.lat, userLocation.lng, lat, lng) : null;

          return (
            <Marker
              key={issueId}
              position={[lat, lng]}
              icon={createCustomIcon(issue.priority, issue.status, isSelected)}
              eventHandlers={{
                click: () => onMarkerSelect?.(issue),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1.5 max-w-xs space-y-2.5 font-sans">
                  {/* Top Bar: ID + Priority + Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {issueId}
                    </span>
                    <IssuePriority priority={issue.priority} />
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      {issue.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 leading-snug mt-0.5 line-clamp-2">
                      {issue.title}
                    </h4>
                  </div>

                  {/* Address & Ward & Distance */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <p className="flex items-start gap-1.5 line-clamp-2 leading-tight">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{issue.address || `${issue.ward || 'Ward'} Area`}</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                      <span>Ward: <strong>{issue.ward || 'General'}</strong></span>
                      {distance && (
                        <span className="text-blue-700 font-bold bg-blue-100/80 px-1.5 py-0.2 rounded">
                          📍 {distance} km away
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer: Status + CTA */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                    <IssueStatus status={issue.status} />
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-[11px] py-1 px-2.5 font-bold"
                      onClick={() => navigate(`${rolePrefix}/issues/${issue.id}`)}
                    >
                      View Details <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating My Location Button Overlay */}
      {onLocateMe && (
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          title="Center Map on My Location"
          className="absolute bottom-5 right-5 z-[450] bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-800 hover:text-blue-600 px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
          )}
          <span>My Location</span>
        </button>
      )}

      {/* Floating empty state overlay if no issues */}
      {issues.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[450] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 shadow-lg text-xs font-bold text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{emptyMessage}</span>
        </div>
      )}
    </div>
  );
};

export default IssueMap;
