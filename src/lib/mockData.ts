// Mock data for the CiviLink application

import { POST_CATEGORIES, POST_STATUSES } from '../config/constants';

export const mockUsers: any[] = [];

export const mockPosts: any[] = [];

export const mockNotifications: any[] = [];

export const mockLeaders: any[] = [];

// Re-export from constants for backward compatibility
export const categories = Array.from(POST_CATEGORIES);
export const statuses = POST_STATUSES.map(s => ({ ...s }));

// Helper functions
export const getStatusColor = (status: string) => {
  const statusObj = POST_STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.color : 'text-gray-600 bg-gray-50';
};

export const getStatusLabel = (status: string) => {
  const statusObj = POST_STATUSES.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};