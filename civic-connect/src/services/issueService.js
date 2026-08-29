/**
 * issueService.js
 *
 * Frontend service layer for issue-related API calls.
 * All functions are pure async — no React state is managed here.
 */

import { apiFetch } from './api.js';

// ─── Public (unauthenticated) ─────────────────────────────────────────────────

/**
 * fetchNearbyIssues
 *
 * Calls GET /api/issues/nearby and returns the parsed `data` object.
 *
 * The response `data.issues` array is already Leaflet-ready:
 * each issue has a `leaflet: { lat, lng }` sub-object for direct use in
 * React-Leaflet <Marker position={[issue.leaflet.lat, issue.leaflet.lng]}>.
 *
 * @param {Object} params
 * @param {number}  params.lat       - Centre latitude  (−90 to 90)
 * @param {number}  params.lng       - Centre longitude (−180 to 180)
 * @param {number}  params.radius    - Search radius in metres (1–50000)
 * @param {string}  [params.status]  - Comma-separated ISSUE_STATUSES to filter
 *                                     (defaults to active issues when omitted)
 * @param {string}  [params.category]- Single ISSUE_CATEGORIES value
 * @param {number}  [params.limit]   - Max results (1–100, default 50)
 *
 * @returns {Promise<{
 *   center: { lat: number, lng: number },
 *   radiusMeters: number,
 *   total: number,
 *   issues: Array<NearbyIssue>
 * }>}
 *
 * @throws {{ status: number, message: string, errors?: Array }}
 *
 * ─── NearbyIssue shape ────────────────────────────────────────────────────────
 * {
 *   _id:            string,
 *   issueId:        string,          // "ISS-0042"
 *   title:          string,
 *   description:    string,
 *   category:       string,          // "POTHOLE" | "GARBAGE" | ...
 *   priority:       string,          // "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
 *   status:         string,          // "REPORTED" | "ASSIGNED" | ...
 *   location: {
 *     type:         "Point",
 *     coordinates:  [number, number] // [longitude, latitude] — GeoJSON order
 *   },
 *   leaflet: {
 *     lat:          number,          // latitude  (safe for <Marker position>)
 *     lng:          number           // longitude (safe for <Marker position>)
 *   },
 *   address:        string,
 *   ward:           string,
 *   thumbnail:      string | null,   // first image URL or null
 *   distanceMeters: number,          // rounded integer metres from centre
 *   createdAt:      string,          // ISO 8601
 *   updatedAt:      string           // ISO 8601
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Usage in a React-Leaflet component:
 *
 *   const { issues } = await fetchNearbyIssues({ lat: 28.6139, lng: 77.2090, radius: 2000 });
 *
 *   issues.map(issue => (
 *     <Marker
 *       key={issue._id}
 *       position={[issue.leaflet.lat, issue.leaflet.lng]}
 *     >
 *       <Popup>
 *         <strong>{issue.title}</strong><br />
 *         {issue.category} · {issue.priority}<br />
 *         📍 {issue.distanceMeters}m away
 *       </Popup>
 *     </Marker>
 *   ))
 */
export const fetchNearbyIssues = async ({
  lat,
  lng,
  radius,
  status,
  category,
  limit,
} = {}) => {
  // Build query string — only append optional params when they have a value
  const params = new URLSearchParams();

  params.set('lat',    String(lat));
  params.set('lng',    String(lng));
  params.set('radius', String(radius));

  if (status)   params.set('status',   status);
  if (category) params.set('category', category);
  if (limit)    params.set('limit',    String(limit));

  const json = await apiFetch(`/api/issues/nearby?${params.toString()}`);

  // The backend wraps all responses in { success, message, data }
  return json.data;
};
