import { useState, useEffect, useRef, useCallback } from 'react';

// Default fallback location near municipal active issue cluster (Sector 15 / Ward 8, New Delhi)
const DEFAULT_FALLBACK_LOCATION = {
  lat: 28.6280,
  lng: 77.2160,
  address: 'Sector 15, New Delhi',
  isFallback: true
};

export const useUserLocation = () => {
  const [location, setLocation] = useState(DEFAULT_FALLBACK_LOCATION);
  const [status, setStatus] = useState('loading'); // 'active' | 'permission_denied' | 'unavailable' | 'loading'
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const watchIdRef = useRef(null);

  const startWatchingLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser');
      return;
    }

    setStatus('loading');

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000
    };

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({
        lat: latitude,
        lng: longitude,
        address: 'Current Live GPS Location',
        isFallback: false
      });
      setStatus('active');
      setError(null);
      setLastUpdated(new Date());
    };

    const handleError = (err) => {
      console.warn('Geolocation watchPosition notice:', err.message);
      if (err.code === err.PERMISSION_DENIED) {
        setStatus('permission_denied');
        setError('Location access was denied');
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setStatus('unavailable');
        setError('Position unavailable');
      } else {
        setStatus('unavailable');
        setError(err.message || 'GPS Timeout');
      }
      // Retain fallback coordinates so application remains fully operational
      setLocation(prev => prev.isFallback ? prev : DEFAULT_FALLBACK_LOCATION);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
  }, []);

  const requestPermission = useCallback(() => {
    startWatchingLocation();
  }, [startWatchingLocation]);

  useEffect(() => {
    startWatchingLocation();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatchingLocation]);

  return {
    location,
    status,
    error,
    lastUpdated,
    requestPermission,
    useFallback: () => {
      setLocation(DEFAULT_FALLBACK_LOCATION);
      setStatus('active');
    }
  };
};

export default useUserLocation;
