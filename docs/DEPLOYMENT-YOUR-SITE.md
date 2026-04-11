# Deploy Your Personal Site

This guide explains how to deploy your personal instance of Cool Blog while keeping the open-source repository public.

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Public GitHub Repository                        │
│           github.com/your-username/cool-blog                 │
│                                                               │
│  - All source code (open source)                             │
│  - Documentation                                             │
│  - Example configurations                                    │
│  - CI/CD workflows                                           │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ Auto-deploy on push
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Pages Deployment                     │
│            your-personal-domain.com                          │
│                                                               │
│  - Your private environment variables                        │
│  - Your personal branding                                   │
│  - Your database and services                                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Setup

### Step 1: Prepare Your Environment

```bash
# Navigate to your project
cd /Users/wenjiaqi/Downloads/cool-blog

# Create your private configuration (gitignored)
cat > .env.production << 'EOF'
# Your private configuration
DATABASE_URL=your_production_neon_url
RESEND_API_KEY=your_resend_key
MCP_API_KEY=your_mcp_key
GITHUB_TOKEN=your_github_token
PUBLIC_SITE_URL=https://your-domain.com
EOF

# Use this for local development
cp .env.production .env.local
```

### Step 2: Configure Branding

**Option A: Automatic (Recommended)**

The system automatically detects your domain and applies your branding:

- Your branding appears when `PUBLIC_SITE_URL` contains your domain
- Template branding appears for all other domains

**Option B: Force Template Branding**

If you want to use template branding even on your domain:

```bash
# Add to .env.local or Cloudflare environment variables
PUBLIC_USE_TEMPLATE_BRANDING=true
```

**Option C: Custom Branding**

Edit `src/config/branding.ts` to add your own branding:

```typescript
const customBranding: BrandConfig = {
  siteName: 'Your Name',
  siteTitle: 'Your Name | YOUR TAGLINE',
  // ... customize all fields
};
```

### Step 3: Deploy to Cloudflare Pages

#### First Time Setup

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy
```

Your site will be available at: `https://cool-blog.pages.dev`

#### Configure Custom Domain

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **cool-blog** → **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `blog.yourdomain.com`)
5. Follow DNS configuration instructions

### Step 4: Set Environment Variables

1. In Cloudflare Dashboard, go to **Pages** → **cool-blog** → **Settings** → **Environment variables**
2. Add the following variables:

```bash
# Required
DATABASE_URL=your_production_neon_url

# Optional
RESEND_API_KEY=your_resend_key
MCP_API_KEY=your_mcp_key
GITHUB_TOKEN=your_github_token
PUBLIC_SITE_URL=https://your-domain.com

# Optional branding override
# PUBLIC_USE_TEMPLATE_BRANDING=true
```

3. Click **Encrypt** and **Save**
4. Trigger a new deployment

## 🔐 Security Best Practices

### Private Configuration

**Never Commit These Files:**
- `.env.production` - Your production secrets
- `.env.staging` - Your staging secrets
- `config/private.ts` - Any private config

**Always Gitignored:**
```bash
# .gitignore already includes:
.env
.env.*
!.env.example
```

### Environment Variable Management

**Local Development:**
```bash
# Use .env.local (gitignored)
cp .env.production .env.local
npm run dev
```

**Production:**
```bash
# Stored in Cloudflare Dashboard only
# Never in repository
```

### API Keys

**Rotate Keys Regularly:**
```bash
# Generate new MCP API key
node -e "console.log('ckb_' + require('crypto').randomBytes(32).toString('hex'))"

# Update in:
# 1. Cloudflare Dashboard
# 2. .env.production (for local testing)
# 3. Trigger redeployment
```

## 🔄 Deployment Workflow

### Making Changes

```bash
# 1. Make changes to source code
# Edit files...

# 2. Test locally
npm run dev
# Visit http://localhost:4321

# 3. Build and test production build
npm run build
npm run preview

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push to trigger deployment
git push origin master

# 6. Cloudflare Pages automatically deploys
#    Visit your site to see changes
```

### Branch Deployments

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
git commit -am "feat: add new feature"

# Push feature branch
git push origin feature/new-feature

# Cloudflare Pages creates preview deployment:
# https://cool-blog-*.pages.dev
```

## 🌐 Managing Multiple Deployments

### Architecture

```
GitHub Repository (cool-blog)
├── master branch
│   └── Deploys to: your-personal-domain.com (production)
├── dev branch
│   └── Deploys to: dev.your-personal-domain.com (staging)
└── feature/* branches
    └── Deploys to: preview URLs (testing)
```

### Setup

1. **Configure Cloudflare Pages Productions**

In Cloudflare Dashboard:
- **Production**: Branch `master` → `your-domain.com`
- **Staging**: Branch `dev` → `dev.your-domain.com`
- **Preview**: Branch `feature/*` → `*.preview.pages.dev`

2. **Set Environment Variables per Environment**

```bash
# Production environment
DATABASE_URL=production_db_url
PUBLIC_SITE_URL=https://your-domain.com

# Staging environment
DATABASE_URL=staging_db_url
PUBLIC_SITE_URL=https://dev.your-domain.com

# Preview environments
DATABASE_URL=preview_db_url
PUBLIC_SITE_URL=https://cool-blog-preview.pages.dev
```

## 📊 Monitoring & Analytics

### View Deployment Logs

1. Go to Cloudflare Dashboard → Pages → cool-blog
2. Click **Deployments**
3. Click on a deployment to view logs

### Analytics

Enable Cloudflare Web Analytics:
1. Go to **Analytics & Logs** → **Web Analytics**
2. Add your site
3. Insert script in `src/layouts/Layout.astro`:

```astro
<slot />
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "your-token"}'></script>
```

## 🆘 Troubleshooting

### Deployment Failed

**Check:**
1. Build logs in Cloudflare Dashboard
2. Environment variables are set correctly
3. Database connection is valid
4. No TypeScript errors

### Environment Variables Not Working

**Solution:**
```bash
# Verify variables are set in Cloudflare Dashboard
# Trigger new deployment
# Check build logs for variable loading

# For local testing:
echo "DATABASE_URL=$DATABASE_URL"
```

### Branding Not Applied

**Check:**
```bash
# Verify PUBLIC_SITE_URL is set correctly
# Check if it matches your domain detection logic

# Force template branding:
PUBLIC_USE_TEMPLATE_BRANDING=true
```

### Database Connection Issues

**Solution:**
```bash
# Test connection locally
psql $DATABASE_URL

# Check Neon Dashboard:
# - Project is active
# - Branch is correct
# - SSL mode is enabled
```

## 📝 Summary

### Your Setup

**Public Repository:**
- GitHub: `github.com/your-username/cool-blog`
- All code open source
- Example configurations
- Documentation

**Private Deployment:**
- Cloudflare Pages: `your-domain.com`
- Private secrets in Cloudflare Dashboard
- Your personal branding
- Your database and services

### Key Files

**Public (in repository):**
- `.env.example` - Template for users
- `src/config/branding.ts` - Branding logic
- `docs/` - Documentation

**Private (gitignored):**
- `.env.production` - Your secrets
- `.env.local` - Local development
- `config/private.ts` - Private config (if needed)

### Workflow

1. **Development**: Work in `master` or feature branches
2. **Testing**: Use preview deployments
3. **Deployment**: Push to `master` for production
4. **Secrets**: Never commit, always in Cloudflare Dashboard

---

**Your personal site is ready! 🚀**

Next: Promote your open-source project and share your deployment!
