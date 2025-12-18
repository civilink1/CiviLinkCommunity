/**
 * Services Index
 * 
 * Centralized export for all service modules.
 * GitHub Copilot: Import services from here in your components.
 * 
 * Example usage:
 * import { authService, postsService } from '../services';
 */

import * as authService from './auth.service';
import * as postsService from './posts.service';
import * as commentsService from './comments.service';
import * as notificationsService from './notifications.service';
import * as leadersService from './leaders.service';
import * as aiService from './ai.service';
import * as analyticsService from './analytics.service';
import * as uploadsService from './uploads.service';

export {
  authService,
  postsService,
  commentsService,
  notificationsService,
  leadersService,
  aiService,
  analyticsService,
  uploadsService,
};

// Re-export commonly used functions for convenience
export {
  login,
  register,
  logout,
  getCurrentUser,
  setCurrentUser,
} from './auth.service';

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  endorsePost,
} from './posts.service';

export {
  validatePost,
  moderateContent,
} from './ai.service';

export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './notifications.service';

export {
  getLeadersByCity,
  searchLeaders,
} from './leaders.service';
