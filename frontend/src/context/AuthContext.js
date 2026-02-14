import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await authAPI.getProfile();
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.signup(userData);
      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await authAPI.logout(refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};