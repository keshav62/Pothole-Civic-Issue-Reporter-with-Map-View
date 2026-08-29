/**
 * api.js
 * Base wrapper for backend fetch calls.
 */

import { auth } from '../config/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * apiFetch
 *
 * Automatically attaches Firebase Auth tokens, parses JSON, and handles HTTP errors.
 *
 * @param {string} path - The API endpoint to fetch
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<any>}
 * @throws {{ status: number, message: string, errors?: Array }}
 */
export const apiFetch = async (path, options = {}) => {
  let token = options.customToken || null;

  // Wait for Firebase to restore session from IndexedDB if this is a hard refresh
  await auth.authStateReady();

  // 1. Get a live, cryptographically secure Firebase ID token
  if (!token && auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn('Failed to get Firebase token:', err);
    }
  }

  if (!token) {
    throw { status: 401, message: 'Unauthorized: No valid authentication token found.' };
  }

  const headers = new Headers(options.headers || {});

  // 3. Attach Authorization: Bearer <token>
  headers.set('Authorization', `Bearer ${token}`);

  // 4. Set Content-Type to application/json if not FormData
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const fetchOptions = {
    ...options,
    headers
  };

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const response = await fetch(url, fetchOptions);

  // 5. Parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw { status: response.status, message: 'Server error' };
    }
    return null;
  }

  // 6. Throw error for non-2xx
  if (!response.ok || data.success === false) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      errors: data.errors
    };
  }

  return data;
};
