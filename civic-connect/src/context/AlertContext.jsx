import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useCivic } from './CivicContext';
import { useUserLocation } from '../hooks/useUserLocation';
import {
  calculateDistance,
  formatDistance,
  formatTimeAgo,
  getSeverityScore,
  isIssueAlertEligible
} from '../utils/geo';

const AlertContext = createContext(null);

const SETTINGS_STORAGE_KEY = 'civic_connect_alert_settings_v1';
const READ_ALERTS_STORAGE_KEY = 'civic_connect_read_alerts_v1';

const DEFAULT_SETTINGS = {
  radiusMeters: 2000, // Default 2 km
  categories: {
    'Pothole': true,
    'Water Leakage': true,
    'Garbage Pileup': true,
    'Streetlight': true,
    'Drainage': true,
    'Traffic': true,
    'Parks': true,
  },
  severities: {
    'CRITICAL': true,
    'HIGH': true,
    'MEDIUM': true,
    'LOW': true,
  },
  browserNotifications: false,
};

export const AlertProvider = ({ children }) => {
  const { issues } = useCivic();
  const { location: userLocation, status: locationStatus, lastUpdated: locationLastUpdated, requestPermission: requestLocationPermission } = useUserLocation();

  // Load Settings & Read States
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [readAlertIds, setReadAlertIds] = useState(() => {
    try {
      const saved = localStorage.getItem(READ_ALERTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasNewCriticalAlert, setHasNewCriticalAlert] = useState(false);

  // Save Settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save alert settings to localStorage', e);
    }
  }, [settings]);

  // Save Read IDs
  useEffect(() => {
    try {
      localStorage.setItem(READ_ALERTS_STORAGE_KEY, JSON.stringify(readAlertIds));
    } catch (e) {
      console.warn('Failed to save read alerts to localStorage', e);
    }
  }, [readAlertIds]);

  // Request Browser Notification Permission gracefully
  const requestBrowserNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') {
      setSettings(prev => ({ ...prev, browserNotifications: true }));
      return true;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setSettings(prev => ({ ...prev, browserNotifications: true }));
      return true;
    }
    setSettings(prev => ({ ...prev, browserNotifications: false }));
    return false;
  }, []);

  // Compute Nearby Alerts dynamically
  const alerts = useMemo(() => {
    if (!issues || !Array.isArray(issues) || !userLocation || userLocation.lat == null) {
      return [];
    }

    const computedList = [];

    issues.forEach(issue => {
      const issueLat = issue.latitude || issue.location?.lat;
      const issueLng = issue.longitude || issue.location?.lng;

      if (!issueLat || !issueLng) return;

      const distanceMeters = calculateDistance(userLocation.lat, userLocation.lng, issueLat, issueLng);
      
      // Check alert eligibility based on status, distance, settings
      if (isIssueAlertEligible(issue, distanceMeters, settings.radiusMeters)) {
        const severityKey = (issue.priority || 'MEDIUM').toUpperCase();
        
        // Filter by settings if configured
        if (settings.severities && settings.severities[severityKey] === false) return;

        const alertId = `ALT-${issue.id}-${severityKey}`;
        const isRead = readAlertIds.includes(alertId);

        computedList.push({
          alertId,
          issueId: issue.id,
          title: issue.title,
          category: issue.category || 'General',
          description: issue.description,
          priority: issue.priority || 'MEDIUM',
          status: issue.status || 'REPORTED',
          address: issue.address || issue.location?.address || 'Nearby Municipal Area',
          latitude: issueLat,
          longitude: issueLng,
          distanceMeters,
          formattedDistance: formatDistance(distanceMeters),
          reportedDate: issue.reportedDate || issue.createdAt || new Date().toISOString(),
          formattedTimeAgo: formatTimeAgo(issue.reportedDate || issue.createdAt),
          isRead,
          severityScore: getSeverityScore(issue.priority),
          issueObj: issue
        });
      }
    });

    // Priority Sort: (1) Severity Score (High to Low), (2) Distance (Meters, Low to High), (3) Recency
    return computedList.sort((a, b) => {
      if (b.severityScore !== a.severityScore) {
        return b.severityScore - a.severityScore;
      }
      if (a.distanceMeters !== b.distanceMeters) {
        return a.distanceMeters - b.distanceMeters;
      }
      return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
    });
  }, [issues, userLocation, settings, readAlertIds]);

  // Trigger Browser Notification for Critical Alerts
  useEffect(() => {
    if (!settings.browserNotifications || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const unreadCritical = alerts.find(a => a.priority === 'CRITICAL' && !a.isRead);
    if (unreadCritical) {
      setHasNewCriticalAlert(true);
      try {
        new Notification('🚨 CivicConnect Critical Alert', {
          body: `${unreadCritical.title} reported ${unreadCritical.formattedDistance} from your location.`,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.warn('Browser notification trigger warning:', e);
      }
    }
  }, [alerts, settings.browserNotifications]);

  const unreadCount = useMemo(() => alerts.filter(a => !a.isRead).length, [alerts]);

  const markAsRead = useCallback((alertId) => {
    setReadAlertIds(prev => prev.includes(alertId) ? prev : [...prev, alertId]);
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = alerts.map(a => a.alertId);
    setReadAlertIds(prev => Array.from(new Set([...prev, ...allIds])));
    setHasNewCriticalAlert(false);
  }, [alerts]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AlertContext.Provider value={{
      alerts,
      unreadCount,
      hasNewCriticalAlert,
      userLocation,
      locationStatus,
      locationLastUpdated,
      requestLocationPermission,
      settings,
      updateSettings,
      markAsRead,
      markAllAsRead,
      requestBrowserNotificationPermission
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useRealtimeAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    return {
      alerts: [],
      unreadCount: 0,
      hasNewCriticalAlert: false,
      userLocation: { lat: 28.6280, lng: 77.2160, address: 'Sector 15, New Delhi' },
      locationStatus: 'unavailable',
      locationLastUpdated: new Date(),
      requestLocationPermission: () => {},
      settings: { radiusMeters: 2000 },
      updateSettings: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      requestBrowserNotificationPermission: async () => false
    };
  }
  return context;
};

export default AlertContext;
