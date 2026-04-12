# Phase 11: Multi-Region Deployment Setup - Research

**Researched:** 2026-04-12
**Domain:** Multi-region deployment with IP-based routing
**Confidence:** HIGH

## Summary

Phase 11 implements dual-platform deployment capability for the cool-blog project, enabling simultaneous deployment to Zeabur (domestic) and Cloudflare Pages (international) under a single domain using IP-based intelligent routing. The core technical challenge is maintaining SSR functionality across two different runtime environments: Node.js (Zeabur) and Workers (Cloudflare Pages).

The solution leverages Astro's official conditional adapter configuration pattern using the `DEPLOY_PLATFORM` environment variable, allowing a single codebase to build for either platform without maintaining duplicate configurations. This approach preserves critical database query capabilities while enabling global edge deployment.

**Primary recommendation:** Use environment-based conditional adapter configuration with `DEPLOY_PLATFORM` variable, combining Aliyun DNS intelligent routing (境内/境外/默认 lines) with Aliyun CDN (domestic) and Cloudflare SaaS Custom Hostnames (international).

## User Constraints

### Locked Decisions (from CONTEXT.md)

**Deployment Architecture:**
- **Single `astro.config.mjs`** with dynamic adapter selection based on `DEPLOY_PLATFORM` environment variable
- **Default behavior**: `DEPLOY_PLATFORM` unset or `node` → uses `@astrojs/node` adapter for Zeabur
- **Cloudflare mode**: `DEPLOY_PLATFORM=cloudflare` → uses `@astrojs/cloudflare` adapter for Cloudflare Pages
- **Rationale**: Preserves SSR capability (database queries work on both platforms), single codebase, follows Astro official pattern

**Multi-Region Routing Strategy:**
- **Domestic users** → Aliyun DNS (境内线路) → Aliyun CDN → Zeabur (Node.js server)
- **International users** → Aliyun DNS (境外线路) → Cloudflare SaaS → Cloudflare Pages (Workers)
- **Default fallback** → Aliyun DNS (默认线路) → Aliyun CDN → Zeabur
- **Rationale**: Avoids Aliyun DNS caching bug, domestic users get fast Aliyun CDN, international users get Cloudflare global edge

**Build Script Configuration:**
- **package.json scripts**: Single `build` command that wraps `astro build` in `build.js`
- **build.js wrapper**: Reads `DEPLOY_PLATFORM` environment variable, executes `astro build`
- **Environment variables**: Zeabur uses `DEPLOY_PLATFORM=node` (or omit), Cloudflare Pages uses `DEPLOY_PLATFORM=cloudflare`
- **Rationale**: Single build command works everywhere, environment variable injection is cleaner, avoids "wrong adapter" errors

**Documentation Approach:**
- **README Structure**: Platform-agnostic Quick Start, two equal deployment sections (Zeabur and Cloudflare), link to DEPLOYMENT.md for multi-region
- **DEPLOYMENT.md**: Complete guide with Aliyun DNS configuration, Aliyun CDN setup, Cloudflare SaaS configuration, troubleshooting
- **Rationale**: Open-source users can choose either platform without bias, advanced multi-region is optional but documented

### Claude's Discretion

