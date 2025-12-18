# CiviLink Project Structure

Complete overview of the CiviLink codebase architecture for GitHub Copilot optimization.

## 📁 Directory Structure

```
civilink/
├── /config/                    # Configuration files
│   └── constants.ts           # App constants, API URLs, feature flags
│
├── /types/                     # TypeScript type definitions
│   └── index.ts               # All interfaces and types
│
├── /services/                  # API service layer (Backend integration points)
│   ├── index.ts               # Service exports
│   ├── api.service.ts         # Base API client with auth
│   ├── auth.service.ts        # Authentication (login, register, JWT)
│   ├── posts.service.ts       # Posts CRUD operations
│   ├── comments.service.ts    # Comments on posts
│   ├── notifications.service.ts # User notifications
│   ├── leaders.service.ts     # Government leaders directory
│   ├── ai.service.ts          # AI validation & moderation
│   ├── analytics.service.ts   # Dashboard statistics
│   └── uploads.service.ts     # File upload handling
│
├── /hooks/                     # Custom React hooks
│   ├── index.ts               # Hook exports
│   ├── useAuth.ts             # Authentication hook
│   ├── usePosts.ts            # Posts data management
│   └── useNotifications.ts    # Notifications hook
│
├── /utils/                     # Utility functions
│   ├── index.ts               # Utility exports
│   ├── formatting.ts          # Date, number, text formatting
│   └── validation.ts          # Form validation helpers
│
├── /lib/                       # Libraries and mock data
│   └── mockData.ts            # Mock data (remove when backend is ready)
│
├── /components/                # React components
│   ├── /landing/              # Landing page
│   ├── /auth/                 # Authentication pages
│   ├── /dashboard/            # User dashboard
│   ├── /posts/                # Posts and create post
│   ├── /notifications/        # Notifications page
│   ├── /leaders/              # Local leaders directory
│   ├── /profile/              # User profile
│   ├── /search/               # Search functionality
│   ├── /admin/                # Admin dashboard
│   ├── /city-gov/             # City government portal
│   ├── /layout/               # Layout components
│   ├── /ui/                   # UI component library
│   └── /figma/                # Figma-imported components
│
├── /styles/                    # Global styles
│   └── globals.css            # Tailwind + custom styles
│
├── App.tsx                     # Main application component
├── .env.example               # Environment variables template
├── API_INTEGRATION.md         # API integration guide
└── PROJECT_STRUCTURE.md       # This file
```

## 🎯 Key Concepts

### 1. Service Layer Pattern

All backend communication goes through `/services/`:

```typescript
// ❌ Don't do this in components:
fetch('/api/posts').then(...)

// ✅ Do this instead:
import { postsService } from '../services';
const response = await postsService.getPosts();
```

**Benefits**:
- Single source of truth for API calls
- Easy to swap mock → real backend
- Consistent error handling
- Type safety

### 2. Type-First Development

All types are defined in `/types/index.ts`:

```typescript
import type { User, Post, CreatePostData } from '../types';

// Now you get autocomplete and type checking everywhere
const createPost = async (data: CreatePostData): Promise<Post> => {
  // ...
}
```

### 3. Configuration Management

All constants in `/config/constants.ts`:

```typescript
import { API_BASE_URL, ENDORSEMENT_THRESHOLD } from '../config/constants';
```

Change once, update everywhere.

### 4. Custom Hooks for Data

Use hooks to manage complex state:

```typescript
import { usePosts } from '../hooks';

function PostsList() {
  const { posts, isLoading, error, refresh } = usePosts();
  // Automatic loading states and error handling
}
```

## 🔄 Data Flow

```
Component
    ↓
Custom Hook (optional)
    ↓
Service Layer
    ↓
API Client (api.service.ts)
    ↓
Backend API
```

### Example: Creating a Post

```typescript
// 1. Component calls hook
const { createPost, isCreating } = useCreatePost();

// 2. Hook calls service
const result = await createPost(postData, userId, userName);

// 3. Service calls API client
const response = await postsService.createPost(data, userId, userName);

// 4. API client makes HTTP request
return api.post<Post>('/posts', data);

// 5. Backend receives and processes
// 6. Response flows back up the chain
```

## 🔐 Authentication Flow

```
1. User submits login form
2. AuthPage calls authService.login()
3. authService sends credentials to backend
4. Backend validates and returns JWT token
5. authService stores token in localStorage
6. All future API calls include JWT in headers
7. Backend verifies token for protected routes
```

**Files involved**:
- `/services/auth.service.ts` - Login logic
- `/services/api.service.ts` - Adds JWT to requests
- `/hooks/useAuth.ts` - React state management
- `/components/auth/AuthPage.tsx` - UI

## 🤖 AI Integration Pattern

**IMPORTANT**: AI API keys NEVER go in frontend!

