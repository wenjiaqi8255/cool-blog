# Architecture Research

**Domain:** Astro + React Content Site with Bento Grid Layout
**Researched:** 2026-03-27
**Confidence:** HIGH

---

## Part I: Existing Architecture (v1.0)

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

---

---

# Part II: MCP Integration Architecture (v1.1)

**Domain:** Blog content management via MCP server
**Researched:** 2026-03-30
**Overall confidence:** HIGH

---

## Recommended MCP Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ARCHITECTURE (v1.1)                           │
└─────────────────────────────────────────────────────────────────────────────┘

                    Mobile Device (Claude App)
                           │
                           │ HTTPS (OAuth2/JWT)
                           ▼
              ┌──────────────────────────┐
              │    MCP Server (HTTP)     │  ← Separate process, same repo
              │   @casys/mcp-server      │     Port: 3001 (configurable)
              │                          │
              │  • Article Tools         │
              │  • OAuth2 Validation     │
              │  • Zod Input Schemas     │
              │  • Rate Limiting         │
              └───────────┬──────────────┘
                          │
                          │ DATABASE_URL (Neon)
                          ▼
              ┌──────────────────────────┐
              │    Neon Postgres         │  ← Existing database
              │                          │
              │  Tables:                 │
              │  • subscribers (exist)   │
              │  • articles (NEW)        │
              │  • article_versions      │
              └───────────┬──────────────┘
                          │
                          │ Drizzle ORM
                          ▼
              ┌──────────────────────────┐
              │   Astro Blog (Static)    │  ← Existing site
              │                          │
              │  Options:                │
              │  A) SSR + DB queries     │
              │  B) Rebuild trigger      │
              │  C) Hybrid (ISR)         │
              └──────────────────────────┘
                          │
                          ▼
                    Cloudflare Pages
```

### Component Boundaries (v1.1 Additions)

| Component | Responsibility | Communicates With | Process |
|-----------|---------------|-------------------|---------|
| **MCP Server** | Accept article content from Claude, validate, store in DB | Neon Postgres (write), Claude (tools) | Separate Node.js process |
| **Neon Postgres** | Persistent storage for articles and subscribers | MCP Server, Astro (optional SSR) | Managed service |
| **Astro Blog** | Static site generation, article rendering | Neon (if SSR), Cloudflare (deploy) | Build process |
| **Claude App** | Mobile interface for writing articles | MCP Server (HTTP transport) | External client |

### Data Storage: New `articles` Table

```sql
-- Add to existing schema alongside subscribers table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,           -- Raw Markdown
  excerpt TEXT,
  tags TEXT[] NOT NULL,            -- Array of tag strings
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cover_image VARCHAR(500),
  draft BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version history for drafts/revisions
