/**
 * AI Service
 * 
 * Handles AI-powered content validation and moderation.
 * GitHub Copilot: This should call your BACKEND AI endpoint, NOT directly call AI APIs.
 * 
 * SECURITY WARNING: Never put AI API keys in frontend code!
 * All AI calls must go through your backend to keep API keys secure.
 */

import api from './api.service';
import type {
  AIValidationRequest,
  AIValidationResponse,
  AIContentModerationRequest,
  AIContentModerationResponse,
  APIResponse,
} from '../types';
import { AI_CONFIDENCE_THRESHOLD } from '../config/constants';

// ============================================================================
// AI VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a post using AI to detect spam and categorize content
 * 
 * TODO: Replace with actual backend API call
 * Backend endpoint: POST /ai/validate-post
 * 
 * Your backend should:
 * 1. Receive the post data
 * 2. Call your AI API (OpenAI, Claude, etc.) with your API key
 * 3. Parse the AI response
 * 4. Return the validation result
 * 
 * Example backend implementation (Node.js):
 * ```
 * app.post('/ai/validate-post', async (req, res) => {
 *   const { title, description, category } = req.body;
 *   
 *   const prompt = `Analyze this civic issue report:
 *   Title: ${title}
 *   Description: ${description}
 *   Category: ${category}
 *   
 *   Is this a legitimate civic issue or spam? Provide confidence score.`;
 *   
 *   const aiResponse = await openai.chat.completions.create({
 *     model: 'gpt-4',
 *     messages: [{ role: 'user', content: prompt }],
 *   });
 *   
 *   // Parse AI response and return
 *   res.json(validationResult);
 * });
 * ```
 */
export async function validatePost(data: AIValidationRequest): Promise<APIResponse<AIValidationResponse>> {
  // TODO: Replace this mock implementation with actual backend API call
  // Example implementation:
  // return api.post<AIValidationResponse>('/ai/validate-post', data);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  // This simulates AI validation logic
  const spamKeywords = ['free money', 'click here', 'buy now', 'limited time'];
  const hasSpam = spamKeywords.some(keyword => 
    data.title.toLowerCase().includes(keyword) || 
    data.description.toLowerCase().includes(keyword)
  );

  // Simulate AI confidence score (0-1)
  const confidence = hasSpam ? 0.3 : 0.9;
  const isValid = confidence >= AI_CONFIDENCE_THRESHOLD;

  // Determine status based on AI confidence
  let suggestedStatus: 'under-review' | 'approved' | 'rejected';
  if (confidence >= AI_CONFIDENCE_THRESHOLD) {
    suggestedStatus = 'approved';
  } else if (confidence >= 0.5) {
    suggestedStatus = 'under-review';
  } else {
    suggestedStatus = 'rejected';
  }

  // Simulate priority detection
  const urgencyWords = ['urgent', 'emergency', 'dangerous', 'immediate'];
  const hasUrgency = urgencyWords.some(word =>
    data.title.toLowerCase().includes(word) ||
    data.description.toLowerCase().includes(word)
  );

  return {
    success: true,
    data: {
      isValid,
      confidence,
      suggestedStatus,
      reasoning: isValid
        ? 'Content appears to be a legitimate civic issue report.'
        : 'Content may contain spam or inappropriate content. Manual review recommended.',
      suggestedCategory: data.category,
      suggestedPriority: hasUrgency ? 'high' : 'medium',
    },
  };
}

/**
 * Moderate content (posts, comments) using AI
 * 
 * TODO: Replace with actual backend API call
 * Backend endpoint: POST /ai/moderate-content
 * 
 * Your backend should check for:
 * - Profanity
 * - Hate speech
 * - Spam
 * - Inappropriate content
 */
export async function moderateContent(data: AIContentModerationRequest): Promise<APIResponse<AIContentModerationResponse>> {
  // TODO: Replace this mock implementation with actual backend API call
  // return api.post<AIContentModerationResponse>('/ai/moderate-content', data);
  
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const inappropriateWords = ['spam', 'scam', 'offensive'];
  const flags: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';

  inappropriateWords.forEach(word => {
    if (data.content.toLowerCase().includes(word)) {
      flags.push(word);
      severity = 'medium';
    }
  });

  const isAppropriate = flags.length === 0;
  const suggestedAction = isAppropriate ? 'approve' : flags.length > 2 ? 'reject' : 'review';

  return {
    success: true,
    data: {
      isAppropriate,
      flags,
      severity,
      suggestedAction,
    },
  };
}

/**
 * Generate AI suggestions for improving a post
 * 
 * TODO: Implement backend API call
 * Backend endpoint: POST /ai/suggest-improvements
 */
export async function suggestPostImprovements(
  title: string,
  description: string
): Promise<APIResponse<{ suggestions: string[] }>> {
  // TODO: Implement with backend API
  // return api.post('/ai/suggest-improvements', { title, description });
  
  // MOCK IMPLEMENTATION
  const suggestions = [
    'Add specific location details for faster response',
    'Include photos if possible to help officials assess the issue',
    'Mention if this is a recurring problem',
  ];

  return {
    success: true,
    data: { suggestions },
  };
}

/**
 * Auto-categorize a post based on its content
 * 
 * TODO: Implement backend API call
 * Backend endpoint: POST /ai/categorize
 */
export async function categorizePost(
  title: string,
  description: string
): Promise<APIResponse<{ category: string; confidence: number }>> {
  // TODO: Implement with backend API
  // return api.post('/ai/categorize', { title, description });
  
  // MOCK IMPLEMENTATION
  const categories = ['Infrastructure', 'Transportation', 'Parks', 'Public Safety', 'Education', 'Health'];
  
  // Simple keyword-based categorization
  const content = (title + ' ' + description).toLowerCase();
  let category = 'Infrastructure';
  
  if (content.includes('road') || content.includes('traffic') || content.includes('bus')) {
    category = 'Transportation';
  } else if (content.includes('park') || content.includes('tree') || content.includes('garden')) {
    category = 'Parks';
  } else if (content.includes('police') || content.includes('safety') || content.includes('crime')) {
    category = 'Public Safety';
  } else if (content.includes('school') || content.includes('education')) {
    category = 'Education';
  } else if (content.includes('health') || content.includes('hospital') || content.includes('medical')) {
    category = 'Health';
  }

  return {
    success: true,
    data: {
      category,
      confidence: 0.85,
    },
  };
}

// ============================================================================
// AI HELPER FUNCTIONS
// ============================================================================

/**
 * Check if AI validation should auto-approve a post
 */
export function shouldAutoApprove(validationResult: AIValidationResponse): boolean {
  return validationResult.confidence >= AI_CONFIDENCE_THRESHOLD && validationResult.isValid;
}

/**
 * Check if AI moderation requires manual review
 */
export function requiresManualReview(moderationResult: AIContentModerationResponse): boolean {
  return moderationResult.suggestedAction === 'review' || moderationResult.severity === 'high';
}
