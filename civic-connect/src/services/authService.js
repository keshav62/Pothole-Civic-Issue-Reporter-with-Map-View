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
   * Fetches the current user's profile from the backend API.
   */
  async fetchProfile() {
    const json = await apiFetch('/api/auth/me');
    return json.data;
  },

  /**
   * Log in via Demo Mode
   */
  async demoLogin(role) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ role })
    };
    
    const json = await apiFetch('/api/auth/demo-login', options);
    const { token, user } = json.data;
    
    localStorage.setItem('civicconnect_token', token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    
    return { token, user };
  },

  /**
   * Log in with Email & Password
   */
  async loginUser({ email, password }) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ email, password })
    };
    
    const json = await apiFetch('/api/auth/login', options);
    const { token, user } = json.data;
    
    localStorage.setItem('civicconnect_token', token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    
    return user;
  },

  /**
   * Registers a user.
   */
  async registerUser({ name, email, password, role, department, ward, phone }) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, department, ward, phone })
    };
    
    const json = await apiFetch('/api/auth/register', options);
    const { token, user } = json.data;
    
    localStorage.setItem('civicconnect_token', token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
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