CREATE TABLE article_versions (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_draft ON articles(draft);
CREATE INDEX idx_articles_date ON articles(date DESC);
```

**Drizzle Schema Addition** (`src/db/schema.ts`):

```typescript
import { pgTable, text, timestamp, boolean, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  tags: text('tags').array().notNull(),
  date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  draft: boolean('draft').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const articleVersions = pgTable('article_versions', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## Integration Points (v1.1)

### NEW Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `mcp-server/` | New directory at repo root | MCP server implementation |
| `mcp-server/index.ts` | Entry point | HTTP server, tool definitions |
| `mcp-server/tools/` | Tool modules | `create-article`, `update-article`, `list-articles` |
| `mcp-server/schemas/` | Zod schemas | Input validation for all tools |
| `mcp-server/auth/` | Authentication | OAuth2/JWT validation middleware |
| `src/db/schema.ts` | Modified | Add `articles` and `article_versions` tables |
| `.env` | Modified | Add MCP server secrets (JWT_SECRET, etc.) |

### MODIFIED Components

| Component | Change Required | Reason |
|-----------|-----------------|--------|
| `astro.config.mjs` | Add API route OR ISR config | Support rebuild trigger or SSR |
| `src/pages/articles/[slug].astro` | DB query option | Read from DB instead of files (if SSR) |
| `package.json` | Add MCP dependencies | `@casys/mcp-server`, `zod` |
| Drizzle migrations | New migration file | Create articles tables |

### Integration Options

#### Option A: SSR Mode (Recommended for real-time)

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server',  // Changed from 'static'
  adapter: cloudflare(),
});
```

```astro
---
// src/pages/articles/[slug].astro
import { db } from '../../db';
import { articles } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function getStaticPaths() {
  // For SSR, this can be dynamic or pre-render common pages
  const allArticles = await db.select().from(articles).where(eq(articles.draft, false));
  return allArticles.map(article => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
---
```

**Pros:** Real-time updates, no rebuild needed
**Cons:** Loses pure static benefits, requires CF Workers

#### Option B: Rebuild Trigger (Preserves static)

```typescript
// src/pages/api/rebuild.ts
export async function POST({ request }) {
  // Verify webhook secret
  const signature = request.headers.get('x-webhook-signature');
  if (!verifySignature(signature)) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Trigger Cloudflare build
  await fetch(process.env.CLOUDFLARE_BUILD_HOOK, { method: 'POST' });

  return new Response('Build triggered', { status: 200 });
}
```

**MCP Server** calls this endpoint after article creation:

```typescript
// mcp-server/tools/create-article.ts
await fetch('https://kernel-panic.dev/api/rebuild', {
  method: 'POST',
  headers: { 'x-webhook-signature': generateSignature() },
});
```

**Pros:** Keeps static output, simple deployment
**Cons:** Delay (30-60s rebuild), build minutes cost

#### Option C: Hybrid ISR (Best of both)

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid',  // Static by default, ISR for specific pages
  adapter: cloudflare(),
});
```

```astro
---
// src/pages/articles/[slug].astro
export const prerender = false;  // Enable ISR for this page

// Revalidate every 5 minutes
export const revalidate = 300;
---
```

**Pros:** Near real-time, reduced DB queries
**Cons:** Requires Cloudflare Workers, more complex

---

## Data Flow (v1.1)

### Article Creation Flow

```
1. USER WRITES ON MOBILE
   ┌─────────────────────┐
   │  Claude App (iOS)   │
   │  "Write article..." │
   └──────────┬──────────┘
              │
              ▼

2. CLAUDE CALLS MCP TOOL
   ┌─────────────────────────────────────────┐
   │  Tool: create_article                   │
   │  Args: {                                │
   │    title: "...",                        │
   │    content: "# Markdown...",            │
   │    tags: ["ML", "Tutorial"],            │
   │    draft: false                         │
   │  }                                      │
   └──────────┬──────────────────────────────┘
              │
              ▼

3. MCP SERVER VALIDATES & STORES
   ┌─────────────────────────────────────────┐
   │  1. OAuth2/JWT auth check               │
   │  2. Zod schema validation               │
   │  3. Generate slug from title            │
   │  4. Extract excerpt (first 150 chars)   │
   │  5. Insert into Neon articles table     │
   │  6. Return success + article URL        │
   └──────────┬──────────────────────────────┘
              │
              ▼

4. TRIGGER REBUILD (Option B)
   ┌─────────────────────────────────────────┐
   │  POST /api/rebuild                      │
   │  → Cloudflare build hook                │
   │  → Astro queries DB during build        │
   │  → Static pages regenerated             │
   └──────────┬──────────────────────────────┘
              │
              ▼

5. ARTICLE LIVE
   ┌─────────────────────────────────────────┐
   │  https://kernel-panic.dev/articles/...  │
   │  Rendered from DB data                  │
   └─────────────────────────────────────────┘
```

### MCP Tool Definitions

```typescript
// mcp-server/tools/create-article.ts
import { z } from 'zod';
import { db } from '../../src/db';
import { articles } from '../../src/db/schema';

const CreateArticleSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  tags: z.array(z.enum(['ML', 'Systems', 'Tutorial', 'Project', 'Notes'])).min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  draft: z.boolean().default(true),
});

export const createArticleTool = {
  name: 'create_article',
  description: 'Create a new blog article with Markdown content',
  inputSchema: CreateArticleSchema,
  handler: async (input: z.infer<typeof CreateArticleSchema>) => {
    // Generate slug from title
    const slug = slugify(input.title);

    // Extract excerpt if not provided
    const excerpt = input.excerpt || input.content.substring(0, 150) + '...';

    // Insert into database
    const [article] = await db.insert(articles).values({
      slug,
      title: input.title,
      content: input.content,
      excerpt,
      tags: input.tags,
      coverImage: input.coverImage,
      draft: input.draft,
    }).returning();

    return {
      content: [{
        type: 'text',
        text: `Article created: https://kernel-panic.dev/articles/${slug}`,
      }],
    };
  },
};
```

---

## Security Architecture (v1.1)

### Authentication Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: OAuth2/JWT (Transport)
┌─────────────────────┐
│  Claude App         │
│  ┌───────────────┐  │
│  │ Access Token  │──┼───► Authorization: Bearer <JWT>
│  └───────────────┘  │
└─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  MCP Server Middleware                  │
│  • Verify JWT signature                 │
│  • Check token expiration               │
│  • Extract user identity                │
│  • Reject if invalid (401)              │
└─────────────────────────────────────────┘

Layer 2: Zod Input Validation (Application)
┌─────────────────────────────────────────┐
│  Every tool input validated:            │
│  • Type checking                        │
│  • Length limits (title max 500 chars)  │
│  • Enum constraints (valid tags)        │
│  • Format validation (URLs, dates)      │
│  • Reject if invalid (400)              │
└─────────────────────────────────────────┘

Layer 3: SQL Injection Prevention (Data)
┌─────────────────────────────────────────┐
│  Drizzle ORM parameterized queries:     │
│  • Automatic escaping                   │
│  • No raw SQL strings                   │
│  • Type-safe database access            │
└─────────────────────────────────────────┘

Layer 4: Rate Limiting (Availability)
┌─────────────────────────────────────────┐
│  @casys/mcp-server built-in:            │
│  • 10 requests/minute per user          │
│  • 100 requests/hour per user           │
│  • IP-based blocking for abuse          │
└─────────────────────────────────────────┘
```

