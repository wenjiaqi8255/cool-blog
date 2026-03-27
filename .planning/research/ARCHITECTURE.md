# Architecture Research

**Domain:** Astro + React Content Site with Bento Grid Layout
**Researched:** 2026-03-27
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                        CLIENT LAYER                               |
+------------------------------------------------------------------+
|  +------------+  +------------+  +------------+  +------------+  |
|  |   Header   |  |   Bento    |  |  Article   |  | Newsletter |  |
|  | Component  |  |   Grid     |  |   List     |  |    Form    |  |
|  | (Static)   |  | (Islands)  |  |  (Static)  |  | (React)    |  |
|  +-----+------+  +-----+------+  +-----+------+  +-----+------+  |
|        |               |               |               |          |
+--------+---------------+---------------+---------------+----------+
                              |
+-----------------------------v------------------------------------+
|                        ASTRO LAYER                               |
+------------------------------------------------------------------+
|  +------------------+  +------------------+  +----------------+  |
|  |  Pages/          |  |  Content         |  |  API Routes    |  |
|  |  - index.astro   |  |  Collections     |  |  - subscribe   |  |
|  |  - articles/     |  |  - articles/     |  |    .ts         |  |
|  |  - [slug].astro  |  |  - portfolio/    |  |                |  |
|  +--------+---------+  +--------+---------+  +-------+--------+  |
|           |                     |                     |           |
+-----------+---------------------+---------------------+-----------+
                              |
+-----------------------------v------------------------------------+
|                     CLOUDFLARE PAGES                             |
+------------------------------------------------------------------+
|  +-------------------+  +-------------------+                    |
|  | Static Assets     |  | Pages Functions   |                    |
|  | (SSG Output)      |  | (Serverless)      |                    |
|  +-------------------+  +---------+---------+                    |
|                                   |                               |
+-----------------------------------+------------------------------+
                                    |
+-----------------------------v------------------------------------+
|                        DATA LAYER                                |
+------------------------------------------------------------------+
|  +-------------------+  +-------------------+                    |
|  | Neon Postgres     |  | Markdown Files    |                    |
|  | (Subscribers)     |  | (Content)          |                    |
|  | @neondatabase/    |  | Git-managed        |                    |
|  | serverless        |  | Content Collections|                    |
|  +-------------------+  +-------------------+                    |
+------------------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **Header.astro** | Site branding, navigation tabs, subscribe CTA | Astro component (static) |
| **BentoGrid.astro** | Container for portfolio cards, grid layout | Astro component with CSS Grid |
| **BentoCard.astro** | Individual portfolio card with hover effects | Astro component (static) |
| **ImageCard.astro** | Card variant with grayscale-to-color effect | Astro component with CSS |
| **TerminalCard.astro** | Card with code/terminal styling | Astro component (static) |
| **ArticleList.astro** | Renders article previews from content collections | Astro component (static) |
| **ArticlePage.astro** | Full article rendering with syntax highlighting | Astro page with layout |
| **NewsletterForm.tsx** | Email capture with client-side validation | React island (`client:visible`) |
| **SearchFilter.tsx** | Article search and tag filtering | React island (`client:load`) |
| **SubscribeAPI** | Serverless endpoint for email storage | Cloudflare Pages Function |
| **BaseLayout.astro** | Shared page structure, meta tags, global styles | Astro layout component |
| **SEOLayout.astro** | Open Graph, Twitter Cards, meta tags | Astro layout component |

## Recommended Project Structure

