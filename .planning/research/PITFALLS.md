# Pitfalls Research

**Domain:** Astro + Cloudflare Workers + Neon Postgres
**Researched:** 2026-03-27
**Confidence:** HIGH

---

## Critical Pitfalls

### Pitfall 1: Sharp Image Service Incompatibility

**What goes wrong:**
The default Astro image service (Sharp) uses native Node.js modules that cannot run in Cloudflare's `workerd` edge runtime. Deployments fail with cryptic compilation errors or images simply don't render.

**Why it happens:**
Sharp depends on native bindings (libvips) that require a full Node.js environment. Cloudflare Workers run on V8 isolates, not Node.js, making Sharp incompatible with on-demand rendered routes.

**How to avoid:**
Configure the Cloudflare adapter with the correct `imageService` option:
```javascript
// astro.config.mjs
export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare-binding', // default in Astro 6+
  }),
});
```
Or for build-time-only image processing:
```javascript
adapter: cloudflare({
  imageService: { build: 'compile', runtime: 'cloudflare-binding' }
}),
```

**Warning signs:**
- Build errors mentioning `sharp`, `libvips`, or native modules
- Images working locally but failing in production
- `Error: Cannot find module 'sharp'` in Cloudflare logs

**Phase to address:** Phase 1 (Foundation) - Set correct adapter configuration from the start.

---

### Pitfall 2: Astro.locals.runtime API Removed (Astro 6 Breaking Change)

**What goes wrong:**
Code accessing `Astro.locals.runtime.env` throws runtime errors. This API was removed in Astro 6 / @astrojs/cloudflare v13.

**Why it happens:**
The adapter was refactored to use Cloudflare's Vite plugin directly, changing how environment variables and bindings are accessed.

**How to avoid:**
Use the new import patterns:
```javascript
// OLD (removed in Astro 6)
const { env } = Astro.locals.runtime;
const { cf } = Astro.locals.runtime;

// NEW (Astro 6+)
import { env } from 'cloudflare:workers';
const cf = Astro.request.cf;
const ctx = Astro.locals.cfContext;
```

**Warning signs:**
- `Cannot read properties of undefined (reading 'env')`
- Code that worked in Astro 5 breaks after upgrade
- Environment variables returning undefined

**Phase to address:** Phase 1 (Foundation) - Use correct patterns from the start.

---

### Pitfall 3: Neon Cold Starts Causing Timeouts

**What goes wrong:**
First requests to the newsletter subscription endpoint timeout or feel sluggish. Users may see "Network Error" or 504 Gateway Timeout.

**Why it happens:**
Neon scales compute to zero after 5 minutes of inactivity by default. Waking up an idle compute takes 300-500ms, which can exceed default timeout settings in serverless environments.

**How to avoid:**
1. **Increase connection timeouts** in your database client:
   ```javascript
   const sql = neon(process.env.DATABASE_URL, {
     fetchOptions: { signal: AbortSignal.timeout(10000) }
   });
   ```

2. **Implement retry logic with exponential backoff:**
   ```javascript
   import retry from 'async-retry';
   const result = await retry(
     async () => sql`SELECT * FROM emails WHERE id = ${id}`,
     { retries: 3, minTimeout: 1000, randomize: true }
   );
   ```

3. **Configure longer suspend timeout** (paid plans):
   ```bash
   curl -X PATCH "https://console.neon.tech/api/v2/projects/{project_id}/endpoints/{endpoint_id}" \
     -d '{"endpoint":{"suspend_timeout_seconds":3600}}'
   ```

4. **Use same region** for app and database to minimize latency.

**Warning signs:**
- First request of the day is slow, subsequent requests are fast
- Intermittent timeout errors on low-traffic endpoints
- "Connection timeout" errors in logs

**Phase to address:** Phase 2 (Newsletter Backend) - Implement from the start.

---

### Pitfall 4: Environment Variables Not Loading Correctly

**What goes wrong:**
`process.env.DATABASE_URL` is undefined in production, or values differ between local dev and deployed environments.

**Why it happens:**
Cloudflare Workers don't use `process.env`. Environment variables must be configured through Wrangler and accessed via `cloudflare:workers` import.

**How to avoid:**
1. **Define non-sensitive vars in `wrangler.jsonc`:**
   ```json
   {
     "vars": {
       "MY_VARIABLE": "test"
     }
   }
   ```

2. **Set secrets via CLI (never in config):**
   ```bash
   npx wrangler secret put DATABASE_URL
   ```

3. **Create `.dev.vars` for local development:**
   ```env
   DATABASE_URL=postgresql://...
   MY_VARIABLE=local_value
   ```

