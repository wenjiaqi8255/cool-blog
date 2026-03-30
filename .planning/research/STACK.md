# Stack Research

**Domain:** Technical Blog/Portfolio with Bento Grid Layout
**Researched:** 2026-03-27 (v1.0), 2026-03-30 (v1.1)
**Confidence:** HIGH

---

## v1.0 Stack (Shipped & Validated)

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | 6.1.1 | Static Site Generator with SSR capability | Best-in-class content collections, excellent Cloudflare support, island architecture for selective hydration, lightweight output. Astro 5.16+ includes experimental SVG optimization and React 19 support. |
| **React** | 19.x | Interactive components | Required for client-side interactivity (tab switching, hover effects, newsletter form). Astro 5.14+ supports React 19 actions. Use only for islands that need JS. |
| **TypeScript** | 5.x | Type safety | First-class support in Astro, essential for content collection schemas and type-safe database queries with Drizzle. |
| **Tailwind CSS** | 4.2.2 | Styling | Official Bento Grid components, utility-first approach matches design system requirements. v4 uses new Vite plugin architecture (`@tailwindcss/vite`) for better performance. |
| **Neon Postgres** | Serverless | Database for newsletter emails | Edge-compatible, generous free tier, instant branching for development. Pooled connections (`-pooler.region.aws.neon.tech`) essential for serverless environments. |

### Supporting Libraries (v1.0)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| **@astrojs/react** | 5.0.2 | React integration for Astro | ✅ Installed |
| **@astrojs/cloudflare** | 13.1.4 | Cloudflare adapter | ✅ Installed |
| **@neondatabase/serverless** | 1.0.2 | Neon serverless driver | ✅ Installed |
| **drizzle-orm** | 0.45.2 | TypeScript ORM | ✅ Installed |
| **drizzle-kit** | 0.31.10 | Schema migrations | ✅ Installed (dev) |
| **@fontsource/inter** | 5.x | Self-hosted Inter font | ✅ Installed |
| **@fontsource/jetbrains-mono** | 5.x | Self-hosted JetBrains Mono font | ✅ Installed |
| **@astrojs/rss** | 4.0.18 | RSS feed generation | ✅ Installed |
| **@astrojs/sitemap** | 3.7.2 | Sitemap generation | ✅ Installed |
| **resend** | 6.9.4 | Email delivery | ✅ Installed |
| **fuse.js** | 7.1.0 | Client-side search | ✅ Installed |
| **zod** | 4.3.6 | Schema validation | ✅ Installed |

---

## v1.1 Stack Additions (Content Management & Automation)

### Notion Migration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@notionhq/client` | ^2.2.x | Official Notion API client | Official SDK with TypeScript support, handles authentication, pagination, and error handling automatically |
| `gray-matter` | ^4.0.x | Frontmatter extraction | Battle-tested YAML/JSON/TOML parser, works with strings (no file system required), simple API |

