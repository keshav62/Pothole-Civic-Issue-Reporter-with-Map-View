// ─────────────────────────────────────────────────────────────────────────────
// mockUsers.js – Empty initial state; real users are loaded from MongoDB Atlas
// ─────────────────────────────────────────────────────────────────────────────
import { USER_ROLES } from '../utils/constants';

export const mockUsers = [];
export const currentWorker = null;
export const MOCK_USERS = [];

export const getMockUserByRole = (role) => null;
export const getMockUserByEmail = (email) => null;
