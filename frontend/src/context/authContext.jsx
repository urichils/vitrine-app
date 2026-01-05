// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Check if token exists
          if (!parsedUser.token) {
            console.error('No token found in stored user');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return;
          }

          // Optional: Check token expiration
          const tokenPayload = parseJwt(parsedUser.token);
          if (tokenPayload && tokenPayload.exp) {
            const now = Date.now() / 1000;
            if (tokenPayload.exp < now) {
              console.error('Token has expired');
              localStorage.removeItem('user');
              setUser(null);
              setLoading(false);
              return;
            }
          }

          console.log('User loaded from localStorage:', parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Helper function to parse JWT without verification (client-side only for exp check)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const login = (userData) => {
    console.log('Login called with:', userData);
    
    if (!userData.token) {
      console.error('Login failed: No token provided');
      return false;
    }

    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('User logged in successfully:', userData);
      return true;
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logout called');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user && !!user.token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;