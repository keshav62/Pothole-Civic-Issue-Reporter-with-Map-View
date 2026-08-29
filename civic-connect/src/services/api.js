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
  let token = null;

  // 1. Try to get a live Firebase ID token
  if (auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (err) {
      console.warn('Failed to get Firebase token:', err);
    }
  }

  // 2. Fall back to localStorage token
  if (!token) {
    token = localStorage.getItem('civicconnect_token') || localStorage.getItem('civic_connect_token');
  }

  const headers = new Headers(options.headers || {});

  // 3. Attach Authorization: Bearer <token>
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

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
    // Handling non-JSON responses gracefully
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
