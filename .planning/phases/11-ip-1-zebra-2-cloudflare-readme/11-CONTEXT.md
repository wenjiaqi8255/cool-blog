# Phase 11: Multi-Region Deployment Setup - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-region deployment setup with IP-based routing and documentation updates for open-source release. This phase delivers:
- Dual-platform deployment capability (Zeabur + Cloudflare Pages)
- Environment-based adapter configuration (preserves SSR and database queries)
- DNS routing: domestic → Zeabur, international → Cloudflare
- Updated README and deployment documentation for open-source users
- Aliyun DNS + Aliyun CDN + Cloudflare SaaS routing architecture

This does NOT include: New features, content changes, or architectural refactoring beyond deployment configuration.

</domain>

<decisions>
## Implementation Decisions

### Deployment Architecture

**Choice: Conditional Adapter Configuration with Environment Variables**

- **Single `astro.config.mjs`** with dynamic adapter selection based on `DEPLOY_PLATFORM` environment variable
- **Default behavior**: `DEPLOY_PLATFORM` unset or `node` → uses `@astrojs/node` adapter for Zeabur
- **Cloudflare mode**: `DEPLOY_PLATFORM=cloudflare` → uses `@astrojs/cloudflare` adapter for Cloudflare Pages
- **Rationale**:
  - Preserves SSR capability (database queries work on both platforms)
  - Single codebase, no duplicate config files to maintain
  - Follows Astro official pattern for environment-specific builds
  - Developers don't need to remember which build script to use

**Implementation Pattern:**
```javascript
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

### Multi-Region Routing Strategy

**Choice: Aliyun DNS + Aliyun CDN + Cloudflare SaaS**

**Architecture:**
```
Domestic users → Aliyun DNS (境内线路) → Aliyun CDN → Zeabur (Node.js server)
International users → Aliyun DNS (境外线路) → Cloudflare SaaS → Cloudflare Pages (Workers)
Default fallback → Aliyun DNS (默认线路) → Aliyun CDN → Zeabur
```

**Configuration Steps:**

1. **Aliyun CDN Setup**
   - Add加速域名 in Aliyun CDN console
   - 源站: Zeabur domain or IP
   - Enable HTTPS with Aliyun free DV certificate (DNS-01 validation)
   - CDN provides CNAME: `yourdomain.com.w.alikunlun.com`

2. **Cloudflare SaaS Setup**
   - Register any domain with Cloudflare (NS points to CF)
   - SSL/TLS → Custom Hostnames → Add main domain
   - Set Fallback Origin to Zeabur address
   - Add verification TXT record to Aliyun DNS

3. **Aliyun DNS Records**
   ```
   境内   CNAME  yourdomain.com.w.alikunlun.com
   境外   CNAME  xxx.yourdomain-cf-sas.com (CF SaaS fallback origin)
   默认   CNAME  yourdomain.com.w.alikunlun.com (fallback to domestic)
   ```

**Rationale:**
- Avoids Aliyun DNS free version A/CNAME caching bug (both CNAMEs, no mixing)
- Domestic: Fast Aliyun CDN + Zeabur Node.js server
- International: Cloudflare global edge network
- Single domain management in Aliyun DNS

**Verification:**
- Use itdog.cn to test domestic latency (should be <30ms on CDN nodes)
- Use `curl -v --resolve` to verify international routing through Cloudflare

### Build Script Configuration

**Choice: Environment Variable Control with build.js Wrapper**

**package.json scripts:**
```json
{
  "scripts": {
    "build": "node build.js",
    "dev": "astro dev"
  }
}
```

**build.js:**
```javascript
import { execSync } from 'child_process';

const platform = process.env.DEPLOY_PLATFORM || 'node';
const command = 'astro build';

