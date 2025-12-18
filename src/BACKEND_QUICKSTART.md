# Backend Quickstart Guide

**Get your CiviLink backend running in minutes with GitHub Copilot**

## 🎯 Overview

This frontend is **ready for backend integration**. All API endpoints are defined, types are documented, and integration points are clearly marked with TODO comments.

## ⚡ Quick Setup (Recommended Stack)

### Option 1: Node.js + Express + PostgreSQL + OpenAI

```bash
# 1. Create backend folder
mkdir civilink-backend && cd civilink-backend
npm init -y

# 2. Install dependencies
npm install express cors dotenv jsonwebtoken bcrypt pg
npm install @types/express @types/cors @types/jsonwebtoken @types/bcrypt --save-dev
npm install openai  # or anthropic for Claude

# 3. Install dev dependencies
npm install -D typescript ts-node nodemon @types/node
npx tsc --init
```

### Option 2: Node.js + Express + MongoDB + OpenAI

```bash
npm install express cors dotenv jsonwebtoken bcrypt mongoose
npm install openai
```

### Option 3: Python + FastAPI + PostgreSQL + OpenAI

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib python-multipart openai
```

## 📋 Required Endpoints

Copy this checklist - implement these endpoints to match the frontend:

### Authentication
- [ ] `POST /api/auth/register` - Register new user
- [ ] `POST /api/auth/login` - Login user (return JWT)
- [ ] `POST /api/auth/logout` - Logout user
- [ ] `GET /api/auth/me` - Get current user

### Posts
- [ ] `POST /api/posts` - Create post
- [ ] `GET /api/posts` - Get all posts (with filters & pagination)
- [ ] `GET /api/posts/:id` - Get single post
- [ ] `PATCH /api/posts/:id` - Update post
- [ ] `DELETE /api/posts/:id` - Delete post
- [ ] `POST /api/posts/:id/endorse` - Endorse post
- [ ] `DELETE /api/posts/:id/endorse` - Remove endorsement

### AI Services (CRITICAL: Keep API keys server-side!)
- [ ] `POST /api/ai/validate-post` - Validate post with AI
- [ ] `POST /api/ai/moderate-content` - Moderate content
- [ ] `POST /api/ai/categorize` - Auto-categorize post

### Notifications
- [ ] `GET /api/notifications` - Get user notifications
- [ ] `PATCH /api/notifications/:id/read` - Mark as read
- [ ] `POST /api/notifications/mark-all-read` - Mark all as read
- [ ] `DELETE /api/notifications/:id` - Delete notification

### Leaders
- [ ] `GET /api/leaders?city=...` - Get leaders by city
- [ ] `GET /api/leaders/:id` - Get single leader
- [ ] `GET /api/leaders/search?q=...` - Search leaders

### File Upload
- [ ] `POST /api/uploads/image` - Upload single image
- [ ] `POST /api/uploads/images` - Upload multiple images

### Comments (Optional but recommended)
- [ ] `GET /api/posts/:postId/comments` - Get comments
- [ ] `POST /api/posts/:postId/comments` - Create comment
- [ ] `PATCH /api/comments/:id` - Update comment
- [ ] `DELETE /api/comments/:id` - Delete comment

## 🚀 Implementation Example (Node.js/Express)

### 1. Basic Server Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/leaders', require('./routes/leaders'));
app.use('/api/uploads', require('./routes/uploads'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Database Schema (PostgreSQL)

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  city VARCHAR(255),
  state VARCHAR(50),
  address TEXT,
  zip_code VARCHAR(20),
  contribution_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'under-review',
  priority VARCHAR(50) DEFAULT 'medium',
  endorsements INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  post_id INTEGER REFERENCES posts(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- endorsements table (many-to-many)
CREATE TABLE endorsements (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- leaders table
CREATE TABLE leaders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  department VARCHAR(255),
  city VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Authentication Route Example

```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, city, state, address, zipCode } = req.body;
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, city, state, address, zip_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, city, state, address, zip_code, contribution_score`,
      [email, passwordHash, name, city, state, address, zipCode]
    );
    
    const user = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  // Implement login logic
  // GitHub Copilot will help you here!
});

module.exports = router;
```

### 4. AI Validation Example (CRITICAL FOR CIVILINK)

```javascript
// routes/ai.js
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // NEVER expose this to frontend!
});

router.post('/validate-post', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: `You are a civic issue validator for CiviLink. 
                  Analyze posts to determine if they are legitimate civic issues or spam.
                  Respond with JSON: {
                    "isValid": boolean,
                    "confidence": 0-1,
                    "suggestedStatus": "approved"|"under-review"|"rejected",
                    "reasoning": string,
                    "suggestedPriority": "low"|"medium"|"high"
                  }`
      }, {
        role: 'user',
        content: `Title: ${title}\nDescription: ${description}\nCategory: ${category}`
      }],
      temperature: 0.3,
    });
    
    const result = JSON.parse(completion.choices[0].message.content);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### 5. Posts Route with Pagination

```javascript
// routes/posts.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get posts with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      query 
    } = req.query;
    
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;
    
    if (category) {
      whereConditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }
    
    if (status) {
      whereConditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    
    if (query) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${query}%`);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) FROM posts ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    const offset = (page - 1) * limit;
    params.push(limit, offset);
    
    const result = await db.query(
      `SELECT p.*, u.name as user_name 
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );
    
    res.json({
      success: true,
      data: {
        data: result.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create post (with AI validation)
router.post('/', authMiddleware, async (req, res) => {
  // GitHub Copilot will help implement this!
  // Remember to call AI validation before saving
});

module.exports = router;
```

### 6. Auth Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No auth token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};
```

## 🔐 Environment Variables

Create `.env` file:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/civilink

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# OpenAI (or choose Anthropic/Google)
OPENAI_API_KEY=sk-...

# File Upload (AWS S3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=civilink-uploads
AWS_REGION=us-east-1

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Testing Your Backend

```bash
# Install testing dependencies
npm install -D jest supertest

# Create tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User',
        city: 'San Francisco',
        state: 'CA'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

## 📝 Copilot Prompts for Backend

Open your backend files and use these prompts:

```javascript
// Implement function to create a new post with AI validation before saving

// Add middleware to verify JWT token and attach user to request

// Create database query to get all posts with filters and pagination

// Implement file upload to AWS S3 with validation

// Add WebSocket server for real-time notifications

// Create cron job to send digests of highly endorsed posts to government leaders
```

## 🎓 Next Steps

1. **Start with auth** - Get login/register working first
2. **Add posts CRUD** - Core functionality
3. **Integrate AI** - This is what makes CiviLink special!
4. **Add file upload** - For post images
5. **Implement notifications** - User engagement
6. **Real-time features** - WebSocket for live updates

## 🆘 Common Issues & Solutions

**CORS errors**: Add your frontend URL to CORS whitelist
**JWT errors**: Make sure JWT_SECRET is set in .env
**Database errors**: Check connection string and credentials
**AI timeouts**: Increase timeout, optimize prompts
**File upload fails**: Check S3 credentials and bucket permissions

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://jwt.io/)

---

**Your frontend is waiting!** Start with authentication, then add features one by one. GitHub Copilot will help you implement everything. 🚀
