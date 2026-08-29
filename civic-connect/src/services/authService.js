/**
 * authService.js
 *
 * Frontend service layer for authentication.
 */

import { apiFetch } from './api.js';
import { STORAGE_KEYS } from '../utils/constants';

const authService = {
  /**
   * Retrieves the cached user from localStorage.
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Creates or verifies a session on the backend (MongoDB) using Firebase user / profile parameters.
   *
   * @param {Object} firebaseUser The Firebase user or mock user object
   * @param {Object} profileData Profile details (name, email, role, department, ward, phone, etc.)
   */
  async createSession(firebaseUser = {}, profileData = {}) {
    let token = 'mock-id-token-email';
    try {
      if (firebaseUser && typeof firebaseUser.getIdToken === 'function') {
        token = await firebaseUser.getIdToken();
      }
    } catch (err) {
      console.warn('Failed to retrieve token from firebaseUser:', err);
    }

    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem('civicconnect_token', token);
    }

    // Merge email and name into body payload
    const bodyPayload = {
      ...profileData,
      email: profileData.email || firebaseUser?.email || '',
      name: profileData.name || firebaseUser?.displayName || ''
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(bodyPayload),
      customToken: token
    };

    try {
      const json = await apiFetch('/api/auth/session', options);
      const user = json.data.user;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      return user;
    } catch (error) {
      console.warn('Backend session creation API error:', error);
      throw error;
    }
  },

  /**
   * Fetches the current user's profile from the backend API.
   */
  async fetchProfile() {
    const json = await apiFetch('/api/auth/me');
    return json.data;
  },

  /**
   * Logs in a user locally.
   */
  async loginUser({ email, password, role }) {
    const user = { email, role: role || 'CITIZEN' };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    return user;
  },

  /**
   * Registers a user locally.
   */
  async registerUser({ name, email, password, role, department, phone }) {
    const user = { name, email, role: role || 'CITIZEN', department, phone };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    return user;
  },

  /**
   * Logs the current user out.
   */
  async logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem('civicconnect_token');
  }
};

export default authService;