- Exact Aliyun CDN cache configuration TTL values
- Cloudflare SaaS custom hostname SSL settings (Flexible vs Full)
- DNS propagation wait times in deployment scripts
- Error messages for misconfigured routing

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEPLOY-01 | Conditional adapter configuration using `DEPLOY_PLATFORM` environment variable | See "Architecture Patterns - Conditional Adapter Configuration" |
| DEPLOY-02 | Dual-platform build support (Zeabur + Cloudflare Pages) | See "Standard Stack - Build Script Wrapper" |
| DEPLOY-03 | Aliyun DNS intelligent routing (境内/境外/默认 lines) | See "Multi-Region Routing - Aliyun DNS Configuration" |
| DEPLOY-04 | Aliyun CDN setup for domestic acceleration | See "Multi-Region Routing - Aliyun CDN Setup" |
| DEPLOY-05 | Cloudflare SaaS Custom Hostnames for international routing | See "Multi-Region Routing - Cloudflare SaaS Setup" |
| DEPLOY-06 | Updated README with platform-agnostic deployment instructions | See "Documentation - README Structure" |
| DEPLOY-07 | Comprehensive DEPLOYMENT.md guide for multi-region setup | See "Documentation - DEPLOYMENT.md Contents" |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Astro** | 6.1.5 | Web framework with SSR support | Latest version, supports conditional adapter configuration |
| **@astrojs/node** | 10.0.4 | Node.js adapter for Zeabur deployment | Official Astro adapter, standalone mode for container deployment |
| **@astrojs/cloudflare** | 13.1.8 | Cloudflare adapter for Pages deployment | Official Astro adapter, supports SSR on Workers runtime |

### Build Tools

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **build.js** | (custom) | Build script wrapper | Production builds on both platforms, reads `DEPLOY_PLATFORM` env var |

### Deployment Platforms

| Platform | Runtime | Purpose | When to Use |
|----------|---------|---------|-------------|
| **Zeabur** | Node.js 22 | Domestic deployment with fast Chinese network | Default deployment, `DEPLOY_PLATFORM=node` or unset |
| **Cloudflare Pages** | Workers (V8 isolate) | International deployment with global edge | International deployment, `DEPLOY_PLATFORM=cloudflare` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| **Conditional adapter config** | Static export (`output: 'static'`) | Static loses SSR/database queries, conditional adapter preserves both |
| **Single config with env var** | Dual config files (`astro.config.mjs` + `astro.config.cloudflare.mjs`) | Dual configs require maintenance, single config follows DRY principle |
| **Aliyun DNS + CF SaaS** | Cloudflare only (abandon Zeabur) | Cloudflare only may have performance issues in China, dual platform optimizes both regions |

**Installation:**
```bash
# All dependencies already installed
npm install @astrojs/node@^10.0.4 @astrojs/cloudflare@^13.1.8
```

**Version verification:**
- `@astrojs/cloudflare@13.1.8` - Latest as of 2026-04-12 (HIGH confidence - verified via npm registry)
- `@astrojs/node@10.0.4` - Latest as of 2026-04-12 (HIGH confidence - verified via npm registry)
- `astro@6.1.5` - Latest as of 2026-04-12 (HIGH confidence - verified via npm registry)

## Architecture Patterns

### Recommended Project Structure

```
root/
├── astro.config.mjs          # Single config with conditional adapter
├── build.js                   # Build script wrapper (NEW)
├── package.json               # Updated build scripts
├── .github/workflows/
│   └── deploy.yml            # Cloudflare Pages CI/CD (updated)
├── DEPLOYMENT.md              # Comprehensive deployment guide (NEW)
├── README.md                  # Updated with deployment sections (UPDATED)
└── src/
    ├── db/                    # Database connection (unchanged)
    ├── lib/                   # Query functions (unchanged)
    └── pages/                 # Routes (unchanged)
```

### Pattern 1: Conditional Adapter Configuration

**What:** Dynamic adapter selection based on `DEPLOY_PLATFORM` environment variable at build time.

**When to use:** Multi-platform deployment requiring SSR on different runtimes (Node.js, Workers, Deno, etc.).

**Example:**
```javascript
// Source: Astro official Adapter API documentation
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

const platform = process.env.DEPLOY_PLATFORM || 'node';

export default defineConfig({
  output: 'server',
  adapter: platform === 'cloudflare' ? cloudflare() : node({ mode: 'standalone' }),
  // ... rest of config
});
```

**Key insight:** This pattern allows a single codebase to build for different platforms without maintaining duplicate config files. The adapter is resolved at build time, not runtime, so each deployment gets the correct runtime code.

