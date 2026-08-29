import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_USERS } from '../data/mockUsers';
import { auth, firebaseSignOut } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const localUser = authService.getCurrentUser();
      return localUser || MOCK_USERS[0];
    } catch {
      return MOCK_USERS[0];
    }
  });
  const [loading, setLoading] = useState(false);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase Auth User Detected:", firebaseUser.email);
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('civic_connect_token', idToken);
          localStorage.setItem('civicconnect_token', idToken);
        } catch (err) {
          console.error("Failed to fetch Firebase ID token:", err);
        }
      }
    });
    return () => unsubscribe();
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
      firebaseSignOut();
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

  const loginWithGmail = (email, role = 'SUPER_ADMIN', customName = null, customPhoto = null) => {
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    const roleMap = {
      SUPER_ADMIN: 'Super Admin',
      DEPARTMENT_ADMIN: 'Department Admin',
      WARD_OFFICER: 'Ward Officer',
      FIELD_WORKER: 'Field Worker'
    };

    const displayName = customName || (existing ? existing.name : email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    const photo = customPhoto || (existing ? existing.avatar : `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`);

    const user = {
      id: existing ? existing.id : `USR-FB-${Date.now()}`,
      name: displayName,
      email: email,
      role: role,
      roleLabel: roleMap[role] || 'Authority Official',
      department: existing ? existing.department : 'Road Maintenance',
      ward: existing ? existing.ward : 'Ward 15',
      status: 'ACTIVE',
      avatar: photo,
      lastActive: 'Just now',
      isFirebaseGoogleAuth: true
    };

    if (!existing) {
      MOCK_USERS.unshift(user);
    }

    setCurrentUser(user);
    return user;
  };

  const signupWithGmail = ({ name, email, role, department, ward, phone, photoURL }) => {
    const roleMap = {
      SUPER_ADMIN: 'Super Admin',
      DEPARTMENT_ADMIN: 'Department Admin',
      WARD_OFFICER: 'Ward Officer',
      FIELD_WORKER: 'Field Worker'
    };

    const newUser = {
      id: `USR-FB-${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      phone: phone || '+91 98765 43210',
      role: role || 'DEPARTMENT_ADMIN',
      roleLabel: roleMap[role] || 'Authority Official',
      department: department || 'Road Maintenance',
      ward: ward || 'Ward 15',
      status: 'ACTIVE',
      avatar: photoURL || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80`,
      lastActive: 'Just now',
      isFirebaseGoogleAuth: true
    };

    MOCK_USERS.unshift(newUser);
    setCurrentUser(newUser);
    return newUser;
  };

  const switchRole = (role) => {
    const matchingUser = MOCK_USERS.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }
  };

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
      loginWithGmail,
      signupWithGmail,
      switchRole
    }),
    [currentUser, loading, login, logout, register]
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
