/**
 * useAuth Hook
 * 
 * Custom hook for authentication state management.
 * GitHub Copilot: This provides a clean interface for auth operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth.service';
import type { User, AuthCredentials, RegisterData } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  /**
   * Log in user
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);

    const response = await authService.login(credentials);

    if (response.success && response.data) {
      setUser(response.data.user);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Login failed');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    const response = await authService.register(data);

    if (response.success && response.data) {
      setUser(response.data.user);
      setIsLoading(false);
      return { success: true };
    } else {
      setError(response.error || 'Registration failed');
      setIsLoading(false);
      return { success: false, error: response.error };
    }
  }, []);

  /**
   * Log out user
   */
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    navigate('/');
  }, [navigate]);

  /**
   * Update user profile
   */
  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      authService.updateCurrentUser(updates);
    }
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };
}
