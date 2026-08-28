import React from 'react';
import { MapPin, Navigation, Layers, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../hooks/useToast';

export const MapPage = () => {
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Civic Issue Geospatial Map</h1>
          <p className="text-sm text-slate-500 mt-1">
            Geographic visualization of pothole clusters and reported municipal hazards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Navigation className="w-4 h-4" />}
            onClick={() => showToast('Locating user coordinates...', 'info')}
          >
            Locate Me
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Layers className="w-4 h-4" />}
            onClick={() => showToast('Toggled Heatmap Layer', 'info')}
          >
            Heatmap Layer
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-[520px] bg-slate-100 rounded-xl flex items-center justify-center relative border border-slate-200 m-4">
          <EmptyState
            icon={<Compass className="w-10 h-10 text-blue-500 animate-pulse" />}
            title="Interactive Map View Foundation Ready"
            description="Geospatial Leaflet / Google Maps container ready for Member 4 implementation."
            actionText="Simulate Pothole Pin Marker"
            onAction={() => showToast('Marker pinned at [37.7749, -122.4194]', 'success')}
          />
        </div>
      </Card>
    </div>
  );
};

export default MapPage;