### Input Validation Schemas

```typescript
// mcp-server/schemas/article.ts
import { z } from 'zod';

export const ArticleContentSchema = z.string()
  .min(1, 'Content cannot be empty')
  .max(100000, 'Content exceeds 100KB limit')
  .refine(
    (content) => !containsDangerousPatterns(content),
    'Content contains forbidden patterns'
  );

export const CreateArticleInputSchema = z.object({
  title: z.string()
    .min(1, 'Title required')
    .max(500, 'Title too long')
    .refine(s => s.trim() === s, 'No leading/trailing whitespace'),

  content: ArticleContentSchema,

  tags: z.array(z.enum(['ML', 'Systems', 'Tutorial', 'Project', 'Notes']))
    .min(1, 'At least one tag required')
    .max(5, 'Maximum 5 tags'),

  excerpt: z.string().max(500).optional(),

  coverImage: z.string()
    .url('Must be valid URL')
    .refine(url => url.startsWith('https://'), 'HTTPS only')
    .optional(),

  draft: z.boolean().default(true),
});

// Sanitization helper
function containsDangerousPatterns(content: string): boolean {
  const dangerousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:/i,
  ];
  return dangerousPatterns.some(pattern => pattern.test(content));
}
```

### OAuth2/JWT Implementation

```typescript
// mcp-server/auth/jwt.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function validateToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

// Middleware
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
```

---

## Deployment Architecture (v1.1)

### Repository Structure

```
cool-blog/
├── src/                      # Existing Astro app
│   ├── db/
│   │   ├── index.ts          # Modified: Add articles queries
│   │   └── schema.ts         # Modified: Add articles table
│   ├── pages/
│   │   ├── articles/
│   │   │   └── [slug].astro  # Modified: DB query option
│   │   └── api/
│   │       └── rebuild.ts    # NEW: Webhook for rebuild
│   └── ...
├── mcp-server/               # NEW: MCP server
│   ├── index.ts              # Entry point
│   ├── tools/
│   │   ├── create-article.ts
│   │   ├── update-article.ts
│   │   └── list-articles.ts
│   ├── schemas/
│   │   └── article.ts
│   ├── auth/
│   │   └── jwt.ts
│   └── package.json
├── astro.config.mjs          # Modified: Add API routes/ISR
├── package.json              # Modified: Add MCP scripts
└── .env                      # Modified: Add MCP secrets
```

### Process Management

```yaml
# Production deployment (Cloudflare + Separate MCP server)

Processes:
  1. Astro Blog (Cloudflare Pages)
     - Build: npm run build
     - Deploy: Static files to CF
     - Port: 443 (HTTPS)

  2. MCP Server (Node.js on VPS/Container)
     - Start: npm run mcp:start
     - Port: 3001 (HTTPS with TLS termination)
     - Process manager: PM2 or Docker

  3. Neon Postgres (Managed)
     - Connection: DATABASE_URL env var
     - No process management needed
```

### Environment Variables

```bash
# .env (additions for MCP)

# MCP Server
MCP_PORT=3001
MCP_HOST=0.0.0.0
JWT_SECRET=<random-256-bit-secret>
JWT_EXPIRY=24h

# OAuth2 (if using external provider)
OAUTH_CLIENT_ID=<client-id>
OAUTH_CLIENT_SECRET=<client-secret>
OAUTH_ISSUER=https://auth.example.com

# Rebuild Webhook (Option B)
WEBHOOK_SECRET=<random-secret>
CLOUDFLARE_BUILD_HOOK=https://api.cloudflare.com/client/v4/...

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
```

---

## Build Order & Dependencies (v1.1)

### Development Setup Order

