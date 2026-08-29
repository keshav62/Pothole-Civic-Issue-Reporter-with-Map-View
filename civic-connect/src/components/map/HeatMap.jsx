import React from 'react';
import { Circle, CircleMarker, Popup } from 'react-leaflet';

/**
 * Priority severity weights for density calculation
 */
const SEVERITY_WEIGHTS = {
  CRITICAL: 1.0,
  HIGH: 0.75,
  MEDIUM: 0.5,
  LOW: 0.25,
};

const SEVERITY_COLORS = {
  CRITICAL: { fill: '#ef4444', stroke: '#dc2626', radius: 45 },
  HIGH: { fill: '#f97316', stroke: '#ea580c', radius: 35 },
  MEDIUM: { fill: '#eab308', stroke: '#ca8a04', radius: 25 },
  LOW: { fill: '#3b82f6', stroke: '#2563eb', radius: 18 },
};

/**
 * HeatMap / HotspotDensityLayer
 *
 * Renders glowing, weighted radial density zones around issue clusters
 * with interactive hover/click support and zero external binary dependencies.
 */
export const HeatMap = ({ issues = [], opacity = 0.45 }) => {
  return (
    <>
      {issues.map((issue) => {
        const lat = issue.location?.lat ?? issue.latitude;
        const lng = issue.location?.lng ?? issue.longitude;
        if (!lat || !lng) return null;

        const priority = (issue.priority || issue.severity || 'MEDIUM').toString().toUpperCase();
        const colorConfig = SEVERITY_COLORS[priority] || SEVERITY_COLORS.MEDIUM;
        const weight = SEVERITY_WEIGHTS[priority] || 0.5;

        return (
          <React.Fragment key={`hotspot-${issue.id}`}>
            {/* Outer soft ambient heat glow */}
            <Circle
              center={[lat, lng]}
              radius={colorConfig.radius * 12}
              pathOptions={{
                fillColor: colorConfig.fill,
                fillOpacity: opacity * 0.4,
                stroke: false,
              }}
            />

            {/* Inner intense hotspot core */}
            <CircleMarker
              center={[lat, lng]}
              radius={Math.max(12, Math.round(weight * 22))}
              pathOptions={{
                fillColor: colorConfig.fill,
                fillOpacity: opacity * 0.85,
                color: colorConfig.stroke,
                weight: 2,
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-xs font-sans">
                  <span className="font-bold text-slate-900 block">{issue.title}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Category: <strong>{issue.category}</strong> • Ward: <strong>{issue.ward}</strong>
                  </span>
                  <span className="text-[10px] font-semibold text-red-600 block mt-0.5">
                    Severity: {priority} (Density Weight: {Math.round(weight * 100)}%)
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default HeatMap;
