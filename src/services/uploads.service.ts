/**
 * File Upload Service
 * 
 * Handles image uploads for posts.
 * GitHub Copilot: Replace mock implementations with real file upload logic.
 */

import api from './api.service';
import type { APIResponse } from '../types';
import { MAX_FILE_SIZE, MAX_FILES_PER_POST, ALLOWED_FILE_TYPES } from '../config/constants';

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(files: File[]): { valid: boolean; error?: string } {
  if (files.length > MAX_FILES_PER_POST) {
    return {
      valid: false,
      error: `Maximum ${MAX_FILES_PER_POST} files allowed`,
    };
  }

  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

/**
 * Upload a single image
 * 
 * TODO: Replace with actual file upload implementation
 * Backend endpoint: POST /uploads/image
 * 
 * Your backend should:
 * 1. Receive the file via multipart/form-data
 * 2. Validate the file (type, size, dimensions)
 * 3. Upload to cloud storage (AWS S3, Cloudinary, etc.)
 * 4. Return the public URL
 * 
 * Example backend implementation (Node.js with Express + Multer):
 * ```
 * const multer = require('multer');
 * const upload = multer({ dest: 'uploads/' });
 * 
 * app.post('/uploads/image', upload.single('file'), async (req, res) => {
 *   const file = req.file;
 *   // Upload to S3/Cloudinary
 *   const url = await uploadToCloudStorage(file);
 *   res.json({ url });
 * });
 * ```
 */
export async function uploadImage(file: File): Promise<APIResponse<{ url: string }>> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  // TODO: Replace this mock implementation with actual file upload
  // Example implementation:
  // const formData = new FormData();
  // formData.append('file', file);
  // 
  // const response = await fetch(`${API_BASE_URL}/uploads/image`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${getAuthToken()}`,
  //   },
  //   body: formData,
  // });
  // 
  // const data = await response.json();
  // return { success: true, data: { url: data.url } };

  // MOCK IMPLEMENTATION - Creates a local object URL
  // In production, this would return a URL from your cloud storage
  const mockUrl = URL.createObjectURL(file);
  
  return {
    success: true,
    data: { url: mockUrl },
  };
}

/**
 * Upload multiple images
 * 
 * TODO: Replace with actual batch upload implementation
 * Backend endpoint: POST /uploads/images
 */
export async function uploadImages(files: File[]): Promise<APIResponse<{ urls: string[] }>> {
  // Validate files first
  const validation = validateFiles(files);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  // TODO: Replace this mock implementation
  // Example implementation:
  // const formData = new FormData();
  // files.forEach((file, index) => {
  //   formData.append(`files[${index}]`, file);
  // });
  // 
  // const response = await fetch(`${API_BASE_URL}/uploads/images`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${getAuthToken()}`,
  //   },
  //   body: formData,
  // });
  // 
  // const data = await response.json();
  // return { success: true, data: { urls: data.urls } };

  // MOCK IMPLEMENTATION
  const urls = files.map(file => URL.createObjectURL(file));

  return {
    success: true,
    data: { urls },
  };
}

/**
 * Delete an uploaded image
 * 
 * TODO: Replace with actual deletion logic
 * Backend endpoint: DELETE /uploads/image?url=...
 */
export async function deleteImage(url: string): Promise<APIResponse<void>> {
  // TODO: Replace this mock implementation
  // return api.delete(`/uploads/image?url=${encodeURIComponent(url)}`);

  // MOCK IMPLEMENTATION
  // In production, this would delete the image from cloud storage
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }

  return {
    success: true,
  };
}

// ============================================================================
// IMAGE UTILITIES
// ============================================================================

/**
 * Compress image before upload
 * This can reduce bandwidth and storage costs
 */
export async function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          0.85 // Quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Convert file to base64 (useful for small images or previews)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