```
1. Database Schema Update
   ├─ Add articles table to schema.ts
   ├─ Run: npm run db:generate
   └─ Run: npm run db:migrate

2. MCP Server Implementation
   ├─ Create mcp-server/ directory
   ├─ Install: @casys/mcp-server, zod, jsonwebtoken
   ├─ Implement tools (create, update, list)
   └─ Add auth middleware

3. Astro Integration (choose one)
   ├─ Option A: Change to SSR mode
   ├─ Option B: Add /api/rebuild webhook
   └─ Option C: Enable hybrid ISR

4. Testing
   ├─ Unit tests for MCP tools
   ├─ Integration tests for DB operations
   └─ E2E test: Claude → MCP → DB → Blog

5. Deployment
   ├─ Deploy MCP server to VPS/container
   ├─ Update Astro blog deployment
   └─ Configure OAuth2 provider
```

### Dependency Graph

```
                    OAuth2 Provider (external)
                           │
                           ▼
┌──────────────────────────────────────────────┐
│           MCP Server Dependencies            │
├──────────────────────────────────────────────┤
│  @casys/mcp-server    (MCP framework)        │
│  zod                  (validation)           │
│  jsonwebtoken         (JWT handling)         │
│  drizzle-orm          (DB access)            │
│  @neondatabase/serverless (Neon client)      │
└──────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────┐
│         Astro Blog Dependencies              │
├──────────────────────────────────────────────┤
│  astro                (existing)             │
│  @astrojs/cloudflare  (existing)             │
│  drizzle-orm          (existing)             │
│  marked               (Markdown rendering)   │
└──────────────────────────────────────────────┘
```

---

## Scalability Considerations (v1.1)

| Concern | At 10 articles | At 1K articles | At 10K articles |
|---------|----------------|----------------|-----------------|
| **DB Storage** | ~1MB | ~100MB | ~1GB |
| **Query Performance** | No optimization needed | Add indexes on slug, date | Partition by date |
| **MCP Server** | Single instance | Single instance + connection pooling | Horizontal scaling + load balancer |
| **Blog Build Time** | <1s | ~10s | ~60s (consider ISR) |
| **Rate Limiting** | Per-user limits | Per-user + per-IP | Redis-backed distributed limits |

### Performance Optimizations

1. **Connection Pooling** (Neon)
   ```typescript
   // src/db/index.ts
   import { Pool } from '@neondatabase/serverless';

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 10,  // Connection pool size
   });
   ```

2. **Caching** (Optional)
   ```typescript
   // Add Redis for article caching
   import { Redis } from '@upstash/redis';

   const redis = new Redis({
     url: process.env.UPSTASH_URL,
     token: process.env.UPSTASH_TOKEN,
   });

   // Cache article lookups
   const cached = await redis.get(`article:${slug}`);
   if (cached) return cached;
   ```

3. **Lazy Loading** (Astro)
   ```astro
   ---
   // Defer non-critical content
   const { article } = Astro.props;
   ---
   <article>
     <h1>{article.title}</h1>
     <Fragment set:html={article.content} />
     <script define:vars={{ articleId: article.id }}>
       // Load comments lazily
       fetch(`/api/comments/${articleId}`)
     </script>
   </article>
   ```

---

## Sources (v1.1)

- **MCP Specification**: https://modelcontextprotocol.io/docs (HIGH confidence)
- **@casys/mcp-server**: https://github.com/casys/mcp-server (HIGH confidence)
- **Astro SSR Documentation**: https://docs.astro.build/en/guides/server-side-rendering/ (HIGH confidence)
- **Neon Postgres Best Practices**: https://neon.tech/docs/introduction (HIGH confidence)
- **OWASP Input Validation**: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html (HIGH confidence)
- **JWT Best Practices**: https://auth0.com/blog/jwt-authentication-best-practices/ (MEDIUM confidence - industry standard)
- **Drizzle ORM Documentation**: https://orm.drizzle.team/docs/overview (HIGH confidence)

---

## Summary (v1.1)

**Recommended Architecture:**

1. **MCP Server**: Separate Node.js process in same repo, HTTP transport, port 3001
2. **Database**: Add `articles` table to existing Neon Postgres, Drizzle ORM
3. **Integration**: Option B (rebuild webhook) preserves static benefits, Option C (ISR) for better UX
4. **Security**: 4-layer approach (OAuth2/JWT → Zod → ORM → Rate limiting)
5. **Deployment**: MCP server on VPS/container, Astro on Cloudflare Pages

**Key Decisions:**

- **Separate process** for MCP server (scalability, isolation)
- **Same repository** (shared DB schema, easier development)
- **HTTP transport** (mobile access, network-based)
- **Database-driven content** (replaces file-based articles)
- **Static output preserved** (Option B or C recommended)

**Build Order:**

1. Database schema update → Migration
2. MCP server implementation → Tools + Auth
3. Astro integration → Webhook or SSR
4. Testing → E2E validation
5. Deployment → Production configuration

---
*Architecture research for: MCP + Astro + Neon Integration*
*Researched: 2026-03-30*
