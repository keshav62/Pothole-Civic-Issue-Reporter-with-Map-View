/**
 * authService.js
 *
 * Frontend service layer for authentication.
 */

import { apiFetch } from './api.js';
import { STORAGE_KEYS } from '../utils/constants';
import { auth } from '../config/firebase';

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
   * Creates a session on the backend using the provided Firebase user.
   *
   * @param {Object} firebaseUser The Firebase user object
   */
  async createSession(firebaseUser) {
    try {
      // Get the Firebase ID token (will be cached or refreshed automatically by Firebase)
      const token = await firebaseUser.getIdToken();
      
      // Store token in case the fallback logic or other components look for it directly
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem('civicconnect_token', token); // For prompt compatibility

      // Call our backend API to create/verify session
      // apiFetch automatically attaches the token
      const json = await apiFetch('/api/auth/session', { method: 'POST' });
      
      const user = json.data.user;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.warn('Backend session creation failed, using local fallback:', error);
      
      // Fallback local user creation
      const fallbackUser = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'CITIZEN'
      };
      
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(fallbackUser));
      return fallbackUser;
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
   * Logs in a user locally (fallback/demo path).
   */
  async loginUser({ email, password, role }) {
    const user = { email, role: role || 'CITIZEN' };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    return user;
  },

  /**
   * Registers a user locally (fallback/demo path).
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
