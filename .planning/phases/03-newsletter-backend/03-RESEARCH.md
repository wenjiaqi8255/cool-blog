# Phase 3: Newsletter & Backend - Research

**Researched:** 2026-03-29
**Domain:** Astro server endpoints + Drizzle ORM + Neon Postgres + Resend email on Cloudflare Pages
**Confidence:** MEDIUM-HIGH

## Summary

Phase 3 adds newsletter subscription with a database backend to an Astro project currently deployed on Cloudflare Pages with `output: 'static'`. The critical architectural decision is that `output: 'static'` does NOT block server API routes -- you opt individual endpoints out of prerendering with `export const prerender = false`. Drizzle ORM paired with `@neondatabase/serverless` is the established stack for connecting to Neon from serverless environments. For email, Resend's REST API works anywhere (including Cloudflare Workers/Pages) and has a generous free tier (100 emails/day on free plan).

**Primary recommendation:** Use `drizzle-orm` + `@neondatabase/serverless` with the `neon-http` driver for simplicity, `output: 'hybrid'` in Astro config to enable server endpoints, and Resend for email delivery. The subscription flow should store confirmed subscribers immediately (no email confirmation step required per success criteria).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `drizzle-orm` | 0.45.2 | ORM for Postgres queries | Type-safe SQL, Drizzle Kit for migrations |
| `@neondatabase/serverless` | 1.0.2 | Neon serverless driver | HTTP and WebSocket support for edge |
| `resend` | 6.9.4 | Email delivery API | REST-based, works anywhere, generous free tier |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `drizzle-kit` | (latest) | Database migrations | Generate and run migrations |
| `react-email` | (latest) | Email templates | For styled confirmation emails |

**Installation:**
```bash
npm install drizzle-orm @neondatabase/serverless resend
npm install -D drizzle-kit
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── db/
│   ├── index.ts           # Drizzle client singleton
│   └── schema.ts          # Database schema
├── lib/
│   ├── email.ts           # Resend email utilities
│   └── db.ts              # Repository pattern for subscribers
├── pages/
│   └── api/
│       ├── subscribe.ts   # POST handler for subscription
│       └── resend.ts      # POST handler for resend confirmation
└── components/
    └── interactive/
        └── SubscribeModal.tsx  # Already exists, will wire to API
```

### Pattern 1: Astro Server Endpoint with Prerender Opt-Out

**What:** Individual API routes that run server-side on Cloudflare Pages Functions while the rest of the site remains static.

**When to use:** Need database writes or email sends alongside a predominantly static site.

**Astro config (`astro.config.mjs`):**
```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid', // enables server endpoints; pages default to static
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  // ...
});
```

**API route (`src/pages/api/subscribe.ts`):**
```typescript
import type { APIRoute } from 'astro';
export const prerender = false; // This makes it a server endpoint

export const POST: APIRoute = async ({ request }) => {
  // Handle subscription
};
```

**How it works on Cloudflare Pages:**
- `_worker.js` functions handle the server-rendered routes
- Static pages are served from the CDN as before
- No additional infrastructure needed -- it is Cloudflare Pages Functions

### Pattern 2: Drizzle ORM + Neon HTTP Driver

**What:** Database client using the Neon HTTP driver (faster for serverless single queries vs WebSockets).

**When to use:** Serverless environment where you need fast cold-start DB access.

**Schema (`src/db/schema.ts`):**
```typescript
import { pgTable, text, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  confirmed: boolean('confirmed').notNull().default(true),
  confirmationSentAt: timestamp('confirmation_sent_at'),
  confirmationToken: text('confirmation_token'),
});
```