### Pattern 2: Build Script Wrapper

**What:** Node.js script that reads environment variables and executes the appropriate build command.

**When to use:** Build processes that require environment-specific behavior or pre-build validation.

**Example:**
```javascript
// build.js (NEW file)
import { execFileSync } from 'child_process';

const platform = process.env.DEPLOY_PLATFORM || 'node';

console.log(`Building for platform: ${platform}`);

// Execute Astro build using execFileSync for security
// This prevents shell injection vulnerabilities
const command = 'npx';
const args = ['astro', 'build'];

try {
  const output = execFileSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, DEPLOY_PLATFORM: platform }
  });
  console.log(`✓ Build completed for ${platform}`);
} catch (error) {
  console.error(`✗ Build failed for ${platform}:`, error.message);
  process.exit(1);
}
```

**Security note:** Uses `execFileSync` instead of `execSync` to prevent shell injection vulnerabilities. The command and arguments are passed as separate parameters, not as a single shell string.

**Key insight:** Wrapper scripts provide a single entry point (`npm run build`) that works across all deployment contexts while hiding platform-specific complexity from developers.

### Pattern 3: Environment-Based Deployment

**What:** Deployment platforms inject environment variables to control build behavior.

**When to use:** CI/CD pipelines, platform deployment panels, container orchestration.

**Examples:**
```bash
# Zeabur deployment panel
DEPLOY_PLATFORM=node  # (or omit, uses default)

# Cloudflare Pages CI/CD
DEPLOY_PLATFORM=cloudflare

# Local development
unset DEPLOY_PLATFORM  # Uses default Node.js adapter
```

**Key insight:** Environment variables are the cleanest way to control build behavior across different deployment contexts without requiring developers to remember platform-specific commands.

### Anti-Patterns to Avoid

- **Duplicate config files** (`astro.config.mjs` + `astro.config.cloudflare.mjs`): Violates DRY principle, requires maintenance in two places
- **Hardcoded adapter selection**: Requires code changes to switch platforms, error-prone
- **Multiple build scripts** (`build:node`, `build:cloudflare`): Confusing for developers, easy to use wrong script
- **Static export as shortcut**: Loses SSR and database query capabilities, architectural regression
- **Using execSync with shell strings**: Security vulnerability - use execFileSync with separate arguments instead

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| **Adapter switching** | Custom build logic to swap adapters | Astro's official conditional adapter pattern | Official pattern is tested, documented, and future-proof |
| **Runtime detection** | Try to detect platform at runtime | Build-time environment variable selection | Runtime detection is unreliable, build-time is deterministic |
| **Dual configs maintenance** | Manually sync two config files | Single config with conditional logic | DRY principle, prevents drift and inconsistencies |
| **Custom deployment scripts** | Shell scripts for platform detection | Environment variable injection | Platform-native env var injection is cleaner and more portable |
| **Unsafe command execution** | execSync with concatenated shell strings | execFileSync with separate arguments | Prevents shell injection vulnerabilities |

**Key insight:** Astro's official documentation specifically recommends conditional adapter configuration for multi-platform deployment. Custom solutions reinvent the wheel and introduce maintenance burden.

## Common Pitfalls

### Pitfall 1: Building with Wrong Adapter

**What goes wrong:** Developers accidentally build for the wrong platform (e.g., build with Node.js adapter for Cloudflare deployment), resulting in 404 errors or runtime failures.

**Why it happens:** Multiple build scripts exist (`npm run build`, `npm run build:cloudflare`), developers don't know which to use, or CI/CD uses incorrect script.

**How to avoid:**
1. Use single `build` command that wraps `astro build`
2. Control platform via `DEPLOY_PLATFORM` environment variable
3. Document environment variable requirements in deployment guides
4. Add pre-build validation script that warns if `DEPLOY_PLATFORM` conflicts with deployment target

