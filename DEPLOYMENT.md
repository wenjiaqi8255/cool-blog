# Deployment Guide

This guide covers deploying Cool Blog to Zeabur, Cloudflare Pages, or both with intelligent DNS routing for optimal global performance.

## Overview

Cool Blog supports dual-platform deployment:
- **Zeabur** - Node.js runtime, recommended for domestic (China) users
- **Cloudflare Pages** - Workers runtime, recommended for international users
- **Multi-Region** - Intelligent DNS routing directs users to the fastest platform

The deployment platform is controlled by the `DEPLOY_PLATFORM` environment variable:
- `DEPLOY_PLATFORM=node` (or unset) → Zeabur with Node.js adapter
- `DEPLOY_PLATFORM=cloudflare` → Cloudflare Pages with Cloudflare adapter

## Prerequisites

- Domain name (optional, for custom domain)
- Neon database account (for article storage)
- Deployment platform account(s): Zeabur, Cloudflare, or both

## Option 1: Deploy to Zeabur (Domestic)

### Step 1: Prepare Your Project

1. Fork or clone this repository
2. Install dependencies: `npm install`
3. Set up your Neon database and get connection string

### Step 2: Deploy on Zeabur

1. Log in to [Zeabur](https://zeabur.com)
2. Click "New Project" → "Deploy Service"
3. Connect your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `DEPLOY_PLATFORM`: Leave unset (defaults to `node`)
   - `RESEND_API_KEY`: For newsletter functionality (optional)
5. Click "Deploy"

Zeabur will automatically:
- Detect Node.js project
- Install dependencies with `npm install`
- Build with `npm run build`
- Start the standalone server

### Step 3: Configure Custom Domain (Optional)

1. In Zeabur dashboard, go to "Networking"
2. Add your custom domain
3. Update your domain's DNS to point to Zeabur's target

## Option 2: Deploy to Cloudflare Pages (International)

### Step 1: Prepare Your Project

1. Fork or clone this repository
2. Install dependencies: `npm install`
3. Set up your Neon database and get connection string

### Step 2: Deploy via GitHub Actions

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Get your API Token: "My Profile" → "API Tokens" → "Create Token"
3. Get your Account ID from the dashboard URL or sidebar
4. Add secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID
5. Add environment variables in Cloudflare Pages:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `DEPLOY_PLATFORM`: `cloudflare`
6. Push to `master` branch to trigger deployment

### Step 3: Configure Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to "Custom Domains"
2. Add your domain
3. Follow DNS instructions (add CNAME record)

### Deploy via Wrangler CLI (Alternative)

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build for Cloudflare
DEPLOY_PLATFORM=cloudflare npm run build

# Deploy
wrangler pages deploy dist --project-name=your-blog
```

## Option 3: Multi-Region Deployment (Advanced)

Configure intelligent DNS routing to direct domestic users to Zeabur and international users to Cloudflare Pages.

### Architecture

```
Domestic users → Aliyun DNS (境内线路) → Aliyun CDN → Zeabur
International users → Aliyun DNS (境外线路) → Cloudflare SaaS → Cloudflare Pages
Default fallback → Aliyun DNS (默认线路) → Aliyun CDN → Zeabur
```

### Implementation

Multi-region deployment requires manual infrastructure setup:

1. **Deploy to both platforms** (complete Option 1 and Option 2 first)
2. **Set up Aliyun CDN** for domestic acceleration
3. **Configure Cloudflare SaaS** for international routing
4. **Configure Aliyun DNS** with intelligent routing (境内/境外/默认 lines)

> **Note**: Detailed step-by-step procedures for multi-region infrastructure setup are implemented in **Plan 11-05**. This includes console navigation, configuration screenshots, and verification procedures.

## Environment Variables

| Variable | Platforms | Value | Required |
|----------|-----------|-------|----------|
| `DEPLOY_PLATFORM` | All | `node` (Zeabur) or `cloudflare` (Cloudflare) | No (defaults to `node`) |
| `DATABASE_URL` | All | Neon PostgreSQL connection string | Yes |
| `RESEND_API_KEY` | All | Resend API key for newsletter | No |

## Troubleshooting

### Deployment succeeds but site shows 404

**Cause**: Built with wrong adapter (e.g., built for Cloudflare but deploying to Zeabur)

**Solution**: Check `DEPLOY_PLATFORM` environment variable:
- Zeabur: `DEPLOY_PLATFORM=node` or leave unset
- Cloudflare Pages: `DEPLOY_PLATFORM=cloudflare`

### Database connection fails

**Cause**: Runtime incompatibility or wrong connection string

**Solution**:
- Verify `DATABASE_URL` is correct and includes `?sslmode=require`
- Ensure using `@neondatabase/serverless` package (already installed)
- Check Neon console for connection issues

### Build fails with "Astro version not supported"

**Cause**: Node.js version too old

**Solution**: Upgrade to Node.js 22 or higher:
- Locally: Use `nvm install 22 && nvm use 22`
- CI/CD: Set `node-version: '22'` in GitHub Actions

## Architecture Diagrams

### Zeabur Deployment (Node.js)

```
GitHub → Zeabur → Build (DEPLOY_PLATFORM=node) → Node.js Server → Neon Database
         ↓
    Your Domain
```

### Cloudflare Pages Deployment (Workers)

```
GitHub → Cloudflare Pages → Build (DEPLOY_PLATFORM=cloudflare) → Workers → Neon Database
                    ↓
                Your Domain
```

### Multi-Region Deployment

```
Domestic User → Aliyun DNS → Aliyun CDN → Zeabur → Node.js Server
International User → Aliyun DNS → Cloudflare SaaS → Cloudflare Pages → Workers
```

## Performance Optimization

### Aliyun CDN Cache Configuration

- HTML pages: 60 seconds TTL
- Static assets (CSS/JS): 3600 seconds TTL
- Images: 86400 seconds TTL (1 day)

### Cloudflare Cache Configuration

- Cache Everything: Enabled
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 1 day

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to git
2. **Database**: Use Neon's connection pooling for serverless deployments
3. **HTTPS**: Enable HTTPS on both platforms (free certificates available)
4. **CORS**: Configure CORS if accessing API from different domains