### MCP Server

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@modelcontextprotocol/sdk` | ^1.0.x | Official MCP TypeScript SDK | Official implementation, full protocol support, built-in transport options (stdio, HTTP), Zod integration |
| `zod` | ^4.3.6 | Schema validation | **Already installed** — required peer dependency of MCP SDK, used for tool input validation |

### Content Processing

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `gray-matter` | ^4.0.x | Extract metadata from Markdown | Same as Notion migration — dual purpose, handles YAML frontmatter parsing |

**Note:** The existing Astro 6.1.1 already has excellent Markdown support built-in. No additional parsing libraries (remark, unified, marked) are needed.

---

## What NOT to Add (v1.1)

| Library | Why Not | Alternative |
|---------|---------|-------------|
| `remark` / `unified` | Astro already uses these internally for content collections | Use Astro's built-in Markdown processing |
| `marked` | Redundant with Astro's Markdown pipeline | Astro handles rendering |
| `front-matter` | Less maintained than gray-matter | gray-matter is battle-tested |
| `toml` | Not needed for YAML-only frontmatter | gray-matter handles YAML by default |
| `mcp-framework` | Adds abstraction layer on top of official SDK | Use official `@modelcontextprotocol/sdk` directly for more control |
| `@neondatabase/serverless` | **Already installed** | Use existing connection |

---

## Integration Points with Existing Stack

### Database (Neon + Drizzle)
- **Existing:** `@neondatabase/serverless` ^1.0.2, `drizzle-orm` ^0.45.2
- **MCP Server:** Will use the same Drizzle ORM instance and connection pool
- **No new database libraries needed**

### Validation (Zod)
- **Existing:** `zod` ^4.3.6
- **MCP SDK:** Requires Zod as peer dependency (compatible with v3.25+)
- **No version changes needed**

### Content Collections (Astro)
- **Existing:** Astro 6.1.1 with `src/content.config.ts`
- **New:** Articles will be stored in database instead of files
- **Migration:** One-time import from Notion → database, not file-based content collections

### Deployment (Cloudflare Pages)
- **Existing:** `@astrojs/cloudflare` ^13.1.4
- **MCP Server:** Will run as a separate Node.js process (not on Cloudflare)
- **Reason:** MCP stdio transport requires persistent process, Cloudflare Functions are request-scoped

---

## Installation (v1.1)

```bash
# Core additions for v1.1
npm install @notionhq/client gray-matter @modelcontextprotocol/sdk

# All other dependencies already present
# - zod ^4.3.6 (already installed)
# - drizzle-orm ^0.45.2 (already installed)
# - @neondatabase/serverless ^1.0.2 (already installed)
```

---

## Version Verification

| Package | Current Latest | Source | Confidence |
|---------|---------------|--------|------------|
| `@notionhq/client` | 2.2.x | [Official GitHub](https://github.com/makenotion/notion-sdk-js) | HIGH |
| `gray-matter` | 4.0.x | [npm](https://www.npmjs.com/package/gray-matter) | HIGH |
| `@modelcontextprotocol/sdk` | 1.0.x | [npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk) | HIGH |

---

## Migration Architecture

```
┌─────────────────┐
│  Notion API     │
│  (source)       │
└────────┬────────┘
         │ @notionhq/client
         ▼
┌─────────────────┐
│  Migration      │
│  Script         │
│  (one-time)     │
└────────┬────────┘
         │ Drizzle ORM
         ▼
┌─────────────────┐
│  Neon Postgres  │
│  (articles)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MCP Server     │
│  (@modelcontext-│
│  protocol/sdk)  │
└────────┬────────┘
         │ stdio transport
         ▼
┌─────────────────┐
│  Claude Desktop │
│  / Mobile       │
└─────────────────┘
```

---

## Blog Publishing Workflow

```
1. User writes Markdown on mobile
2. Sends to Claude with metadata
3. Claude extracts frontmatter (gray-matter)
4. Claude calls MCP tool: publish_article
5. MCP server validates with Zod
6. MCP server writes to Neon via Drizzle
7. Astro reads from database on build/request
8. Article appears on blog
```

---

## Environment Variables Needed (v1.1)

```bash
# Notion API (for migration)
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx

# Neon Postgres (already configured)
DATABASE_URL=postgresql://xxx