4. **Access correctly in code:**
   ```javascript
   import { env } from 'cloudflare:workers';
   const dbUrl = env.DATABASE_URL;
   ```

**Warning signs:**
- "undefined" appearing where env values should be
- Different behavior in `astro dev` vs production
- Secrets visible in wrangler.jsonc (security issue!)

**Phase to address:** Phase 1 (Foundation) - Set up env handling correctly from day one.

---

### Pitfall 5: Node.js Dependencies Failing in Edge Runtime

**What goes wrong:**
Packages using `require()`, `node:fs`, `node:path`, or other Node.js APIs throw errors in Cloudflare Workers.

**Why it happens:**
Cloudflare's `workerd` runtime doesn't support all Node.js APIs. CommonJS syntax and Node-specific modules fail.

**How to avoid:**
1. **Enable Node.js compatibility flag:**
   ```json
   // wrangler.jsonc
   {
     "compatibility_flags": ["nodejs_compat"]
   }
   ```

2. **Pre-compile problematic dependencies** via Vite:
   ```javascript
   // astro.config.mjs
   function noExternalPlugin() {
     return {
       name: "optimize-dependencies",
       configEnvironment(environment) {
         if (environment !== 'client') {
           return {
             optimizeDeps: {
               include: ["postcss"]
             }
           };
         }
       }
     }
   }
   ```

3. **Use `prerenderEnvironment: 'node'`** if prerendered pages need Node.js APIs:
   ```javascript
   adapter: cloudflare({
     prerenderEnvironment: 'node',
   }),
   ```

**Warning signs:**
- `require is not defined` errors
- `Cannot find module 'node:fs'` errors
- Packages working locally but failing in production

**Phase to address:** Phase 1 (Foundation) - Configure compatibility early.

---

### Pitfall 6: Server Island Hydration Failures

**What goes wrong:**
React components wrapped in server islands throw `hydrate(...) is not available on the server` or show hydration mismatch errors.

**Why it happens:**
Server islands have specific constraints around when and how they hydrate. Lifecycle functions and browser APIs aren't available during SSR.

**How to avoid:**
1. **Don't use browser APIs in server component body:**
   ```javascript
   // WRONG
   const width = window.innerWidth;

   // RIGHT - use client:* directive
   <ClientComponent client:visible />
   ```

2. **Ensure server/client HTML matches:**
   - Don't use `Date.now()` or `Math.random()` in render
   - Don't conditionally render based on browser state

3. **Use correct hydration directive:**
   - `client:load` - hydrate immediately (interactive above fold)
   - `client:visible` - hydrate when visible (below fold)
   - `client:idle` - hydrate on browser idle (non-critical)

**Warning signs:**
- "Hydration failed" console errors
- UI "flash" or layout shift after load
- Interactive elements not responding

**Phase to address:** Phase 2 (Core UI) - Follow island patterns from the start.

---

### Pitfall 7: Neon Free Tier Limits Exceeded

**What goes wrong:**
Application stops working mid-month with database connection errors. No warning emails received.

**Why it happens:**
Neon free tier has strict limits (100 compute hours/month, 5GB data transfer) that can be exceeded without notification.

**How to avoid:**
1. **Monitor usage** in Neon Console dashboard
2. **Use connection pooling** to reduce compute time
3. **Cache frequently accessed data** to reduce queries
4. **Set up billing alerts** if available

**Free Tier Limits:**
| Resource | Limit |
|----------|-------|
| Compute Hours | 100 CU-hrs/month |
| Data Transfer | 5 GB/month |
| Storage | 0.5 GB |

**Warning signs:**
- Sudden database connection failures
- Errors only appearing late in the month
- "Compute quota exceeded" messages

