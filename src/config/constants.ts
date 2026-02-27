/**
 * Application Constants – CiviLink Community (HOA Edition)
 *
 * Centralized configuration.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

/** TODO: Replace with your backend API URL */
export const API_BASE_URL = 'http://localhost:3001/api';
export const AI_SERVICE_URL = '/ai';
export const API_TIMEOUT = 30000;

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const AUTH_TOKEN_KEY = 'civilink_auth_token';
export const USER_DATA_KEY = 'civilink_user';
export const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

export const BRAND_COLORS = {
  primary: '#004080',
  accent: '#E31E24',
  background: '#000000',
  backgroundGradient: 'linear-gradient(to bottom, #000000, #1a1a1a)',
};

/**
 * Report categories (HOA context)
 */
export const POST_CATEGORIES = [
  'Maintenance',
  'Landscaping',
  'Amenities',
  'Safety',
  'Noise',
  'Parking',
  'Rules Violation',
  'Other',
] as const;

/**
 * Report status flow:
 * Pending → Under Review → In Progress → Completed
 * Can be rejected or closed at any stage.
 */
export const POST_STATUSES = [
  { value: 'pending', label: 'Pending Review', color: 'text-yellow-600 bg-yellow-50', description: 'Awaiting board review' },
  { value: 'under_review', label: 'Under Review', color: 'text-blue-600 bg-blue-50', description: 'Being reviewed by the board' },
  { value: 'in_progress', label: 'In Progress', color: 'text-purple-600 bg-purple-50', description: 'Actively being addressed' },
  { value: 'completed', label: 'Completed', color: 'text-emerald-600 bg-emerald-50', description: 'Issue has been resolved' },
  { value: 'rejected', label: 'Rejected', color: 'text-red-600 bg-red-50', description: 'Not a valid issue or duplicate' },
  { value: 'closed', label: 'Closed', color: 'text-gray-600 bg-gray-50', description: 'Resolved or no action needed' },
] as const;

export type PostStatus = typeof POST_STATUSES[number]['value'];

export const ENDORSEMENT_THRESHOLD = 50;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FILES_PER_POST = 5;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ============================================================================
// AI CONFIGURATION
// ============================================================================

export const AI_CONFIDENCE_THRESHOLD = 0.85;

export const AI_CONFIG = {
  model: 'gpt-4',
  maxTokens: 1000,
  temperature: 0.7,
};

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

export const TOAST_DURATION = 3000;
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
  // HOA new routes
  COMMUNITY_ONBOARDING: '/community/onboarding',
  COMMUNITY_BILLING: '/community/billing',
  COMMUNITY_INVITE: '/community/invite',
  JOIN: '/join',
  PENDING_APPROVAL: '/pending-approval',
  HOA_DASHBOARD: '/hoa-dashboard',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  enableAIModeration: true,
  enableRealTimeNotifications: false,
  enableImageUpload: true,
  enableComments: true,
  enableEndorsements: true,
  enableAnalytics: true,
};

// ============================================================================
// PLAN TIERS
// ============================================================================

export const PLAN_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    homes: 100,
    price: 29,
    customPricing: false,
    features: [
      'Up to 100 homes',
      'Endorsement-based reporting',
      'AI content moderation',
      'Board dashboard',
      'Status tracking',
      'Email notifications',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    homes: 250,
    price: 59,
    customPricing: false,
    features: [
      'Up to 250 homes',
      'Everything in Starter',
      'Advanced analytics',
      'Duplicate report merging',
      'Resident management dashboard',
      'Custom branding',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    homes: 500,
    price: 99,
    customPricing: false,
    features: [
      'Up to 500 homes',
      'Everything in Standard',
      'Multi-admin access (up to 5)',
      'Data export (CSV)',
      'Priority support',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    homes: 9999,
    price: 0,
    customPricing: true,
    features: [
      '500+ homes',
      'Everything in Premium',
      'Unlimited admins',
      'Dedicated onboarding support',
      'SSO',
    ],
  },
];