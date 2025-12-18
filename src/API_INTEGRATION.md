# API Integration Guide for GitHub Copilot

This document explains how to connect CiviLink to your backend API. The codebase is structured to make backend integration straightforward.

## 🏗️ Architecture Overview

```
/services/          → API service layer (replace mock implementations)
/types/             → TypeScript type definitions
/config/            → Configuration constants
/hooks/             → React hooks for data fetching
/utils/             → Helper utilities
```

## 🔧 Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Key variables:
- `REACT_APP_API_BASE_URL` - Your backend API URL
- Backend should have AI API keys (NEVER in frontend!)

### 2. Replace Mock Implementations

All services in `/services/` have TODO comments marking where to replace mock code:

```typescript
// Current (Mock):
export async function login(credentials: AuthCredentials) {
  // MOCK IMPLEMENTATION - Remove when backend is ready
  const user = mockUsers.find(u => u.email === credentials.email);
  // ...
}

// Replace with:
export async function login(credentials: AuthCredentials) {
  return api.post<{ user: User; token: string }>('/auth/login', credentials);
}
```

### 3. Service Layer Overview

#### Authentication (`/services/auth.service.ts`)
- `login()` - POST /auth/login
- `register()` - POST /auth/register  
- `logout()` - POST /auth/logout
- `getCurrentUserFromAPI()` - GET /auth/me

#### Posts (`/services/posts.service.ts`)
- `createPost()` - POST /posts
- `getPosts()` - GET /posts (with filters & pagination)
- `getPostById()` - GET /posts/:id
- `updatePost()` - PATCH /posts/:id
- `deletePost()` - DELETE /posts/:id
- `endorsePost()` - POST /posts/:id/endorse

#### AI Service (`/services/ai.service.ts`)
⚠️ **SECURITY**: All AI calls MUST go through your backend!

- `validatePost()` - POST /ai/validate-post (backend calls AI API)
- `moderateContent()` - POST /ai/moderate-content
- `categorizePost()` - POST /ai/categorize

#### Notifications (`/services/notifications.service.ts`)
- `getNotifications()` - GET /notifications
- `markNotificationAsRead()` - PATCH /notifications/:id/read
- Real-time support ready for WebSocket

#### File Uploads (`/services/uploads.service.ts`)
- `uploadImage()` - POST /uploads/image (multipart/form-data)
- `uploadImages()` - POST /uploads/images
- Includes client-side validation & compression

## 📡 API Client Configuration

The API client (`/services/api.service.ts`) automatically:
- Adds JWT tokens to requests
- Handles timeouts
- Parses errors
- Provides consistent response format

```typescript
// Example usage in services:
import api from './api.service';

export async function getPosts() {
  return api.get<Post[]>('/posts');
}

export async function createPost(data: CreatePostData) {
  return api.post<Post>('/posts', data);
}
```

## 🔐 Security Best Practices

### ✅ DO:
- Store AI API keys in backend environment variables
- Validate all user input on the backend
- Use JWT tokens for authentication
- Implement rate limiting on your backend
- Sanitize user content before storing

### ❌ DON'T:
- Put API keys in frontend code or .env files committed to git
- Trust client-side validation alone
- Store sensitive data in localStorage
- Call external APIs directly from frontend

## 🤖 AI Integration (Backend)

### Example Backend Implementation (Node.js/Express)

```javascript
// Backend endpoint for AI post validation
app.post('/api/ai/validate-post', authMiddleware, async (req, res) => {
  const { title, description, category } = req.body;
  
  // Call OpenAI (or your chosen AI provider)
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a civic issue validator. Determine if posts are legitimate civic issues or spam.'
    }, {
      role: 'user',
      content: `Analyze this civic issue:
Title: ${title}
Description: ${description}
Category: ${category}

Is this legitimate? Provide a confidence score 0-1 and reasoning.`
    }],
  });

  // Parse AI response and return
  const result = parseAIResponse(completion);
  res.json(result);
});
```

## 📊 Expected API Response Formats

All APIs should return this format:

```typescript
{
  success: boolean;
  data?: T;           // Response data on success
  error?: string;     // Error message on failure
  message?: string;   // Optional additional info
}
```

### Pagination Format:
```typescript
{
  success: true,
  data: {
    data: Post[],         // Array of items
    total: number,        // Total items
    page: number,         // Current page
    limit: number,        // Items per page
    totalPages: number    // Total pages
  }
}
```

## 🔄 Real-Time Features (WebSocket)

To enable real-time notifications:

1. Set up WebSocket server on backend
2. Implement in `/services/notifications.service.ts`:

```typescript
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
): () => void {
  const ws = new WebSocket(`${WS_URL}/notifications`);
  
  ws.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification);
  };
  
  // Return cleanup function
  return () => ws.close();
}
```

3. Update `/config/constants.ts`:
```typescript
export const FEATURES = {
  enableRealTimeNotifications: true,  // Enable this
  // ...
};
```

## 📁 File Upload (Backend)

Example using Multer + AWS S3:

```javascript
const multer = require('multer');
const AWS = require('aws-sdk');

const upload = multer({ storage: multer.memoryStorage() });
const s3 = new AWS.S3();

app.post('/api/uploads/image', authMiddleware, upload.single('file'), async (req, res) => {
  const file = req.file;
  
  // Upload to S3
  const result = await s3.upload({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `posts/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  }).promise();
  
  res.json({ success: true, data: { url: result.Location } });
});
```

## 🎯 Type Safety

All types are defined in `/types/index.ts`. Use them in your backend for consistency:

```typescript
// Frontend and backend can share these types
import type { User, Post, CreatePostData } from './types';
```

## 🧪 Testing Your Integration

1. **Start with authentication**: Test login/register first
2. **Test CRUD operations**: Create, read, update, delete posts
3. **Test AI integration**: Validate post creation with AI
4. **Test file uploads**: Upload images to posts
5. **Test real-time**: WebSocket notifications

## 📝 Migration Checklist

- [ ] Set up backend API server
- [ ] Configure environment variables
- [ ] Implement authentication endpoints
- [ ] Implement posts CRUD endpoints
- [ ] Set up AI service (OpenAI/Claude/etc.)
- [ ] Configure file storage (S3/Cloudinary)
- [ ] Implement notifications system
- [ ] Set up database (PostgreSQL/MongoDB/Supabase)
- [ ] Replace mock implementations in `/services/`
- [ ] Test all features end-to-end
- [ ] Set up error monitoring (Sentry)
- [ ] Deploy backend and frontend

## 💡 GitHub Copilot Tips

When working with Copilot on the backend:

1. **Open relevant service files** - Copilot will understand the contract
2. **Use TODO comments** - Already added throughout the codebase
3. **Reference types** - Import from `/types/index.ts` for suggestions
4. **Example comments**:
   ```typescript
   // Implement endpoint to create a new post with AI validation
   // Implement JWT authentication middleware
   // Set up PostgreSQL connection with post schema
   ```

## 🆘 Common Issues

**Issue**: CORS errors
**Solution**: Configure CORS on your backend to allow your frontend origin

**Issue**: 401 Unauthorized
**Solution**: Check JWT token is being sent in Authorization header

**Issue**: File upload fails
**Solution**: Ensure `Content-Type: multipart/form-data` and backend accepts it

**Issue**: AI calls timeout
**Solution**: Increase API_TIMEOUT or optimize AI prompt length

---

All services are ready for Copilot to help you implement! Just open the relevant files and start coding. 🚀
