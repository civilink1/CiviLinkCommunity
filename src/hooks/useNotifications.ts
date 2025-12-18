/**
 * useNotifications Hook
 * 
 * Custom hook for managing notifications.
 * GitHub Copilot: This handles notifications with polling or WebSocket support.
 */

import { useState, useEffect, useCallback } from 'react';
import * as notificationsService from '../services/notifications.service';
import type { Notification } from '../types';
import { NOTIFICATION_POLL_INTERVAL } from '../config/constants';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    const response = await notificationsService.getNotifications(userId);

    if (response.success && response.data) {
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch notifications');
    }

    setIsLoading(false);
  }, [userId]);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    const response = await notificationsService.markNotificationAsRead(notificationId);

    if (response.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    const response = await notificationsService.markAllNotificationsAsRead(userId);

    if (response.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }, [userId]);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    const response = await notificationsService.deleteNotification(notificationId);

    if (response.success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up polling if enabled
  useEffect(() => {
    if (NOTIFICATION_POLL_INTERVAL > 0) {
      const interval = setInterval(fetchNotifications, NOTIFICATION_POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications]);

  // TODO: Set up WebSocket connection for real-time notifications
  // useEffect(() => {
  //   const cleanup = notificationsService.subscribeToNotifications(
  //     userId,
  //     (notification) => {
  //       setNotifications(prev => [notification, ...prev]);
  //       setUnreadCount(prev => prev + 1);
  //     }
  //   );
  //   return cleanup;
  // }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications,
  };
}
