/**
 * ReportLocationMap.jsx
 *
 * A dedicated Leaflet map for selecting an incident location during issue
 * reporting. Completely independent from LocationPicker.jsx / IssueMap.
 *
 * Props:
 *   position         – { lat: number, lng: number } | null
 *   onPositionChange – (pos: { lat: number, lng: number }) => void
 *   flyTo            – boolean  – when true, animate camera to new position
 *                                 (set to true on GPS, false on manual moves)
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Visual defaults ──────────────────────────────────────────────────────────
// This is ONLY the initial map viewport. It is NOT the user's location.
const DEFAULT_CENTER = [28.6139, 77.209];
const DEFAULT_ZOOM = 13;
const LOCATED_ZOOM = 17;

// ── Custom pin icon (pure CSS via divIcon – no bundler image issues) ─────────
const createPinIcon = () =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        width: 26px;
        height: 38px;
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.30));
      ">
        <div style="
          width: 26px;
          height: 26px;
          background: #2563eb;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #fff;
        "></div>
        <div style="
          width: 4px;
          height: 10px;
          background: #2563eb;
          border-radius: 0 0 3px 3px;
          margin-top: -2px;
        "></div>
      </div>
    `,
    iconSize: [26, 38],
    iconAnchor: [13, 38],
  });

// ── Internal: update map view when position changes externally ───────────────
const MapViewController = ({ position, flyTo }) => {
  const map = useMap();
  const prevPosRef = useRef(null);

  useEffect(() => {
    if (!position) return;

    const prev = prevPosRef.current;
    const isSame =
      prev &&
      prev.lat === position.lat &&
      prev.lng === position.lng;

    if (isSame) return;
    prevPosRef.current = position;

    if (flyTo) {
      map.flyTo([position.lat, position.lng], LOCATED_ZOOM, { duration: 0.8 });
    }
    // When the user manually clicks/drags, we do NOT force the view.
  }, [position, flyTo, map]);

  return null;
};

// ── Internal: handle map click → place/move marker ───────────────────────────
const ClickToPlace = ({ onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

// ── Public component ─────────────────────────────────────────────────────────
export const ReportLocationMap = ({ position, onPositionChange, flyTo = false }) => {
  const markerRef = useRef(null);

  // Stable icon reference — do not recreate on every render
  const pinIcon = useRef(createPinIcon());

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const latlng = marker.getLatLng();
    onPositionChange({ lat: latlng.lat, lng: latlng.lng });
  }, [onPositionChange]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative"
      style={{ height: '360px' }}
    >
      {/* Hint overlay shown before any location is selected */}
      {!position && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] pointer-events-none"
        >
          <div className="bg-white/95 border border-slate-200 rounded-lg px-3 py-1.5 shadow text-[11px] text-slate-600 font-medium whitespace-nowrap">
            Tap the map or press <strong>Auto-Locate GPS</strong>
          </div>
        </div>
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Animate to GPS result; do not fight user panning */}
        <MapViewController position={position} flyTo={flyTo} />

        {/* Click anywhere to drop marker */}
        <ClickToPlace onPositionChange={onPositionChange} />

        {/* Draggable marker rendered only after a location is chosen */}
        {position && (
          <Marker
            ref={markerRef}
            position={[position.lat, position.lng]}
            icon={pinIcon.current}
            draggable
            eventHandlers={{ dragend: handleDragEnd }}
          />
        )}
      </MapContainer>
    </div>
  );
};