# MCP Server (local only)
# No additional env vars needed — uses DATABASE_URL
```

---

## Alternatives Considered

### v1.0 Alternatives (For Reference)

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro | Next.js | When you need heavy client-side routing, complex auth flows, or are already in Next.js ecosystem. Astro is better for content-first sites. |
| Neon Postgres | Cloudflare D1 | When you want everything in Cloudflare ecosystem. D1 has smaller free tier and is SQLite-based. Neon has better tooling, larger free tier, and full Postgres. |
| Tailwind CSS | CSS Modules + SASS | When you prefer scoped styles and traditional CSS. Tailwind is better for Bento Grid due to official components and rapid prototyping. |
| Drizzle ORM | Prisma | When you prefer graphical schema viewer and more ORM features. Drizzle is lighter, edge-native, and has better TypeScript inference. |

### v1.1 Alternatives

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `@modelcontextprotocol/sdk` | `mcp-framework` | Official SDK provides more control, no unnecessary abstraction layer |
| `gray-matter` | `front-matter` | gray-matter is more actively maintained, battle-tested by major projects |
| Official SDKs | Community packages | Official SDKs have long-term support and API stability guarantees |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js** for this project | Heavier bundle, overkill for content site, Cloudflare support requires extra configuration | **Astro** - purpose-built for content sites, native Cloudflare adapter |
| **Prisma** with Neon | Edge runtime compatibility issues, heavier client, slower cold starts | **Drizzle ORM** - edge-native, tree-shakeable, zero runtime overhead |
| **Cloudflare D1** (for this use case) | SQLite limitations, smaller free tier (5GB), less mature tooling | **Neon Postgres** - full Postgres, larger free tier (10GB), better ecosystem |
| **Non-pooled Neon connections** in serverless | Connection exhaustion under load, failed requests | **Pooled connections** (`-pooler.region.aws.neon.tech`) - handles serverless scaling |
| **Google Fonts CDN** | External dependency, privacy concerns, adds DNS/HTTP overhead | **@fontsource/* packages** - self-hosted, zero external requests, FOUT-free |
| **CSS-in-JS (styled-components, emotion)** | Not optimized for Astro SSR, runtime overhead | **Tailwind CSS** - build-time generation, zero runtime cost |
| **MDX for all content** | Overkill for simple articles, adds complexity | **Markdown with Astro Content Collections** - simpler, type-safe, sufficient for blog |

---

## Stack Patterns by Variant

**For Static Site Generation (SSG) - Default:**
- Use `output: 'static'` in astro.config.mjs
- Pre-render all pages at build time
- Newsletter form calls serverless function endpoint
- Best performance, lowest cost

**For Hybrid Rendering:**
- Use `output: 'hybrid'` with `prerender: true` default
- Only newsletter API route is server-rendered
- Good balance of static performance + dynamic features

**For Full SSR:**
- Use `output: 'server'`
- All pages rendered on request
- Only needed for real-time data or user-specific content (not this project)

**For Animation Complexity:**

| Complexity Level | Recommendation |
|-----------------|----------------|
| Simple hovers/transitions | CSS transitions + Tailwind utilities |
| Card animations | CSS transforms + Tailwind `transition-all` |
| Advanced micro-interactions | Motion library for React components |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Astro 6.x | React 19.x, Tailwind 4.x | Current production version |
| @astrojs/cloudflare 13.x | Astro 6.x, Wrangler 4.x | Use with `output: 'server'` or `output: 'hybrid'` |
| Tailwind CSS 4.x | Vite 6.x, Astro 6.x | Uses `@tailwindcss/vite` plugin |
| drizzle-orm 0.45.x | @neondatabase/serverless 1.0.x | Use `neon()` driver |
| @modelcontextprotocol/sdk 1.x | Zod 3.25+, Node 18+ | Requires Zod as peer dependency |
| @notionhq/client 2.x | Node 18+, TypeScript 5.x | Official Notion SDK |

---

## Architecture-Specific Notes

### Bento Grid Implementation

```css
/* Core Bento Grid CSS (use with Tailwind) */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense; /* Key for auto-packing */
  gap: 4px;
  min-height: 320px;
}

/* Card variants */
.card-span-2 { grid-column: span 2; }
.card-span-4 { grid-column: span 4; }
.card-row-2 { grid-row: span 2; }
```

### Neon Connection Pattern

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use pooled connection string for serverless
const sql = neon(process.env.DATABASE_URL!); // Should be -pooler URL
export const db = drizzle(sql);
```

### Content Collections Structure

```typescript
// content.config.ts (Astro 6.x format)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = { articles };
```

### MCP Server Pattern (v1.1)