**Phase to address:** Ongoing - Monitor from Phase 2 onwards.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip retry logic | Faster initial implementation | Users see timeouts on cold starts | Never for production |
| Hardcode env values | Works locally immediately | Security risk, breaks in prod | Never |
| Use `client:load` everywhere | Simpler mental model | Larger JS bundle, slower loads | MVP only, refactor before launch |
| Skip TypeScript for DB queries | Faster prototyping | Runtime SQL errors | Never - use Drizzle from start |
| Ignore cold start handling | Simpler code | 500ms+ latency on first request | Acceptable for internal tools |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Wrangler** | Running `wrangler pages dev` instead of `astro dev` | Use `astro dev` which now uses workerd runtime |
| **Neon** | Using `pg` package instead of `@neondatabase/serverless` | Use the Neon serverless driver for edge compatibility |
| **Environment vars** | Using `process.env` directly | Import from `cloudflare:workers` |
| **Secrets** | Adding secrets to wrangler.jsonc | Use `wrangler secret put` CLI command |
| **Images** | Using Sharp directly | Use `imageService: 'cloudflare-binding'` |
| **Sessions** | Forgetting KV binding for session storage | KV is auto-provisioned, but verify binding exists |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| No connection pooling | Slow queries, connection timeouts | Use Neon's pooled connection string | 100+ concurrent users |
| Missing cache headers | High compute usage, slow responses | Set appropriate cache headers | 1000+ daily users |
| Large client bundles | Slow Time to Interactive (TTI) | Use `client:visible`, code splitting | Any production launch |
| No pagination on articles | Slow page loads, high memory | Implement pagination (50 items/page) | 100+ articles |
| Unoptimized images | Large payloads, slow LCP | Use Astro's image optimization | Any images in content |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Database URL in git | Credential exposure | Use `wrangler secret put`, never commit `.dev.vars` |
| No input validation on newsletter | SQL injection, spam | Validate email format server-side |
| Missing rate limiting | Abuse, quota exhaustion | Implement per-IP rate limiting |
| Exposing stack traces | Information disclosure | Use error boundaries, generic error messages |
| Using neondb_owner role with RLS | Bypasses security policies | Create restricted role for app connections |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading states on async | Confusion, double-clicks | Show skeleton/spinner during data fetch |
| Slow cold start without feedback | "Broken" perception | Show "warming up" message, implement retry |
| No error feedback on form | User doesn't know if submitted | Show success/error toast messages |
| Missing hover states | Feels unpolished | Add subtle transitions matching design system |
| No mobile optimization | Poor experience on phones | Test touch targets, responsive grid |

---

## "Looks Done But Isn't" Checklist

- [ ] **Newsletter signup:** Often missing error handling — verify all error paths tested
- [ ] **Environment variables:** Often hardcoded in dev — verify `.dev.vars` used locally
- [ ] **Images:** Often work in dev but fail in prod — verify `imageService` config
- [ ] **Sessions:** Often missing KV binding — verify `wrangler.jsonc` has kv_namespaces
- [ ] **Secrets:** Often committed to git — run `git diff` before any commit
- [ ] **Cold start handling:** Often skipped — verify retry logic implemented
- [ ] **TypeScript types for env:** Often missing — run `wrangler types` after config changes

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong imageService config | LOW | Change adapter config, redeploy |
| Missing Node.js compat | LOW | Add flag to wrangler.jsonc, redeploy |
| Astro.locals.runtime usage | MEDIUM | Refactor to new import patterns |
| No retry logic | MEDIUM | Add retry wrapper around all DB calls |
| Hardcoded secrets | HIGH | Rotate all credentials, update all services |
| Missing error boundaries | MEDIUM | Add error.tsx files at route levels |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Sharp incompatibility | Phase 1 (Foundation) | Build succeeds, images render in prod |
| Astro.locals.runtime | Phase 1 (Foundation) | Env vars accessible via `cloudflare:workers` |
| Neon cold starts | Phase 2 (Newsletter) | First request after idle completes < 3s |
| Environment variables | Phase 1 (Foundation) | `wrangler types` generates correct types |
| Node.js dependencies | Phase 1 (Foundation) | All imports resolve in `workerd` |
| Server island hydration | Phase 2 (Core UI) | No hydration errors in console |
| Free tier limits | Ongoing | Monthly usage check in Neon Console |

---

## Sources

### Official Documentation
- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - HIGH confidence
- [Neon Connection Latency Docs](https://neon.com/docs/connect/connection-latency) - HIGH confidence
- [Neon Serverless Driver Docs](https://neon.com/docs/serverless/serverless-driver) - HIGH confidence
- [Cloudflare Workers Environment Variables](https://developers.cloudflare.com/workers/configuration/environment-variables/) - HIGH confidence

### GitHub Issues & Discussions
- [Astro #9059 - Sharp incompatibility](https://github.com/withastro/astro/issues/9059) - HIGH confidence
- [Astro #15796 - SSR build issues](https://github.com/withastro/astro/issues/15796) - HIGH confidence
- [Astro #15946 - Server island runtime access](https://github.com/withastro/astro/issues/15946) - HIGH confidence
- [Adapters #337 - Runtime environment access](https://github.com/withastro/adapters/issues/337) - HIGH confidence

### Community Resources
- [Reddit - Cloudflare support discussion](https://www.reddit.com/r/astrojs/comments/1k7gfv6/is_hosting_astro_on_cloudflare_fully_supported_no/) - MEDIUM confidence
- [Neon Free Tier Limits Discussion](https://www.answeroverflow.com/m/1278237121207078935) - MEDIUM confidence

---
*Pitfalls research for: Astro + Cloudflare + Neon deployment stack*
*Researched: 2026-03-27*