// Note: In production, use execFileNoThrow utility from src/utils/execFileNoThrow.ts
// for safer command execution. This is a simple wrapper for build time only.
execSync(command, { stdio: 'inherit' });
```

**Deployment Environment Variables:**
- **Zeabur**: `DEPLOY_PLATFORM=node` (or omit, uses default)
- **Cloudflare Pages**: `DEPLOY_PLATFORM=cloudflare`

**Rationale:**
- Single build command (`npm run build`) works everywhere
- Environment variable injection is cleaner than maintaining two script entries
- Developers don't need to remember which build script to use
- Avoids "built with wrong adapter" errors
- Works with both Zeabur deployment panel and Cloudflare Pages CI/CD

### Documentation Approach

**Choice: Equal Platform Treatment + Multi-Platform Guide**

**README Structure:**
1. **Quick Start** - Platform-agnostic setup instructions
2. **Deployment Options** - Two sections, equal prominence:
   - "Deploy to Zeabur (Recommended for domestic users)"
   - "Deploy to Cloudflare Pages (Recommended for international users)"
3. **Advanced: Multi-Region Setup** - Link to DEPLOYMENT.md for dual-platform routing

**DEPLOYMENT.md Contents:**
- Complete guide for multi-region deployment
- Aliyun DNS configuration (with screenshots)
- Aliyun CDN setup steps
- Cloudflare SaaS configuration
- Environment variable reference
- Troubleshooting section

**Rationale:**
- Open-source users can choose either platform without bias
- Advanced multi-region setup is documented but not required
- Clear separation between basic (single platform) and advanced (multi-region)
- README stays concise, detailed guide in separate file

### Claude's Discretion
- Exact Aliyun CDN cache configuration TTL values
- Cloudflare SaaS custom hostname SSL settings (Flexible vs Full)
- DNS propagation wait times in deployment scripts
- Error messages for misconfigured routing

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Astro Deployment Configuration
- `/withastro/docs` — Astro official documentation on adapters and deployment
  - Guides → Deploy → Cloudflare (Cloudflare adapter setup)
  - Guides → Deploy → Node (Node.js adapter setup)
  - Guides → Environment Variables (Mode-specific configuration, `loadEnv` usage)
  - Reference → Configuration Reference (adapter property, env schema)

### Existing Deployment Configuration
- `.github/workflows/deploy.yml` — Current Cloudflare Pages deployment workflow (updated with Node.js 22, Wrangler command fix)
- `astro.config.mjs` — Current configuration using `@astrojs/node` adapter
- `package.json` — Current build scripts (to be updated with `build.js` wrapper)

### Debug Session Context
- `.planning/phases/11-ip-1-zebra-2-cloudflare-readme/DEBUG-SESSION-2026-04-11.md` — Full investigation of deployment failures, Node.js compatibility issues, and architecture analysis

### Project Requirements
- `.planning/REQUIREMENTS.md` — Deployment requirements for open-source project
- `.planning/PROJECT.md` — Tech stack (Astro 6, Neon Postgres, Drizzle ORM) and deployment platform constraints

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`.github/workflows/deploy.yml`** — GitHub Actions workflow (needs update for environment variable support)
- **`astro.config.mjs`** — Current Node.js adapter configuration (needs conditional adapter logic)
- **`package.json`** — Build scripts (needs `build.js` wrapper addition)

### Established Patterns
- **Astro SSR**: Server-side rendering with database queries via Drizzle ORM
- **Environment variables**: Database connection via `DATABASE_URL`, Resend API via `RESEND_API_KEY`
- **Deployment platforms**: Zeabur (working), Cloudflare Pages (404 due to adapter mismatch)

### Integration Points
- **Build script**: Create `build.js` wrapper that reads `DEPLOY_PLATFORM` and calls `astro build`
- **Astro config**: Add conditional adapter selection based on `process.env.DEPLOY_PLATFORM`
- **GitHub Actions**: Update workflow to support both platforms via environment variables
- **Documentation**: Update README.md with deployment sections, create DEPLOYMENT.md

### New Files Required
- `build.js` - Build script wrapper (root directory)
- `DEPLOYMENT.md` - Comprehensive deployment guide (root directory)
- `.env.cloudflare.example` - Cloudflare-specific environment variables (if needed)
- `.env.zeabur.example` - Zeabur-specific environment variables (if needed)

</code_context>

<specifics>
## Specific Ideas

**From User Requirements:**
- "主要是多地部署的问题，他们都用同一个域名，但是通过 IP 导向不同的实际站点：1. 国内导向 Zebra 2. 国外导向 Cloudflare"
- Multi-region deployment under single domain is core requirement
- Deployment must work correctly before documentation updates
- Open-source project requires clear deployment instructions

**From Debug Session Analysis:**
- Static export is not acceptable (倒退)
- SSR must be preserved for database-driven portfolio
- Official Astro solution exists (found in documentation)
- This pattern will be reusable in other projects ("这是个非常重要的功能")

**Routing Configuration (User's Detailed Plan):**
- Aliyun DNS 智能解析 with three lines (境内/境外/默认)
- All CNAME records (no A records) to avoid Aliyun DNS cache pollution bug
- Aliyun CDN for domestic with Zeabur origin
- Cloudflare SaaS Custom Hostname for international fallback
- Verification via itdog.cn (domestic) and curl --resolve (international)

**Documentation Philosophy:**
- Equal treatment of both platforms (no "recommended" bias)
- Single-platform deployment for most users
- Multi-region as advanced optional feature
- Environment variable control: "部署平台通过 `DEPLOY_PLATFORM` 环境变量区分，默认为 `node`（Zeabur）"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-ip-1-zebra-2-cloudflare-readme*
*Context gathered: 2026-04-12*
