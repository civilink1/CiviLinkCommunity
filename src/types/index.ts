/**
 * CiviLink Community – Type Definitions
 *
 * HOA / neighbourhood version of CiviLink.
 * All shared TypeScript interfaces live here.
 */

// ============================================================================
// ROLES
// ============================================================================

export type UserRole = 'HOA_ADMIN' | 'HOA_MODERATOR' | 'RESIDENT';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'DENIED';

// ============================================================================
// COMMUNITY (formerly City)
// ============================================================================

export type PlanTier = 'starter' | 'standard' | 'premium' | 'enterprise';

export interface CommunityLeader {
  name: string;
  role: string;        // e.g. "Board President", "Property Manager"
  email: string;
  phone?: string;
}

export interface Announcement {
  id: string;
  communityId: string;
  title: string;
  message: string;
  urgent: boolean;
  createdAt: string;
  authorName: string;
}

export interface Community {
  id: string;
  name: string;
  planTier: PlanTier;
  homeCount: number;
  inviteCode: string;
  requireApproval: boolean;
  commentsEnabled: boolean;
  leadership: CommunityLeader[];
  announcements: Announcement[];
  createdAt: string;
}

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  communityId: string;
  approvalStatus: ApprovalStatus;
  unit?: string;            // lot / unit / address within community
  phone?: string;
  address?: string;
  joinDate: string;
  contributionScore: number;
  avatarUrl?: string;
  bio?: string;
  // legacy fields kept for compat
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  inviteCode: string;
  unit?: string;
}

// ============================================================================
// REPORT (formerly Post) TYPES
// ============================================================================

export type ReportStatus =
  | 'pending'
  | 'under_review'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'closed';

export type PostStatus = ReportStatus;

export type ReportCategory =
  | 'Maintenance'
  | 'Landscaping'
  | 'Amenities'
  | 'Safety'
  | 'Noise'
  | 'Parking'
  | 'Rules Violation'
  | 'Other';

export type PostCategory = ReportCategory;

export interface Report {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  endorsements: number;
  comments: number;
  priority: 'low' | 'medium' | 'high';
  mergedIntoId?: string;
  assignedLeaderId?: string;
  statusHistory?: StatusHistoryItem[];
}

export interface StatusHistoryItem {
  status: string;
  date: string;
  note: string;
}

export type Post = Report;

export interface CreateReportData {
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  images?: string[];
}
export type CreatePostData = CreateReportData;

export interface UpdateReportData {
  title?: string;
  description?: string;
  category?: ReportCategory;
  location?: string;
  status?: ReportStatus;
  priority?: 'low' | 'medium' | 'high';
  assignedLeaderId?: string;
  mergedIntoId?: string;
}
export type UpdatePostData = UpdateReportData;

// ============================================================================
// COMMENT TYPES
// ============================================================================

export interface Comment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
  likes: number;
  // legacy aliases
  postId?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  content?: string;
}

export interface CreateCommentData {
  reportId: string;
  body: string;
  postId?: string;
  content?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | 'report_approved'
  | 'report_rejected'
  | 'report_endorsed'
  | 'comment_added'
  | 'status_changed'
  | 'assigned_to_leader'
  | 'resident_approved'
  | 'resident_denied'
  | 'system'
  // legacy aliases
  | 'post_approved'
  | 'post_rejected'
  | 'post_endorsed'
  | 'status_update'
  | 'endorsement'
  | 'comment';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  reportId?: string;
  postId?: string;
  read: boolean;
  createdAt: string;
  // legacy
  date?: string;
  relatedId?: string | null;
}

export interface MarkNotificationReadData {
  notificationId: string;
}

// ============================================================================
// LEADER TYPES (Board / Property Manager)
// ============================================================================

export interface Leader {
  id: string;
  name: string;
  title: string;
  department: string;
  communityId: string;
  email: string;
  phone: string;
  icon: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
}

// ============================================================================
// AI MODERATION TYPES
// ============================================================================

export interface AIValidationRequest {
  title: string;
  description: string;
  category: ReportCategory;
}

export interface AIValidationResponse {
  isValid: boolean;
  confidence: number;
  suggestedStatus: ReportStatus;
  reasoning: string;
  suggestedCategory?: ReportCategory;
  suggestedPriority?: 'low' | 'medium' | 'high';
}

export interface AIContentModerationRequest {
  content: string;
  type: 'report' | 'comment';
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
  reportId: string;
  userId: string;
  createdAt: string;
  postId?: string;
}

export interface EndorsePostData {
  reportId: string;
  postId?: string;
}

// ============================================================================
// SEARCH & FILTER TYPES
// ============================================================================

export interface SearchFilters {
  query?: string;
  category?: ReportCategory;
  status?: ReportStatus;
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
// HOA DASHBOARD / ANALYTICS TYPES
// ============================================================================

export interface CommunityStats {
  totalReports: number;
  pendingReview: number;
  inProgress: number;
  completed: number;
  rejected: number;
  avgResolutionDays: number;
  residentSatisfaction: number;
  duplicatesMerged: number;
}

export type CityGovStats = CommunityStats;

export interface DashboardStats {
  totalReports: number;
  activeIssues: number;
  resolvedIssues: number;
  contributionScore: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'report_created' | 'report_endorsed' | 'comment_added' | 'status_changed' | 'post_created' | 'post_endorsed';
  title: string;
  timestamp: string;
  reportId?: string;
  postId?: string;
}

export interface CityGovUser {
  id: string;
  cityName: string;
  email: string;
  role: 'city-gov';
  accessLevel: 'read' | 'write' | 'admin';
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}
