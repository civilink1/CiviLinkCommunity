/**
 * Notifications Service
 * 
 * Handles user notifications and real-time updates.
 * GitHub Copilot: Replace mock implementations with real API calls.
 */

import api from './api.service';
import type { Notification, APIResponse } from '../types';

// Mock data - TODO: Remove when backend is connected
import { mockNotifications } from '../lib/mockData';

// ============================================================================
// NOTIFICATION CRUD OPERATIONS
// ============================================================================

/**
 * Get all notifications for the current user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /notifications
 * Expected response: Notification[]
 */
export async function getNotifications(userId: string): Promise<APIResponse<Notification[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Notification[]>('/notifications');
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const userNotifications = mockNotifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    success: true,
    data: userNotifications,
  };
}

/**
 * Mark a notification as read
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: PATCH /notifications/:id/read
 * Expected response: Notification
 */
export async function markNotificationAsRead(notificationId: string): Promise<APIResponse<Notification>> {
  // TODO: Replace this mock implementation
  // return api.patch<Notification>(`/notifications/${notificationId}/read`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const notification = mockNotifications.find(n => n.id === notificationId);
  
  if (!notification) {
    return {
      success: false,
      error: 'Notification not found',
    };
  }

  notification.read = true;

  return {
    success: true,
    data: notification,
  };
}

/**
 * Mark all notifications as read for current user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /notifications/mark-all-read
 * Expected response: { success: true }
 */
export async function markAllNotificationsAsRead(userId: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.post('/notifications/mark-all-read');
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  mockNotifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });

  return {
    success: true,
  };
}

/**
 * Delete a notification
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /notifications/:id
 * Expected response: { success: true }
 */
export async function deleteNotification(notificationId: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/notifications/${notificationId}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  
  if (index === -1) {
    return {
      success: false,
      error: 'Notification not found',
    };
  }

  mockNotifications.splice(index, 1);

  return {
    success: true,
  };
}

/**
 * Get unread notification count
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /notifications/unread-count
 * Expected response: { count: number }
 */
export async function getUnreadCount(userId: string): Promise<APIResponse<{ count: number }>> {
  // TODO: Replace this mock implementation
  // return api.get<{ count: number }>('/notifications/unread-count');
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const count = mockNotifications.filter(
    n => n.userId === userId && !n.read
  ).length;

  return {
    success: true,
    data: { count },
  };
}

// ============================================================================
// NOTIFICATION CREATION (Backend will create these)
// ============================================================================

/**
 * Create a notification (usually called by backend)
 * This is here for reference - your backend should create notifications
 * when events occur (post approved, comment added, etc.)
 */
export function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  postId?: string
): Notification {
  return {
    id: Date.now().toString(),
    userId,
    type,
    title,
    message,
    postId,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Add notification to mock data (for development only)
 */
export function addMockNotification(notification: Notification): void {
  mockNotifications.push(notification);
}

// ============================================================================
// REAL-TIME NOTIFICATIONS
// ============================================================================

/**
 * Subscribe to real-time notifications using WebSocket
 * 
 * TODO: Implement WebSocket connection
 * Example implementation:
 * ```
 * const ws = new WebSocket('wss://your-backend.com/ws/notifications');
 * ws.onmessage = (event) => {
 *   const notification = JSON.parse(event.data);
 *   callback(notification);
 * };
 * ```
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): () => void {
  // TODO: Implement WebSocket subscription
  // Return cleanup function
  return () => {
    // TODO: Close WebSocket connection
  };
}
