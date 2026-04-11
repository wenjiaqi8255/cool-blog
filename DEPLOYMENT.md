# Deployment Guide

Cool Blog can be deployed to multiple platforms. Choose the one that best fits your needs.

## 🚀 Quick Comparison

| Platform | Best For | Cost | Ease of Setup | Performance |
|----------|----------|------|--------------|-------------|
| **Cloudflare Pages** | Global CDN, Free tier | Free | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Zeabur** | Chinese users, Aliyun | Low cost | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Vercel** | Next.js/Astro apps | Free tier | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🌐 Cloudflare Pages Deployment

### Prerequisites

- Cloudflare account (free)
- GitHub account
- Neon database (free tier available)

### Setup Steps

#### 1. Prepare Your Repository

✅ Already done - your project is configured for Cloudflare Pages.

#### 2. Connect to Cloudflare Pages

**Option A: Via Cloudflare Dashboard**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub and select `cool-blog` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
   - **Branch**: `master`
6. Click **Save and Deploy**

**Option B: Via Wrangler CLI**

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy
```

#### 3. Configure Environment Variables

In Cloudflare Dashboard → **Pages** → **cool-blog** → **Settings** → **Environment variables**:

```bash
# Required
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional (for your personal deployment)
PUBLIC_IS_PERSONAL_SITE=true
PUBLIC_SITE_URL=https://your-domain.com

# Optional (for features)
RESEND_API_KEY=re_xxxxx
MCP_API_KEY=ckb_xxxxx
GITHUB_TOKEN=ghp_xxxxx
```

#### 4. Automatic Deployments

- **Push to `master`** → Production deployment
- **Pull requests** → Preview deployments
- **Every commit** → Automatic rebuild

#### 5. Custom Domain (Optional)

1. Go to **Pages** → **cool-blog** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `blog.yourdomain.com`)
4. Follow DNS configuration instructions

**DNS Configuration:**

If your domain is on Cloudflare:
- Add a CNAME record pointing to `cool-blog.pages.dev`

If your domain is elsewhere:
- Add a CNAME record: `blog → cool-blog.pages.dev`

---

## 🇨🇳 Zeabur Deployment (Alibaba Cloud)

### Prerequisites

- Zeabur account (https://zeabur.com)
- GitHub account
- Neon database

### Why Zeabur?

✅ **Great for Chinese users**
- Fast deployment to Chinese regions
- Native Alibaba Cloud integration
- Simple pricing model
- Excellent Chinese documentation

### Setup Steps

#### 1. Create Zeabur Account

1. Visit [https://zeabur.com](https://zeabur.com)
2. Sign up with GitHub account
3. Select region (recommend: Hong Kong or Singapore for Chinese users)

#### 2. Create New Service

1. Click **"Create New Service"**
2. Select **GitHub** → Select `cool-blog` repository
3. Configure service:
   - **Service Name**: `cool-blog` (or your choice)
   - **Region**: Choose closest to your users
     - Hong Kong (香港)
     - Singapore (新加坡)
     - Tokyo (东京)
4. Click **"Create"**

#### 3. Configure Build Settings

Zeabur auto-detects Astro projects, but verify settings:

```yaml
# Service Configuration (auto-detected)
Build Command: npm run build
Output Directory: dist
Start Command: node server/entry.mjs  # Auto-detected

# Environment Variables (click "Settings" → "Environment Variables")
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
PORT=3000  # Auto-set by Zeabur
NODE_ENV=production

# Optional: For your personal branding
PUBLIC_IS_PERSONAL_SITE=true
PUBLIC_SITE_URL=https://your-domain.com
```

#### 4. Deploy

**Automatic Deployment:**
```bash
# Push to master branch
git push origin master

# Zeabur automatically detects and deploys
```

**Manual Deployment:**
1. Go to Zeabur dashboard
2. Click **"Deploy"** button
3. Watch real-time build logs

#### 5. Domain Configuration

**Option A: Use Zeabur Subdomain**
- Your site will be available at: `https://your-service.zeabur.app`

**Option B: Custom Domain**

1. Go to **Service** → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `blog.wenjiaqi.top`)
4. Configure DNS:
   ```
   Type: CNAME
   Name: blog
   Value: your-service.zeabur.app
   TTL: 600
   ```

5. Wait for SSL certificate (automatic, ~1-2 minutes)

#### 6. Alibaba Cloud Integration

**If you have Alibaba Cloud servers:**