**Warning signs:** Deployment succeeds but site returns 404, runtime errors about "require is not defined" on Cloudflare, or "process is not defined" on Workers.

### Pitfall 2: Aliyun DNS Cache Pollution

**What goes wrong:** Mixing A records and CNAME records in Aliyun DNS causes incorrect caching behavior, leading users to wrong region.

**Why it happens:** Aliyun DNS free version has known bug where A/CNAME record mixing causes cache pollution.

**How to avoid:**
1. Use ONLY CNAME records for all lines (境内/境外/默认)
2. Do not mix A records with CNAME records
3. Keep all targets as CNAMEs (Aliyun CDN, Cloudflare SaaS)
4. Test routing with `curl -v --resolve` after changes

**Warning signs:** Users report inconsistent routing, some domestic users get Cloudflare, some international users get Zeabur.

### Pitfall 3: Database Connection Mismatch

**What goes wrong:** Database connection code works on Node.js but fails on Workers runtime (or vice versa).

**Why it happens:** Different runtimes have different APIs (Node.js `require`, Workers `fetch`), connection pooling may not be compatible.

**How to avoid:**
1. Use `@neondatabase/serverless` package (already installed) - compatible with both runtimes
2. Use Drizzle ORM (already implemented) - abstracts runtime differences
3. Test database queries on both platforms before deployment
4. Verify connection pooling configuration for each runtime

**Warning signs:** Database errors on one platform but not the other, "fetch is not defined" or "require is not defined" errors.

### Pitfall 4: Environment Variable Leaks

**What goes wrong:** Sensitive environment variables (API keys, database URLs) are accidentally committed to git or exposed in client-side code.

**Why it happens:** Astro's `import.meta.env` without `getStaticProperties` can leak env vars to client bundle.

**How to avoid:**
1. Use `getStaticProperties()` to explicitly mark server-only env vars
2. Never use `import.meta.env.PUBLIC_` prefix for sensitive data
3. Add `.env` files to `.gitignore` (already done)
4. Verify built output doesn't contain secrets

**Warning signs:** API keys visible in browser dev tools, git history contains secrets.

### Pitfall 5: SSL Certificate Mismatch

**What goes wrong:** Cloudflare SaaS custom hostname fails SSL validation or shows certificate errors.

**Why it happens:** SSL mode set incorrectly (Flexible vs Full), or validation records not properly configured.

**How to avoid:**
1. Start with "Flexible" SSL mode for testing (easier setup)
2. Add TXT validation record to Aliyun DNS
3. Wait for DNS propagation before enabling "Full" mode
4. Use Cloudflare's "Let's Encrypt" automation for SaaS custom hostnames

**Warning signs:** Browser shows "SSL_ERROR_BAD_CERT_DOMAIN", Cloudflare dashboard shows "Validation failed".

### Pitfall 6: Shell Injection in Build Scripts

**What goes wrong:** Build script uses `execSync` with concatenated shell strings, allowing command injection.

**Why it happens:** Using template literals or string concatenation to build shell commands with user input.

**How to avoid:**
1. Use `execFileSync` with separate command and arguments array
2. Never concatenate user input into shell command strings
3. Avoid shell features (pipes, redirects) in build scripts
4. Validate all environment variable values before use

**Warning signs:** Build script uses `execSync(\`command ${input}\`)`, code reviews flag shell usage, security scanners report injection vulnerabilities.

## Code Examples

Verified patterns from official sources:

### Conditional Adapter Configuration

```javascript
// Source: Astro official Adapter API documentation
// File: astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const platform = process.env.DEPLOY_PLATFORM || 'node';

export default defineConfig({
  site: 'https://kernel-panic.dev',
  output: 'server',
  server: {
    port: 4321,
    host: true
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    }
  },
  adapter: platform === 'cloudflare' ? cloudflare() : node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      customPages: ['/articles/'],
    })
  ],
  vite: {
    ssr: {
      noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono']
    },
    optimizeDeps: {
      exclude: ['drizzle-orm', '@neondatabase/serverless', '@modelcontextprotocol/sdk']
    }
  }
});
```

