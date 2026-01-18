# CiviLink Backend Setup - Supabase + Groq AI

## Overview
This guide shows you how to set up the backend for CiviLink using Supabase Edge Functions and Groq AI.

## Prerequisites
- Supabase account (free tier works!)
- Groq API key (get free at https://console.groq.com)
- Supabase CLI installed: `npm install -g supabase`

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project details:
   - Name: `civilink-backend`
   - Database Password: (save this!)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait ~2 minutes for project to initialize

---

## Step 2: Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   ```

3. Create `.env` file in your frontend project:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

---

## Step 3: Get Groq API Key

1. Go to https://console.groq.com
2. Sign up (free tier: 30 requests/minute!)
3. Create API Key
4. Copy the key (starts with `gsk_...`)

---

## Step 4: Add Groq API Key to Supabase

In your terminal:

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Add Groq API key as secret
supabase secrets set GROQ_API_KEY=gsk_your_api_key_here
```

---

## Step 5: Create Edge Functions

### Initialize Supabase in your project

```bash
cd your-project-folder
supabase init
```

### Create the Edge Functions

I'll provide templates for each function. Create these files:

**File structure:**
```
supabase/
  functions/
    verify-post/
      index.ts
    forecast-trends/
      index.ts
    analyze-budget/
      index.ts
    predict-completion/
      index.ts
    generate-report/
      index.ts
    categorize-post/
      index.ts
```

---

## Step 6: Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy verify-post
supabase functions deploy forecast-trends
supabase functions deploy analyze-budget
supabase functions deploy predict-completion
supabase functions deploy generate-report
supabase functions deploy categorize-post
```

---

## Edge Function Templates

### 1. verify-post/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  try {
    const { title, description, category, location } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a civic issue verification AI. Analyze posts to ensure they are appropriate civic issues.'
          },
          {
            role: 'user',
            content: `Analyze this civic issue:
Title: ${title}
Description: ${description}
Category: ${category || 'Not specified'}
Location: ${location || 'Not specified'}

Check if it's:
1. Appropriate (no spam, harassment, inappropriate content)
2. Civic-related (genuine community issue)
3. Suggest the best category

Return ONLY valid JSON: { "isValid": boolean, "reason": string, "suggestedCategory": string, "confidence": number }`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 2. forecast-trends/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  try {
    const { cityName, posts, dateRange } = await req.json()

    // Aggregate data by category
    const categoryData = posts.reduce((acc: any, post: any) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a civic data analyst. Predict future civic issue trends based on historical data.'
          },
          {
            role: 'user',
            content: `Predict next week's civic issue volume for ${cityName}.

Current week data by category:
${JSON.stringify(categoryData, null, 2)}

Date range: ${dateRange.start} to ${dateRange.end}

Consider:
- Seasonal patterns (winter = more infrastructure issues)
- Current trends
- Typical civic issue patterns

Return ONLY valid JSON array:
[
  {
    "category": "Infrastructure",
    "currentWeek": number,
    "nextWeek": number,
    "confidence": number (0-100),
    "reason": "Brief explanation"
  }
]

Include all categories: Infrastructure, Transportation, Parks & Recreation, Safety, Environment, Housing, Commerce, Health`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const trends = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify({ trends }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 3. analyze-budget/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  try {
    const { cityName, issues, highPriorityCount } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a municipal budget analyst. Estimate costs for resolving civic issues.'
          },
          {
            role: 'user',
            content: `Estimate budget impact for ${cityName} civic issues.

Total issues: ${issues.length}
High priority issues (100+ endorsements): ${highPriorityCount}

Issues by category:
${JSON.stringify(issues.map((i: any) => ({ category: i.category, endorsements: i.endorsements })), null, 2)}

Estimate:
- Total cost (realistic municipal costs)
- Cost breakdown by category
- Average cost per issue
- Timeframe to complete

Return ONLY valid JSON:
{
  "totalCost": "$XXX,XXX",
  "averageCostPerIssue": "$X,XXX",
  "estimatedTimeframe": "X-X weeks",
  "breakdown": [
    { "category": "Infrastructure", "cost": "$XXX,XXX", "issues": number }
  ]
}`
          }
        ],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 4. predict-completion/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  try {
    const { postId, category, status, endorsements, historicalData } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a municipal operations analyst. Predict completion times for civic issues.'
          },
          {
            role: 'user',
            content: `Predict completion time for this civic issue:

Category: ${category}
Status: ${status}
Community Endorsements: ${endorsements}

Historical completion times for similar issues:
${JSON.stringify(historicalData, null, 2)}

Estimate days to completion and key factors affecting timeline.

Return ONLY valid JSON:
{
  "estimatedDays": number,
  "confidence": number (0-100),
  "factors": [
    { "label": "Factor name", "value": "Description" }
  ]
}`
          }
        ],
        temperature: 0.4,
        max_tokens: 800,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 5. generate-report/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

serve(async (req) => {
  try {
    const { cityName, dateRange, posts, includeForecasts } = await req.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a civic analytics expert. Generate comprehensive weekly reports for city officials.'
          },
          {
            role: 'user',
            content: `Generate a weekly civic issues report for ${cityName}.

Period: ${dateRange.start} to ${dateRange.end}
Total Issues: ${posts.length}

Issues summary:
${JSON.stringify(posts.map((p: any) => ({ 
  category: p.category, 
  status: p.status, 
  endorsements: p.endorsements 
})), null, 2)}

Include:
1. Executive summary
2. Key trends and insights
3. Actionable recommendations for city officials

Return ONLY valid JSON:
{
  "executiveSummary": "Brief overview",
  "keyInsights": ["Insight 1", "Insight 2", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", ...]
}`
          }
        ],
        temperature: 0.6,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify({
      success: true,
      report: result,
      message: 'Report generated successfully'
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

---

## Step 7: Test Your Functions

Test in Supabase Dashboard:
1. Go to **Edge Functions** tab
2. Click on a function
3. Click "Invoke function"
4. Enter test JSON
5. See response!

---

## Step 8: Update Frontend

Your frontend is already set up! Just:
1. Add `.env` file with Supabase credentials
2. Uncomment the API calls in `/services/ai.service.ts`
3. Start using AI features!

---

## Pricing

**Groq AI (Free Tier):**
- 30 requests/minute
- Unlimited tokens
- Perfect for development!

**Supabase (Free Tier):**
- 500,000 Edge Function invocations/month
- More than enough for CiviLink!

---

## Next Steps

1. **Database Integration**: Add Supabase database for storing posts, users
2. **Authentication**: Use Supabase Auth for user login
3. **Rate Limiting**: Add rate limits to prevent abuse
4. **Monitoring**: Use Supabase logs to monitor function usage

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Groq Docs: https://console.groq.com/docs
- CiviLink already optimized for GitHub Copilot - just ask Copilot for help!
