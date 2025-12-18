/**
 * Posts Service
 * 
 * Handles all post-related API operations.
 * GitHub Copilot: Replace mock implementations with real API calls to your backend.
 */

import api from './api.service';
import type {
  Post,
  CreatePostData,
  UpdatePostData,
  SearchFilters,
  PaginationParams,
  PaginatedResponse,
  APIResponse,
} from '../types';

// Mock data - TODO: Remove when backend is connected
import { mockPosts } from '../lib/mockData';

// ============================================================================
// POST CRUD OPERATIONS
// ============================================================================

/**
 * Create a new post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /posts
 * Expected response: Post
 */
export async function createPost(data: CreatePostData, userId: string, userName: string): Promise<APIResponse<Post>> {
  // TODO: Replace this mock implementation
  // Example implementation:
  // return api.post<Post>('/posts', data);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const newPost: Post = {
    id: Date.now().toString(),
    userId,
    userName,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    status: 'approved', // Will be set by AI validation
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: data.images || [],
    endorsements: 0,
    comments: 0,
    priority: 'medium',
  };

  mockPosts.push(newPost);

  return {
    success: true,
    data: newPost,
  };
}

/**
 * Get all posts with optional filters and pagination
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /posts?page=1&limit=10&category=Infrastructure&status=approved
 * Expected response: PaginatedResponse<Post>
 */
export async function getPosts(
  filters?: SearchFilters,
  pagination?: PaginationParams
): Promise<APIResponse<PaginatedResponse<Post>>> {
  // TODO: Replace this mock implementation
  // const params = new URLSearchParams();
  // if (pagination) {
  //   params.append('page', pagination.page.toString());
  //   params.append('limit', pagination.limit.toString());
  // }
  // if (filters?.category) params.append('category', filters.category);
  // if (filters?.status) params.append('status', filters.status);
  // return api.get<PaginatedResponse<Post>>(`/posts?${params.toString()}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  let filteredPosts = [...mockPosts];

  // Apply filters
  if (filters) {
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredPosts = filteredPosts.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.description.toLowerCase().includes(query)
      );
    }
    if (filters.category) {
      filteredPosts = filteredPosts.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      filteredPosts = filteredPosts.filter(p => p.status === filters.status);
    }
    if (filters.location) {
      filteredPosts = filteredPosts.filter(
        p => p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
  }

  // Sort by most recent
  filteredPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Apply pagination
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      data: paginatedPosts,
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit),
    },
  };
}

/**
 * Get a single post by ID
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /posts/:id
 * Expected response: Post
 */
export async function getPostById(id: string): Promise<APIResponse<Post>> {
  // TODO: Replace this mock implementation
  // return api.get<Post>(`/posts/${id}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const post = mockPosts.find(p => p.id === id);
  
  if (post) {
    return {
      success: true,
      data: post,
    };
  }

  return {
    success: false,
    error: 'Post not found',
  };
}

/**
 * Update a post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: PATCH /posts/:id
 * Expected response: Post
 */
export async function updatePost(id: string, data: UpdatePostData): Promise<APIResponse<Post>> {
  // TODO: Replace this mock implementation
  // return api.patch<Post>(`/posts/${id}`, data);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const postIndex = mockPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return {
      success: false,
      error: 'Post not found',
    };
  }

  mockPosts[postIndex] = {
    ...mockPosts[postIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: mockPosts[postIndex],
  };
}

/**
 * Delete a post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /posts/:id
 * Expected response: { success: true }
 */
export async function deletePost(id: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/posts/${id}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const postIndex = mockPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return {
      success: false,
      error: 'Post not found',
    };
  }

  mockPosts.splice(postIndex, 1);

  return {
    success: true,
  };
}

// ============================================================================
// POST INTERACTIONS
// ============================================================================

/**
 * Endorse a post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /posts/:id/endorse
 * Expected response: { endorsements: number }
 */
export async function endorsePost(postId: string): Promise<APIResponse<{ endorsements: number }>> {
  // TODO: Replace this mock implementation
  // return api.post(`/posts/${postId}/endorse`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const post = mockPosts.find(p => p.id === postId);
  
  if (!post) {
    return {
      success: false,
      error: 'Post not found',
    };
  }

  post.endorsements += 1;

  return {
    success: true,
    data: { endorsements: post.endorsements },
  };
}

/**
 * Remove endorsement from a post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /posts/:id/endorse
 * Expected response: { endorsements: number }
 */
export async function unendorsePost(postId: string): Promise<APIResponse<{ endorsements: number }>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/posts/${postId}/endorse`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const post = mockPosts.find(p => p.id === postId);
  
  if (!post) {
    return {
      success: false,
      error: 'Post not found',
    };
  }

  post.endorsements = Math.max(0, post.endorsements - 1);

  return {
    success: true,
    data: { endorsements: post.endorsements },
  };
}

/**
 * Get posts by user
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /users/:userId/posts
 * Expected response: Post[]
 */
export async function getPostsByUser(userId: string): Promise<APIResponse<Post[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Post[]>(`/users/${userId}/posts`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const userPosts = mockPosts.filter(p => p.userId === userId);
  
  return {
    success: true,
    data: userPosts,
  };
}

/**
 * Get trending posts (most endorsed in last 7 days)
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /posts/trending
 * Expected response: Post[]
 */
export async function getTrendingPosts(limit: number = 10): Promise<APIResponse<Post[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Post[]>(`/posts/trending?limit=${limit}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const trending = [...mockPosts]
    .sort((a, b) => b.endorsements - a.endorsements)
    .slice(0, limit);
  
  return {
    success: true,
    data: trending,
  };
}