```
cool-blog/
+-- public/
|   +-- fonts/
|   |   +-- Inter.woff2
|   |   +-- JetBrainsMono.woff2
|   +-- favicon.svg
|   +-- robots.txt
+-- src/
|   +-- components/
|   |   +-- bento/
|   |   |   +-- BentoGrid.astro
|   |   |   +-- BentoCard.astro
|   |   |   +-- ImageCard.astro
|   |   |   +-- TerminalCard.astro
|   |   |   +-- index.ts
|   |   +-- articles/
|   |   |   +-- ArticleCard.astro
|   |   |   +-- ArticleList.astro
|   |   |   +-- TagFilter.astro
|   |   +-- newsletter/
|   |   |   +-- NewsletterForm.tsx    # React island
|   |   |   +-- NewsletterSuccess.tsx
|   |   +-- search/
|   |   |   +-- SearchFilter.tsx      # React island
|   |   +-- navigation/
|   |   |   +-- Header.astro
|   |   |   +-- TabNavigation.astro
|   |   |   +-- Footer.astro
|   +-- content/
|   |   +-- articles/
|   |   |   +-- article-1.md
|   |   |   +-- article-2.md
|   |   +-- portfolio/
|   |   |   +-- project-1.md
|   |   |   +-- project-2.md
|   |   +-- content.config.ts         # Zod schemas
|   +-- layouts/
|   |   +-- BaseLayout.astro
|   |   +-- ArticleLayout.astro
|   |   +-- SEOLayout.astro
|   +-- pages/
|   |   +-- index.astro               # Main page with tabs
|   |   +-- articles/
|   |   |   +-- index.astro           # Article list
|   |   |   +-- [slug].astro          # Individual article
|   |   +-- api/
|   |   |   +-- subscribe.ts          # Newsletter API endpoint
|   |   +-- rss.xml.js                # RSS feed generation
|   |   +-- 404.astro
|   +-- styles/
|   |   +-- global.css
|   |   +-- bento.css                 # Bento grid styles
|   |   +-- typography.css
|   +-- lib/
|   |   +-- db.ts                     # Neon connection setup
|   |   +-- newsletter.ts             # Newsletter business logic
|   +-- utils/
|   |   +-- formatDate.ts
|   |   +-- slugify.ts
+-- astro.config.mjs
+-- package.json
+-- tsconfig.json
```

### Structure Rationale

- **components/bento/**: Isolated Bento Grid components for easy maintenance and reusability. The `index.ts` barrel export simplifies imports.
- **components/articles/**: Article-related components grouped together for cohesive feature development.
- **components/newsletter/**: React components isolated as they require client-side hydration (islands).
- **content/**: Astro Content Collections for type-safe Markdown management with Zod schemas.
- **layouts/**: Shared page structures following Astro conventions.
- **pages/api/**: Serverless API routes handled by Cloudflare Pages Functions.
- **lib/**: Database connections and business logic separated from UI components.

## Architectural Patterns

### Pattern 1: Islands Architecture with Selective Hydration

**What:** Astro renders static HTML by default, only hydrating interactive components (islands) when needed. This minimizes JavaScript sent to the client.

**When to use:** Use for interactive elements that require client-side state or event handlers. Static content remains zero-JS.

**Trade-offs:**
- (+) Excellent performance, minimal JavaScript payload
- (+) SEO-friendly (static HTML)
- (-) Requires understanding client directives
- (-) React islands cannot share state directly (use nanostores or React Query)

**Example:**
```astro
---
// index.astro
import NewsletterForm from '../components/newsletter/NewsletterForm.tsx';
import BentoGrid from '../components/bento/BentoGrid.astro';
---

<!-- Static component - no JS sent to client -->
<BentoGrid cards={portfolioCards} />

<!-- React island - hydrated when visible in viewport -->
<NewsletterForm client:visible />

<!-- Alternative directives: -->
<!-- client:load = hydrate immediately -->
<!-- client:idle = hydrate when browser idle -->
<!-- client:visible = hydrate when in viewport -->
```

### Pattern 2: Content Collections with Zod Schemas

**What:** Astro Content Collections provide type-safe content management using Zod for schema validation. Markdown frontmatter is validated at build time.

**When to use:** All Markdown/MDX content (articles, portfolio items) should use content collections for type safety and autocompletion.

**Trade-offs:**
- (+) Type safety and autocompletion in IDE
- (+) Build-time validation catches errors early
- (+) Automatic slug generation and content queries
- (-) Requires defining schemas upfront
- (-) Schema changes require migration of existing content

**Example:**
```typescript
// src/content/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    span: z.enum(['col-1', 'col-2', 'col-4', 'row-2']).default('col-1'),
    variant: z.enum(['light', 'dark']).default('light'),
    link: z.string().url().optional(),
  }),
});

export const collections = { articles, portfolio };
```

```astro
---
// src/pages/articles/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await render(article);
---

<article>
  <h1>{article.data.title}</h1>
  <Content />
</article>
```

### Pattern 3: CSS Grid Bento Layout

**What:** Use CSS Grid with `grid-template-columns` and `grid-column`/`grid-row` spans to create flexible Bento layouts without JavaScript layout libraries.

**When to use:** Portfolio grids, dashboard layouts, any modular card-based design.

**Trade-offs:**
- (+) Pure CSS, no JavaScript required
- (+) Responsive with media queries or `auto-fill`
- (+) Source order independence
- (-) Complex spanning requires careful planning
- (-) IE11 not supported (not a concern in 2026)

**Example:**
```css
/* src/styles/bento.css */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  min-height: 320px;
}

