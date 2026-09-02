import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medistock_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('medistock_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('medistock_token', data.token);
      localStorage.setItem('medistock_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid credentials. Try admin@medistock.com / admin123' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const res = await AuthService.updateProfile(updatedData);
      const newUser = res.user || { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('medistock_user', JSON.stringify(newUser));
      return { success: true, user: newUser, message: res.message || 'Profile updated successfully' };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medistock_token');
    localStorage.removeItem('medistock_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
