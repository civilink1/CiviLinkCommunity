/**
 * Comments Service
 * 
 * Handles comments on civic issue posts.
 * GitHub Copilot: Replace mock implementations with real API calls.
 */

import api from './api.service';
import type { Comment, CreateCommentData, APIResponse } from '../types';

// Mock storage
const mockComments: Comment[] = [];

// ============================================================================
// COMMENT OPERATIONS
// ============================================================================

/**
 * Get all comments for a specific post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /posts/:postId/comments
 * Expected response: Comment[]
 */
export async function getCommentsByPostId(postId: string): Promise<APIResponse<Comment[]>> {
  // TODO: Replace this mock implementation
  // return api.get<Comment[]>(`/posts/${postId}/comments`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const comments = mockComments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    success: true,
    data: comments,
  };
}

/**
 * Create a new comment
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /posts/:postId/comments
 * Expected response: Comment
 */
export async function createComment(
  data: CreateCommentData,
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<APIResponse<Comment>> {
  // TODO: Replace this mock implementation
  // return api.post<Comment>(`/posts/${data.postId}/comments`, {
  //   content: data.content,
  // });
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const newComment: Comment = {
    id: Date.now().toString(),
    postId: data.postId,
    userId,
    userName,
    userAvatar,
    content: data.content,
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  mockComments.push(newComment);

  return {
    success: true,
    data: newComment,
  };
}

/**
 * Update a comment
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: PATCH /comments/:id
 * Expected response: Comment
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<APIResponse<Comment>> {
  // TODO: Replace this mock implementation
  // return api.patch<Comment>(`/comments/${commentId}`, { content });
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const comment = mockComments.find(c => c.id === commentId);

  if (!comment) {
    return {
      success: false,
      error: 'Comment not found',
    };
  }

  comment.content = content;

  return {
    success: true,
    data: comment,
  };
}

/**
 * Delete a comment
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /comments/:id
 * Expected response: { success: true }
 */
export async function deleteComment(commentId: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/comments/${commentId}`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const index = mockComments.findIndex(c => c.id === commentId);

  if (index === -1) {
    return {
      success: false,
      error: 'Comment not found',
    };
  }

  mockComments.splice(index, 1);

  return {
    success: true,
  };
}

/**
 * Like a comment
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: POST /comments/:id/like
 * Expected response: { likes: number }
 */
export async function likeComment(commentId: string): Promise<APIResponse<{ likes: number }>> {
  // TODO: Replace this mock implementation
  // return api.post(`/comments/${commentId}/like`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const comment = mockComments.find(c => c.id === commentId);

  if (!comment) {
    return {
      success: false,
      error: 'Comment not found',
    };
  }

  comment.likes += 1;

  return {
    success: true,
    data: { likes: comment.likes },
  };
}

/**
 * Unlike a comment
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: DELETE /comments/:id/like
 * Expected response: { likes: number }
 */
export async function unlikeComment(commentId: string): Promise<APIResponse<{ likes: number }>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/comments/${commentId}/like`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const comment = mockComments.find(c => c.id === commentId);

  if (!comment) {
    return {
      success: false,
      error: 'Comment not found',
    };
  }

  comment.likes = Math.max(0, comment.likes - 1);

  return {
    success: true,
    data: { likes: comment.likes },
  };
}

/**
 * Get comment count for a post
 * 
 * TODO: Replace with actual API call
 * Backend endpoint: GET /posts/:postId/comments/count
 * Expected response: { count: number }
 */
export async function getCommentCount(postId: string): Promise<APIResponse<{ count: number }>> {
  // TODO: Replace this mock implementation
  // return api.get<{ count: number }>(`/posts/${postId}/comments/count`);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const count = mockComments.filter(c => c.postId === postId).length;

  return {
    success: true,
    data: { count },
  };
}
