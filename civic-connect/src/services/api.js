/**
 * api.js
 *
 * Base API configuration for CivicConnect frontend.
 *
 * - BASE_URL reads from the Vite env variable VITE_API_BASE_URL.
 *   Set it in .env for your environment, e.g.:
 *     VITE_API_BASE_URL=http://localhost:5001
 *
 * - apiFetch is a thin wrapper around fetch() that:
 *     1. Prepends BASE_URL to any relative path.
 *     2. Attaches the Firebase ID token from localStorage when available
 *        (the auth service stores it there after login).
 *     3. Sets Content-Type: application/json for non-FormData bodies.
 *     4. Resolves to the parsed JSON body.
 *     5. Throws a structured { status, message, errors } error on non-2xx.
 */

import { auth } from '../config/firebase';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/**
 * apiFetch
 *
 * @param {string} path     - Relative path, e.g. '/api/issues/nearby'
 * @param {RequestInit} [options] - Standard fetch options (method, body, etc.)
 * @returns {Promise<any>}  - Parsed JSON response body
 * @throws {{ status: number, message: string, errors?: Array }}
 */
export const apiFetch = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;

  // Dynamically retrieve fresh Firebase ID token if authenticated, else fallback to localStorage
  let token = null;
  try {
    if (auth?.currentUser) {
      token = await auth.currentUser.getIdToken();
    }
  } catch (err) {
    console.warn('Could not get fresh token from auth.currentUser:', err);
  }

  if (!token) {
    token =
      localStorage.getItem('civic_connect_token') ||
      localStorage.getItem('civicconnect_token');
  }

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set Content-Type for JSON bodies (omit for FormData)
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });

  let json;
  try {
    json = await response.json();
  } catch {
    // Non-JSON response (e.g., 502 from a proxy)
    throw {
      status: response.status,
      message: `Server returned a non-JSON response (HTTP ${response.status})`,
    };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: json?.message || `Request failed with status ${response.status}`,
      errors: json?.errors || [],
    };
  }

  return json;
};