1. **Region Selection**
   - Zeabur supports deploying to Alibaba Cloud regions
   - Available: Hong Kong, Singapore, etc.

2. **Database Options**
   - **Recommended**: Keep using Neon (works great globally)
   - **Alternative**: Use Alibaba Cloud ApsaraDB
     ```bash
     # Update DATABASE_URL format
     DATABASE_URL=postgresql://user:password@rm-xxxx.rds.aliyuncs.com:3306/dbname
     ```

3. **CDN Integration**
   - Zeabur automatically uses Alibaba Cloud CDN
   - Static assets cached globally
   - Fast access in China

---

## 🔧 Troubleshooting

### Cloudflare Pages Issues

#### Build Failed: "Cannot find module"

**Solution:**
```bash
# Clear build cache
rm -rf .astro dist node_modules
npm install
npm run build
```

#### Build Failed: "Worker threw exception"

**Cause**: Using Node.js APIs not available in Cloudflare Workers

**Solution**: 
- Check for `fs`, `path`, `process` usage
- Replace with Cloudflare-compatible alternatives
- Use `import { env } from 'cloudflare:workers'`

#### Environment Variables Not Working

**Solution:**
1. Check variables are set in Cloudflare Dashboard
2. Make sure you're using `import.meta.env.VAR_NAME`
3. Trigger new deployment after adding variables

### Zeabur Issues

#### Build Failed: "Module not found"

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "fix: update dependencies"
git push
```

#### Runtime Error: "EADDRINUSE"

**Cause**: Port conflict

**Solution**: Zeabur automatically sets `PORT` environment variable. Make sure your code uses it:

```typescript
// astro.config.mjs
server: {
  port: Number(process.env.PORT) || 4321  // ✅ Use env PORT
  // port: 4321  // ❌ Hardcoded port
}
```

#### Database Connection Failed

**Solution:**
1. Verify `DATABASE_URL` is set in Zeabur dashboard
2. Check database is accessible from Zeabur region
3. Ensure SSL mode is enabled: `?sslmode=require`

---

## 🎯 Platform Comparison

### Cloudflare Pages

**Pros:**
- ✅ Free tier available
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Preview deployments

**Cons:**
- ❌ Build time limits (free tier)
- ❌ Limited to Cloudflare regions
- ❌ Cold starts on free tier

**Best For:**
- Global audience
- Static + SSR sites
- High traffic needs

### Zeabur

**Pros:**
- ✅ Fast in China
- ✅ Alibaba Cloud integration
- ✅ Simple pricing
- ✅ Good documentation (Chinese)
- ✅ No cold starts

**Cons:**
- ❌ Paid service (but affordable)
- ❌ Fewer regions than Cloudflare
- ❌ Newer platform

**Best For:**
- Chinese users
- Asian markets
- Alibaba Cloud ecosystem

---

## 📋 Pre-Deployment Checklist

### Before Deploying to Any Platform

- [ ] Update `PUBLIC_SITE_URL` environment variable
- [ ] Set `DATABASE_URL` to production database
- [ ] Configure branding (set `PUBLIC_IS_PERSONAL_SITE=true` if needed)
- [ ] Test build locally: `npm run build`
- [ ] Run tests: `npm test`
- [ ] Check environment variables are set
- [ ] Verify database connection
- [ ] Set up custom domain (optional)

### Platform-Specific

**Cloudflare Pages:**
- [ ] Connected GitHub repository
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (optional)

**Zeabur:**
- [ ] Connected GitHub repository
- [ ] Region selected
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] Database accessible from Zeabur region

---

## 🚦 Deployment Workflow

### Development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run dev
npm test

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push to trigger deployment
git push origin feature/new-feature

# 6. Create PR on GitHub
#    - Preview deployment created automatically
#    - Test preview URL
#    - Merge to master when ready
```

### Production

```bash
# 1. Merge to master
git checkout master
git merge feature/new-feature

# 2. Push to trigger production deployment
git push origin master

# 3. Automatic deployment
#    - Cloudflare Pages: https://cool-blog.pages.dev
#    - Zeabur: https://your-service.zeabur.app
```

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guides](https://docs.astro.build/en/guides/deploy/)
- [Zeabur Documentation](https://zeabur.com/docs)
- [Neon Database](https://neon.tech/docs)

---

**Need help?** Check [SECURITY.md](SECURITY.md) for vulnerability reporting or open an issue on GitHub.