**Client (`src/db/index.ts`):**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const db = drizzle(process.env.DATABASE_URL, { schema });
export { db, schema };
```

**Key distinction -- `neon-http` vs `neon-serverless`:**
- `neon-http` (used above): Faster cold-start, good for single queries, no connection pooling needed
- `neon-serverless`: WebSocket-based, needed for transactions, requires connection pool management

For newsletter subscription (single inserts), `neon-http` is preferred.

### Pattern 3: Resend Email with React Email Template

**What:** Send styled transactional emails via Resend's REST API with React Email for templates.

**When to use:** Confirmation and resend email functionality.

**Setup:**
```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(to: string) {
  const { data, error } = await resend.emails.send({
    from: 'Cool Blog <newsletter@yourdomain.com>',
    to,
    subject: 'You are subscribed to Cool Blog',
    react: SubscriptionEmailTemplate({ email: to }),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Failed to send email');
  }
  return data;
}
```

**Environment variables needed:**
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/cool-blog?sslmode=require
RESEND_API_KEY=re_xxxxx
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| DB connection management | Custom connection pool | `@neondatabase/serverless` driver | Handles Neon serverless connection lifecycle, HTTP keep-alive, WebSocket reuse |
| Email sending | Nodemailer + SMTP on Cloudflare | Resend REST API | Cloudflare Pages has no SMTP; Resend works via HTTP from any platform |
| Schema migrations | Raw SQL scripts | Drizzle Kit (`drizzle-kit push`) | Version-controlled migrations, generated TypeScript, works with Neon |
| Duplicate email prevention | Application-level check | DB UNIQUE constraint on `email` column | Atomic, race-condition safe, enforced at DB level |
| Email templates | String concatenation | React Email + Resend | Type-safe, styled HTML emails, maintainable |

## Common Pitfalls

### Pitfall 1: `output: 'static'` misconception
**What goes wrong:** Developers think they must change to `output: 'server'` to enable API routes, causing the entire site to become server-rendered.

**Why it happens:** `output: 'static'` means all routes prerender by default, but individual routes can opt out with `export const prerender = false`. You do not need `output: 'server'`.

**How to avoid:** Use `output: 'hybrid'` which makes this intent clearer. Pages with no `prerender` export remain static. Only API routes and dynamic pages need `prerender = false`.

### Pitfall 2: Neon connection string missing SSL
**What goes wrong:** Database queries fail silently or hang on Cloudflare Workers/Pages.

**Why it happens:** Neon requires `?sslmode=require` in the connection string. Without it, the connection is rejected.

**How to avoid:** Ensure `DATABASE_URL` in Cloudflare Pages dashboard is: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

### Pitfall 3: Cloudflare Pages environment variable access
**What goes wrong:** `process.env.DATABASE_URL` returns undefined in Workers/Pages Functions.

**Why it happens:** Cloudflare Pages Functions run as Workers, not Node.js. `process.env` is not automatically populated from the Pages dashboard environment variables in the Workers context.

**How to avoid:** Use `cloudflare.env.VAR_NAME` in Workers, or set bindings in `wrangler.toml`. For Astro with the Cloudflare adapter, the adapter handles env var injection -- ensure variables are set in Cloudflare Pages dashboard under Settings > Environment Variables.

### Pitfall 4: Cold start latency on first DB connection
**What goes wrong:** The first API call after a cold start takes 1-2 seconds.

**Why it happens:** Neon HTTP driver establishes connection on first query in serverless environment.

**How to avoid:** This is inherent to serverless. Accept ~1s cold start for first request. After that, connections are reused within the function instance. The `neon-http` driver is optimized for this pattern.

## Code Examples

### Subscription API endpoint
```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { sendConfirmationEmail } from '../../lib/email';

export const prerender = false;

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    const result = await db.insert(schema.subscribers).values({
      email,
      confirmed: true,
      confirmationSentAt: new Date(),
    }).returning();

    await sendConfirmationEmail(email);

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully subscribed'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email already subscribed'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({
      success: false,
      error: 'Subscription failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Updated SubscribeModal (wiring to API)
```typescript
// src/components/interactive/SubscribeModal.tsx (updated handleSubmit)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || isSubmitting) return;

  setIsSubmitting(true);
  setError('');

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Subscription failed');
    }

    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong');
  } finally {
    setIsSubmitting(false);
  }
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'server'` for any API | `output: 'hybrid'` + `prerender = false` per route | Astro 4+ | Only API routes are server-rendered, rest stays static |
| Cloudflare Pages adapter for Astro | Cloudflare **Workers** adapter (`@astrojs/cloudflare`) | Astro v13+ | Pages adapter removed; Workers is now the target |
| `neon-serverless` WebSocket driver | `neon-http` driver for serverless | 2024 | HTTP is faster and simpler for single-query workloads |
| Nodemailer + SMTP | Resend REST API | 2023+ | Works on serverless (no SMTP needed), easier setup |

**Deprecated/outdated:**
- `@astrojs/cloudflare-pages`: Removed in Astro v13 (use `@astrojs/cloudflare` for Workers)
- `neon-serverless` for simple inserts: Use `neon-http` instead for lower latency

## Open Questions

1. **Cloudflare Pages vs Workers targeting**
   - What we know: The `@astrojs/cloudflare` adapter generates Workers output; Pages is no longer a first-class target in Astro v13
   - What's unclear: Whether deploying via `wrangler pages deploy` (current approach) and the `cloudflare` adapter still work together, or if the project needs to migrate to pure Workers deployment
   - Recommendation: Keep current deployment approach but test API routes locally with `wrangler dev` before assuming compatibility

2. **Confirmation email flow**
   - What we know: Success criteria say "confirmation message" not "email verification link click"
   - What's unclear: Whether to use a simple "you are subscribed" email (immediate) or require email link confirmation (more complex)
   - Recommendation: Use immediate "you are subscribed" email per success criteria item 2 -- simpler to implement, sufficient for the success criteria

3. **Resend domain verification**
   - What we know: Resend requires domain verification for production sending
   - What's unclear: Whether the user has a domain ready for email sending
   - Recommendation: Start with Resend's test domain (`@resend.dev`) for development, migrate to verified domain before production

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.0.0 (unit) + Playwright 1.50.0 (E2E) |
| Config file | `vitest.config.ts`, `playwright.config.ts` |
| Quick run command | `npm run test:unit` |
| Full suite command | `npm run test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| NEWS-01 | Email input with client-side validation | Unit | `vitest run src/tests/unit/components/SubscribeModal.test.tsx` | Will be created |
| NEWS-02 | Email stored in Neon Postgres | Integration | `curl -X POST /api/subscribe -d '{"email":"test@test.com"}'` (manual) | Will create `src/pages/api/subscribe.ts` |
| NEWS-02 | Duplicate prevention at DB level | Unit | `vitest run src/tests/unit/lib/db.test.ts` | Will create |
| NEWS-03 | Confirmation message shown after subscribe | E2E | `playwright test src/tests/e2e/newsletter.spec.ts` | Will create |
| NEWS-04 | Resend confirmation endpoint works | Integration | `curl -X POST /api/resend -d '{"email":"test@test.com"}'` (manual) | Will create `src/pages/api/resend.ts` |

### Sampling Rate
- **Per task commit:** `npm run test:unit` (subset of relevant tests)
- **Per wave merge:** `npm run test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/tests/unit/components/SubscribeModal.test.tsx` -- covers NEWS-01
- [ ] `src/tests/unit/lib/db.test.ts` -- covers NEWS-02 duplicate prevention
- [ ] `src/tests/unit/lib/email.test.ts` -- covers NEWS-04 email sending
- [ ] `src/tests/e2e/newsletter.spec.ts` -- covers NEWS-03 E2E flow
- [ ] Framework install: Already in place (vitest + playwright + testing-library + happy-dom + jsdom)

## Sources

### Primary (HIGH confidence)
- [Astro Endpoints Documentation](https://docs.astro.build/en/guides/endpoints/) - Server endpoint pattern with `prerender = false`
- [Drizzle ORM + Neon Quick Start](https://orm.drizzle.team/docs/quick-start) - `neon-http` and `neon-serverless` driver setup
- [Resend Documentation](https://resend.com/docs/send-with-node) - SDK setup, API keys, email sending with React

### Secondary (MEDIUM confidence)
- [Astro Cloudflare Integration Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - Adapter configuration, server endpoints on Cloudflare
- WebFetch of Drizzle Neon connection guide - confirmed HTTP vs WebSocket driver distinction

### Tertiary (LOW confidence -- flagged for validation)
- Cloudflare Pages environment variable access pattern in Workers context -- verify during implementation
- Exact Astro v6 `output: 'hybrid'` behavior -- was introduced in Astro 4+, behavior should be stable but test during Phase 3 plan

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - packages confirmed at current versions, docs verified
- Architecture: HIGH - Astro hybrid mode pattern confirmed, Drizzle + Neon confirmed
- Pitfalls: MEDIUM - Cloudflare env var access pattern needs validation during implementation

**Research date:** 2026-03-29
**Valid until:** 2026-05-01 (Astro and Cloudflare adapter patterns are stable)