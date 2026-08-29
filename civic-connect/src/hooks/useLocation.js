import { useState, useCallback, useEffect } from 'react';

/**
 * useLocation
 *
 * A reusable hook that wraps the browser Geolocation API.
 * Never uses fake or hardcoded coordinates.
 *
 * Returns:
 *   coords             – { lat: number, lng: number } | null
 *   accuracy           – number (metres) | null
 *   loading            – boolean
 *   error              – string | null   (human-readable)
 *   getCurrentLocation – () => void      (imperative trigger)
 */
export const useLocation = () => {
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setAccuracy(
          position.coords.accuracy != null
            ? Math.round(position.coords.accuracy)
            : null
        );
        setLoading(false);
      },
      (err) => {
        let message;
        switch (err.code) {
          case 1: // PERMISSION_DENIED
            message =
              'Location permission was denied. Please allow location access in your browser settings.';
            break;
          case 2: // POSITION_UNAVAILABLE
            message = 'Your current location could not be determined.';
            break;
          case 3: // TIMEOUT
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred while retrieving your location.';
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return { coords, accuracy, loading, error, getCurrentLocation };
};
