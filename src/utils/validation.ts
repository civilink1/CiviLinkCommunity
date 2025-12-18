/**
 * Validation Utilities
 * 
 * Helper functions for form validation.
 */

import { VALIDATION } from '../config/constants';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns array of validation errors (empty if valid)
 */
export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < VALIDATION.user.passwordMinLength) {
    errors.push(`Password must be at least ${VALIDATION.user.passwordMinLength} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return errors;
}

/**
 * Validate post title
 */
export function validatePostTitle(title: string): { valid: boolean; error?: string } {
  if (!title.trim()) {
    return { valid: false, error: 'Title is required' };
  }

  if (title.length < VALIDATION.post.titleMinLength) {
    return {
      valid: false,
      error: `Title must be at least ${VALIDATION.post.titleMinLength} characters`,
    };
  }

  if (title.length > VALIDATION.post.titleMaxLength) {
    return {
      valid: false,
      error: `Title must not exceed ${VALIDATION.post.titleMaxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate post description
 */
export function validatePostDescription(description: string): { valid: boolean; error?: string } {
  if (!description.trim()) {
    return { valid: false, error: 'Description is required' };
  }

  if (description.length < VALIDATION.post.descriptionMinLength) {
    return {
      valid: false,
      error: `Description must be at least ${VALIDATION.post.descriptionMinLength} characters`,
    };
  }

  if (description.length > VALIDATION.post.descriptionMaxLength) {
    return {
      valid: false,
      error: `Description must not exceed ${VALIDATION.post.descriptionMaxLength} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validate ZIP code (US format)
 */
export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validate phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+1|1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize HTML input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Check if string contains profanity
 * TODO: Implement more comprehensive profanity filter or use AI
 */
export function containsProfanity(text: string): boolean {
  const profanityList = ['badword1', 'badword2']; // Add actual words
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}