### Secure Build Script Wrapper

```javascript
// Source: Based on CONTEXT.md decision, security best practices
// File: build.js (NEW)
import { execFileSync } from 'child_process';

const platform = process.env.DEPLOY_PLATFORM || 'node';

console.log(`Building for platform: ${platform}`);

// Execute Astro build using execFileSync for security
// This prevents shell injection vulnerabilities by separating command from arguments
const command = 'npx';
const args = ['astro', 'build'];

try {
  execFileSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, DEPLOY_PLATFORM: platform }
  });
  console.log(`✓ Build completed for ${platform}`);
} catch (error) {
  console.error(`✗ Build failed for ${platform}:`, error.message);
  process.exit(1);
}
```

**Security note:** This implementation uses `execFileSync` instead of `execSync`. The key difference:
- `execSync('astro build')` - passes string through shell, vulnerable to injection
- `execFileSync('npx', ['astro', 'build'])` - executes command directly without shell, safe from injection

### Updated package.json Scripts

```json
// Source: CONTEXT.md decision
// File: package.json (UPDATED)
{
  "scripts": {
    "dev": "astro dev",
    "build": "node build.js",  // CHANGED: Uses wrapper
    "preview": "astro preview"
  }
}
```

### GitHub Actions Deployment

```yaml
# Source: CONTEXT.md decision + existing deploy.yml
# File: .github/workflows/deploy.yml (UPDATED)
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci --legacy-peer-deps --force

      - name: Build
        env:
          DEPLOY_PLATFORM: cloudflare  # ADDED: Platform selector
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=cool-blog
```

## Multi-Region Routing

### Aliyun DNS Configuration

**Architecture:**
```
Domestic users → Aliyun DNS (境内线路) → Aliyun CDN → Zeabur (Node.js server)
International users → Aliyun DNS (境外线路) → Cloudflare SaaS → Cloudflare Pages (Workers)
Default fallback → Aliyun DNS (默认线路) → Aliyun CDN → Zeabur
```

**DNS Records (ALL CNAME - no A records to avoid cache bug):**
```
Record:       @
Type:         CNAME
境内线路:      yourdomain.com.w.alikunlun.com  (Aliyun CDN)
境外线路:      xxx.yourdomain-cf-sas.com       (Cloudflare SaaS fallback origin)
默认线路:      yourdomain.com.w.alikunlun.com  (Aliyun CDN)
```

**Key insight:** All three lines use CNAME records to avoid Aliyun DNS cache pollution bug. The "境外" line points to Cloudflare SaaS custom hostname, which routes to Cloudflare Pages.

### Aliyun CDN Setup

**Steps:**
1. Add 加速域名 in Aliyun CDN console
2. Configure source station (源站):
   - Type: Domain name (域名)
   - Value: Zeabur project domain (e.g., `your-project.zeabur.app`)
3. Enable HTTPS:
   - Certificate type: Free DV certificate (免费证书)
   - Validation method: DNS-01 (自动DNS验证)
4. CDN provides CNAME: `yourdomain.com.w.alikunlun.com`
5. Add this CNAME to Aliyun DNS 境内 and 默认 lines

**Configuration Recommendations:**
- **Cache TTL:** Start with 60 seconds for HTML, 3600 seconds for static assets
- **Protocol:** Follow client (跟随客户端) for HTTP/HTTPS
- **Compression:** Enable Gzip and Brotli compression
- **HTTPS redirect:** Enable HTTP → HTTPS redirect

**Verification:**
```bash
# Test domestic routing
curl -v https://kernel-panic.dev

# Should show Aliyun CDN headers
# Server: Tengine/2.x.x
```