```typescript
// mcp-server/index.ts
import { McpServer } from '@modelcontextprotocol/sdk';
import { z } from 'zod';

const server = new McpServer({
  name: 'cool-blog-publisher',
  version: '1.0.0',
});

server.tool(
  'publish_article',
  {
    title: z.string().describe('Article title'),
    content: z.string().describe('Markdown content'),
    tags: z.array(z.string()).describe('Article tags'),
  },
  async (input) => {
    // Use existing Drizzle ORM instance
    // Write to Neon Postgres
    return { success: true };
  }
);

// stdio transport for Claude Desktop/Mobile
```

---

## Sources

### Official Documentation
- [Astro Documentation](https://docs.astro.build) - Official docs for Astro 6.x features, content collections, integrations (HIGH confidence)
- [Tailwind CSS + Astro Guide](https://tailwindcss.com/docs/installation/framework-guides/astro) - Official integration guide (HIGH confidence)
- [Neon Documentation](https://neon.com/docs) - Serverless driver, connection pooling best practices (HIGH confidence)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs) - Neon integration patterns (HIGH confidence)
- [Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - @astrojs/cloudflare configuration (HIGH confidence)
- [Notion JavaScript SDK](https://github.com/makenotion/notion-sdk-js) — Official GitHub repository (HIGH confidence)
- [Notion API Docs](https://developers.notion.com/) — Official API reference (HIGH confidence)
- [Model Context Protocol](https://modelcontextprotocol.io/) — Official MCP documentation (HIGH confidence)
- [MCP TypeScript SDK](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — Official SDK on npm (HIGH confidence)
- [gray-matter](https://www.npmjs.com/package/gray-matter) — npm package page (HIGH confidence)

### Research Sources
- [Neon MCP Server](https://mcpservers.org/servers/neondatabase-labs/mcp-server-neon) — Neon's official MCP integration (HIGH confidence)
- [Best Markdown Parsing Libraries 2026](https://www.pkgpulse.com/blog/best-markdown-parsing-libraries-2026) — remark ecosystem overview (MEDIUM confidence)
- [MCP Framework](https://github.com/QuantGeekDev/mcp-framework) — Alternative framework (decided against, HIGH confidence in decision)

---

## Confidence Assessment

| Component | Confidence | Reason |
|-----------|------------|--------|
| v1.0 Stack | HIGH | All packages shipped and validated in production |
| `@notionhq/client` | HIGH | Official SDK, actively maintained, comprehensive docs |
| `gray-matter` | HIGH | Battle-tested, widely used, simple API |
| `@modelcontextprotocol/sdk` | HIGH | Official SDK, required Zod already present |
| Integration approach | HIGH | Uses existing stack (Drizzle, Neon, Zod) without conflicts |
| Version compatibility | HIGH | All packages compatible with Node 18+, existing Zod v4 |

---

## Rationale Summary

### Why These Choices (v1.1)

1. **Official SDKs over community packages** — `@notionhq/client` and `@modelcontextprotocol/sdk` are maintained by their respective organizations, ensuring long-term support and API compatibility.

2. **Minimal additions** — Only 3 new packages needed. Everything else uses the existing Astro/Neon/Drizzle/Zod stack.

3. **gray-matter for dual purposes** — Single library handles both Notion migration (extracting metadata from imported content) and MCP workflow (parsing frontmatter from user Markdown).

4. **No Markdown parser additions** — Astro already has best-in-class Markdown support through its content collections. Adding remark/unified/marked would be redundant.

5. **MCP over custom API** — MCP provides standardized protocol for Claude integration, works on mobile, and doesn't require building authentication or API infrastructure.

### What Makes This Stack Cohesive

- **TypeScript throughout** — All packages have first-class TypeScript support
- **Zod for validation** — Shared validation layer across MCP tools and API boundaries
- **Drizzle ORM** — Single database abstraction for both web app and MCP server
- **Serverless-compatible** — All packages work with Cloudflare Pages and Neon serverless
- **Mobile-first workflow** — MCP enables Claude mobile → database publishing without intermediate steps

---

*Stack research for: Technical Blog/Portfolio with Bento Grid Layout*
*Last updated: 2026-03-30 (v1.1 additions)*
