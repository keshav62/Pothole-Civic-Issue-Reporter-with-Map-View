import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from storage
  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('Error initializing auth state:', err);
    } finally {
      setLoading(false);
    }
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

  const value = useMemo(
    () => ({
      currentUser,
      user: currentUser, // Alias for ease of access
      isAuthenticated: Boolean(currentUser),
      loading,
      login,
      logout,
      register,
    }),
    [currentUser, loading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
