/**
 * api.js
 *
 * Base API configuration and fetch wrapper for CivicConnect.
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

/**
 * apiFetch
 *
 * Automatically attaches JWT tokens, parses JSON, and handles HTTP errors.
 *
 * @param {string} path - The API endpoint to fetch
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<any>}
 * @throws {{ status: number, message: string, errors?: Array }}
 */
export const apiFetch = async (path, options = {}) => {
  // Prefer explicitly provided customToken if passed in options
  let token = options.customToken || null;

  // Fall back to cached token in localStorage
  if (!token) {
    token = localStorage.getItem('civicconnect_token') || localStorage.getItem('AUTH_TOKEN');
  }

  const headers = new Headers(options.headers || {});

  // Attach Authorization: Bearer <token>
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (!path.includes('/api/auth/login') && !path.includes('/api/auth/register')) {
    if (import.meta.env.DEV || process.env.NODE_ENV !== 'production') {
       // fallback for dev if required
    } else {
       throw { status: 401, message: 'Unauthorized: No valid authentication token found.' };
    }
  }

  // Set Content-Type to application/json if not FormData
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

  // Parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw { status: response.status, message: 'Server error' };
    }
    return null;
  }

  // Throw error for non-2xx
  if (!response.ok || data.success === false) {
    if (response.status === 401) {
      localStorage.removeItem('civicconnect_token');
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('civic_connect_user');
      localStorage.removeItem('AUTH_USER');
    }
    
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      errors: data.errors
    };
  }

  return data;
};