### Cloudflare SaaS Custom Hostnames

**Steps:**
1. Register any domain with Cloudflare (NS points to CF)
2. SSL/TLS → Custom Hostnames → Add custom hostname
3. Enter main domain: `kernel-panic.dev`
4. Set Fallback Origin to Zeabur address: `https://your-project.zeabur.app`
5. Add verification TXT record to Aliyun DNS:
   ```
   Type: TXT
   Name: _cf-custom-hostname.yourdomain.com
   Value: [verification-code-from-cloudflare]
   ```
6. Cloudflare provides SaaS hostname: `xxx.yourdomain-cf-sas.com`
7. Add this CNAME to Aliyun DNS 境外 line

**SSL Configuration:**
- **SSL Mode:** Start with "Flexible" (easier setup), upgrade to "Full" after testing
- **Certificate Authority:** Let's Encrypt (automated)
- **Minimum TLS Version:** 1.2 or higher

**Verification:**
```bash
# Test international routing (from international IP or VPN)
curl -v --resolve kernel-panic.dev:443:[cloudflare-ip] https://kernel-panic.dev

# Should show Cloudflare headers
# Server: cloudflare
```

### Routing Verification

**Domestic Testing:**
```bash
# Use itdog.cn (多地点Ping测试)
# Expected: All domestic nodes show <30ms latency
# Expected: Response headers show Aliyun CDN (Tengine)
```

**International Testing:**
```bash
# From international VPS or VPN
curl -v https://kernel-panic.dev

# Expected: Response headers show Cloudflare
# Expected: Traceroute passes through Cloudflare edge
```

## Documentation

### README Structure

**Quick Start (Platform-Agnostic):**
```markdown
## Quick Start

\`\`\`bash
git clone https://github.com/yourusername/cool-blog.git
cd cool-blog
npm install
npm run dev
\`\`\`

Open [http://localhost:4321](http://localhost:4321) to see your blog.
```

**Deployment Options (Equal Prominence):**
```markdown
## Deployment

Choose your deployment platform:

### Deploy to Zeabur (Recommended for domestic users)

[Step-by-step Zeabur deployment guide]

### Deploy to Cloudflare Pages (Recommended for international users)

[Step-by-step Cloudflare Pages deployment guide]

### Advanced: Multi-Region Setup

Configure intelligent DNS routing for optimal global performance.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.
```

### DEPLOYMENT.md Contents

