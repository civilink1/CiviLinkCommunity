/**
 * CiviLink Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * GitHub Copilot: Use these types when implementing backend API calls.
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  city: string;
  state: string;
  address: string;
  zipCode: string;
  joinDate: string;
  contributionScore: number;
  avatarUrl?: string;
  bio?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  city: string;
  state: string;
  address: string;
  zipCode: string;
}

// ============================================================================
// POST TYPES
// ============================================================================

export type PostStatus = 'under-review' | 'approved' | 'rejected';

export type PostCategory = 
  | 'Infrastructure'
  | 'Transportation'
  | 'Parks'
  | 'Public Safety'
  | 'Education'
  | 'Health';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  category: PostCategory;
  location: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  endorsements: number;
  comments: number;
  priority: 'low' | 'medium' | 'high';
  assignedLeaderId?: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  category: PostCategory;
  location: string;
  images?: string[];
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  category?: PostCategory;
  location?: string;
  status?: PostStatus;
  priority?: 'low' | 'medium' | 'high';
  assignedLeaderId?: string;
}

// ============================================================================
// COMMENT TYPES
// ============================================================================

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CreateCommentData {
  postId: string;
  content: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 
  | 'post_approved'
  | 'post_rejected'
  | 'post_endorsed'
  | 'comment_added'
  | 'status_changed'
  | 'assigned_to_leader';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  postId?: string;
  read: boolean;
  createdAt: string;
}

export interface MarkNotificationReadData {
  notificationId: string;
}

// ============================================================================
// LEADER TYPES
// ============================================================================

export interface Leader {
  id: string;
  name: string;
  title: string;
  department: string;
  city: string;
  email: string;
  phone: string;
  icon: string;
  avatarUrl?: string;
  bio?: string;
}

// ============================================================================
// AI MODERATION TYPES
// ============================================================================

export interface AIValidationRequest {
  title: string;
  description: string;
  category: PostCategory;
}

export interface AIValidationResponse {
  isValid: boolean;
  confidence: number;
  suggestedStatus: PostStatus;
  reasoning: string;
  suggestedCategory?: PostCategory;
  suggestedPriority?: 'low' | 'medium' | 'high';
}

export interface AIContentModerationRequest {
  content: string;
  type: 'post' | 'comment';
}

export interface AIContentModerationResponse {
  isAppropriate: boolean;
  flags: string[];
  severity: 'low' | 'medium' | 'high';
  suggestedAction: 'approve' | 'review' | 'reject';
}

// ============================================================================
// ENDORSEMENT TYPES
// ============================================================================

export interface Endorsement {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface EndorsePostData {
  postId: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchFilters {
  query?: string;
  category?: PostCategory;
  status?: PostStatus;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// CITY GOVERNMENT TYPES
// ============================================================================

export interface CityGovUser {
  id: string;
  cityName: string;
  email: string;
  role: 'city-gov';
  accessLevel: 'read' | 'write' | 'admin';
}

export interface CityGovStats {
  totalPosts: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  avgResponseTime: number;
  citizenSatisfaction: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DashboardStats {
  totalPosts: number;
  activeIssues: number;
  resolvedIssues: number;
  contributionScore: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'post_created' | 'post_endorsed' | 'comment_added' | 'status_changed';
  title: string;
  timestamp: string;
  postId?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}
