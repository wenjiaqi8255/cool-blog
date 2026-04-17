# Deployment Guide

Cool Blog supports dual-platform deployment:

- **Cloudflare Workers** — Global edge deployment, recommended for international users
- **Zeabur** — Node.js runtime, recommended for China domestic users

The deployment platform is controlled by the `DEPLOY_PLATFORM` environment variable:

- `DEPLOY_PLATFORM=node` (or unset) → Node.js adapter (Zeabur)
- `DEPLOY_PLATFORM=cloudflare` → Cloudflare adapter (Workers)

## Prerequisites

- [Neon](https://neon.tech) account (free tier available) for PostgreSQL database
- Node.js 22+

## Option 1: Deploy to Cloudflare Workers

### Step 1: Prepare Your Project

1. Fork this repository
2. Set up a Neon database and copy the connection string

### Step 2: Configure GitHub Secrets

In your GitHub repository → Settings → Secrets and variables → Actions, add:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

### Step 3: Configure Workers Secret

The `DATABASE_URL` must be set as a **Workers secret** (not a regular environment variable). This ensures it's encrypted and never exposed in logs or builds.

**Via Cloudflare Dashboard:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
2. Click on `cool-blog` (your Worker)
3. Settings → Variables and Secrets
4. Add `DATABASE_URL` as an **Encrypt** (secret) variable
5. Paste your Neon connection string

**Via Wrangler CLI:**

```bash
npx wrangler secret put DATABASE_URL
# Paste your connection string when prompted
```

### Step 4: Deploy

Push to `master` branch. GitHub Actions will automatically build and deploy.

### Configure Custom Domain (Optional)

1. In Cloudflare Dashboard → Workers → your Worker → Settings → Domains & Routes
2. Add your custom domain

## Option 2: Deploy to Zeabur

[Zeabur](https://zeabur.com) provides Node.js deployment with domestic China network optimization.

### Step 1: Deploy on Zeabur

1. Log in to [Zeabur](https://zeabur.com)
2. Create a new project and connect your GitHub repository
3. Configure environment variables in the Zeabur dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `DEPLOY_PLATFORM` | `node` (or leave unset) |

4. Deploy

### Step 2: Configure Custom Domain (Optional)

1. In Zeabur dashboard → Networking
2. Add your custom domain and follow DNS instructions

## Environment Variables Reference

| Variable | Required | Platforms | Description |
|----------|----------|-----------|-------------|
| `DATABASE_URL` | Yes | All | Neon PostgreSQL connection string |
| `DEPLOY_PLATFORM` | No | All | `node` or `cloudflare` (defaults to `node`) |
| `PUBLIC_SITE_URL` | Recommended | All | Full site URL for meta tags |
| `PUBLIC_IS_PERSONAL_SITE` | No | All | `true` for personal branding |
| `MCP_API_KEY` | No | All | API key for MCP server access |
| `GITHUB_TOKEN` | No | All | GitHub token for stats card |
| `RESEND_API_KEY` | No | All | Resend API key for newsletter |

### How DATABASE_URL Works Per Platform

| Platform | Where to Set | How It's Read |
|----------|-------------|---------------|
| **Cloudflare Workers** | Dashboard → Workers → Secrets | `getSecret("DATABASE_URL")` via Astro env |
| **Zeabur** | Dashboard → Environment Variables | `process.env.DATABASE_URL` |
| **Local dev** | `.env.local` file | `getSecret()` reads from `.env` automatically |

> **Note:** `DATABASE_URL` is declared as a server-side secret in `astro.config.mjs` using `envField`. It is **never** baked into the build bundle — it's always read at runtime from the platform's secure storage.

## Architecture

### Cloudflare Workers

```
GitHub push → GitHub Actions → Build (DEPLOY_PLATFORM=cloudflare)
  → wrangler deploy → Cloudflare Workers → getSecret("DATABASE_URL") → Neon Database
```

### Zeabur

```
GitHub push → Zeabur → Build (DEPLOY_PLATFORM=node)
  → Node.js Server → process.env.DATABASE_URL → Neon Database
```

## Troubleshooting

### Site loads but shows empty content (no articles)

**Cause:** Database not connected — `DATABASE_URL` not accessible at runtime.

**Solution:**
- **Cloudflare Workers:** Verify secret is set in Dashboard → Workers → Settings → Variables and Secrets (must be **encrypted**, not plain text)
- **Zeabur:** Verify `DATABASE_URL` is set in the environment variables

### Build fails with "Astro version not supported"

**Cause:** Node.js version too old.

**Solution:** Use Node.js 22 or higher.

### Deployment succeeds but site shows 404

**Cause:** Wrong adapter for the platform.

**Solution:** Ensure `DEPLOY_PLATFORM` matches your target:
- Zeabur: `node` or unset
- Cloudflare: `cloudflare`
