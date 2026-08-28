import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS } from '../data/mockUsers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to Super Admin for easy viewing, but easily toggleable
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);

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

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role) => {
    const matchingUser = MOCK_USERS.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role: currentUser?.role || null,
      loginAs,
      logout,
      switchRole,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