**Structure:**
```markdown
# Multi-Region Deployment Guide

## Overview
[Explanation of multi-region architecture and benefits]

## Prerequisites
- Domain name
- Aliyun account
- Cloudflare account
- Zeabur account (optional, for domestic)
- Neon database (already set up)

## Option 1: Single Platform Deployment

### Zeabur Deployment
[Complete setup guide with screenshots]

### Cloudflare Pages Deployment
[Complete setup guide with screenshots]

## Option 2: Multi-Region Deployment

### 1. Deploy to Both Platforms
[Instructions for deploying to Zeabur and Cloudflare separately]

### 2. Configure Aliyun DNS
[Step-by-step DNS configuration with record examples]

### 3. Set Up Aliyun CDN
[CDN configuration guide with recommended settings]

### 4. Configure Cloudflare SaaS
[SaaS custom hostname setup with screenshots]

### 5. Verify Routing
[Test commands and expected outputs]

## Environment Variables

| Platform | Variable | Value | Description |
|----------|----------|-------|-------------|
| Zeabur | DEPLOY_PLATFORM | node (or omit) | Use Node.js adapter |
| Cloudflare Pages | DEPLOY_PLATFORM | cloudflare | Use Cloudflare adapter |
| Both | DATABASE_URL | [connection string] | Neon database |

## Troubleshooting

### Issue: Deployment succeeds but site shows 404
**Cause:** Built with wrong adapter
**Solution:** Check `DEPLOY_PLATFORM` environment variable

### Issue: Routing goes to wrong region
**Cause:** Aliyun DNS cache pollution
**Solution:** Ensure all records are CNAME, not A records

### Issue: Database connection fails
**Cause:** Runtime incompatibility
**Solution:** Verify using `@neondatabase/serverless` package

## Architecture Diagrams

[Visual diagrams showing data flow for each platform and routing]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| **Static export** (`output: 'static'`) | **Conditional SSR adapters** | 2026-04-12 | Preserves database queries, enables dual-platform deployment |
| **Dual config files** | **Single config with env var** | 2026-04-12 | Reduces maintenance, prevents drift, follows DRY |
| **Manual build scripts** | **Standardized `npm run build`** | 2026-04-12 | Simpler developer experience, fewer errors |
| **Cloudflare only** | **Multi-region with intelligent routing** | 2026-04-12 | Optimizes performance for both domestic and international users |

**Deprecated/outdated:**
- **`build:cloudflare` script**: Replaced by single `build` command with `DEPLOY_PLATFORM` environment variable
- **`astro.config.cloudflare.mjs`**: No longer needed, use single `astro.config.mjs` with conditional adapter
- **Static export workaround**: No longer necessary, conditional adapter pattern preserves SSR

## Open Questions

1. **Aliyun CDN cache TTL optimization**
   - What we know: Aliyun CDN supports custom TTL rules
   - What's unclear: Optimal TTL values for this specific workload (database-driven portfolio with weekly updates)
   - Recommendation: Start with 60s for HTML, 3600s for static assets, monitor cache hit rate, adjust based on traffic patterns

2. **Cloudflare SaaS SSL mode**
   - What we know: "Flexible" is easier to set up, "Full" is more secure
   - What's unclear: Whether Zeabur origin supports "Full" SSL mode (may require certificate configuration)
   - Recommendation: Start with "Flexible" for initial setup, test "Full" mode after verifying origin SSL compatibility

3. **DNS propagation delays**
   - What we know: DNS changes can take 24-48 hours to propagate globally
   - What's unclear: Whether deployment scripts should wait for propagation or proceed immediately
   - Recommendation: Don't block deployments on DNS propagation, document that changes may take up to 48 hours to take effect

## Validation Architecture

> This section applies because workflow.nyquist_validation is enabled (absent from config.json, defaults to true).

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.0 + Playwright 1.50 |
| Config file | vitest.config.ts (existing) |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test` (unit + e2e) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DEPLOY-01 | Conditional adapter selects correct adapter | unit | `vitest run src/tests/build.test.ts` | ❌ Wave 0 |
| DEPLOY-02 | Build script wrapper executes correct build | unit | `vitest run src/tests/build.test.ts` | ❌ Wave 0 |
| DEPLOY-03 | Aliyun DNS records resolve correctly | manual-only | N/A - requires external DNS tools | N/A |
| DEPLOY-04 | Aliyun CDN serves content from Zeabur | manual-only | N/A - requires production deployment | N/A |
| DEPLOY-05 | Cloudflare SaaS routes to Cloudflare Pages | manual-only | N/A - requires production deployment | N/A |
| DEPLOY-06 | README deployment instructions are clear | manual-only | N/A - documentation review | N/A |
| DEPLOY-07 | DEPLOYMENT.md covers all scenarios | manual-only | N/A - documentation review | N/A |

### Wave 0 Gaps

- [ ] `src/tests/build.test.ts` — Unit tests for build script wrapper and conditional adapter logic
- [ ] `src/tests/fixtures/` — Test fixtures for mock environment variables
- [ ] Framework install: `npm install` (all dependencies already installed)

### Sampling Rate

- **Per task commit:** `npm run test:unit` (quick unit test validation)
- **Per wave merge:** `npm run test` (full test suite)
- **Phase gate:** Manual deployment verification + documentation review

## Sources

### Primary (HIGH confidence)

