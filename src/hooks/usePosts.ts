/**
 * usePosts Hook
 * 
 * Custom hook for managing posts data.
 * GitHub Copilot: This handles all post operations with loading states.
 */

import { useState, useEffect, useCallback } from 'react';
import * as postsService from '../services/posts.service';
import type { Post, CreatePostData, SearchFilters, PaginationParams } from '../types';

export function usePosts(initialFilters?: SearchFilters, pagination?: PaginationParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /**
   * Fetch posts with current filters
   */
  const fetchPosts = useCallback(async (filters?: SearchFilters, paginationParams?: PaginationParams) => {
    setIsLoading(true);
    setError(null);

    const response = await postsService.getPosts(filters, paginationParams);

    if (response.success && response.data) {
      setPosts(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch posts');
    }

    setIsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts(initialFilters, pagination);
  }, []);

  /**
   * Refresh posts (refetch with same filters)
   */
  const refresh = useCallback(() => {
    fetchPosts(initialFilters, pagination);
  }, [fetchPosts, initialFilters, pagination]);

  return {
    posts,
    isLoading,
    error,
    totalPages,
    total,
    fetchPosts,
    refresh,
  };
}

/**
 * Hook for managing a single post
 */
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);

      const response = await postsService.getPostById(postId);

      if (response.success && response.data) {
        setPost(response.data);
      } else {
        setError(response.error || 'Failed to fetch post');
      }

      setIsLoading(false);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return {
    post,
    isLoading,
    error,
  };
}

/**
 * Hook for creating posts
 */
export function useCreatePost() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(async (data: CreatePostData, userId: string, userName: string) => {
    setIsCreating(true);
    setError(null);

    const response = await postsService.createPost(data, userId, userName);

    setIsCreating(false);

    if (response.success && response.data) {
      return { success: true, post: response.data };
    } else {
      setError(response.error || 'Failed to create post');
      return { success: false, error: response.error };
    }
  }, []);

  return {
    createPost,
    isCreating,
    error,
  };
}
