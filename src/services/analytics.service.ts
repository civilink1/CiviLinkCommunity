/**
 * Analytics Service
 * 
 * Handles dashboard statistics and analytics data.
 * GitHub Copilot: Replace mock implementations with real API calls.
 */

import api from './api.service';
import type { DashboardStats, CityGovStats, APIResponse } from '../types';
import { mockPosts } from '../lib/mockData';

// ============================================================================
// USER ANALYTICS
// ============================================================================

/**
 * Get dashboard statistics for a user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /analytics/dashboard
 * Expected response: DashboardStats
 */
export async function getDashboardStats(userId: string): Promise<APIResponse<DashboardStats>> {
  // TODO: Replace this mock implementation
  // return api.get<DashboardStats>('/analytics/dashboard');
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const userPosts = mockPosts.filter(p => p.userId === userId);
  const activePosts = userPosts.filter(p => p.status === 'approved');
  const resolvedPosts = userPosts.filter(p => p.status === 'rejected'); // In real app, would have 'resolved' status

  const stats: DashboardStats = {
    totalPosts: userPosts.length,
    activeIssues: activePosts.length,
    resolvedIssues: resolvedPosts.length,
    contributionScore: userPosts.reduce((sum, post) => sum + post.endorsements, 0),
    recentActivity: userPosts.slice(0, 5).map(post => ({
      id: post.id,
      type: 'post_created',
      title: post.title,
      timestamp: post.createdAt,
      postId: post.id,
    })),
  };

  return {
    success: true,
    data: stats,
  };
}

// ============================================================================
// CITY GOVERNMENT ANALYTICS
// ============================================================================

/**
 * Get analytics for city government dashboard
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /analytics/city-gov?city=San%20Francisco
 * Expected response: CityGovStats
 */
export async function getCityGovStats(cityName: string): Promise<APIResponse<CityGovStats>> {
  // TODO: Replace this mock implementation
  // return api.get<CityGovStats>(`/analytics/city-gov?city=${encodeURIComponent(cityName)}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const cityPosts = mockPosts; // In real app, would filter by city
  const pendingPosts = cityPosts.filter(p => p.status === 'under-review');
  const approvedPosts = cityPosts.filter(p => p.status === 'approved');
  const rejectedPosts = cityPosts.filter(p => p.status === 'rejected');

  const stats: CityGovStats = {
    totalPosts: cityPosts.length,
    pendingReview: pendingPosts.length,
    approved: approvedPosts.length,
    rejected: rejectedPosts.length,
    avgResponseTime: 2.5, // hours
    citizenSatisfaction: 4.2, // out of 5
  };

  return {
    success: true,
    data: stats,
  };
}

// ============================================================================
// ADMIN ANALYTICS
// ============================================================================

/**
 * Get overall platform analytics (admin only)
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /analytics/admin
 */
export async function getAdminStats(): Promise<APIResponse<any>> {
  // TODO: Replace this mock implementation
  // return api.get('/analytics/admin');
  
  // MOCK IMPLEMENTATION
  return {
    success: true,
    data: {
      totalUsers: 1250,
      totalPosts: mockPosts.length,
      postsThisMonth: Math.floor(mockPosts.length * 0.3),
      avgEndorsements: mockPosts.reduce((sum, p) => sum + p.endorsements, 0) / mockPosts.length || 0,
      topCategories: [
        { category: 'Infrastructure', count: 45 },
        { category: 'Transportation', count: 38 },
        { category: 'Parks', count: 22 },
      ],
    },
  };
}

// ============================================================================
// TREND ANALYTICS
// ============================================================================

/**
 * Get trending issues by category
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /analytics/trends?period=week
 */
export async function getTrendingIssues(period: 'day' | 'week' | 'month' = 'week'): Promise<APIResponse<any>> {
  // TODO: Replace this mock implementation
  // return api.get(`/analytics/trends?period=${period}`);
  
  // MOCK IMPLEMENTATION
  return {
    success: true,
    data: {
      trending: mockPosts.slice(0, 10).map(post => ({
        id: post.id,
        title: post.title,
        category: post.category,
        endorsements: post.endorsements,
        trend: 'up',
      })),
    },
  };
}

/**
 * Get engagement metrics over time
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /analytics/engagement?days=30
 */
export async function getEngagementMetrics(days: number = 30): Promise<APIResponse<any>> {
  // TODO: Replace this mock implementation
  // return api.get(`/analytics/engagement?days=${days}`);
  
  // MOCK IMPLEMENTATION
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return date.toISOString().split('T')[0];
  });

  return {
    success: true,
    data: {
      dates,
      posts: dates.map(() => Math.floor(Math.random() * 10)),
      endorsements: dates.map(() => Math.floor(Math.random() * 50)),
      comments: dates.map(() => Math.floor(Math.random() * 30)),
    },
  };
}