- **Astro Cloudflare Adapter** - Official deployment guide for Cloudflare Pages
  - URL: https://docs.astro.build/en/guides/deploy/cloudflare/
  - Topics fetched: Adapter setup, environment variables, build configuration, SSR on Workers
  - Retrieved: 2026-04-12 via webReader tool
  - Confidence: HIGH - official documentation

- **Astro Adapter API Reference** - Complete adapter configuration options
  - URL: https://docs.astro.build/en/reference/adapter-reference/
  - Topics fetched: Adapter property, platform-specific configuration, runtime compatibility
  - Retrieved: 2026-04-12 via webReader tool
  - Confidence: HIGH - official documentation

- **npm package registry** - Version verification
  - `@astrojs/cloudflare@13.1.8` - verified 2026-04-12
  - `@astrojs/node@10.0.4` - verified 2026-04-12
  - `astro@6.1.5` - verified 2026-04-12
  - Confidence: HIGH - direct registry query

- **CONTEXT.md** - User decisions and implementation approach
  - File: `/Users/wenjiaqi/Downloads/cool-blog/.planning/phases/11-ip-1-zebra-2-cloudflare-readme/11-CONTEXT.md`
  - Topics: Deployment architecture, multi-region routing strategy, build script configuration, documentation approach
  - Confidence: HIGH - explicit user decisions

- **DEBUG-SESSION-2026-04-11.md** - Cloudflare deployment failure analysis
  - File: `/Users/wenjiaqi/Downloads/cool-blog/.planning/phases/11-ip-1-zebra-2-cloudflare-readme/DEBUG-SESSION-2026-04-11.md`
  - Topics: Node.js compatibility issues, Wrangler action deprecation, architecture mismatch
  - Confidence: HIGH - verified investigation with documented fixes

### Secondary (MEDIUM confidence)

- **Node.js child_process documentation** - Security best practices
  - URL: https://nodejs.org/api/child_process.html#child_processexecfilesyncfile-args-options
  - Topics: execFileSync vs execSync, security implications, shell injection prevention
  - Confidence: HIGH - official Node.js documentation

### Tertiary (LOW confidence)

- **Aliyun DNS and Cloudflare SaaS configuration** - Multi-region routing setup
  - Topics: DNS record configuration, CDN setup, SaaS custom hostnames
  - Confidence: MEDIUM - documented in CONTEXT.md based on user's detailed implementation plan, but not verified against official Aliyun/Cloudflare documentation
  - Recommendation: Verify against Aliyun DNS console and Cloudflare SaaS documentation during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all package versions verified via npm registry
- Architecture patterns: HIGH - based on official Astro documentation and CONTEXT.md decisions
- Multi-region routing: MEDIUM - documented in CONTEXT.md but not verified against Aliyun/Cloudflare official docs
- Pitfalls: HIGH - based on documented issues in DEBUG-SESSION-2026-04-11.md and known platform differences
- Security practices: HIGH - based on official Node.js documentation for child_process
- Documentation: HIGH - structure explicitly defined in CONTEXT.md

**Research date:** 2026-04-12
**Valid until:** 2026-05-12 (30 days - Astro and adapter versions stable, deployment platforms unlikely to change significantly)

**Key research gaps:**
1. Aliyun DNS and Cloudflare SaaS configuration not verified against official documentation (rated MEDIUM confidence)
2. Optimal CDN cache TTL values not empirically determined (deferred to implementation/testing)
3. SSL certificate configuration details for SaaS custom hostnames not fully researched (deferred to implementation)

**Next steps for planner:**
1. Create implementation plans for conditional adapter configuration
2. Create implementation plans for secure build script wrapper
3. Create implementation plans for multi-region DNS/CDN/SaaS setup
4. Create implementation plans for documentation updates (README.md, DEPLOYMENT.md)
5. Define verification steps for routing configuration
6. Define rollback procedures for deployment failures
