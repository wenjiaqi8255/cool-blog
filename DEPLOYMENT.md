# Deployment Guide — Cool Blog

This guide covers deploying the Cool Blog to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Create one at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: Installed via `npm install` (already in package.json)
3. **GitHub Account**: For repository connection (optional, for CI/CD)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Authenticate with Cloudflare

```bash
npm run cf:login
```

This will open a browser window to authenticate with Cloudflare.

### 3. Verify Authentication

```bash
npm run cf:whoami
```

## Deployment Methods

### Method A: Manual Deployment (Quick Start)

1. **Build and Deploy:**
   ```bash
   npm run deploy
   ```

2. **Your site will be available at:**
   `https://cool-blog.pages.dev`

### Method B: Git-Connected Deployment (Recommended for Production)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cool-blog.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages** → **Create a project**
   - Select **Connect to Git**
   - Authorize GitHub and select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `/`
   - Click **Save and Deploy**

3. **Automatic Deployments:**
   - Every push to `main` triggers a production deployment
   - Pull requests create preview deployments

## Environment Variables

### Setting Environment Variables in Cloudflare Dashboard

1. Go to **Pages** → **cool-blog** → **Settings** → **Environment variables**
2. Add variables for **Production** and **Preview** environments:

| Variable | Description | Required |
|----------|-------------|----------|
| `PUBLIC_SITE_URL` | Your site's public URL | No |
| `GITHUB_TOKEN` | GitHub API token for higher rate limits | Optional |

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in values in `.env.local`

## Custom Domain (Optional)

### 1. Add Custom Domain in Cloudflare

1. Go to **Pages** → **cool-blog** → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `blog.yourdomain.com`)
4. Follow DNS configuration instructions

### 2. SSL Certificate

- Cloudflare automatically provisions SSL certificates via Let's Encrypt
- No manual configuration needed
- Certificates auto-renew before expiration

### 3. DNS Configuration

If your domain is on Cloudflare:
- Add a CNAME record pointing to `cool-blog.pages.dev`

If your domain is elsewhere:
- Add a CNAME record: `blog → cool-blog.pages.dev`

## Troubleshooting

### Issue: "Worker not found" error

**Cause:** Site deployed as Worker instead of Pages

**Solution:**
1. Ensure `astro.config.mjs` has `output: 'static'`
2. Redeploy with `npm run deploy`

### Issue: Hydration mismatches in console

**Cause:** Cloudflare Auto Minify modifies HTML

**Solution:**
1. Go to **Pages** → **cool-blog** → **Settings** → **Functions**
2. Disable **Auto Minify** for HTML, CSS, and JS

### Issue: SVG icons appear broken

**Cause:** Cloudflare may mangle SVG attributes

**Solution:**
1. Inline critical SVGs directly in HTML
2. Use base64 data URLs for small icons

### Issue: GitHub API rate limit exceeded

**Cause:** Unauthenticated API has 60 requests/hour limit

**Solution:**
1. Create a GitHub Personal Access Token
2. Add `GITHUB_TOKEN` to Cloudflare environment variables

### Issue: Build fails with "module not found"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Verification Checklist

After deployment, verify:

- [ ] Site loads at `https://cool-blog.pages.dev`
- [ ] All images load correctly
- [ ] Hover effects work (card backgrounds, arrow nudge, grayscale)
- [ ] Tab navigation switches between Portfolio and Articles
- [ ] Subscribe modal opens and closes
- [ ] Stats card shows GitHub commit count
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] HTTPS certificate is valid (check padlock icon)
- [ ] No console errors

## Monitoring

### View Deployment Logs

1. Go to **Pages** → **cool-blog** → **Deployments**
2. Click on a deployment to view logs

### Analytics (Optional)

Enable Cloudflare Web Analytics:
1. Go to **Analytics & Logs** → **Web Analytics**
2. Add your site
3. Insert the provided JavaScript snippet

## Rollback

To rollback to a previous deployment:

1. Go to **Pages** → **cool-blog** → **Deployments**
2. Find the working deployment
3. Click **Rollback to this deployment**

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
