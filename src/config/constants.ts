/**
 * Application Constants
 * 
 * Centralized configuration for the CiviLink application.
 * GitHub Copilot: Update API_BASE_URL when deploying to production.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Base URL for all API requests
 * TODO: Replace with your backend API URL
 * Example: 'https://api.civilink.com/v1'
 */
export const API_BASE_URL = 'http://localhost:3001/api';

/**
 * AI Service API endpoint
 * TODO: Configure this in your backend environment
 */
export const AI_SERVICE_URL = '/ai'; // Proxied through backend for security

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT = 30000;

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * JWT token storage key
 */
export const AUTH_TOKEN_KEY = 'civilink_auth_token';

/**
 * User data storage key
 */
export const USER_DATA_KEY = 'civilink_user';

/**
 * Token refresh interval (15 minutes)
 */
export const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

/**
 * Brand colors matching the design system
 */
export const BRAND_COLORS = {
  primary: '#004080',
  accent: '#E31E24',
  background: '#000000',
  backgroundGradient: 'linear-gradient(to bottom, #000000, #1a1a1a)',
};

/**
 * Post categories available in the system
 */
export const POST_CATEGORIES = [
  'Infrastructure',
  'Transportation',
  'Parks',
  'Public Safety',
  'Education',
  'Health',
  'Other',
] as const;

/**
 * Post statuses with display configuration
 * Status flow: Pending Review → Under Review → In Progress → Completed
 * AI automatically approves posts - city officials move from Under Review to In Progress
 * Can be rejected or closed at any stage
 */
export const POST_STATUSES = [
  { value: 'pending', label: 'Pending Review', color: 'text-yellow-600 bg-yellow-50', description: 'Awaiting city review' },
  { value: 'under_review', label: 'Under Review', color: 'text-blue-600 bg-blue-50', description: 'Being reviewed by city officials' },
  { value: 'in_progress', label: 'In Progress', color: 'text-purple-600 bg-purple-50', description: 'City is actively working on this' },
  { value: 'completed', label: 'Completed', color: 'text-emerald-600 bg-emerald-50', description: 'Issue has been resolved' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600 bg-red-50', description: 'Not a valid issue or duplicate' },
  { value: 'closed', label: 'Closed', color: 'text-gray-600 bg-gray-50', description: 'Resolved or no action needed' },
] as const;

export type PostStatus = typeof POST_STATUSES[number]['value'];

/**
 * Endorsement threshold to send post to officials
 */
export const ENDORSEMENT_THRESHOLD = 50;

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * File upload limits
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES_PER_POST = 5;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ============================================================================
// AI CONFIGURATION
// ============================================================================

/**
 * AI confidence threshold for auto-approval
 * Posts with AI confidence >= this value are auto-approved
 */
export const AI_CONFIDENCE_THRESHOLD = 0.85;

/**
 * AI model configuration
 * TODO: Update these in your backend environment
 */
export const AI_CONFIG = {
  model: 'gpt-4', // or 'claude-3-opus', etc.
  maxTokens: 1000,
  temperature: 0.7,
};

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

/**
 * Toast notification duration in milliseconds
 */
export const TOAST_DURATION = 3000;

/**
 * Notification polling interval (30 seconds)
 * Set to 0 to disable polling (use WebSocket instead)
 */
export const NOTIFICATION_POLL_INTERVAL = 30000;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  post: {
    titleMinLength: 10,
    titleMaxLength: 200,
    descriptionMinLength: 20,
    descriptionMaxLength: 2000,
  },
  comment: {
    minLength: 1,
    maxLength: 500,
  },
  user: {
    nameMinLength: 2,
    nameMaxLength: 100,
    passwordMinLength: 8,
  },
};

// ============================================================================
// ROUTE PATHS
// ============================================================================

export const ROUTES = {
  HOME: '/',
  AUTH_LOGIN: '/auth/login',
  DASHBOARD: '/dashboard',
  POSTS: '/posts',
  CREATE_POST: '/posts/create',
  POST_DETAIL: '/posts/:id',
  NOTIFICATIONS: '/notifications',
  LEADERS: '/leaders',
  PROFILE: '/profile',
  SEARCH: '/search',
  ADMIN: '/admin',
  CITY_GOV: '/city-gov',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Feature flags for conditional functionality
 * TODO: Move these to environment variables or backend configuration
 */
export const FEATURES = {
  enableAIModeration: true,
  enableRealTimeNotifications: false,
  enableImageUpload: true,
  enableComments: true,
  enableEndorsements: true,
  enableAnalytics: true,
};