/**
 * Geospatial Utilities for CivicConnect Realtime Location-Based Alert System
 */

/**
 * Calculates the geodesic distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 Latitude of point 1 (in degrees)
 * @param {number} lon1 Longitude of point 1 (in degrees)
 * @param {number} lat2 Latitude of point 2 (in degrees)
 * @param {number} lon2 Longitude of point 2 (in degrees)
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
}

/**
 * Formats distance in meters into human-readable text.
 * @param {number} meters 
 * @returns {string} e.g. "350 m" or "1.2 km"
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats a date string or timestamp into relative time.
 * @param {string|Date} date 
 * @returns {string} e.g. "2 min ago", "1 hour ago"
 */
export function formatTimeAgo(date) {
  if (!date) return 'Recently';
  const time = new Date(date).getTime();
  if (isNaN(time)) return 'Recently';
  
  const diffInSeconds = Math.floor((Date.now() - time) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

/**
 * Returns severity weight score for sorting (Higher is more urgent).
 */
export function getSeverityScore(priority = '') {
  const p = priority.toUpperCase();
  if (p === 'CRITICAL') return 400;
  if (p === 'HIGH') return 300;
  if (p === 'MEDIUM') return 200;
  if (p === 'LOW') return 100;
  return 50;
}

/**
 * Returns maximum alert radius for a given issue priority.
 */
export function getMaxAlertRadiusForPriority(priority = '') {
  const p = priority.toUpperCase();
  if (p === 'CRITICAL') return 2000; // 2km
  if (p === 'HIGH') return 1000;     // 1km
  if (p === 'MEDIUM') return 500;     // 500m
  if (p === 'LOW') return 300;        // 300m
  return 500;
}

/**
 * Determines if an issue is eligible for alert based on status, distance, and severity.
 */
export function isIssueAlertEligible(issue, distanceMeters, customMaxRadiusMeters = null) {
  if (!issue) return false;
  
  // Status check: Only active non-resolved, non-rejected issues
  const status = (issue.status || '').toUpperCase();
  if (status === 'RESOLVED' || status === 'REJECTED' || status === 'CLOSED') {
    return false;
  }

  const priorityMaxRadius = getMaxAlertRadiusForPriority(issue.priority);
  const effectiveMaxRadius = customMaxRadiusMeters || priorityMaxRadius;

  return distanceMeters <= effectiveMaxRadius;
}
