/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and session management.
 * GitHub Copilot: Replace mock implementations with real API calls to your backend.
 */

import api, { setAuthToken, clearAuthToken } from './api.service';
import type { User, AuthCredentials, RegisterData, APIResponse } from '../types';
import { USER_DATA_KEY } from '../config/constants';

// Mock data - TODO: Remove when backend is connected
import { mockUsers } from '../lib/mockData';

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Log in a user with email and password
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /auth/login
 * Expected response: { user: User, token: string }
 */
export async function login(credentials: AuthCredentials): Promise<APIResponse<{ user: User; token: string }>> {
  // TODO: Replace this mock implementation
  // Example implementation:
  // return api.post<{ user: User; token: string }>('/auth/login', credentials);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    const { password, ...userWithoutPassword } = user;
    const token = 'mock-jwt-token-' + Date.now();
    
    setAuthToken(token);
    setCurrentUser(userWithoutPassword as User);
    
    return {
      success: true,
      data: { user: userWithoutPassword as User, token },
    };
  }

  return {
    success: false,
    error: 'Invalid email or password',
  };
}

/**
 * Register a new user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /auth/register
 * Expected response: { user: User, token: string }
 */
export async function register(data: RegisterData): Promise<APIResponse<{ user: User; token: string }>> {
  // TODO: Replace this mock implementation
  // Example implementation:
  // return api.post<{ user: User; token: string }>('/auth/register', data);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const existingUser = mockUsers.find(u => u.email === data.email);
  
  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered',
    };
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: data.email,
    name: data.name,
    role: 'user',
    city: data.city,
    state: data.state,
    address: data.address,
    zipCode: data.zipCode,
    joinDate: new Date().toISOString(),
    contributionScore: 0,
  };

  mockUsers.push({ ...newUser, password: data.password } as any);
  
  const token = 'mock-jwt-token-' + Date.now();
  setAuthToken(token);
  setCurrentUser(newUser);

  return {
    success: true,
    data: { user: newUser, token },
  };
}

/**
 * Log out the current user
 * 
 * TODO: Call backend to invalidate token if needed
 * Backend endpoint: POST /auth/logout
 */
export async function logout(): Promise<void> {
  // TODO: Add API call to invalidate token on backend
  // await api.post('/auth/logout');
  
  clearAuthToken();
  clearCurrentUser();
}

/**
 * Refresh authentication token
 * 
 * TODO: Implement token refresh logic
 * Backend endpoint: POST /auth/refresh
 * Expected response: { token: string }
 */
export async function refreshToken(): Promise<APIResponse<{ token: string }>> {
  // TODO: Replace with actual API call
  // return api.post<{ token: string }>('/auth/refresh');
  
  // MOCK IMPLEMENTATION
  return {
    success: true,
    data: { token: 'mock-refreshed-token-' + Date.now() },
  };
}

/**
 * Get current authenticated user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /auth/me
 * Expected response: User
 */
export async function getCurrentUserFromAPI(): Promise<APIResponse<User>> {
  // TODO: Replace with actual API call
  // return api.get<User>('/auth/me');
  
  // MOCK IMPLEMENTATION
  const user = getCurrentUser();
  if (user) {
    return {
      success: true,
      data: user,
    };
  }
  
  return {
    success: false,
    error: 'Not authenticated',
  };
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

/**
 * Store current user in localStorage
 */
export function setCurrentUser(user: User): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Remove current user from localStorage
 */
export function clearCurrentUser(): void {
  localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Update current user data
 */
export function updateCurrentUser(updates: Partial<User>): void {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
  }
}
