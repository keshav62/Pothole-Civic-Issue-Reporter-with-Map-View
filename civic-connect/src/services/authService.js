import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { MOCK_USERS, getMockUserByEmail } from '../data/mockUsers';

const SIMULATED_DELAY_MS = 250;

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Auth Service
 * Modular abstraction layer for all authentication operations.
 * Currently uses localStorage + Mock datasets; easily swappable with backend API client.
 */
export const authService = {
  /**
   * Retrieve current user from local storage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to parse current user from localStorage:', err);
      return null;
    }
  },

  /**
   * Authenticate user with email and password (or quick role select)
   */
  async loginUser({ email, password, role }) {
    await delay();

    // If role is passed directly (for demo switcher) or found by email
    let matchedUser = null;

    if (email) {
      matchedUser = getMockUserByEmail(email);
    }

    if (!matchedUser && role) {
      matchedUser = MOCK_USERS.find((u) => u.role === role);
    }

    if (!matchedUser) {
      // Fallback: create dynamic session for any email entered with default CITIZEN or specified role
      matchedUser = {
        id: `user-${Date.now()}`,
        name: email ? email.split('@')[0].replace('.', ' ') : 'Civic User',
        email: email || 'user@example.com',
        role: role || USER_ROLES.CITIZEN,
        department: null,
      };
    }

    // Do NOT store passwords
    const safeUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      department: matchedUser.department || null,
      phone: matchedUser.phone || null,
      address: matchedUser.address || null,
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${Date.now()}`);

    return safeUser;
  },

  /**
   * Register a new user
   */
  async registerUser({ name, email, password, role = USER_ROLES.CITIZEN, department = null, phone = null }) {
    await delay();

    if (!name || !email) {
      throw new Error('Name and email are required for registration.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      department: department || (role === USER_ROLES.CITIZEN ? null : 'General Operations'),
      phone,
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-jwt-${Date.now()}`);

    return newUser;
  },

  /**
   * Logout user and clear tokens
   */
  async logoutUser() {
    await delay(100);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  },

  /**
   * Get available demo mock users for fast role-testing
   */
  getMockUsers() {
    return MOCK_USERS;
  },
};

export default authService;