```
Frontend                    Backend                  AI Service
   │                          │                         │
   │  POST /ai/validate-post  │                         │
   │─────────────────────────>│                         │
   │                          │  Call OpenAI API        │
   │                          │────────────────────────>│
   │                          │                         │
   │                          │<────────────────────────│
   │                          │   AI Response           │
   │  Validation Result       │                         │
   │<─────────────────────────│                         │
```

**Implementation**:
- Frontend: `/services/ai.service.ts` (calls backend)
- Backend: Your API route (calls OpenAI/Claude)
- Never expose API keys to frontend

## 📝 Component Organization

### Feature-based Structure

Each feature has its own directory:

```
/components/posts/
  ├── PostsPage.tsx         # Main posts page
  ├── CreatePostPage.tsx    # Create post page
  ├── PostCard.tsx          # Individual post component
  └── PostFilters.tsx       # Filter controls
```

### Component Responsibilities

**Page Components** (`*Page.tsx`):
- Handle routing
- Manage page-level state
- Compose smaller components

**Feature Components**:
- Business logic
- Data fetching
- User interactions

**UI Components** (`/components/ui/`):
- Pure presentational
- No business logic
- Reusable across features

## 🎨 Styling Approach

- **Tailwind CSS** for all styling
- **Custom tokens** in `/styles/globals.css`
- **No inline styles** unless dynamic

**Brand colors**:
- Primary: `#004080` (blue)
- Accent: `#E31E24` (red)
- Use Tailwind classes for everything else

## 🔧 Development Workflow

### Adding a New Feature

1. **Define types** in `/types/index.ts`
2. **Create service** in `/services/` with mock data
3. **Add custom hook** (if needed) in `/hooks/`
4. **Build UI component** in `/components/`
5. **Test with mock data**
6. **Replace mock with real API**

### Example: Adding Comments Feature

```typescript
// 1. Define types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

// 2. Create service
export async function getComments(postId: string) {
  return api.get<Comment[]>(`/posts/${postId}/comments`);
}

// 3. Create hook (optional)
export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  // ... fetch logic
  return { comments, isLoading, addComment };
}

// 4. Use in component
function CommentsList({ postId }: { postId: string }) {
  const { comments, isLoading } = useComments(postId);
  // ... render
}
```

## 🚀 Deployment Checklist

**Frontend**:
- [ ] Update `REACT_APP_API_BASE_URL` in `.env`
- [ ] Remove `/lib/mockData.ts` references
- [ ] Enable production features in `/config/constants.ts`
- [ ] Build: `npm run build`

**Backend**:
- [ ] Set up all environment variables
- [ ] Configure CORS for frontend domain
- [ ] Set up database
- [ ] Configure file storage (S3/Cloudinary)
- [ ] Add AI API keys
- [ ] Implement rate limiting
- [ ] Set up logging/monitoring

## 📚 Important Files

### Must Read First
1. `/API_INTEGRATION.md` - Backend integration guide
2. `/types/index.ts` - Understand data structures
3. `/config/constants.ts` - Configuration options
4. `/services/api.service.ts` - How API calls work

### When Adding Features
1. `/services/*.service.ts` - API patterns
2. `/hooks/*.ts` - State management patterns
3. `/components/*/` - UI patterns

## 🎓 GitHub Copilot Tips

### Best Practices for Copilot

1. **Open related files** - Copilot uses context from open tabs
2. **Use descriptive comments**:
   ```typescript
   // Implement function to validate user email and send verification code
   function sendVerificationEmail(email: string) {
     // Copilot will suggest implementation
   }
   ```

3. **Reference existing patterns**:
   ```typescript
   // Similar to postsService.getPosts() but for comments
   export async function getComments(postId: string) {
     // Copilot knows the pattern
   }
   ```

4. **Use types for better suggestions**:
   ```typescript
   // With types, Copilot knows exactly what to suggest
   const user: User = {
     // Copilot autocompletes all User fields
   }
   ```

### Common Copilot Prompts

```typescript
// Implement this function to call the backend API for user registration

// Add error handling for network failures and timeout

// Create a React hook to fetch and cache user profile data

// Implement pagination for the posts list

// Add WebSocket connection for real-time notifications
```

## 🔍 Finding Things

**"Where do I..."**

- Add a new API endpoint? → Create in `/services/`
- Define a new data type? → Add to `/types/index.ts`
- Create a new page? → Add to `/components/[feature]/`
- Add form validation? → Use/extend `/utils/validation.ts`
- Format dates? → Use `/utils/formatting.ts`
- Configure app settings? → Update `/config/constants.ts`
- Store auth token? → See `/services/api.service.ts`

## 📖 Further Reading

- [API Integration Guide](./API_INTEGRATION.md) - Detailed backend setup
- [.env.example](./.env.example) - All environment variables
- TypeScript Handbook for type definitions
- React documentation for hooks patterns

---

**Ready to build!** This codebase is optimized for GitHub Copilot to help you implement the backend. Open the files and start coding! 🚀
