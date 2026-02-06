# Deployment Guide: Railway (Backend) + Netlify (Frontend)

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before deploying, ensure you have:
- [Railway Account](https://railway.app) (free tier available)
- [Netlify Account](https://netlify.com) (free tier available)
- GitHub account with your code pushed to a repository
- Node.js 18+ installed locally
- Git installed

---

## Backend Deployment (Railway)

### Step 1: Prepare Backend Code

The backend is in the `api/` folder. Ensure you have:

```typescript
// api/server.ts - Main entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
```

### Step 2: Create Railway Account & Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "Start a New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access your GitHub

### Step 3: Set Up Railway Project

1. **Create a new project:**
   - Click "Create a new project"
   - Select your repository from the list
   - Choose the branch to deploy (usually `main`)

2. **Configure the build command:**
   - Go to Project Settings → Build & Deploy
   - Set build command: `npm install` (or `bun install`)
   - Set start command: `node api/server.mjs`

3. **Add Environment Variables:**
   - Go to Variables tab
   - Add all required variables:

```env
PORT=3001
CLIENT_URL=https://your-netlify-domain.netlify.app
NODE_ENV=production

# Database (if using)
DATABASE_URL=postgresql://...

# API Keys
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Google Sheets (if using)
GOOGLE_SHEETS_API_KEY=your-api-key
GOOGLE_SHEETS_ID=your-sheet-id

# Email (if using SendGrid, Resend, etc.)
SENDGRID_API_KEY=your-key
```

### Step 4: Deploy Backend

1. Railway auto-deploys on push to your branch
2. Check deployment status in the Railway dashboard
3. Get your backend URL:
   - Go to Project → Service (your-backend-service)
   - Copy the Railway-provided URL (format: `https://your-service-production.up.railway.app`)
   - This is your `BACKEND_URL`

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://your-service-production.up.railway.app/health

# Test API endpoint
curl -X POST https://your-service-production.up.railway.app/api/consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "interest": "Web Development"
  }'
```

---

## Frontend Deployment (Netlify)

### Step 1: Build Frontend Locally

```bash
# Install dependencies
npm install
# or
bun install

# Build the project
npm run build
# or
bun run build

# This creates a 'dist' folder with production-ready files
```

### Step 2: Create Netlify Account & Project

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Authorize Netlify to access your GitHub

### Step 3: Configure Netlify Deployment

1. **Select your repository:**
   - Choose your GitHub repo
   - Select the branch (usually `main`)

2. **Configure build settings:**
   - **Build command:** `npm run build` (or `bun run build`)
   - **Publish directory:** `dist`
   - Click "Deploy site"

### Step 4: Set Environment Variables

1. Go to Site settings → Build & Deploy → Environment
2. Add these variables:

```env
VITE_API_URL=https://your-service-production.up.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** Environment variables for Vite must start with `VITE_`

### Step 5: Update Frontend Config

Update your frontend to use the API URL:

```typescript
// src/services/consultationService.ts or similar
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const submitConsultation = async (data) => {
  const response = await fetch(`${API_URL}/api/consultation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

### Step 6: Redeploy Frontend

1. After setting environment variables, Netlify auto-deploys
2. Check deployment status in Netlify dashboard
3. Your site is live at: `https://your-site-name.netlify.app`

---

## Environment Variables

### Backend Environment Variables (.env)

```env
# Server
PORT=3001
NODE_ENV=production
CLIENT_URL=https://your-netlify-site.netlify.app

# Database (if using PostgreSQL/Supabase)
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Sheets Integration
GOOGLE_SHEETS_API_KEY=AIza...
GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMREBvApAFkro5gstsqUZDiJ04OwQ8

# Email Service (choose one)
SENDGRID_API_KEY=SG.abc123...
# OR
RESEND_API_KEY=re_abc123...

# Other APIs
STRIPE_API_KEY=sk_live_...
OPENAI_API_KEY=sk-...
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=https://your-service-production.up.railway.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** Vite strips environment variables that don't start with `VITE_`

---

## Deployment Workflows

### Option 1: Deploy Both (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy v1.0"
git push origin main

# 2. Railway auto-deploys backend
# 3. Netlify auto-deploys frontend
# 4. Both are live!
```

### Option 2: Deploy Frontend Only

```bash
# 1. Update frontend code
# 2. Push to GitHub
git push origin main

# 3. Netlify auto-deploys
# 4. Backend remains unchanged on Railway
```

### Option 3: Manual Deployment

**If auto-deploy is disabled:**

**Railway Backend:**
```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway up
```

**Netlify Frontend:**
```bash
# Build locally
npm run build

# Deploy via CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## Update Production URLs

### In Your Vite Config

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/api": {
        target: mode === 'production' 
          ? "https://your-railway-backend.up.railway.app"
          : "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
}));
```

### Or Use Environment Variables

```typescript
// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## Troubleshooting

### Backend Issues

**Issue: "502 Bad Gateway" on Railway**
```
Solution:
1. Check Railway logs: Project → Service → Logs
2. Verify environment variables are set
3. Ensure start command is correct: node api/server.mjs
4. Check PORT is set to process.env.PORT || 3001
```

**Issue: CORS errors in browser**
```
Solution:
1. Update CLIENT_URL on Railway to match Netlify domain
2. Restart Railway deployment
3. Verify cors() config in api/server.ts:
   cors({
     origin: process.env.CLIENT_URL,
     credentials: true,
   })
```

**Issue: Environment variables not loading**
```
Solution:
1. Verify .env file exists in api/ folder (not committed)
2. Check Railway Variables tab has all required vars
3. Restart the service after adding variables
```

### Frontend Issues

**Issue: "Cannot find module" errors during build**
```
Solution:
1. Ensure dependencies are installed: npm install
2. Check tsconfig.json paths are correct
3. Verify all imports use correct paths
```

**Issue: API calls return 404 or CORS errors**
```
Solution:
1. Check VITE_API_URL matches Railway backend URL
2. Verify Network tab in browser DevTools
3. Test API directly: curl https://your-railway-backend.up.railway.app/health
```

**Issue: Build succeeds but site shows blank page**
```
Solution:
1. Check browser console for errors (F12 → Console)
2. Ensure index.html references correct entry point
3. Verify public/ folder is set correctly in vite.config.ts
4. Check main.tsx imports are correct
```

### Deployment Issues

**Issue: "Permission denied" on Railway**
```
Solution:
1. Verify GitHub account is authorized in Railway settings
2. Check repository is public or Railway has access
3. Regenerate GitHub personal access token if needed
```

**Issue: Build fails on Netlify**
```
Solution:
1. Check Netlify build logs: Site settings → Build & deploy
2. Verify build command matches your setup
3. Ensure Node.js version is compatible (18+)
4. Check for missing environment variables
```

---

## Post-Deployment Checklist

- [ ] Backend URL obtained from Railway
- [ ] Frontend environment variables updated with backend URL
- [ ] Health check passes: `curl https://your-backend/health`
- [ ] API endpoints respond correctly
- [ ] Netlify shows "Published" status
- [ ] Frontend loads without console errors
- [ ] API calls work from frontend
- [ ] CORS is working (no CORS errors)
- [ ] Environment variables are secure (no API keys in frontend)
- [ ] Database migrations run (if applicable)
- [ ] Email notifications work (if implemented)
- [ ] Analytics/monitoring set up (if needed)

---

## Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes)
- [Express CORS Guide](https://expressjs.com/en/resources/middleware/cors.html)

---

## Quick Command Reference

```bash
# Local Development
npm install          # Install dependencies
npm run dev          # Start dev server (frontend + proxy to backend)
npm run server       # Start backend (in another terminal)

# Production Build
npm run build        # Build frontend for production

# Deployment
git push origin main # Trigger auto-deploy on Railway & Netlify

# Testing
curl https://your-backend/health                    # Test backend health
curl https://your-frontend.netlify.app              # Test frontend
```

---

**Last Updated:** January 27, 2026  
**Version:** 1.0
