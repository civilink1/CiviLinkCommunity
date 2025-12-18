/**
 * Leaders Service
 * 
 * Handles local government leaders directory and contact information.
 * GitHub Copilot: Replace mock implementations with real API calls.
 */

import api from './api.service';
import type { Leader, APIResponse } from '../types';

// Mock data - TODO: Remove when backend is connected
import { mockLeaders } from '../lib/mockData';

// ============================================================================
// LEADER OPERATIONS
// ============================================================================

/**
 * Get all leaders for a specific city
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /leaders?city=San%20Francisco
 * Expected response: Leader[]
 */
export async function getLeadersByCity(city: string): Promise<APIResponse<Leader[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Leader[]>(`/leaders?city=${encodeURIComponent(city)}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const leaders = mockLeaders.filter(
    leader => leader.city.toLowerCase() === city.toLowerCase()
  );

  return {
    success: true,
    data: leaders,
  };
}

/**
 * Get a specific leader by ID
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /leaders/:id
 * Expected response: Leader
 */
export async function getLeaderById(id: string): Promise<APIResponse<Leader>> {
  // TODO: Replace this mock implementation
  // return api.get<Leader>(`/leaders/${id}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const leader = mockLeaders.find(l => l.id === id);

  if (leader) {
    return {
      success: true,
      data: leader,
    };
  }

  return {
    success: false,
    error: 'Leader not found',
  };
}

/**
 * Get leaders by department
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /leaders?department=Transportation
 * Expected response: Leader[]
 */
export async function getLeadersByDepartment(department: string): Promise<APIResponse<Leader[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Leader[]>(`/leaders?department=${encodeURIComponent(department)}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const leaders = mockLeaders.filter(
    leader => leader.department.toLowerCase() === department.toLowerCase()
  );

  return {
    success: true,
    data: leaders,
  };
}

/**
 * Search leaders by name or title
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /leaders/search?q=mayor
 * Expected response: Leader[]
 */
export async function searchLeaders(query: string): Promise<APIResponse<Leader[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Leader[]>(`/leaders/search?q=${encodeURIComponent(query)}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const searchQuery = query.toLowerCase();
  const leaders = mockLeaders.filter(
    leader =>
      leader.name.toLowerCase().includes(searchQuery) ||
      leader.title.toLowerCase().includes(searchQuery) ||
      leader.department.toLowerCase().includes(searchQuery)
  );

  return {
    success: true,
    data: leaders,
  };
}

// ============================================================================
// ADMIN OPERATIONS (City Government Portal)
// ============================================================================

/**
 * Create a new leader (admin only)
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /leaders
 * Expected response: Leader
 */
export async function createLeader(leaderData: Omit<Leader, 'id'>): Promise<APIResponse<Leader>> {
  // TODO: Replace this mock implementation
  // return api.post<Leader>('/leaders', leaderData);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const newLeader: Leader = {
    id: Date.now().toString(),
    ...leaderData,
  };

  mockLeaders.push(newLeader);

  return {
    success: true,
    data: newLeader,
  };
}

/**
 * Update a leader (admin only)
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: PATCH /leaders/:id
 * Expected response: Leader
 */
export async function updateLeader(
  id: string,
  updates: Partial<Omit<Leader, 'id'>>
): Promise<APIResponse<Leader>> {
  // TODO: Replace this mock implementation
  // return api.patch<Leader>(`/leaders/${id}`, updates);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const index = mockLeaders.findIndex(l => l.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Leader not found',
    };
  }

  mockLeaders[index] = {
    ...mockLeaders[index],
    ...updates,
  };

  return {
    success: true,
    data: mockLeaders[index],
  };
}

/**
 * Delete a leader (admin only)
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /leaders/:id
 * Expected response: { success: true }
 */
export async function deleteLeader(id: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/leaders/${id}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const index = mockLeaders.findIndex(l => l.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Leader not found',
    };
  }

  mockLeaders.splice(index, 1);

  return {
    success: true,
  };
}
