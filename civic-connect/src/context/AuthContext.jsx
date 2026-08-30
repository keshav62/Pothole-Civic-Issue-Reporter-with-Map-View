import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const localUser = authService.getCurrentUser();
      return localUser || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Restore session from backend on mount if we have a user in localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.getCurrentUser()) {
          const profile = await authService.fetchProfile();
          if (profile && profile.user) {
            setCurrentUser(profile.user);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch fresh profile, you may need to log in again.", err);
        // If 401, we might want to log out, but we'll leave it simple for now
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await authService.loginUser(credentials);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const user = await authService.registerUser(userData);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logoutUser();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAs = (userOrRoleId) => {
    let targetUser = null;
    if (typeof userOrRoleId === 'string') {
      targetUser = MOCK_USERS.find(u => u.role === userOrRoleId || u.id === userOrRoleId);
    } else {
      targetUser = userOrRoleId;
    }
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const switchRole = (role) => {
    const matchingUser = MOCK_USERS.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }
  };

  const updateCurrentUser = useCallback((user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('civic_connect_user', JSON.stringify(user));
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      user: currentUser, // Alias for ease of access
      role: currentUser?.role || null,
      isAuthenticated: !!currentUser,
      loading,
      login,
      logout,
      register,
      loginAs,
      switchRole,
      updateCurrentUser
    }),
    [currentUser, loading, login, logout, register, updateCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