.bento-card {
  min-height: 320px;
  background: #F7F7F7;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover {
  transform: translateY(-2px);
}

/* Span variants */
.bento-card[data-span="col-2"] {
  grid-column: span 2;
}

.bento-card[data-span="col-4"] {
  grid-column: span 4;
}

.bento-card[data-span="row-2"] {
  grid-row: span 2;
}

/* Dark variant */
.bento-card[data-variant="dark"] {
  background: #111111;
  color: #FFFFFF;
}

/* Responsive */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bento-card[data-span="col-4"] {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }

  .bento-card[data-span] {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

### Pattern 4: Serverless API with Neon Postgres

**What:** Use Cloudflare Pages Functions for API endpoints, connecting to Neon Postgres via the `@neondatabase/serverless` driver.

**When to use:** Newsletter subscriptions, any data that requires database persistence.

**Trade-offs:**
- (+) Edge-compatible (WebSocket connections)
- (+) Connection pooling via Neon's PgBouncer
- (+) Generous free tier
- (-) Cold starts on first request
- (-) Limited connection lifetime (use connection pooling URL)

**Example:**
```typescript
// src/lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { subscribers } from '../../lib/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if already subscribed
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return new Response(JSON.stringify({ message: 'Already subscribed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert new subscriber
    await db.insert(subscribers).values({
      email,
      subscribedAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Data Flow

### Request Flow

```
[User visits page]
       |
       v
[Astro SSG] --> [Static HTML served from Cloudflare CDN]
       |
       v
[Client loads page]
       |
       +-- [React islands hydrate on trigger (visible/load)]
       |           |
       |           v
       |    [User interacts with NewsletterForm]
       |           |
       |           v
       |    [POST /api/subscribe]
       |           |
       |           v
       |    [Cloudflare Pages Function]
       |           |
       |           v
       |    [Neon Postgres (via serverless driver)]
       |           |
       |           v
       |    [Response: success/error]
       |
       +-- [Static content remains zero-JS]
```

### Content Flow

```
[Markdown files in src/content/]
       |
       v
[Astro Content Collections]
       |
       +-- [Zod schema validation]
       |
       v
[getCollection() / getEntry()]
       |
       v
[Pages render static HTML]
       |
       v
[Build output to Cloudflare Pages]
```

### Key Data Flows

1. **Article Reading Flow:** User navigates to `/articles/[slug]` -> Astro prerendered page serves static HTML -> Syntax-highlighted code blocks rendered at build time -> Zero client-side JavaScript for reading.

2. **Newsletter Subscription Flow:** User enters email in React form -> Form validates client-side -> POST to `/api/subscribe` -> Cloudflare Pages Function executes -> Neon Postgres stores email -> Success response updates UI.

3. **Search/Filter Flow:** User types in search input -> React island (`client:load`) filters articles -> Client-side filtering of static data (no API calls needed for small datasets).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current architecture is optimal. Static generation handles traffic spikes. Newsletter API uses Neon's free tier. |
| 1k-100k users | Add caching headers for API responses. Consider Cloudflare KV for rate limiting. Enable Neon's connection pooling. |
| 100k+ users | Consider ISR (Incremental Static Regeneration) for frequently updated content. Add CDN caching for API. May need dedicated Neon plan. |

### Scaling Priorities

1. **First bottleneck:** Newsletter API under high submission volume. **Fix:** Add rate limiting via Cloudflare KV, implement queue-based processing.

2. **Second bottleneck:** Large article count slowing builds. **Fix:** Implement pagination, consider ISR for article pages, or use Astro's live content collections for real-time data.

## Anti-Patterns

### Anti-Pattern 1: Hydrating Everything with `client:load`

**What people do:** Adding `client:load` to all React components "just in case."

**Why it's wrong:** Defeats the purpose of islands architecture. Ships unnecessary JavaScript, hurts performance scores.

**Do this instead:** Only hydrate components that need interactivity. Use `client:visible` for below-fold content. Keep as much as possible in Astro components (static).

### Anti-Pattern 2: Client-Side Data Fetching for Static Content

**What people do:** Using `fetch()` in React components to load article data.

**Why it's wrong:** Articles are static content. Client-side fetching adds latency, hurts SEO, breaks without JavaScript.

**Do this instead:** Use Astro's `getCollection()` at build time. Pass data as props to components. Articles render as static HTML.

### Anti-Pattern 3: Direct Database Connections from Client

**What people do:** Exposing DATABASE_URL to client-side code.

**Why it's wrong:** Security vulnerability. Credentials exposed. Direct connections from browsers are blocked anyway.

**Do this instead:** All database access through API routes (`src/pages/api/`). Database credentials stay server-side only.

### Anti-Pattern 4: Over-Engineering the Bento Grid

**What people do:** Using JavaScript layout libraries (Masonry, react-grid-layout) for static portfolio grids.

**Why it's wrong:** Adds unnecessary JavaScript. CSS Grid handles layout perfectly. Layout shifts during hydration.

**Do this instead:** Use pure CSS Grid with `grid-column` and `grid-row` spans. Define span values in frontmatter. No JavaScript needed for layout.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Neon Postgres** | `@neondatabase/serverless` driver via API routes | Use pooled connection URL (`-pooler` suffix) for serverless |
| **Cloudflare Pages** | `@astrojs/cloudflare` adapter | Set `output: 'server'` or `output: 'hybrid'` in astro.config.mjs |
| **RSS Feed** | `@astrojs/rss` package | Generate at build time from content collections |
| **Sitemap** | `@astrojs/sitemap` integration | Auto-generates from pages |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Astro Pages <-> Content Collections | `getCollection()`, `getEntry()` | Synchronous, build-time |
| React Islands <-> API Routes | `fetch()` POST/GET | Async, runtime |
| API Routes <-> Neon Postgres | `@neondatabase/serverless` | WebSocket via connection pooler |
| Layouts <-> Pages | Astro slots | Static composition |

## Build Order Implications

Based on dependencies, the recommended implementation order:

### Phase 1: Foundation (No dependencies)
1. **Project setup** - Astro init, TypeScript, Tailwind/CSS
2. **BaseLayout** - Shared page structure
3. **Global styles** - Typography, colors, CSS variables
4. **Static Bento Grid** - CSS Grid layout, basic cards

### Phase 2: Content (Depends on Phase 1)
1. **Content Collections** - Schema definition, Markdown files
2. **Article pages** - List view, individual article pages
3. **Syntax highlighting** - Shiki or Prism for code blocks

### Phase 3: Interactivity (Depends on Phase 1-2)
1. **React integration** - `@astrojs/react`
2. **NewsletterForm** - React island with validation
3. **SearchFilter** - Client-side article filtering

### Phase 4: Backend (Depends on Phase 3)
1. **Neon setup** - Database, connection pooling
2. **Subscribe API** - Serverless endpoint
3. **Error handling** - Validation, rate limiting

### Phase 5: Polish (Depends on all above)
1. **SEO** - Meta tags, sitemap, robots.txt
2. **RSS feed** - Article syndication
3. **Performance audit** - Lighthouse, Core Web Vitals
4. **Deployment** - Cloudflare Pages configuration

## Sources

- [Astro Official Docs - Project Structure](https://docs.astro.build/en/basics/project-structure/) - HIGH confidence
- [Astro Official Docs - Content Collections](https://docs.astro.build/en/guides/content-collections/) - HIGH confidence
- [Astro Official Blog - Live Content Collections](https://astro.build/blog/live-content-collections-deep-dive/) - HIGH confidence
- [Astro Official Docs - @astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - HIGH confidence
- [Neon Docs - Serverless Driver](https://neon.com/blog/serverless-driver-for-postgres) - HIGH confidence
- [Neon Docs - Connection Pooling](https://neon.com/docs/connect/connection-pooling) - HIGH confidence
- [Cloudflare Docs - Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/) - HIGH confidence
- [Patterns.dev - Islands Architecture](https://www.patterns.dev/vanilla/islands-architecture/) - MEDIUM confidence
- [Feature-Sliced Design - Astro Islands](https://feature-sliced.design/blog/astro-islands-architecture) - MEDIUM confidence
- [Astro Docs - RSS Feed](https://docs.astro.build/en/recipes/rss/) - HIGH confidence
- [Astro Docs - Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - HIGH confidence
- [Building Serverless Newsletter Systems](https://samirpaulb.github.io/posts/serverless-newsletter-and-contact-system/) - MEDIUM confidence

---
*Architecture research for: Astro + React + Neon + Cloudflare Bento Grid Blog/Portfolio*
*Researched: 2026-03-27*
